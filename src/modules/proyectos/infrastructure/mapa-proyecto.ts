import type { EstadoProyecto } from "../domain/estado-proyecto"
import { Proyecto } from "../domain/proyecto"
import { SlugProyecto } from "../domain/slug-proyecto"

export interface FilaProyecto {
  id: string
  public_slug: string
  folio: string
  estado: string
  levantamiento_id: string | null
  cliente_nombre: string
  cliente_contacto: string | null
  proyecto_nombre: string | null
  /** Ya viene como 'YYYY-MM-DD' (casteado con to_char en la consulta). */
  fecha_propuesta: string
  contenido: unknown
  esquema_version: number
  creado_en: Date | string
  actualizado_en: Date | string
  publicado_en: Date | string | null
  aceptado_en: Date | string | null
  aceptado_por: string | null
}

function fecha(valor: Date | string): Date {
  return valor instanceof Date ? valor : new Date(valor)
}

export function proyectoADominio(fila: FilaProyecto): Proyecto {
  return Proyecto.desdePersistencia({
    id: fila.id,
    folio: fila.folio,
    slug: SlugProyecto.desde(fila.public_slug),
    estado: fila.estado as EstadoProyecto,
    levantamientoId: fila.levantamiento_id,
    clienteNombre: fila.cliente_nombre,
    clienteContacto: fila.cliente_contacto,
    proyectoNombre: fila.proyecto_nombre,
    fechaPropuesta: new Date(`${fila.fecha_propuesta}T00:00:00.000Z`),
    contenido: fila.contenido,
    creadoEn: fecha(fila.creado_en),
    actualizadoEn: fecha(fila.actualizado_en),
    publicadoEn: fila.publicado_en ? fecha(fila.publicado_en) : null,
    aceptadoEn: fila.aceptado_en ? fecha(fila.aceptado_en) : null,
    aceptadoPor: fila.aceptado_por,
  })
}
