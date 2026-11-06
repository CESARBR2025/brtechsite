import { describe, expect, it } from "vitest"
import { debeCelebrar } from "./decision-celebracion"

describe("debeCelebrar", () => {
  it.each([
    { reducido: false, visto: false, esperado: true },
    { reducido: false, visto: true, esperado: false },
    { reducido: true, visto: false, esperado: false },
    { reducido: true, visto: true, esperado: false },
  ])("respeta movimiento reducido y visitas anteriores: %j", ({ esperado, ...decision }) => {
    expect(debeCelebrar(decision)).toBe(esperado)
  })
})
