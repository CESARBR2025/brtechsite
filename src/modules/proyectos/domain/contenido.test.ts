import { describe, expect, it } from "vitest"
import { completitud, contenidoVacio, normalizarContenido } from "./contenido"

describe("maquetas de la propuesta", () => {
  it("un contenido nuevo no trae maquetas", () => {
    const c = contenidoVacio()
    expect(c.maquetas).toEqual([])
    expect(completitud(c).maquetas).toBe(false)
  })

  it("el dispositivo por omisión es el celular", () => {
    const c = normalizarContenido({
      maquetas: [{ id: "a", titulo: "Ruta del día", imagen: "/propuestas/ruta.webp" }],
    })
    expect(c.maquetas[0]).toMatchObject({ dispositivo: "movil", titulo: "Ruta del día", descripcion: "" })
    expect(completitud(c).maquetas).toBe(true)
  })

  it("descarta las filas sin imagen (una recién agregada no cuenta)", () => {
    const c = normalizarContenido({
      maquetas: [
        { id: "a", dispositivo: "web", titulo: "Pendiente de subir", imagen: "" },
        { id: "b", dispositivo: "web", titulo: "Camionetas", imagen: "/propuestas/mapa.webp" },
      ],
    })
    expect(c.maquetas.map((m) => m.id)).toEqual(["b"])
  })

  it("rechaza un dispositivo desconocido", () => {
    expect(() =>
      normalizarContenido({ maquetas: [{ id: "a", dispositivo: "tablet", imagen: "/x.webp" }] }),
    ).toThrow(/Contenido del proyecto inválido/)
  })
})
