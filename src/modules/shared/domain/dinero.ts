import { DatosInvalidos } from "./errors"

/**
 * Valor monetario inmutable. Se guarda como entero de centavos para hacer
 * aritmética exacta (nada de floats). El formateo a texto ocurre en la
 * frontera (presentación), no aquí.
 */
export class Dinero {
  private constructor(public readonly centavos: number) {}

  static desdeCentavos(centavos: number): Dinero {
    if (!Number.isInteger(centavos)) {
      throw new DatosInvalidos("Los centavos deben ser un entero")
    }
    if (centavos < 0) {
      throw new DatosInvalidos("Un monto no puede ser negativo")
    }
    return new Dinero(centavos)
  }

  /** Acepta "1234.50" o 1234.5 (unidades) y lo convierte a centavos. */
  static desdeUnidades(unidades: number | string): Dinero {
    const n = typeof unidades === "string" ? Number(unidades) : unidades
    if (!Number.isFinite(n)) {
      throw new DatosInvalidos(`Monto inválido: ${unidades}`)
    }
    return Dinero.desdeCentavos(Math.round(n * 100))
  }

  static cero(): Dinero {
    return new Dinero(0)
  }

  mas(otro: Dinero): Dinero {
    return new Dinero(this.centavos + otro.centavos)
  }

  /** Multiplica por una cantidad (posiblemente fraccionaria) y redondea. */
  por(cantidad: number): Dinero {
    if (!Number.isFinite(cantidad) || cantidad < 0) {
      throw new DatosInvalidos(`Cantidad inválida: ${cantidad}`)
    }
    return new Dinero(Math.round(this.centavos * cantidad))
  }

  get unidades(): number {
    return this.centavos / 100
  }

  igualA(otro: Dinero): boolean {
    return this.centavos === otro.centavos
  }
}
