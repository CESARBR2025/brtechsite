import type { EstadoLevantamiento } from "./estado-levantamiento"
import type { Levantamiento } from "./levantamiento"
import type { SlugLevantamiento } from "./slug-levantamiento"

export interface FiltroLevantamientos {
  estado?: EstadoLevantamiento
  limite?: number
}

/** Puerto de persistencia del agregado Levantamiento. */
export interface RepositorioLevantamientos {
  /** Inserta o actualiza el levantamiento completo. */
  guardar(levantamiento: Levantamiento): Promise<void>

  obtenerPorId(id: string): Promise<Levantamiento | null>

  obtenerPorSlug(slug: SlugLevantamiento): Promise<Levantamiento | null>

  listar(filtro?: FiltroLevantamientos): Promise<Levantamiento[]>

  /** Reserva y devuelve el siguiente folio legible (p. ej. "BRD-000007"). */
  siguienteFolio(): Promise<string>
}
