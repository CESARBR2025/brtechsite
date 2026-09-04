import { Dinero } from "@/src/modules/shared/domain/dinero"
import { DatosInvalidos } from "@/src/modules/shared/domain/errors"
import type { GeneradorId } from "@/src/modules/shared/domain/id"
import { ItemTicket } from "../domain/item-ticket"
import type { ItemEntrada } from "./entrada"

export function construirItems(
  entradas: ItemEntrada[],
  generadorId: GeneradorId,
): ItemTicket[] {
  return entradas.map(
    (e) =>
      new ItemTicket({
        id: generadorId.nuevo(),
        concepto: e.concepto,
        detalle: e.detalle ?? null,
        cantidad: e.cantidad,
        precioUnitario: Dinero.desdeUnidades(e.precioUnitario),
      }),
  )
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
