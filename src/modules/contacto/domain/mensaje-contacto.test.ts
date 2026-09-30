import { describe, expect, it } from "vitest"
import { DatosInvalidos } from "@/src/modules/shared/domain/errors"
import { MensajeContacto } from "./mensaje-contacto"

const base = { nombre: "Ana López", email: "Ana@Negocio.mx", mensaje: "Necesito un sistema" }

describe("MensajeContacto", () => {
  it("interés y teléfono son opcionales", () => {
    const m = MensajeContacto.crear({ ...base, interes: "", telefono: "  " })
    expect(m.interes).toBeNull()
    expect(m.interesEtiqueta).toBeNull()
    expect(m.telefono).toBeNull()
    expect(m.email).toBe("ana@negocio.mx")
  })

  it("acepta un interés conocido y expone su etiqueta", () => {
    const m = MensajeContacto.crear({ ...base, interes: "inventarios" })
    expect(m.interes).toBe("inventarios")
    expect(m.interesEtiqueta).toBe("Control de inventarios")
  })

  it("rechaza un interés que no está en la lista", () => {
    expect(() => MensajeContacto.crear({ ...base, interes: "toString" })).toThrow(DatosInvalidos)
    expect(() => MensajeContacto.crear({ ...base, interes: "cripto" })).toThrow(DatosInvalidos)
  })

  it("normaliza el teléfono a solo dígitos", () => {
    expect(MensajeContacto.crear({ ...base, telefono: "(427) 123-4567" }).telefono).toBe("4271234567")
    expect(MensajeContacto.crear({ ...base, telefono: "+52 427 123 4567" }).telefono).toBe("524271234567")
  })

  it("rechaza teléfonos demasiado cortos o largos", () => {
    expect(() => MensajeContacto.crear({ ...base, telefono: "12345" })).toThrow(DatosInvalidos)
    expect(() => MensajeContacto.crear({ ...base, telefono: "1".repeat(16) })).toThrow(DatosInvalidos)
  })
})
