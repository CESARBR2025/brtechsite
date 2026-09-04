import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type {
  FiltroListado,
  RepositorioTickets,
} from "../domain/repositorio-tickets"
import {
  aTicketDetalleDTO,
  aTicketResumenDTO,
  type TicketDetalleDTO,
  type TicketResumenDTO,
} from "./dtos"

/** Consultas del panel (cualquier estado). */
export class ConsultarTickets {
  constructor(private readonly repo: RepositorioTickets) {}

  async listar(filtro?: FiltroListado): Promise<TicketResumenDTO[]> {
    const tickets = await this.repo.listar(filtro)
    return tickets.map(aTicketResumenDTO)
  }

  async obtenerDetalle(id: string): Promise<TicketDetalleDTO> {
    const ticket = await this.repo.obtenerPorId(id)
    if (!ticket) {
      throw new RecursoNoEncontrado(`No existe el ticket ${id}`)
    }
    return aTicketDetalleDTO(ticket)
  }
}
