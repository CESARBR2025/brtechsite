import type { EstadoProyecto } from "./estado-proyecto"
import type { Proyecto } from "./proyecto"
import type { SlugProyecto } from "./slug-proyecto"

export interface FiltroProyectos {
  estado?: EstadoProyecto
  limite?: number
}

/** Puerto de persistencia del agregado Proyecto. */
export interface RepositorioProyectos {
  /** Inserta o actualiza el proyecto completo. */
  guardar(proyecto: Proyecto): Promise<void>

  obtenerPorId(id: string): Promise<Proyecto | null>

  obtenerPorSlug(slug: SlugProyecto): Promise<Proyecto | null>

  listar(filtro?: FiltroProyectos): Promise<Proyecto[]>

  /** Reserva y devuelve el siguiente folio legible (p. ej. "BRP-000007"). */
  siguienteFolio(): Promise<string>
}
