export function formatearDinero(monto: number, moneda = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: moneda,
  }).format(monto)
}

export function formatearFecha(iso: string): string {
  // iso: "YYYY-MM-DD" o ISO completo
  const soloFecha = iso.slice(0, 10)
  const d = new Date(`${soloFecha}T00:00:00.000Z`)
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d)
}

/** Primer nombre, con la inicial en mayúscula y el resto en minúscula. */
export function nombreDePila(nombre: string): string {
  const primero = nombre.trim().split(/\s+/)[0] ?? ""
  if (!primero) return ""
  return (
    primero.charAt(0).toLocaleUpperCase("es") +
    primero.slice(1).toLocaleLowerCase("es")
  )
}

export function formatearFechaHora(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}
