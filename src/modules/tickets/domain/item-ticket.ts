import { Dinero } from "@/src/modules/shared/domain/dinero"
import { DatosInvalidos } from "@/src/modules/shared/domain/errors"

export interface DatosItemTicket {
  id: string
  concepto: string
  detalle?: string | null
  cantidad: number
  precioUnitario: Dinero
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
