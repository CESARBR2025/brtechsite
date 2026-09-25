import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { NotificadorRespuestas } from "../domain/notificador-respuestas"
import type { RepositorioLevantamientos } from "../domain/repositorio-levantamientos"
import { SlugLevantamiento } from "../domain/slug-levantamiento"

export interface RespuestaEntrada {
  id: string
  respuesta: string
}

export interface ResultadoResponderPreguntas {
  preguntasPendientes: number
  /** Solo si esta vez quedaron todas respondidas: si el aviso a BR TECH salió o falló. */
  aviso: "enviado" | "fallido" | null
  /** Causa del fallo del aviso, para registrarla en el adaptador. */
  errorAviso?: unknown
}

/**
 * El cliente responde las "Preguntas al cliente" desde su diagnóstico público.
 * El slug es la única credencial: si no está publicado, se comporta como "no existe".
 * Cuando un guardado deja todas respondidas, se avisa a BR TECH con las respuestas.
 */
export class ResponderPreguntas {
  constructor(
    private readonly repo: RepositorioLevantamientos,
    private readonly notificador: NotificadorRespuestas,
    private readonly reloj: Reloj,
  ) {}

  async ejecutar(
    slugCrudo: string,
    respuestas: RespuestaEntrada[],
  ): Promise<ResultadoResponderPreguntas> {
    let slug: SlugLevantamiento
    try {
      slug = SlugLevantamiento.desde(slugCrudo)
    } catch {
      throw new RecursoNoEncontrado("Diagnóstico no encontrado")
    }
    const levantamiento = await this.repo.obtenerPorSlug(slug)
    if (!levantamiento || !levantamiento.esPublico) {
      throw new RecursoNoEncontrado("Diagnóstico no encontrado")
    }
    const yaCompletas = levantamiento.preguntasCompletas
    const cambio = levantamiento.responderPreguntas(respuestas, this.reloj)
    if (!cambio) {
      return { preguntasPendientes: levantamiento.preguntasPendientes, aviso: null }
    }
    await this.repo.guardar(levantamiento)
    if (!levantamiento.preguntasCompletas) {
      return { preguntasPendientes: levantamiento.preguntasPendientes, aviso: null }
    }

    // Las respuestas ya quedaron guardadas: un fallo del aviso no las pierde
    try {
      const c = levantamiento.contenido
      await this.notificador.respuestasCompletas({
        levantamientoId: levantamiento.id,
        folio: levantamiento.folio,
        slug: levantamiento.slug.valor,
        clienteNombre: levantamiento.cliente.nombre,
        contactoNombre: c.contexto.contactoNombre,
        proyectoNombre: levantamiento.proyectoNombre,
        esActualizacion: yaCompletas,
        preguntas: c.preguntasAbiertas.map(({ grupo, texto, respuesta }) => ({
          grupo,
          texto,
          respuesta,
        })),
      })
      return { preguntasPendientes: 0, aviso: "enviado" }
    } catch (err) {
      return { preguntasPendientes: 0, aviso: "fallido", errorAviso: err }
    }
  }
}
