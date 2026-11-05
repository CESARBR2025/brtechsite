import { afterEach, describe, expect, it, vi } from "vitest"
import { obtenerDatosPago } from "./datos-pago-env"

// Cuerpo inventado, con su dígito verificador calculado aquí.
const cuerpo = "98765432109876543"
const suma = [...cuerpo].reduce((s, d, i) => s + (Number(d) * [3, 7, 1][i % 3]) % 10, 0)
const clabe = `${cuerpo}${(10 - (suma % 10)) % 10}`
const entorno = { PAGO_BANCO: "Banco de prueba", PAGO_TITULAR: "Titular de prueba", PAGO_CLABE: clabe }

afterEach(() => vi.restoreAllMocks())

describe("obtenerDatosPago", () => {
  it("expone únicamente los datos de pago completos", () => {
    expect(obtenerDatosPago(entorno)).toEqual({ banco: entorno.PAGO_BANCO, titular: entorno.PAGO_TITULAR, clabe })
  })

  it.each(["PAGO_BANCO", "PAGO_TITULAR", "PAGO_CLABE"] as const)("requiere %s", (campo) => {
    expect(obtenerDatosPago({ ...entorno, [campo]: undefined })).toBeNull()
    expect(obtenerDatosPago({ ...entorno, [campo]: "   " })).toBeNull()
  })

  it("acepta configuración vacía", () => {
    expect(obtenerDatosPago({})).toBeNull()
  })

  it("recorta espacios exteriores", () => {
    expect(obtenerDatosPago({ ...entorno, PAGO_BANCO: " Banco de prueba " })).toEqual({
      banco: "Banco de prueba", titular: entorno.PAGO_TITULAR, clabe,
    })
  })

  it("oculta la configuración inválida y registra el error sin datos bancarios", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    const incorrecta = clabe.slice(0, 17) + ((Number(clabe[17]) + 1) % 10)
    expect(obtenerDatosPago({ ...entorno, PAGO_CLABE: incorrecta })).toBeNull()
    expect(error).toHaveBeenCalledOnce()
    const mensaje = error.mock.calls.flat().join(" ")
    expect(mensaje).toContain("CLABE")
    for (const valor of [incorrecta, entorno.PAGO_BANCO, entorno.PAGO_TITULAR]) {
      expect(mensaje).not.toContain(valor)
    }
  })
})
