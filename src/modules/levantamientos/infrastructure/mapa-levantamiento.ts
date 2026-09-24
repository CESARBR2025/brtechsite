import type { EstadoLevantamiento } from "../domain/estado-levantamiento"
import { Levantamiento } from "../domain/levantamiento"
import { SlugLevantamiento } from "../domain/slug-levantamiento"

export interface FilaLevantamiento {
  id: string
  public_slug: string
  folio: string
  estado: string
  cliente_nombre: string
  cliente_contacto: string | null
  proyecto_nombre: string | null
  /** Ya viene como 'YYYY-MM-DD' (casteado con to_char en la consulta). */
  fecha_reunion: string
  contenido: unknown
  esquema_version: number
  creado_en: Date | string
  actualizado_en: Date | string
  publicado_en: Date | string | null
  confirmado_en: Date | string | null
}

function fecha(valor: Date | string): Date {
  return valor instanceof Date ? valor : new Date(valor)
}

export function levantamientoADominio(fila: FilaLevantamiento): Levantamiento {
  return Levantamiento.desdePersistencia({
    id: fila.id,
    folio: fila.folio,
    slug: SlugLevantamiento.desde(fila.public_slug),
    estado: fila.estado as EstadoLevantamiento,
    clienteNombre: fila.cliente_nombre,
    clienteContacto: fila.cliente_contacto,
    proyectoNombre: fila.proyecto_nombre,
    fechaReunion: new Date(`${fila.fecha_reunion}T00:00:00.000Z`),
    contenido: fila.contenido,
    creadoEn: fecha(fila.creado_en),
    actualizadoEn: fecha(fila.actualizado_en),
    publicadoEn: fila.publicado_en ? fecha(fila.publicado_en) : null,
    confirmadoEn: fila.confirmado_en ? fecha(fila.confirmado_en) : null,
  })
}
