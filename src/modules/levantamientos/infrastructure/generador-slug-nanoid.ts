import { customAlphabet } from "nanoid"
import {
  type GeneradorSlugLevantamiento,
  SlugLevantamiento,
} from "../domain/slug-levantamiento"

// Mismo criterio que los tickets: alfabeto URL-safe sin caracteres ambiguos,
// 12 chars ≈ 71 bits de entropía (el slug es la credencial de acceso).
const ALFABETO = "0123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz"
const generar = customAlphabet(ALFABETO, 12)

export const generadorSlugLevantamientoNanoid: GeneradorSlugLevantamiento = {
  nuevo: () => SlugLevantamiento.desde(generar()),
}
