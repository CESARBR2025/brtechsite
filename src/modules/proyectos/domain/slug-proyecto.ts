import { DatosInvalidos } from "@/src/modules/shared/domain/errors"

/**
 * Slug público de la propuesta. Es la única credencial de acceso a la página
 * que se comparte por WhatsApp, así que debe ser corto pero no adivinable.
 */
const PATRON = /^[A-Za-z0-9_-]{8,32}$/

export class SlugProyecto {
  private constructor(public readonly valor: string) {}

  static desde(valor: string): SlugProyecto {
    if (!PATRON.test(valor)) {
      throw new DatosInvalidos(`Slug de proyecto inválido: ${valor}`)
    }
    return new SlugProyecto(valor)
  }

  toString(): string {
    return this.valor
  }
}

/** Puerto: genera slugs nuevos para proyectos. */
export interface GeneradorSlugProyecto {
  nuevo(): SlugProyecto
}
