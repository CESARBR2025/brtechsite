import { DatosInvalidos } from "@/src/modules/shared/domain/errors"

/**
 * Slug público del diagnóstico. Es la única credencial de acceso a la página
 * que se comparte por WhatsApp, así que debe ser corto pero no adivinable.
 */
const PATRON = /^[A-Za-z0-9_-]{8,32}$/

export class SlugLevantamiento {
  private constructor(public readonly valor: string) {}

  static desde(valor: string): SlugLevantamiento {
    if (!PATRON.test(valor)) {
      throw new DatosInvalidos(`Slug de levantamiento inválido: ${valor}`)
    }
    return new SlugLevantamiento(valor)
  }

  toString(): string {
    return this.valor
  }
}

/** Puerto: genera slugs nuevos para levantamientos. */
export interface GeneradorSlugLevantamiento {
  nuevo(): SlugLevantamiento
}
