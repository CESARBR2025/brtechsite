import { DatosInvalidos } from "@/src/modules/shared/domain/errors"
import type { DatosGenerales } from "../domain/levantamiento"

/** Formas de entrada (primitivas) que la presentación pasa a los casos de uso. */
export interface DatosGeneralesEntrada {
  clienteNombre: string
  clienteContacto?: string | null
  proyectoNombre?: string | null
  /** Fecha de la reunión en formato ISO "YYYY-MM-DD". */
  fechaReunion: string
}

const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/

function parsearFecha(iso: string): Date {
  const fecha = new Date(`${iso}T00:00:00.000Z`)
  if (!PATRON_FECHA.test(iso) || Number.isNaN(fecha.getTime())) {
    throw new DatosInvalidos(
      `Fecha de reunión inválida: "${iso}" (se espera YYYY-MM-DD)`,
    )
  }
  return fecha
}

export function aDatosGenerales(e: DatosGeneralesEntrada): DatosGenerales {
  return {
    clienteNombre: e.clienteNombre,
    clienteContacto: e.clienteContacto,
    proyectoNombre: e.proyectoNombre,
    fechaReunion: parsearFecha(e.fechaReunion),
  }
}
