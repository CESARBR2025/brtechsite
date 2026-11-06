import { describe, expect, it } from "vitest"
import { esClabeValida } from "./clabe"

/** Cuerpos inventados para estas pruebas; no representan cuentas bancarias. */
function conVerificador(cuerpo: string): string {
  const suma = [...cuerpo].reduce(
    (total, digito, i) => total + ((Number(digito) * [3, 7, 1][i % 3]) % 10),
    0,
  )
  return `${cuerpo}${(10 - (suma % 10)) % 10}`
}

describe("esClabeValida", () => {
  it.each(["98765432109876543", "00123456789012345", "55555555555555555"])(
    "acepta un cuerpo inventado con verificador calculado: %s",
    (cuerpo) => expect(esClabeValida(conVerificador(cuerpo))).toBe(true),
  )

  it("rechaza un verificador erróneo", () => {
    const valida = conVerificador("98765432109876543")
    const incorrecta = valida.slice(0, 17) + ((Number(valida[17]) + 1) % 10)
    expect(esClabeValida(incorrecta)).toBe(false)
  })

  it.each(["", "123", "1".repeat(19), "a".repeat(18), "1".repeat(17) + "\n", " 123456789012345678", "123 456 78901234567 8"])(
    "rechaza formato inválido: %j",
    (texto) => expect(esClabeValida(texto)).toBe(false),
  )
})
