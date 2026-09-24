/**
 * Fechas críticas: "YYYY-MM-DDTHH:mm" en la hora local del negocio, sin zona.
 * Se formatean tal cual (como UTC) para no desplazarlas con la zona del servidor.
 */
export function formatearFechaHora(valor: string): string {
  const d = new Date(`${valor}:00.000Z`)
  if (Number.isNaN(d.getTime())) return valor
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(d)
}
