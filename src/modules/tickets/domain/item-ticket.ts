import { Dinero } from "@/src/modules/shared/domain/dinero"
import { DatosInvalidos } from "@/src/modules/shared/domain/errors"
import { type ClaseConcepto, type TipoPieza, esClaseConcepto, esTipoPieza, LARGO_ETIQUETA } from "./clasificacion"

export interface DatosItemTicket {
  id: string
  concepto: string
  detalle?: string | null
  cantidad: number
  precioUnitario: Dinero
  clase?: ClaseConcepto
  pieza?: TipoPieza | null
  etiqueta?: string | null
  piezaAnterior?: string | null
}

/**
 * Línea de un ticket: un concepto de trabajo o refacción con su costo.
 * El importe siempre se deriva de cantidad × precioUnitario.
 */
export class ItemTicket {
  readonly id: string
  readonly concepto: string
  readonly detalle: string | null
  readonly cantidad: number
  readonly clase: ClaseConcepto
  readonly pieza: TipoPieza | null
  readonly etiqueta: string | null
  readonly piezaAnterior: string | null
  readonly precioUnitario: Dinero

  constructor(datos: DatosItemTicket) {
    const concepto = datos.concepto.trim()
    if (concepto.length === 0) {
      throw new DatosInvalidos("El concepto del ítem no puede estar vacío")
    }
    if (!Number.isFinite(datos.cantidad) || datos.cantidad <= 0) {
      throw new DatosInvalidos(
        `La cantidad del ítem "${concepto}" debe ser mayor a cero`,
      )
    }
    const clase = datos.clase === undefined ? "otro" : datos.clase
    if (!esClaseConcepto(clase)) throw new DatosInvalidos("La clase del concepto no es válida")
    const pieza = datos.pieza ?? null
    if (pieza !== null && !esTipoPieza(pieza)) throw new DatosInvalidos("El tipo de pieza no es válido")
    if (pieza !== null && clase !== "pieza" && clase !== "diagnostico") {
      throw new DatosInvalidos("Solo los conceptos de pieza o diagnóstico pueden indicar una pieza")
    }
    const etiqueta = textoCorto(datos.etiqueta, "La etiqueta")
    const piezaAnterior = textoCorto(datos.piezaAnterior, "La pieza anterior")
    if (piezaAnterior !== null && clase !== "pieza") {
      throw new DatosInvalidos("Solo los conceptos de pieza pueden indicar la pieza anterior")
    }
    this.clase = clase
    this.pieza = pieza
    this.etiqueta = etiqueta
    this.piezaAnterior = piezaAnterior
    this.id = datos.id
    this.concepto = concepto
    this.detalle = datos.detalle?.trim() || null
    this.cantidad = datos.cantidad
    this.precioUnitario = datos.precioUnitario
  }

  get importe(): Dinero {
    return this.precioUnitario.por(this.cantidad)
  }
}

function textoCorto(valor: string | null | undefined, campo: string): string | null {
  const texto = valor?.trim() || null
  if (texto && texto.length > LARGO_ETIQUETA) {
    throw new DatosInvalidos(`${campo} no puede tener más de ${LARGO_ETIQUETA} caracteres`)
  }
  return texto
}
