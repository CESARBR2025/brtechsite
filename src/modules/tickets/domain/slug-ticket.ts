import { DatosInvalidos } from "@/src/modules/shared/domain/errors"

/**
 * Slug público del ticket: cadena corta, no adivinable, apta para URL.
 * Es la única credencial de acceso a la página pública, así que debe
 * generarse con un alfabeto amplio y suficiente longitud.
 */
const PATRON = /^[A-Za-z0-9_-]{8,32}$/

export class SlugTicket {
  private constructor(public readonly valor: string) {}

  static desde(valor: string): SlugTicket {
    if (!PATRON.test(valor)) {
      throw new DatosInvalidos(`Slug de ticket inválido: ${valor}`)
    }
    return new SlugTicket(valor)
  }

  toString(): string {
    return this.valor
  }
}

/** Puerto: genera slugs nuevos para tickets. */
export interface GeneradorSlug {
  nuevo(): SlugTicket
}
