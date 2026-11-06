import { describe, expect, it } from "vitest"
import { sugerirClasificacion } from "@/src/modules/tickets/application/sugerir-clasificacion"
import { CATEGORIAS_EQUIPO, PIEZAS_POR_CATEGORIA } from "@/src/modules/tickets/domain/clasificacion"
import { PLANTILLAS_CONCEPTO } from "./plantillas-concepto"

describe("plantillas de conceptos", () => {
  it.each(PLANTILLAS_CONCEPTO)("$nombre coincide con la clasificación sugerida", (plantilla) => {
    expect(sugerirClasificacion(plantilla.concepto)).toEqual({ clase: plantilla.clase, pieza: plantilla.pieza })
  })

  it.each(PLANTILLAS_CONCEPTO)("$nombre solo ofrece piezas y ensambles compatibles", (plantilla) => {
    expect(plantilla.categorias.length).toBeGreaterThan(0)
    for (const categoria of plantilla.categorias) {
      expect(CATEGORIAS_EQUIPO).toContain(categoria)
      if (plantilla.pieza) expect(PIEZAS_POR_CATEGORIA[categoria]).toContain(plantilla.pieza)
      if (plantilla.clase === "ensamble") expect(categoria).toBe("pc")
    }
  })
})
