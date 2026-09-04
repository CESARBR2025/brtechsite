import { describe, expect, it } from "vitest"
import { Dinero } from "./dinero"
import { DatosInvalidos } from "./errors"

describe("Dinero", () => {
  it("convierte unidades a centavos redondeando", () => {
    expect(Dinero.desdeUnidades(12.34).centavos).toBe(1234)
    expect(Dinero.desdeUnidades("0.1").centavos).toBe(10)
    expect(Dinero.desdeUnidades(0.005).centavos).toBe(1)
  })

  it("suma sin errores de punto flotante", () => {
    const total = Dinero.desdeUnidades(0.1).mas(Dinero.desdeUnidades(0.2))
    expect(total.centavos).toBe(30)
    expect(total.unidades).toBe(0.3)
  })

  it("multiplica por cantidad fraccionaria y redondea", () => {
    expect(Dinero.desdeUnidades(100).por(1.5).centavos).toBe(15000)
    expect(Dinero.desdeCentavos(333).por(3).centavos).toBe(999)
  })

  it("rechaza montos negativos y no enteros", () => {
    expect(() => Dinero.desdeCentavos(-1)).toThrow(DatosInvalidos)
    expect(() => Dinero.desdeCentavos(10.5)).toThrow(DatosInvalidos)
    expect(() => Dinero.desdeUnidades("abc")).toThrow(DatosInvalidos)
  })
})
