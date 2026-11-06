import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { PIEZAS_POR_CATEGORIA } from "@/src/modules/tickets/domain/clasificacion"
import {
  BASES_3D, CAJAS, LADO_ORIGINAL, PANTALLA_LOCAL, PIEZAS_3D,
  encajar, homografia, ladoDe, rutaImagen, tarjeta,
  type Cuadrilatero, type NombreImagen,
} from "./geometria"

const categorias = ["laptop", "pc", "todo_en_uno"] as const
const imagenes = Object.keys(CAJAS) as NombreImagen[]

describe("geometría de la ilustración del recibo", () => {
  it.each(categorias)("tiene zona para cada pieza con imagen suelta de %s", (categoria) => {
    for (const pieza of PIEZAS_POR_CATEGORIA[categoria]) {
      if (pieza in PIEZAS_3D) {
        expect(BASES_3D[categoria].zonas).toHaveProperty(pieza)
      }
    }
  })

  it.each(categorias)("convierte todas las zonas y esquinas de %s dentro de su destino", (categoria) => {
    const base = BASES_3D[categoria]
    const ajuste = encajar(base.imagen, base.destino)
    for (const punto of [...Object.values(base.zonas), ...base.pantalla]) {
      const [x, y] = ajuste.punto(punto)
      expect(x).toBeGreaterThanOrEqual(base.destino.x)
      expect(x).toBeLessThanOrEqual(base.destino.x + base.destino.w)
      expect(y).toBeGreaterThanOrEqual(base.destino.y)
      expect(y).toBeLessThanOrEqual(base.destino.y + base.destino.h)
    }
  })

  it.each(imagenes)("encaja la caja de %s centrada y sin deformarla", (imagen) => {
    for (const rect of [{ x: 20, y: 10, w: 480, h: 270 }, { x: 30, y: 40, w: 120, h: 300 }]) {
      const ajuste = encajar(imagen, rect)
      const [x0, y0, x1, y1] = CAJAS[imagen]
      const escala = ajuste.w / LADO_ORIGINAL
      const ancho = (x1 - x0) * escala
      const alto = (y1 - y0) * escala
      expect(ajuste.h).toBe(ajuste.w)
      expect(ancho).toBeLessThanOrEqual(rect.w + 1e-9)
      expect(alto).toBeLessThanOrEqual(rect.h + 1e-9)
      expect(Math.min(Math.abs(ancho - rect.w), Math.abs(alto - rect.h))).toBeLessThan(1e-9)
      expect(ajuste.x + (x0 + x1) / 2 * escala).toBeCloseTo(rect.x + rect.w / 2, 9)
      expect(ajuste.y + (y0 + y1) / 2 * escala).toBeCloseTo(rect.y + rect.h / 2, 9)
      // La conversión de puntos conserva el redondeo a una décima de la maqueta.
      const [x, y] = ajuste.punto([x0, y0])
      expect(Math.abs(x - (ajuste.x + x0 * escala))).toBeLessThanOrEqual(0.05 + 1e-9)
      expect(Math.abs(y - (ajuste.y + y0 * escala))).toBeLessThanOrEqual(0.05 + 1e-9)
    }
  })

  it.each(categorias)("proyecta las cuatro esquinas sobre la pantalla de %s con matrix3d", (categoria) => {
    const base = BASES_3D[categoria]
    const ajuste = encajar(base.imagen, base.destino)
    const [p0, p1, p2, p3] = base.pantalla
    const cuadrilatero: Cuadrilatero = [ajuste.punto(p0), ajuste.punto(p1), ajuste.punto(p2), ajuste.punto(p3)]
    const { w, h } = PANTALLA_LOCAL
    const matriz = homografia(w, h, cuadrilatero)
    expect(matriz).toMatch(/^matrix3d\(.+\)$/)
    const valores = matriz.slice("matrix3d(".length, -1).split(",").map(Number)
    expect(valores).toHaveLength(16)
    expect(valores.every(Number.isFinite)).toBe(true)

    const esquinas = [[0, 0], [w, 0], [w, h], [0, h]] as const
    esquinas.forEach(([x, y], i) => {
      // CSS almacena matrix3d por columnas; la perspectiva divide por la cuarta coordenada.
      const divisor = valores[3] * x + valores[7] * y + valores[15]
      const proyectadoX = (valores[0] * x + valores[4] * y + valores[12]) / divisor
      const proyectadoY = (valores[1] * x + valores[5] * y + valores[13]) / divisor
      expect(Math.abs(proyectadoX - cuadrilatero[i][0])).toBeLessThanOrEqual(0.5)
      expect(Math.abs(proyectadoY - cuadrilatero[i][1])).toBeLessThanOrEqual(0.5)
    })
  })

  it.each(imagenes)("tiene el archivo WebP de %s en la ruta pública", (imagen) => {
    expect(rutaImagen(imagen)).toBe(`/recibo/3d/${imagen}.webp`)
    expect(existsSync(resolve(process.cwd(), "public", `.${rutaImagen(imagen)}`))).toBe(true)
  })

  it("sitúa la tarjeta de una pieza con el tamaño y desplazamiento de la maqueta", () => {
    expect(tarjeta({ x: 380, y: 300 })).toEqual({ x: 368, y: 288, w: 144, h: 86 })
  })

  it.each(["laptop", "todo_en_uno"] as const)("elige el lado izquierdo de %s solo antes de x = 240", (categoria) => {
    const base = BASES_3D[categoria]
    expect(ladoDe(base, { x: 239.9, y: 200 })).toBe(base.izq)
    expect(ladoDe(base, { x: 240, y: 200 })).toBe(base)
    expect(ladoDe(base, { x: 400, y: 200 })).toBe(base)
  })

  it("conserva las posiciones de la PC a ambos lados porque no tiene alternativa izquierda", () => {
    expect(ladoDe(BASES_3D.pc, { x: 100, y: 200 })).toBe(BASES_3D.pc)
    expect(ladoDe(BASES_3D.pc, { x: 300, y: 200 })).toBe(BASES_3D.pc)
  })
})
