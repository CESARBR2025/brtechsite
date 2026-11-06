import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"

const NOMBRES_EQUIPO = { laptop: "laptop", pc: "PC", todo_en_uno: "computadora", otro: "equipo" } as const

export function textosRecibo(ticket: TicketPublicoDTO) {
  const equipo = NOMBRES_EQUIPO[ticket.equipo.categoria]
  const ensamble = ticket.escena.principal === "ensamble"
  const diagnostico = ticket.escena.soloDiagnostico
  const garantia = !diagnostico && ((ticket.garantiaDias ?? 0) > 0 || Boolean(ticket.notaGarantia?.trim()))
  const titulos = ensamble
    ? ["Lo que buscabas", "Lo que elegimos", "Lo que hicimos"]
    : ["Lo que nos contaste", "Lo que encontramos", diagnostico ? "Lo que sigue" : "Lo que hicimos"]
  const textos = [ticket.problemaReportado, ticket.diagnostico,
    diagnostico ? ticket.trabajoRealizado?.trim() || ticket.recomendaciones : ticket.trabajoRealizado]

  return {
    equipo,
    apoyo: ticket.pagado
      ? `Recibimos tu pago. Guarda esta página: es tu comprobante${garantia ? " y tu garantía" : ""}.`
      : ensamble
        ? `Tu nueva PC ya está armada y probada. Aquí tienes cada pieza${garantia ? ", tu garantía" : ""} y la forma de pago.`
        : diagnostico
          ? `Ya sabemos qué tiene tu ${equipo}. Aquí tienes el diagnóstico, lo que sigue y la forma de pago.`
          : `Tu ${equipo} ya está ${ticket.equipo.categoria === "otro" ? "listo" : "lista"} y vuelve a funcionar como debe. Aquí tienes todo lo que le hicimos${garantia ? ", tu garantía" : ""} y la forma de pago.`,
    titulo: ensamble ? "Así armamos tu PC" : diagnostico ? `Lo que encontramos en tu ${equipo}` : `Así quedó tu ${equipo}`,
    subtitulo: ensamble ? "Lo que buscabas, lo que elegimos y cómo quedó." : `Lo que nos contaste, lo que encontramos y ${diagnostico ? "lo que sigue" : "lo que hicimos"}.`,
    pasos: textos.flatMap((texto, indice) => texto?.trim() ? [{ indice, titulo: titulos[indice], texto }] : []),
  }
}

/** Fechas civiles de México; se pasan ya resueltas al HTML, sin reloj en el cliente. */
export function hoyDelRecibo(ahora = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit" }).format(ahora)
}

const MILISEGUNDOS_DIA = 86_400_000
const fechaCivil = (fecha: string) => Date.parse(`${fecha.slice(0, 10)}T00:00:00Z`)

export function diasDesdeServicio(fechaServicio: string, hoy: string): number {
  return Math.max(0, Math.floor((fechaCivil(hoy) - fechaCivil(fechaServicio)) / MILISEGUNDOS_DIA))
}

export function vigenciaGarantia(fechaServicio: string, dias: number, hoy: string) {
  const vence = fechaCivil(fechaServicio) + dias * MILISEGUNDOS_DIA
  const restantes = Math.min(dias, Math.max(0, Math.ceil((vence - fechaCivil(hoy)) / MILISEGUNDOS_DIA)))
  return { fecha: new Date(vence).toISOString().slice(0, 10), restantes, porcentaje: restantes / dias * 100 }
}
