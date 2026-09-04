export const ESTADOS_TICKET = ["borrador", "publicado", "archivado"] as const

export type EstadoTicket = (typeof ESTADOS_TICKET)[number]

export function esEstadoTicket(valor: string): valor is EstadoTicket {
  return (ESTADOS_TICKET as readonly string[]).includes(valor)
}
