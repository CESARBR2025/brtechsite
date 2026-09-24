import type { ClaveSeccion, Contenido } from "../domain/contenido"
import type { EstadoLevantamiento } from "../domain/estado-levantamiento"
import type { Levantamiento } from "../domain/levantamiento"

/** Contenido tal como lo ve el cliente: nunca incluye las notas internas. */
export type ContenidoPublicoDTO = Omit<Contenido, "notasInternas">

/** Vista pública: el "Diagnóstico de tu proyecto" en /d/[slug]. */
export interface DiagnosticoPublicoDTO {
  folio: string
  slug: string
  cliente: { nombre: string }
  proyectoNombre: string | null
  fechaReunion: string // YYYY-MM-DD
  publicadoEn: string | null
  confirmado: boolean
  contenido: ContenidoPublicoDTO
}

/** Fila del listado del panel. */
export interface LevantamientoResumenDTO {
  id: string
  folio: string
  slug: string
  estado: EstadoLevantamiento
  clienteNombre: string
  proyectoNombre: string | null
  fechaReunion: string
  confirmado: boolean
  seccionesCompletas: number
  seccionesTotales: number
  actualizadoEn: string
}

/** Vista completa para capturar/editar en el panel. */
export interface LevantamientoDetalleDTO {
  id: string
  folio: string
  slug: string
  estado: EstadoLevantamiento
  cliente: { nombre: string; contacto: string | null }
  proyectoNombre: string | null
  fechaReunion: string
  contenido: Contenido
  completitud: Record<ClaveSeccion, boolean>
  creadoEn: string
  actualizadoEn: string
  publicadoEn: string | null
  confirmadoEn: string | null
}

function fechaISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function aDiagnosticoPublicoDTO(l: Levantamiento): DiagnosticoPublicoDTO {
  // Único punto donde el contenido sale al público: aquí se quitan las notas internas
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { notasInternas: _interno, ...publico } = l.contenido
  return {
    folio: l.folio,
    slug: l.slug.valor,
    cliente: { nombre: l.cliente.nombre },
    proyectoNombre: l.proyectoNombre,
    fechaReunion: fechaISO(l.fechaReunion),
    publicadoEn: l.publicadoEn?.toISOString() ?? null,
    confirmado: l.confirmadoEn !== null,
    contenido: publico,
  }
}

export function aLevantamientoDetalleDTO(
  l: Levantamiento,
): LevantamientoDetalleDTO {
  return {
    id: l.id,
    folio: l.folio,
    slug: l.slug.valor,
    estado: l.estado,
    cliente: l.cliente,
    proyectoNombre: l.proyectoNombre,
    fechaReunion: fechaISO(l.fechaReunion),
    contenido: l.contenido,
    completitud: l.completitud,
    creadoEn: l.creadoEn.toISOString(),
    actualizadoEn: l.actualizadoEn.toISOString(),
    publicadoEn: l.publicadoEn?.toISOString() ?? null,
    confirmadoEn: l.confirmadoEn?.toISOString() ?? null,
  }
}

export function aLevantamientoResumenDTO(
  l: Levantamiento,
): LevantamientoResumenDTO {
  const secciones = Object.values(l.completitud)
  return {
    id: l.id,
    folio: l.folio,
    slug: l.slug.valor,
    estado: l.estado,
    clienteNombre: l.cliente.nombre,
    proyectoNombre: l.proyectoNombre,
    fechaReunion: fechaISO(l.fechaReunion),
    confirmado: l.confirmadoEn !== null,
    seccionesCompletas: secciones.filter(Boolean).length,
    seccionesTotales: secciones.length,
    actualizadoEn: l.actualizadoEn.toISOString(),
  }
}
