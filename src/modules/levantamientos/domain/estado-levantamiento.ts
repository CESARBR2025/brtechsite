export const ESTADOS_LEVANTAMIENTO = ["borrador", "publicado", "archivado"] as const

export type EstadoLevantamiento = (typeof ESTADOS_LEVANTAMIENTO)[number]

export function esEstadoLevantamiento(
  valor: string,
): valor is EstadoLevantamiento {
  return (ESTADOS_LEVANTAMIENTO as readonly string[]).includes(valor)
}
