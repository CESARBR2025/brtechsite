import { Dinero } from "@/src/modules/shared/domain/dinero"
import {
  DatosInvalidos,
  OperacionNoPermitida,
} from "@/src/modules/shared/domain/errors"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { EstadoTicket } from "./estado-ticket"
import { ItemTicket } from "./item-ticket"
import { SlugTicket } from "./slug-ticket"

export interface DatosCliente {
  nombre: string
  contacto?: string | null
}

export interface DatosEquipo {
  tipo: string
  detalle?: string | null
}

/** Campos de texto libre editables de un ticket. */
export interface DetalleServicio {
  problemaReportado?: string | null
  diagnostico?: string | null
  trabajoRealizado?: string | null
  recomendaciones?: string | null
  notaGarantia?: string | null
}

export interface DatosNuevoTicket {
  cliente: DatosCliente
  equipo: DatosEquipo
  detalle?: DetalleServicio
  moneda?: string
  impuesto?: Dinero
  fechaServicio: Date
  items?: ItemTicket[]
}

export interface PropsTicket {
  id: string
  folio: string
  slug: SlugTicket
  estado: EstadoTicket
  clienteNombre: string
  clienteContacto: string | null
  equipoTipo: string
  equipoDetalle: string | null
  problemaReportado: string | null
  diagnostico: string | null
  trabajoRealizado: string | null
  recomendaciones: string | null
  notaGarantia: string | null
  moneda: string
  impuesto: Dinero
  pagado: boolean
  fechaServicio: Date
  items: ItemTicket[]
  creadoEn: Date
  actualizadoEn: Date
  publicadoEn: Date | null
}

function textoOpcional(valor: string | null | undefined): string | null {
  const t = valor?.trim()
  return t ? t : null
}

function textoRequerido(valor: string, campo: string): string {
  const t = valor.trim()
  if (!t) throw new DatosInvalidos(`El campo "${campo}" es obligatorio`)
  return t
}

/**
 * Raíz de agregado. Un ticket de servicio con sus líneas.
 * Subtotal y total siempre se derivan de los ítems; nunca se guardan sueltos.
 */
export class Ticket {
  private constructor(private props: PropsTicket) {}

  /** Alta de un ticket nuevo (siempre nace en borrador). */
  static crear(
    datos: DatosNuevoTicket,
    deps: { id: string; folio: string; slug: SlugTicket; reloj: Reloj },
  ): Ticket {
    const ahora = deps.reloj.ahora()
    const d = datos.detalle ?? {}
    return new Ticket({
      id: deps.id,
      folio: deps.folio,
      slug: deps.slug,
      estado: "borrador",
      clienteNombre: textoRequerido(datos.cliente.nombre, "nombre del cliente"),
      clienteContacto: textoOpcional(datos.cliente.contacto),
      equipoTipo: textoRequerido(datos.equipo.tipo, "tipo de equipo"),
      equipoDetalle: textoOpcional(datos.equipo.detalle),
      problemaReportado: textoOpcional(d.problemaReportado),
      diagnostico: textoOpcional(d.diagnostico),
      trabajoRealizado: textoOpcional(d.trabajoRealizado),
      recomendaciones: textoOpcional(d.recomendaciones),
      notaGarantia: textoOpcional(d.notaGarantia),
      moneda: (datos.moneda ?? "MXN").trim().toUpperCase(),
      impuesto: datos.impuesto ?? Dinero.cero(),
      pagado: false,
      fechaServicio: datos.fechaServicio,
      items: datos.items ?? [],
      creadoEn: ahora,
      actualizadoEn: ahora,
      publicadoEn: null,
    })
  }

  /** Rehidrata desde persistencia sin re-ejecutar reglas de alta. */
  static desdePersistencia(props: PropsTicket): Ticket {
    return new Ticket(props)
  }

  // --- Lectura ---

  get id(): string {
    return this.props.id
  }
  get folio(): string {
    return this.props.folio
  }
  get slug(): SlugTicket {
    return this.props.slug
  }
  get estado(): EstadoTicket {
    return this.props.estado
  }
  get moneda(): string {
    return this.props.moneda
  }
  get impuesto(): Dinero {
    return this.props.impuesto
  }
  get pagado(): boolean {
    return this.props.pagado
  }
  get fechaServicio(): Date {
    return this.props.fechaServicio
  }
  get items(): readonly ItemTicket[] {
    return this.props.items
  }
  get creadoEn(): Date {
    return this.props.creadoEn
  }
  get actualizadoEn(): Date {
    return this.props.actualizadoEn
  }
  get publicadoEn(): Date | null {
    return this.props.publicadoEn
  }
  get cliente(): { nombre: string; contacto: string | null } {
    return {
      nombre: this.props.clienteNombre,
      contacto: this.props.clienteContacto,
    }
  }
  get equipo(): { tipo: string; detalle: string | null } {
    return { tipo: this.props.equipoTipo, detalle: this.props.equipoDetalle }
  }
  get detalle(): Required<DetalleServicio> {
    return {
      problemaReportado: this.props.problemaReportado,
      diagnostico: this.props.diagnostico,
      trabajoRealizado: this.props.trabajoRealizado,
      recomendaciones: this.props.recomendaciones,
      notaGarantia: this.props.notaGarantia,
    }
  }
  get esPublico(): boolean {
    return this.props.estado === "publicado"
  }

  get subtotal(): Dinero {
    return this.props.items.reduce(
      (acc, item) => acc.mas(item.importe),
      Dinero.cero(),
    )
  }

  get total(): Dinero {
    return this.subtotal.mas(this.props.impuesto)
  }

  // --- Comportamiento ---

  private garantizarEditable(): void {
    if (this.props.estado === "archivado") {
      throw new OperacionNoPermitida(
        "Un ticket archivado no se puede modificar",
      )
    }
  }

  private tocar(reloj: Reloj): void {
    this.props.actualizadoEn = reloj.ahora()
  }

  actualizarCliente(datos: DatosCliente, reloj: Reloj): void {
    this.garantizarEditable()
    this.props.clienteNombre = textoRequerido(datos.nombre, "nombre del cliente")
    this.props.clienteContacto = textoOpcional(datos.contacto)
    this.tocar(reloj)
  }

  actualizarEquipo(datos: DatosEquipo, reloj: Reloj): void {
    this.garantizarEditable()
    this.props.equipoTipo = textoRequerido(datos.tipo, "tipo de equipo")
    this.props.equipoDetalle = textoOpcional(datos.detalle)
    this.tocar(reloj)
  }

  actualizarDetalle(detalle: DetalleServicio, reloj: Reloj): void {
    this.garantizarEditable()
    if ("problemaReportado" in detalle)
      this.props.problemaReportado = textoOpcional(detalle.problemaReportado)
    if ("diagnostico" in detalle)
      this.props.diagnostico = textoOpcional(detalle.diagnostico)
    if ("trabajoRealizado" in detalle)
      this.props.trabajoRealizado = textoOpcional(detalle.trabajoRealizado)
    if ("recomendaciones" in detalle)
      this.props.recomendaciones = textoOpcional(detalle.recomendaciones)
    if ("notaGarantia" in detalle)
      this.props.notaGarantia = textoOpcional(detalle.notaGarantia)
    this.tocar(reloj)
  }

  fijarImpuesto(impuesto: Dinero, reloj: Reloj): void {
    this.garantizarEditable()
    this.props.impuesto = impuesto
    this.tocar(reloj)
  }

  fijarFechaServicio(fecha: Date, reloj: Reloj): void {
    this.garantizarEditable()
    this.props.fechaServicio = fecha
    this.tocar(reloj)
  }

  /** Sustituye la lista completa de ítems (el panel siempre manda todo). */
  reemplazarItems(items: ItemTicket[], reloj: Reloj): void {
    this.garantizarEditable()
    this.props.items = [...items]
    this.tocar(reloj)
  }

  marcarPagado(pagado: boolean, reloj: Reloj): void {
    this.props.pagado = pagado
    this.tocar(reloj)
  }

  publicar(reloj: Reloj): void {
    if (this.props.estado === "publicado") return
    if (this.props.estado === "archivado") {
      throw new OperacionNoPermitida("No se puede publicar un ticket archivado")
    }
    if (this.props.items.length === 0) {
      throw new OperacionNoPermitida(
        "El ticket necesita al menos un concepto para publicarse",
      )
    }
    this.props.estado = "publicado"
    this.props.publicadoEn = reloj.ahora()
    this.tocar(reloj)
  }

  despublicar(reloj: Reloj): void {
    if (this.props.estado !== "publicado") return
    this.props.estado = "borrador"
    this.props.publicadoEn = null
    this.tocar(reloj)
  }

  archivar(reloj: Reloj): void {
    this.props.estado = "archivado"
    this.tocar(reloj)
  }

  /** Snapshot plano para el repositorio. No se usa desde presentación. */
  instantanea(): PropsTicket {
    return { ...this.props, items: [...this.props.items] }
  }
}
