import { DatosInvalidos } from "@/src/modules/shared/domain/errors"

/**
 * Firma con la que una persona del cliente acepta la propuesta: su nombre y el
 * trazo que dibujó. El trazo es un path SVG (solo M y L, coordenadas enteras)
 * sobre un lienzo de `LIENZO_FIRMA`, así se guarda ligero y se dibuja nítido.
 */
export interface Firma {
  nombre: string
  trazo: string
}

export const MAX_FIRMANTES = 3
export const LIENZO_FIRMA = { ancho: 600, alto: 200 } as const

const MAX_NOMBRE = 120
const MAX_TRAZO = 12_000
/** Menos puntos que esto es un toque accidental, no una firma. */
const MIN_PUNTOS = 6
const TRAZO = /^(?:M\d{1,3} \d{1,3}(?:L\d{1,3} \d{1,3})+)+$/

export function trazoValido(trazo: string): boolean {
  return (
    trazo.length <= MAX_TRAZO &&
    TRAZO.test(trazo) &&
    (trazo.match(/[ML]/g)?.length ?? 0) >= MIN_PUNTOS
  )
}

/** Valida las firmas de una aceptación: de 1 a `MAX_FIRMANTES`, cada una con nombre y trazo. */
export function crearFirmas(crudas: readonly { nombre: string; trazo: string }[]): Firma[] {
  if (crudas.length === 0) throw new DatosInvalidos("Falta la firma de quien acepta")
  if (crudas.length > MAX_FIRMANTES) {
    throw new DatosInvalidos(`Pueden firmar hasta ${MAX_FIRMANTES} personas`)
  }
  return crudas.map((f) => {
    const nombre = f.nombre.trim()
    if (!nombre) throw new DatosInvalidos('El campo "nombre de quien firma" es obligatorio')
    if (nombre.length > MAX_NOMBRE) throw new DatosInvalidos("El nombre es demasiado largo")
    if (!trazoValido(f.trazo)) throw new DatosInvalidos(`Falta la firma de ${nombre}`)
    return { nombre, trazo: f.trazo }
  })
}

/** Firmas leídas de persistencia: se descarta lo que no tenga la forma esperada. */
export function firmasGuardadas(crudo: unknown): Firma[] {
  if (!Array.isArray(crudo)) return []
  return crudo.flatMap((f) =>
    f && typeof f.nombre === "string" && typeof f.trazo === "string" && trazoValido(f.trazo)
      ? [{ nombre: f.nombre, trazo: f.trazo }]
      : [],
  )
}

/** Firma del desarrollador: su trazo y cuándo firmó. */
export interface FirmaDesarrollador {
  trazo: string
  en: Date
}

/** Firma del desarrollador leída de persistencia; null si falta o no tiene la forma esperada. */
export function firmaDesarrolladorGuardada(crudo: unknown): FirmaDesarrollador | null {
  if (!crudo || typeof crudo !== "object") return null
  const { trazo, en } = crudo as { trazo?: unknown; en?: unknown }
  if (typeof trazo !== "string" || !trazoValido(trazo) || typeof en !== "string") return null
  const fecha = new Date(en)
  return Number.isNaN(fecha.getTime()) ? null : { trazo, en: fecha }
}
