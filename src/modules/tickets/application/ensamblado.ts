import { Dinero } from "@/src/modules/shared/domain/dinero"
import { DatosInvalidos } from "@/src/modules/shared/domain/errors"
import type { GeneradorId } from "@/src/modules/shared/domain/id"
import { type CategoriaEquipo, esCategoriaEquipo, esClaseConcepto, esTipoPieza } from "../domain/clasificacion"
import { ItemTicket } from "../domain/item-ticket"
import type { ItemEntrada } from "./entrada"

export function construirItems(
  entradas: ItemEntrada[],
  generadorId: GeneradorId,
): ItemTicket[] {
  return entradas.map((e) => {
    if (!esClaseConcepto(e.clase)) throw new DatosInvalidos("La clase del concepto no es válida")
    if (e.pieza != null && !esTipoPieza(e.pieza)) throw new DatosInvalidos("El tipo de pieza no es válido")
    return new ItemTicket({
      id: generadorId.nuevo(),
      concepto: e.concepto,
      detalle: e.detalle ?? null,
      cantidad: e.cantidad,
      precioUnitario: Dinero.desdeUnidades(e.precioUnitario),
      clase: e.clase,
      pieza: e.pieza ?? null,
      etiqueta: e.etiqueta,
      piezaAnterior: e.piezaAnterior,
    })
  })
}

export function parsearCategoria(valor: string): CategoriaEquipo {
  if (!esCategoriaEquipo(valor)) throw new DatosInvalidos("La categoría del equipo no es válida")
  return valor
}

const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/

export function parsearFechaServicio(iso: string): Date {
  if (!PATRON_FECHA.test(iso)) {
    throw new DatosInvalidos(
      `Fecha de servicio inválida: "${iso}" (se espera YYYY-MM-DD)`,
    )
  }
  const fecha = new Date(`${iso}T00:00:00.000Z`)
  if (Number.isNaN(fecha.getTime())) {
    throw new DatosInvalidos(`Fecha de servicio inválida: "${iso}"`)
  }
  return fecha
}
