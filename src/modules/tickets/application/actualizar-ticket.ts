import { Dinero } from "@/src/modules/shared/domain/dinero"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { GeneradorId } from "@/src/modules/shared/domain/id"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { RepositorioTickets } from "../domain/repositorio-tickets"
import type { DatosTicketEntrada } from "./entrada"
import { construirItems, parsearCategoria, parsearFechaServicio } from "./ensamblado"

export class ActualizarTicket {
  constructor(
    private readonly repo: RepositorioTickets,
    private readonly generadorId: GeneradorId,
    private readonly reloj: Reloj,
  ) {}

  async ejecutar(id: string, datos: DatosTicketEntrada): Promise<void> {
    const ticket = await this.repo.obtenerPorId(id)
    if (!ticket) {
      throw new RecursoNoEncontrado(`No existe el ticket ${id}`)
    }

    ticket.actualizarCliente(datos.cliente, this.reloj)
    ticket.actualizarEquipoYConceptos(
      { ...datos.equipo, categoria: parsearCategoria(datos.equipo.categoria) },
      construirItems(datos.items ?? [], this.generadorId),
      this.reloj,
    )
    ticket.fijarGarantia(datos.garantiaDias ?? null, this.reloj)
    ticket.actualizarDetalle(
      {
        problemaReportado: datos.problemaReportado,
        diagnostico: datos.diagnostico,
        trabajoRealizado: datos.trabajoRealizado,
        recomendaciones: datos.recomendaciones,
        notaGarantia: datos.notaGarantia,
      },
      this.reloj,
    )
    ticket.fijarFechaServicio(
      parsearFechaServicio(datos.fechaServicio),
      this.reloj,
    )
    ticket.fijarImpuesto(
      datos.impuesto != null
        ? Dinero.desdeUnidades(datos.impuesto)
        : Dinero.cero(),
      this.reloj,
    )

    await this.repo.guardar(ticket)
  }
}
