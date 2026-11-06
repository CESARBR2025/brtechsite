import { describe, expect, it } from "vitest"
import { sugerirClasificacion } from "./sugerir-clasificacion"

describe("sugerirClasificacion", () => {
  it.each([
    ["Mantenimiento interno del equipo", "mantenimiento", null],
    ["1pz de SSD 240GB", "pieza", "disco"],
    ["Instalación de SO (Sistema operativo W11)", "sistema", null],
    ["Instalación de Office LTSC", "programa", null],
    ["Diagnóstico completo", "diagnostico", null],
    ["Armado de PC", "ensamble", null],
    ["Memoria RAM 8 GB", "pieza", "ram"],
    ["Configuración de impresora", "otro", null],
    ["BATERÍA", "pieza", "bateria"],
    ["Disipador fan", "pieza", "ventilador"],
    ["PSU", "pieza", "fuente"],
    ["Tarjeta madre", "pieza", "placa"],
    ["Ryzen Core i7", "pieza", "procesador"],
    ["RTX 3050", "pieza", "video"],
    ["Gabinete", "pieza", "gabinete"],
    ["Instalación de la pieza RAM", "mano_de_obra", null],
    ["Mantenimiento y armado de PC", "mantenimiento", null],
    ["Revisión del disco SSD", "diagnostico", null],
    ["Windows con Office y SSD", "sistema", null],
    ["Instalación de SSD", "pieza", "disco"],
    ["Pasta térmica", "mantenimiento", null],
    ["Visita a domicilio", "mano_de_obra", null],
    ["Linux", "sistema", null],
    ["macOS", "sistema", null],
    ["M.2", "pieza", "disco"],
  ])("%s → %s / %s", (concepto, clase, pieza) => {
    expect(sugerirClasificacion(concepto)).toEqual({ clase, pieza })
  })

  it("considera el detalle normalizado", () => {
    expect(sugerirClasificacion("Servicio", "REVISIÓN completa")).toEqual({ clase: "diagnostico", pieza: null })
    expect(sugerirClasificacion("Servicio", null)).toEqual({ clase: "otro", pieza: null })
  })
})
