import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { RepositorioTickets } from "../domain/repositorio-tickets"

type Accion = "publicar" | "despublicar" | "archivar"

/**
 * Casos de uso de transición de estado. Se agrupan porque comparten la
 * misma forma: cargar, aplicar la transición del dominio, guardar.
 */
export class CambiarEstadoTicket {
  constructor(
    private readonly repo: RepositorioTickets,
    private readonly reloj: Reloj,
  ) {}

  private async aplicar(id: string, accion: Accion): Promise<void> {
    const ticket = await this.repo.obtenerPorId(id)
    if (!ticket) {
      throw new RecursoNoEncontrado(`No existe el ticket ${id}`)
    }
    if (accion === "publicar") ticket.publicar(this.reloj)
    else if (accion === "despublicar") ticket.despublicar(this.reloj)
    else ticket.archivar(this.reloj)
    await this.repo.guardar(ticket)
  }

  publicar(id: string): Promise<void> {
    return this.aplicar(id, "publicar")
  }

  despublicar(id: string): Promise<void> {
    return this.aplicar(id, "despublicar")
  }

  archivar(id: string): Promise<void> {
    return this.aplicar(id, "archivar")
  }

  async marcarPago(id: string, pagado: boolean): Promise<void> {
    const ticket = await this.repo.obtenerPorId(id)
    if (!ticket) {
      throw new RecursoNoEncontrado(`No existe el ticket ${id}`)
    }
    ticket.marcarPagado(pagado, this.reloj)
    await this.repo.guardar(ticket)
  }
}
