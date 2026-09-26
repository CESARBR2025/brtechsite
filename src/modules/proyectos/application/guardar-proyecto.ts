import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { RepositorioProyectos } from "../domain/repositorio-proyectos"
import { aDatosGenerales, type DatosGeneralesEntrada } from "./entrada"

/**
 * Guarda la captura completa (lo usa el guardado automático del panel).
 * El contenido llega crudo; el dominio lo valida y normaliza.
 */
export class GuardarProyecto {
  constructor(
    private readonly repo: RepositorioProyectos,
    private readonly reloj: Reloj,
  ) {}

  async ejecutar(
    id: string,
    datos: { generales: DatosGeneralesEntrada; contenido: unknown },
  ): Promise<{ actualizadoEn: string }> {
    const proyecto = await this.repo.obtenerPorId(id)
    if (!proyecto) throw new RecursoNoEncontrado(`No existe el proyecto ${id}`)
    proyecto.actualizarGenerales(aDatosGenerales(datos.generales), this.reloj)
    proyecto.reemplazarContenido(datos.contenido, this.reloj)
    await this.repo.guardar(proyecto)
    return { actualizadoEn: proyecto.actualizadoEn.toISOString() }
  }
}
