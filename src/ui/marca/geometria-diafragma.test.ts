import { describe, expect, it } from "vitest"
import { aspa, simboloSvgTexto, tramo } from "./geometria-diafragma"

describe("geometría del diafragma", () => {
  it.each([8, 57, 74])("produce trazos finitos con radio %s", (r) => {
    for (const phi of [-70, 0, 34]) {
      for (const trazo of Object.values(aspa(r, phi))) {
        expect(trazo).not.toMatch(/NaN|Infinity/)
        expect(trazo).toMatch(/^M.+Z$/)
      }
    }
  })

  it("sujeta el progreso al intervalo 0–1", () => {
    expect(tramo(-200, 100, 200)).toBe(0)
    expect(tramo(100, 100, 200)).toBe(0)
    expect(tramo(150, 100, 200)).toBe(.5)
    expect(tramo(200, 100, 200)).toBe(1)
    expect(tramo(900, 100, 200)).toBe(1)
  })

  it("exporta un SVG autónomo con sus gradientes", () => {
    const svg = simboloSvgTexto()
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(svg).toContain('width="512" height="512"')
    expect(svg).toContain('viewBox="-104 -104 208 208"')
    for (const [, id] of svg.matchAll(/url\(#([^)]+)\)/g)) {
      expect(svg).toContain(`id="${id}"`)
    }
  })
})
