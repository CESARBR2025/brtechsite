import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { RepositorioLevantamientos } from "../domain/repositorio-levantamientos"
import { aDatosGenerales, type DatosGeneralesEntrada } from "./entrada"

/**
 * Guarda la captura completa (lo usa el guardado automático del panel).
 * El contenido llega crudo; el dominio lo valida y normaliza.
 */
export class GuardarLevantamiento {
  constructor(
    private readonly repo: RepositorioLevantamientos,
    private readonly reloj: Reloj,
  ) {}

  async ejecutar(
    id: string,
    datos: { generales: DatosGeneralesEntrada; contenido: unknown },
  ): Promise<{ actualizadoEn: string }> {
    const levantamiento = await this.repo.obtenerPorId(id)
    if (!levantamiento) {
      throw new RecursoNoEncontrado(`No existe el levantamiento ${id}`)
    }
    levantamiento.actualizarGenerales(aDatosGenerales(datos.generales), this.reloj)
    levantamiento.reemplazarContenido(datos.contenido, this.reloj)
    await this.repo.guardar(levantamiento)
    return { actualizadoEn: levantamiento.actualizadoEn.toISOString() }
  }
}
