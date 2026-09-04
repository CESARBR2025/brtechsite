import type { EstadoTicket } from "../domain/estado-ticket"
import type { Ticket } from "../domain/ticket"

/** Ítem tal como lo consume la presentación (montos en unidades, no centavos). */
export interface ItemDTO {
  id: string
  concepto: string
  detalle: string | null
  cantidad: number
  precioUnitario: number
  importe: number
}

/** Vista pública del ticket: lo que ve el cliente en /t/[slug]. */
export interface TicketPublicoDTO {
  folio: string
  slug: string
  moneda: string
  fechaServicio: string // ISO (solo fecha)
  publicadoEn: string | null
  pagado: boolean
  cliente: { nombre: string; contacto: string | null }
  equipo: { tipo: string; detalle: string | null }
  problemaReportado: string | null
  diagnostico: string | null
  trabajoRealizado: string | null
  recomendaciones: string | null
  notaGarantia: string | null
  items: ItemDTO[]
  subtotal: number
  impuesto: number
  total: number
}

/** Fila del listado del panel. */
export interface TicketResumenDTO {
  id: string
  folio: string
  slug: string
  estado: EstadoTicket
  clienteNombre: string
  equipoTipo: string
  total: number
  moneda: string
  pagado: boolean
  fechaServicio: string
  actualizadoEn: string
}

/** Vista completa para editar en el panel. */
export interface TicketDetalleDTO extends TicketPublicoDTO {
  id: string
  estado: EstadoTicket
  creadoEn: string
  actualizadoEn: string
}

function fechaISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function itemsDTO(ticket: Ticket): ItemDTO[] {
  return ticket.items.map((item) => ({
    id: item.id,
    concepto: item.concepto,
    detalle: item.detalle,
    cantidad: item.cantidad,
    precioUnitario: item.precioUnitario.unidades,
    importe: item.importe.unidades,
  }))
}

export function aTicketPublicoDTO(ticket: Ticket): TicketPublicoDTO {
  return {
    folio: ticket.folio,
    slug: ticket.slug.valor,
    moneda: ticket.moneda,
    fechaServicio: fechaISO(ticket.fechaServicio),
    publicadoEn: ticket.publicadoEn?.toISOString() ?? null,
    pagado: ticket.pagado,
    cliente: ticket.cliente,
    equipo: ticket.equipo,
    problemaReportado: ticket.detalle.problemaReportado,
    diagnostico: ticket.detalle.diagnostico,
    trabajoRealizado: ticket.detalle.trabajoRealizado,
    recomendaciones: ticket.detalle.recomendaciones,
    notaGarantia: ticket.detalle.notaGarantia,
    items: itemsDTO(ticket),
    subtotal: ticket.subtotal.unidades,
    impuesto: ticket.impuesto.unidades,
    total: ticket.total.unidades,
  }
}

export function aTicketDetalleDTO(ticket: Ticket): TicketDetalleDTO {
  return {
    ...aTicketPublicoDTO(ticket),
    id: ticket.id,
    estado: ticket.estado,
    creadoEn: ticket.creadoEn.toISOString(),
    actualizadoEn: ticket.actualizadoEn.toISOString(),
  }
}

export function aTicketResumenDTO(ticket: Ticket): TicketResumenDTO {
  return {
    id: ticket.id,
    folio: ticket.folio,
    slug: ticket.slug.valor,
    estado: ticket.estado,
    clienteNombre: ticket.cliente.nombre,
    equipoTipo: ticket.equipo.tipo,
    total: ticket.total.unidades,
    moneda: ticket.moneda,
    pagado: ticket.pagado,
    fechaServicio: fechaISO(ticket.fechaServicio),
    actualizadoEn: ticket.actualizadoEn.toISOString(),
  }
}
