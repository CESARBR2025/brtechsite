/**
 * Sesión del panel: cookie firmada con HMAC-SHA256 usando Web Crypto,
 * para que funcione tanto en el runtime de Node como en el Edge (middleware).
 * No hay usuarios: la única credencial es PANEL_PASSWORD. La cookie solo
 * afirma "alguien conoce la contraseña y la sesión no ha expirado".
 */

const COOKIE = "panel_sesion"
const DURACION_MS = 1000 * 60 * 60 * 12 // 12 h

export const NOMBRE_COOKIE_SESION = COOKIE

function base64url(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes))
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function firmar(mensaje: string, secreto: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secreto),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(mensaje),
  )
  return base64url(sig)
}

/** Genera el valor de la cookie: "<expira_ms>.<firma>". */
export async function crearTokenSesion(secreto: string): Promise<{
  valor: string
  maxAgeSegundos: number
}> {
  const expira = Date.now() + DURACION_MS
  const firma = await firmar(String(expira), secreto)
  return {
    valor: `${expira}.${firma}`,
    maxAgeSegundos: Math.floor(DURACION_MS / 1000),
  }
}

export async function tokenSesionValido(
  valor: string | undefined,
  secreto: string,
): Promise<boolean> {
  if (!valor) return false
  const [expiraStr, firma] = valor.split(".")
  if (!expiraStr || !firma) return false

  const expira = Number(expiraStr)
  if (!Number.isFinite(expira) || expira < Date.now()) return false

  const esperada = await firmar(expiraStr, secreto)
  // comparación en tiempo (aprox) constante
  if (esperada.length !== firma.length) return false
  let diff = 0
  for (let i = 0; i < esperada.length; i++) {
    diff |= esperada.charCodeAt(i) ^ firma.charCodeAt(i)
  }
  return diff === 0
}
