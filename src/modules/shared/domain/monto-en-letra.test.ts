import { describe, expect, it } from "vitest"
import { Dinero } from "./dinero"
import { montoEnLetra } from "./monto-en-letra"

describe("montoEnLetra", () => {
  it.each([
    [0, "Cero pesos"], [1, "Un peso"], [21, "Veintiún pesos"], [100, "Cien pesos"],
    [101, "Ciento un pesos"], [1000, "Mil pesos"], [2121, "Dos mil ciento veintiún pesos"],
    [15520, "Quince mil quinientos veinte pesos"], [21000, "Veintiún mil pesos"],
    [100000, "Cien mil pesos"], [1000000, "Un millón de pesos"],
    [21000000, "Veintiún millones de pesos"], [1000001, "Un millón un pesos"],
    [999999999, "Novecientos noventa y nueve millones novecientos noventa y nueve mil novecientos noventa y nueve pesos"],
  ])("convierte %s", (unidades, texto) => {
    expect(montoEnLetra(Dinero.desdeUnidades(unidades), "MXN")).toBe(`${texto} 00/100 M.N.`)
  })

  it("respeta los centavos con dos dígitos", () => {
    expect(montoEnLetra(Dinero.desdeUnidades(2121.5), "MXN")).toBe("Dos mil ciento veintiún pesos 50/100 M.N.")
    expect(montoEnLetra(Dinero.desdeCentavos(1), "MXN")).toBe("Cero pesos 01/100 M.N.")
  })

  it("devuelve null para otra moneda o montos fuera del rango", () => {
    expect(montoEnLetra(Dinero.cero(), "USD")).toBeNull()
    expect(montoEnLetra(Dinero.desdeUnidades(1000000000), "MXN")).toBeNull()
  })
})
