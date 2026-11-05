/** Geometría y colores del símbolo aprobado en PROTO, sin React ni DOM. */
export const R = 100
export const RI = 57

export type Punto = readonly [number, number]

export const pol = (r: number, a: number): Punto => [
  r * Math.cos(a * Math.PI / 180),
  r * Math.sin(a * Math.PI / 180),
]

export function rot(p: Punto, a: number): Punto {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180)
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]
}

const f = (n: number): string => n.toFixed(2)
const P = (p: Punto): string => f(p[0]) + " " + f(p[1])

export const clamp = (x: number, a = 0, b = 1): number => Math.min(b, Math.max(a, x))
export const tramo = (ms: number, a: number, b: number): number => clamp((ms - a) / (b - a))
export const salidaCubica = (t: number): number => 1 - Math.pow(1 - t, 3)
export const entradaCubica = (t: number): number => t * t * t
export const salidaAtras = (t: number, c = 1.7): number =>
  1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)

export function aspa(r: number, phi: number): { cuerpo: string; brillo: string; sombra: string } {
  const Ia = pol(r, -120 + phi), Ib = pol(r, -60 + phi), d = 14
  const O30 = pol(R, -30), O90 = pol(R, -90), Pb = pol(R - 3.5, -30), Pa = pol(R - 3.5, -90)
  const lx = O90[0] - O30[0], ly = O90[1] - O30[1], L = Math.hypot(lx, ly), ux = lx / L, uy = ly / L
  const E1: Punto = [O30[0] + ux * d, O30[1] + uy * d], E2: Punto = [O90[0] - ux * d, O90[1] - uy * d]
  const K1: Punto = [(O30[0] + E1[0]) / 2, (O30[1] + E1[1]) / 2]
  const K2: Punto = [(O90[0] + E2[0]) / 2, (O90[1] + E2[1]) / 2]
  const ex = Ib[0] - Ia[0], ey = Ib[1] - Ia[1], EL = Math.hypot(ex, ey) || 1
  const dist = Math.hypot(Pb[0] - Ib[0], Pb[1] - Ib[1]), bul = pol(7, -75)
  const Cb: Punto = [Ib[0] + ex / EL * dist * .55 + bul[0], Ib[1] + ey / EL * dist * .55 + bul[1]]
  const Ca = rot(Cb, -60)
  const Rc = pol(13, -82), Sc = pol(11, -52)
  return {
    cuerpo: `M${P(Ia)}L${P(Ib)}Q${P(Cb)} ${P(Pb)}Q${P(K1)} ${P(E1)}L${P(E2)}Q${P(K2)} ${P(Pa)}Q${P(Ca)} ${P(Ia)}Z`,
    brillo: `M${P(Ib)}Q${P(Cb)} ${P(Pb)}Q${P([Cb[0] + Rc[0], Cb[1] + Rc[1]])} ${P(Ib)}Z`,
    sombra: `M${P(Ia)}Q${P(Ca)} ${P(Pa)}Q${P([Ca[0] + Sc[0], Ca[1] + Sc[1]])} ${P(Ia)}Z`,
  }
}

export function hex(r: number, giro = 0, cx = 0, cy = 0, esc = 1): string {
  let s = ""
  for (let j = 0; j < 6; j++) {
    const p = pol(r * esc, -120 + 60 * j + giro)
    s += (j ? "L" : "M") + f(p[0] + cx) + " " + f(p[1] + cy)
  }
  return s + "Z"
}

// Colores propios del dibujo de marca, conservados literalmente de PROTO.
export const TONOS = [
  ["#C98FFF", "#7A2CE6"], ["#A85CF5", "#4A1FB0"],
  ["#7C3FE0", "#2C1280"], ["#6A35CE", "#2A1178"],
  ["#8C4CEB", "#451DA6"], ["#B070F7", "#6B28DA"],
] as const

export const CODIGO = ["M-19 -16L-43 0L-19 16", "M10 -29L-9 28", "M19 -16L43 0L19 16"] as const
export const ESTRELLA = "M0 -14Q1.6 -1.6 14 0Q1.6 1.6 0 14Q-1.6 1.6 -14 0Q-1.6 -1.6 0 -14Z"

/** El prefijo procede de useId o de una constante interna, nunca de datos del recibo. */
export function gradientesSvgTexto(prefijo: string): string {
  return TONOS.map((t, i) =>
    `<linearGradient id="${prefijo}-t${i}" gradientUnits="userSpaceOnUse" x1="60" y1="-85" x2="-5" y2="-40"><stop offset="0" stop-color="${t[0]}"/><stop offset="1" stop-color="${t[1]}"/></linearGradient>`,
  ).join("") +
    `<linearGradient id="${prefijo}-gb" gradientUnits="userSpaceOnUse" x1="30" y1="-50" x2="90" y2="-50"><stop offset="0" stop-color="#fff" stop-opacity=".82"/><stop offset="1" stop-color="#E9D9FF" stop-opacity=".18"/></linearGradient>` +
    `<linearGradient id="${prefijo}-gc" gradientUnits="userSpaceOnUse" x1="-25" y1="-50" x2="0" y2="-98"><stop offset="0" stop-color="#160650" stop-opacity=".6"/><stop offset="1" stop-color="#160650" stop-opacity="0"/></linearGradient>`
}

export function contenidoSimboloSvg(prefijo: string): string {
  const a = aspa(RI, 0)
  return `<defs>${gradientesSvgTexto(prefijo)}</defs>` +
    TONOS.map((_, i) => `<g transform="rotate(${60 * i})"><path d="${a.cuerpo}" fill="url(#${prefijo}-t${i})"/><path d="${a.brillo}" fill="url(#${prefijo}-gb)"/><path d="${a.sombra}" fill="url(#${prefijo}-gc)"/></g>`).join("") +
    `<path d="${hex(RI)}" fill="#fff"/>` +
    CODIGO.map(d => `<path d="${d}" fill="none" stroke="#8C5BE0" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`).join("")
}

export function simboloSvgTexto(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="-104 -104 208 208">${contenidoSimboloSvg("brtech")}</svg>`
}
