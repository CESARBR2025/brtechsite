import type { EstadoTicket } from "./estado-ticket"
import type { Ticket } from "./ticket"
import type { SlugTicket } from "./slug-ticket"

export interface FiltroListado {
  estado?: EstadoTicket
  limite?: number
  /** id del último ticket de la página anterior (paginación por cursor). */
  cursor?: string
}

/**
 * Puerto de persistencia del agregado Ticket.
 * La aplicación depende de esta interfaz; el adaptador Postgres la implementa.
 */
export interface RepositorioTickets {
  /** Inserta o actualiza el ticket completo (con sus ítems) de forma atómica. */
  guardar(ticket: Ticket): Promise<void>

  obtenerPorId(id: string): Promise<Ticket | null>

  obtenerPorSlug(slug: SlugTicket): Promise<Ticket | null>

  listar(filtro?: FiltroListado): Promise<Ticket[]>

  /** Reserva y devuelve el siguiente folio legible (p. ej. "BRT-000042"). */
  siguienteFolio(): Promise<string>
}
