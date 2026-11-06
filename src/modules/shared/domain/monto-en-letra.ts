import type { Dinero } from "./dinero"

const UNIDADES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"]
const DECENAS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"]
const CENTENAS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"]

function menosDeMil(n: number): string {
  if (n === 100) return "cien"
  if (n < 30) return UNIDADES[n]
  if (n < 100) return DECENAS[Math.floor(n / 10)] + (n % 10 ? ` y ${UNIDADES[n % 10]}` : "")
  return CENTENAS[Math.floor(n / 100)] + (n % 100 ? ` ${menosDeMil(n % 100)}` : "")
}

function apocope(texto: string): string {
  return texto.replace(/veintiuno$/, "veintiún").replace(/uno$/, "un")
}

function menosDeUnMillon(n: number): string {
  const miles = Math.floor(n / 1000)
  const resto = n % 1000
  return [miles ? (miles === 1 ? "mil" : `${apocope(menosDeMil(miles))} mil`) : "", resto ? apocope(menosDeMil(resto)) : ""].filter(Boolean).join(" ")
}

/** Montos MXN de hasta 999,999,999 pesos; fuera del rango devuelve null. */
export function montoEnLetra(monto: Dinero, moneda: string): string | null {
  if (moneda !== "MXN") return null
  const pesos = Math.floor(monto.centavos / 100)
  if (pesos > 999_999_999) return null
  const millones = Math.floor(pesos / 1_000_000)
  const resto = pesos % 1_000_000
  const texto = pesos === 0 ? "cero" : [
    millones ? (millones === 1 ? "un millón" : `${apocope(menosDeMil(millones))} millones`) : "",
    resto ? menosDeUnMillon(resto) : "",
  ].filter(Boolean).join(" ")
  const centavos = String(monto.centavos % 100).padStart(2, "0")
  const sustantivo = pesos !== 0 && pesos % 1_000_000 === 0 ? "de pesos" : pesos === 1 ? "peso" : "pesos"
  return `${texto[0].toUpperCase()}${texto.slice(1)} ${sustantivo} ${centavos}/100 M.N.`
}
