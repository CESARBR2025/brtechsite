import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { RepositorioTickets } from "../domain/repositorio-tickets"
import { SlugTicket } from "../domain/slug-ticket"
import { aTicketPublicoDTO, type TicketPublicoDTO } from "./dtos"

/**
 * Devuelve un ticket para su página pública. Solo si está publicado;
 * en cualquier otro caso se comporta como "no existe" (no filtra borradores).
 */
export class ObtenerTicketPublico {
  constructor(private readonly repo: RepositorioTickets) {}

  async ejecutar(slugCrudo: string): Promise<TicketPublicoDTO> {
    let slug: SlugTicket
    try {
      slug = SlugTicket.desde(slugCrudo)
    } catch {
      throw new RecursoNoEncontrado("Ticket no encontrado")
    }

    const ticket = await this.repo.obtenerPorSlug(slug)
    if (!ticket || !ticket.esPublico) {
      throw new RecursoNoEncontrado("Ticket no encontrado")
    }
    return aTicketPublicoDTO(ticket)
  }
}
