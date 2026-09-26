import { customAlphabet } from "nanoid"
import { type GeneradorSlugProyecto, SlugProyecto } from "../domain/slug-proyecto"

// Mismo criterio que tickets y levantamientos: alfabeto URL-safe sin
// caracteres ambiguos, 12 chars ≈ 71 bits de entropía (el slug es la credencial).
const ALFABETO = "0123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz"
const generar = customAlphabet(ALFABETO, 12)

export const generadorSlugProyectoNanoid: GeneradorSlugProyecto = {
  nuevo: () => SlugProyecto.desde(generar()),
}
