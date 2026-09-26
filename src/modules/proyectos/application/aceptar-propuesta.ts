import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { NotificadorAceptacion } from "../domain/puertos"
import type { RepositorioProyectos } from "../domain/repositorio-proyectos"
import { proyectoPublicado } from "./obtener-propuesta-publica"

export interface ResultadoAceptarPropuesta {
  /** Si el aviso a BR TECH salió o falló (la aceptación queda guardada igual). */
  aviso: "enviado" | "fallido"
  /** Causa del fallo del aviso, para registrarla en el adaptador. */
  errorAviso?: unknown
}

/**
 * El cliente acepta la propuesta desde su página pública. El slug es la
 * única credencial: si no está publicada, se comporta como "no existe".
 */
export class AceptarPropuesta {
  constructor(
    private readonly repo: RepositorioProyectos,
    private readonly notificador: NotificadorAceptacion,
    private readonly reloj: Reloj,
  ) {}

  async ejecutar(slug: string, nombre: string): Promise<ResultadoAceptarPropuesta> {
    const proyecto = await proyectoPublicado(this.repo, slug)
    proyecto.aceptar(nombre, this.reloj)
    await this.repo.guardar(proyecto)

    const aceptacion = proyecto.aceptacion!
    try {
      await this.notificador.propuestaAceptada({
        proyectoId: proyecto.id,
        folio: proyecto.folio,
        slug: proyecto.slug.valor,
        clienteNombre: proyecto.cliente.nombre,
        proyectoNombre: proyecto.proyectoNombre,
        aceptadaPor: aceptacion.por,
        aceptadaEn: aceptacion.en,
        totalCentavos: proyecto.totalCentavos,
        moneda: proyecto.contenido.inversion.moneda,
      })
      return { aviso: "enviado" }
    } catch (err) {
      return { aviso: "fallido", errorAviso: err }
    }
  }
}
