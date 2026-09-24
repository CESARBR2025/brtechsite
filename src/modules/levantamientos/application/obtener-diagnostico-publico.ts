import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { RepositorioLevantamientos } from "../domain/repositorio-levantamientos"
import { SlugLevantamiento } from "../domain/slug-levantamiento"
import { aDiagnosticoPublicoDTO, type DiagnosticoPublicoDTO } from "./dtos"

/**
 * Devuelve el diagnóstico para su página pública. Solo si está publicado;
 * en cualquier otro caso se comporta como "no existe".
 */
export class ObtenerDiagnosticoPublico {
  constructor(private readonly repo: RepositorioLevantamientos) {}

  async ejecutar(slugCrudo: string): Promise<DiagnosticoPublicoDTO> {
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
    return aDiagnosticoPublicoDTO(levantamiento)
  }
}
