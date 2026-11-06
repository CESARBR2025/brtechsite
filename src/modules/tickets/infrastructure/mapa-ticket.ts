import { Dinero } from "@/src/modules/shared/domain/dinero"
import { esCategoriaEquipo, esClaseConcepto, esTipoPieza } from "../domain/clasificacion"
import type { EstadoTicket } from "../domain/estado-ticket"
import { ItemTicket } from "../domain/item-ticket"
import { SlugTicket } from "../domain/slug-ticket"
import { Ticket } from "../domain/ticket"

export interface FilaTicket {
  id: string
  public_slug: string
  folio: string
  estado: string
  cliente_nombre: string
  cliente_contacto: string | null
  equipo_categoria: string
  garantia_dias: number | null
  equipo_tipo: string
  equipo_detalle: string | null
  problema_reportado: string | null
  diagnostico: string | null
  trabajo_realizado: string | null
  recomendaciones: string | null
  nota_garantia: string | null
  moneda: string
  impuesto_centavos: string | number
  pagado: boolean
  /** Ya viene como 'YYYY-MM-DD' (casteado con to_char en la consulta). */
  fecha_servicio: string
  creado_en: Date | string
  actualizado_en: Date | string
  publicado_en: Date | string | null
}

export interface FilaItem {
  id: string
  ticket_id: string
  posicion: number
  clase: string
  pieza: string | null
  etiqueta: string | null
  pieza_anterior: string | null
  concepto: string
  detalle: string | null
  cantidad: string | number
  precio_unitario_centavos: string | number
}

function fecha(valor: Date | string): Date {
  return valor instanceof Date ? valor : new Date(valor)
}

function fechaSoloDia(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`)
}

export function itemADominio(fila: FilaItem): ItemTicket {
  const clase = esClaseConcepto(fila.clase) ? fila.clase : "otro"
  return new ItemTicket({
    clase,
    pieza: (clase === "pieza" || clase === "diagnostico") && fila.pieza !== null && esTipoPieza(fila.pieza) ? fila.pieza : null,
    etiqueta: fila.etiqueta,
    piezaAnterior: clase === "pieza" ? fila.pieza_anterior : null,
    id: fila.id,
    concepto: fila.concepto,
    detalle: fila.detalle,
    cantidad: Number(fila.cantidad),
    precioUnitario: Dinero.desdeCentavos(Number(fila.precio_unitario_centavos)),
  })
}

export function ticketADominio(
  fila: FilaTicket,
  filasItems: FilaItem[],
): Ticket {
  const items = [...filasItems]
    .sort((a, b) => a.posicion - b.posicion)
    .map(itemADominio)

  return Ticket.desdePersistencia({
    id: fila.id,
    folio: fila.folio,
    slug: SlugTicket.desde(fila.public_slug),
    estado: fila.estado as EstadoTicket,
    clienteNombre: fila.cliente_nombre,
    clienteContacto: fila.cliente_contacto,
    equipoCategoria: esCategoriaEquipo(fila.equipo_categoria) ? fila.equipo_categoria : "otro",
    garantiaDias: fila.garantia_dias,
    equipoTipo: fila.equipo_tipo,
    equipoDetalle: fila.equipo_detalle,
    problemaReportado: fila.problema_reportado,
    diagnostico: fila.diagnostico,
    trabajoRealizado: fila.trabajo_realizado,
    recomendaciones: fila.recomendaciones,
    notaGarantia: fila.nota_garantia,
    moneda: fila.moneda,
    impuesto: Dinero.desdeCentavos(Number(fila.impuesto_centavos)),
    pagado: fila.pagado,
    fechaServicio: fechaSoloDia(fila.fecha_servicio),
    items,
    creadoEn: fecha(fila.creado_en),
    actualizadoEn: fecha(fila.actualizado_en),
    publicadoEn: fila.publicado_en ? fecha(fila.publicado_en) : null,
  })
}
