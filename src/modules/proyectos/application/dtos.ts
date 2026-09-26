import type { ClaveSeccion, Contenido } from "../domain/contenido"
import type { EstadoProyecto } from "../domain/estado-proyecto"
import type { Proyecto } from "../domain/proyecto"

/** Contenido tal como lo ve el cliente: sin notas internas, permisos, arquitectura ni decisiones. */
export type ContenidoPublicoDTO = Omit<
  Contenido,
  "notasInternas" | "permisos" | "arquitectura" | "decisiones"
>

/** Vista pública: la propuesta en /p/[slug]. */
export interface PropuestaPublicaDTO {
  folio: string
  slug: string
  cliente: { nombre: string }
  proyectoNombre: string | null
  fechaPropuesta: string // YYYY-MM-DD
  publicadoEn: string | null
  aceptacion: { en: string; por: string } | null
  totalCentavos: number
  contenido: ContenidoPublicoDTO
}

/** Fila del listado del panel. */
export interface ProyectoResumenDTO {
  id: string
  folio: string
  slug: string
  estado: EstadoProyecto
  clienteNombre: string
  proyectoNombre: string | null
  fechaPropuesta: string
  aceptado: boolean
  totalCentavos: number
  moneda: string
  seccionesCompletas: number
  seccionesTotales: number
  actualizadoEn: string
}

/** Vista completa para capturar/editar en el panel. */
export interface ProyectoDetalleDTO {
  id: string
  folio: string
  slug: string
  estado: EstadoProyecto
  levantamientoId: string | null
  cliente: { nombre: string; contacto: string | null }
  proyectoNombre: string | null
  fechaPropuesta: string
  contenido: Contenido
  completitud: Record<ClaveSeccion, boolean>
  creadoEn: string
  actualizadoEn: string
  publicadoEn: string | null
  aceptacion: { en: string; por: string } | null
}

function fechaISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function aceptacionDTO(p: Proyecto): { en: string; por: string } | null {
  const a = p.aceptacion
  return a ? { en: a.en.toISOString(), por: a.por } : null
}

export function aPropuestaPublicaDTO(p: Proyecto): PropuestaPublicaDTO {
  // Único punto donde el contenido sale al público: aquí se quita lo interno
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    notasInternas: _interno,
    permisos: _permisos,
    arquitectura: _arquitectura,
    decisiones: _decisiones,
    ...publico
  } = p.contenido
  /* eslint-enable @typescript-eslint/no-unused-vars */
  return {
    folio: p.folio,
    slug: p.slug.valor,
    cliente: { nombre: p.cliente.nombre },
    proyectoNombre: p.proyectoNombre,
    fechaPropuesta: fechaISO(p.fechaPropuesta),
    publicadoEn: p.publicadoEn?.toISOString() ?? null,
    aceptacion: aceptacionDTO(p),
    totalCentavos: p.totalCentavos,
    contenido: publico,
  }
}

export function aProyectoDetalleDTO(p: Proyecto): ProyectoDetalleDTO {
  return {
    id: p.id,
    folio: p.folio,
    slug: p.slug.valor,
    estado: p.estado,
    levantamientoId: p.levantamientoId,
    cliente: p.cliente,
    proyectoNombre: p.proyectoNombre,
    fechaPropuesta: fechaISO(p.fechaPropuesta),
    contenido: p.contenido,
    completitud: p.completitud,
    creadoEn: p.creadoEn.toISOString(),
    actualizadoEn: p.actualizadoEn.toISOString(),
    publicadoEn: p.publicadoEn?.toISOString() ?? null,
    aceptacion: aceptacionDTO(p),
  }
}

export function aProyectoResumenDTO(p: Proyecto): ProyectoResumenDTO {
  const secciones = Object.values(p.completitud)
  return {
    id: p.id,
    folio: p.folio,
    slug: p.slug.valor,
    estado: p.estado,
    clienteNombre: p.cliente.nombre,
    proyectoNombre: p.proyectoNombre,
    fechaPropuesta: fechaISO(p.fechaPropuesta),
    aceptado: p.aceptacion !== null,
    totalCentavos: p.totalCentavos,
    moneda: p.contenido.inversion.moneda,
    seccionesCompletas: secciones.filter(Boolean).length,
    seccionesTotales: secciones.length,
    actualizadoEn: p.actualizadoEn.toISOString(),
  }
}
