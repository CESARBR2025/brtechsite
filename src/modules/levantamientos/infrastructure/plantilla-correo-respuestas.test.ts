import { describe, expect, it } from "vitest"
import { plantillaCorreoRespuestas } from "./plantilla-correo-respuestas"

const datos = {
  levantamientoId: "lv1",
  folio: "BRD-000001",
  slug: "abc123",
  clienteNombre: "Tostadas Tio Beto",
  contactoNombre: "César Chavero",
  proyectoNombre: "Tostadas Tio Beto Soft",
  esActualizacion: false,
  preguntas: [
    { grupo: "Críticas", texto: "¿Modelo de impresora?", respuesta: "<b>Epson</b>\nTM-P20" },
    { grupo: "Importantes", texto: "¿Horario?", respuesta: "6 a 15 h" },
  ],
}
const urls = { panel: "https://x.com/panel/levantamientos/lv1", diagnostico: "https://x.com/d/abc123" }

describe("plantillaCorreoRespuestas", () => {
  it("incluye cada pregunta con su respuesta escapada", () => {
    const c = plantillaCorreoRespuestas(datos, urls)
    expect(c.asunto).toBe("🟣 César Chavero respondió todas las preguntas · BRD-000001")
    expect(c.html).toContain("&lt;b&gt;Epson&lt;/b&gt;<br />TM-P20")
    expect(c.html).not.toContain("<b>Epson")
    expect(c.html).toContain("Importantes")
    expect(c.texto).toContain("2. ¿Horario?\n   → 6 a 15 h")
  })

  it("distingue una actualización", () => {
    const c = plantillaCorreoRespuestas({ ...datos, esActualizacion: true }, urls)
    expect(c.asunto).toContain("actualizó sus respuestas")
  })
})
