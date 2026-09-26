export const ESTADOS_PROYECTO = ["borrador", "publicado", "archivado"] as const

export type EstadoProyecto = (typeof ESTADOS_PROYECTO)[number]

export function esEstadoProyecto(valor: string): valor is EstadoProyecto {
  return (ESTADOS_PROYECTO as readonly string[]).includes(valor)
}
