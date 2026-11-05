/** Valida los 18 dígitos de una CLABE y su dígito verificador. */
export function esClabeValida(texto: string): boolean {
  if (texto.length !== 18 || !/^\d{18}$/.test(texto)) return false

  const pesos = [3, 7, 1]
  let suma = 0
  for (let i = 0; i < 17; i++) {
    suma += (Number(texto[i]) * pesos[i % 3]) % 10
  }
  return Number(texto[17]) === (10 - (suma % 10)) % 10
}
