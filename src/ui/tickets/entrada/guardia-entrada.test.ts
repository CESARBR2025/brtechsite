import { runInNewContext } from "node:vm"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { claveEntrada } from "./decision-entrada"
import { GuardiaEntrada } from "./guardia-entrada"

function codigoGuardia(slug: string) {
  return renderToStaticMarkup(createElement(GuardiaEntrada, { slug }))
    .replace(/^<script>/, "").replace(/<\/script>$/, "")
}

describe("guardia anterior a la hidratación", () => {
  it.each([
    [false, null, "1"],
    [false, "1", undefined],
    [false, "", undefined],
    [true, null, undefined],
  ])("decide con movimiento reducido=%s y valor guardado=%s", (reducido, visto, esperado) => {
    const dataset: { entrada?: string } = {}
    runInNewContext(codigoGuardia("ejemplo"), {
      window: {
        matchMedia: () => ({ matches: reducido }),
        localStorage: { getItem: (clave: string) => {
          expect(clave).toBe(claveEntrada("ejemplo"))
          return visto
        } },
      },
      document: { documentElement: { dataset } },
    })
    expect(dataset.entrada).toBe(esperado)
  })

  it("protege el script de un slug que contiene HTML y conserva su clave", () => {
    const slug = '</script><script>"\\\n'
    const codigo = codigoGuardia(slug)
    expect(codigo).not.toContain("<")
    runInNewContext(codigo, {
      window: {
        matchMedia: () => ({ matches: false }),
        localStorage: { getItem: (clave: string) => {
          expect(clave).toBe(claveEntrada(slug))
          return "1"
        } },
      },
    })
  })

  it("deja visible el recibo si el almacenamiento falla", () => {
    const dataset = {}
    expect(() => runInNewContext(codigoGuardia("ejemplo"), {
      window: {
        matchMedia: () => ({ matches: false }),
        localStorage: { getItem: () => { throw new Error("Almacenamiento bloqueado") } },
      },
      document: { documentElement: { dataset } },
    })).not.toThrow()
    expect(dataset).toEqual({})
  })
})
