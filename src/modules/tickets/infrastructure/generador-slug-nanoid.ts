import { customAlphabet } from "nanoid"
import { type GeneradorSlug, SlugTicket } from "../domain/slug-ticket"

// Alfabeto URL-safe sin caracteres ambiguos. 12 chars ≈ 71 bits de entropía:
// suficiente para que el slug sea la credencial de acceso a la página pública.
const ALFABETO = "0123456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz"
const generar = customAlphabet(ALFABETO, 12)

export class GeneradorSlugNanoid implements GeneradorSlug {
  nuevo(): SlugTicket {
    return SlugTicket.desde(generar())
  }
}

export const generadorSlugNanoid = new GeneradorSlugNanoid()
