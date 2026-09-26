import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { Proyecto } from "../domain/proyecto"
import type { RepositorioProyectos } from "../domain/repositorio-proyectos"
import { SlugProyecto } from "../domain/slug-proyecto"
import { aPropuestaPublicaDTO, type PropuestaPublicaDTO } from "./dtos"

/** Carga un proyecto publicado por su slug; cualquier otro caso cuenta como "no existe". */
export async function proyectoPublicado(
  repo: RepositorioProyectos,
  slugCrudo: string,
): Promise<Proyecto> {
  let slug: SlugProyecto
  try {
    slug = SlugProyecto.desde(slugCrudo)
  } catch {
    throw new RecursoNoEncontrado("Propuesta no encontrada")
  }
  const proyecto = await repo.obtenerPorSlug(slug)
  if (!proyecto || !proyecto.esPublico) throw new RecursoNoEncontrado("Propuesta no encontrada")
  return proyecto
}

/** Devuelve la propuesta para su página pública. Solo si está publicada. */
export class ObtenerPropuestaPublica {
  constructor(private readonly repo: RepositorioProyectos) {}

  async ejecutar(slug: string): Promise<PropuestaPublicaDTO> {
    return aPropuestaPublicaDTO(await proyectoPublicado(this.repo, slug))
  }
}
