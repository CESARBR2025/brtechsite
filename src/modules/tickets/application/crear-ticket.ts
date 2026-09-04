import { Dinero } from "@/src/modules/shared/domain/dinero"
import type { GeneradorId } from "@/src/modules/shared/domain/id"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { RepositorioTickets } from "../domain/repositorio-tickets"
import type { GeneradorSlug } from "../domain/slug-ticket"
import { Ticket } from "../domain/ticket"
import type { DatosTicketEntrada } from "./entrada"
import { construirItems, parsearFechaServicio } from "./ensamblado"

export interface ResultadoCrearTicket {
  id: string
  folio: string
  slug: string
}

export class CrearTicket {
  constructor(
    private readonly repo: RepositorioTickets,
    private readonly generadorId: GeneradorId,
    private readonly generadorSlug: GeneradorSlug,
    private readonly reloj: Reloj,
  ) {}

  async ejecutar(datos: DatosTicketEntrada): Promise<ResultadoCrearTicket> {
    const items = construirItems(datos.items ?? [], this.generadorId)
    const folio = await this.repo.siguienteFolio()

    const ticket = Ticket.crear(
      {
        cliente: datos.cliente,
        equipo: datos.equipo,
        detalle: {
          problemaReportado: datos.problemaReportado,
          diagnostico: datos.diagnostico,
          trabajoRealizado: datos.trabajoRealizado,
          recomendaciones: datos.recomendaciones,
          notaGarantia: datos.notaGarantia,
        },
        moneda: datos.moneda,
        impuesto:
          datos.impuesto != null
            ? Dinero.desdeUnidades(datos.impuesto)
            : Dinero.cero(),
        fechaServicio: parsearFechaServicio(datos.fechaServicio),
        items,
      },
      {
        id: this.generadorId.nuevo(),
        folio,
        slug: this.generadorSlug.nuevo(),
        reloj: this.reloj,
      },
    )

    await this.repo.guardar(ticket)
    return { id: ticket.id, folio: ticket.folio, slug: ticket.slug.valor }
  }
}
