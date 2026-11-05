import { describe, expect, it } from "vitest"
import { claveEntrada, debeReproducirEntrada } from "./decision-entrada"

describe("decisión de entrada del recibo", () => {
  it.each([
    [false, false, true],
    [false, true, false],
    [true, false, false],
    [true, true, false],
  ])("reducido=%s, visto=%s → reproducir=%s", (reducido, visto, esperado) => {
    expect(debeReproducirEntrada({ reducido, visto })).toBe(esperado)
  })

  it("recuerda cada recibo por su slug", () => {
    expect(claveEntrada("recibo-uno")).toBe("brtech-entrada-recibo-uno")
    expect(claveEntrada("recibo-uno")).not.toBe(claveEntrada("recibo-dos"))
  })
})
