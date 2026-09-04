import type { GeneradorId } from "@/src/modules/shared/domain/id"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type {
  FiltroListado,
  RepositorioTickets,
} from "@/src/modules/tickets/domain/repositorio-tickets"
import {
  type GeneradorSlug,
  SlugTicket,
} from "@/src/modules/tickets/domain/slug-ticket"
import type { Ticket } from "@/src/modules/tickets/domain/ticket"

export class RelojFijo implements Reloj {
  constructor(private instante: Date) {}
  ahora(): Date {
    return new Date(this.instante)
  }
  avanzar(ms: number): void {
    this.instante = new Date(this.instante.getTime() + ms)
  }
}

export class GeneradorIdSecuencial implements GeneradorId {
  private n = 0
  constructor(private readonly prefijo = "id") {}
  nuevo(): string {
    this.n += 1
    return `${this.prefijo}-${this.n}`
  }
}

export class GeneradorSlugSecuencial implements GeneradorSlug {
  private n = 0
  nuevo(): SlugTicket {
    this.n += 1
    return SlugTicket.desde(`slugtest${String(this.n).padStart(4, "0")}`)
  }
}

export class RepositorioTicketsEnMemoria implements RepositorioTickets {
  private readonly porId = new Map<string, Ticket>()
  private folio = 0

  async guardar(ticket: Ticket): Promise<void> {
    this.porId.set(ticket.id, ticket)
  }

  async obtenerPorId(id: string): Promise<Ticket | null> {
    return this.porId.get(id) ?? null
  }

  async obtenerPorSlug(slug: SlugTicket): Promise<Ticket | null> {
    for (const t of this.porId.values()) {
      if (t.slug.valor === slug.valor) return t
    }
    return null
  }

  async listar(filtro: FiltroListado = {}): Promise<Ticket[]> {
    let lista = [...this.porId.values()]
    if (filtro.estado) lista = lista.filter((t) => t.estado === filtro.estado)
    lista.sort((a, b) => b.creadoEn.getTime() - a.creadoEn.getTime())
    return filtro.limite ? lista.slice(0, filtro.limite) : lista
  }

  async siguienteFolio(): Promise<string> {
    this.folio += 1
    return `BRT-${String(this.folio).padStart(6, "0")}`
  }
}
