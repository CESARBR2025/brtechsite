import { describe, expect, it } from "vitest"
import { Dinero } from "@/src/modules/shared/domain/dinero"
import { DatosInvalidos } from "@/src/modules/shared/domain/errors"
import { CLASES_CONCEPTO, type ClaseConcepto, type TipoPieza } from "./clasificacion"
import { ItemTicket, type DatosItemTicket } from "./item-ticket"

const base = { id: "item-1", concepto: "Servicio", cantidad: 1, precioUnitario: Dinero.desdeUnidades(100) }
const item = (datos: Partial<DatosItemTicket> = {}) => new ItemTicket({ ...base, ...datos })

describe("ItemTicket", () => {
  it("usa otro y campos nulos por defecto", () => {
    expect(item()).toMatchObject({ clase: "otro", pieza: null, etiqueta: null, piezaAnterior: null })
  })

  it.each(CLASES_CONCEPTO)("acepta la clase %s sin pieza", (clase) => {
    expect(item({ clase }).clase).toBe(clase)
  })

  it("rechaza clase o pieza desconocida", () => {
    expect(() => item({ clase: "inventada" as ClaseConcepto })).toThrow(DatosInvalidos)
    expect(() => item({ clase: "pieza", pieza: "tornillo" as TipoPieza })).toThrow(DatosInvalidos)
  })

  it.each(["pieza", "diagnostico"] as const)("permite pieza en %s", (clase) => {
    expect(item({ clase, pieza: "ram" }).pieza).toBe("ram")
  })

  it.each(CLASES_CONCEPTO.filter((clase) => clase !== "pieza" && clase !== "diagnostico"))("rechaza pieza en %s", (clase) => {
    expect(() => item({ clase, pieza: "ram" })).toThrow(DatosInvalidos)
  })

  it.each(CLASES_CONCEPTO.filter((clase) => clase !== "pieza"))("rechaza pieza anterior en %s", (clase) => {
    expect(() => item({ clase, piezaAnterior: "4 GB" })).toThrow(DatosInvalidos)
  })

  it("recorta espacios y convierte vacíos a null", () => {
    expect(item({ clase: "pieza", etiqueta: "  RAM 8 GB  ", piezaAnterior: "  4 GB  " })).toMatchObject({ etiqueta: "RAM 8 GB", piezaAnterior: "4 GB" })
    expect(item({ etiqueta: "   ", piezaAnterior: "   " })).toMatchObject({ etiqueta: null, piezaAnterior: null })
  })

  it.each(["etiqueta", "piezaAnterior"] as const)("limita %s a 32 caracteres después de trim", (campo) => {
    expect(item({ clase: "pieza", [campo]: `  ${"a".repeat(32)}  ` })[campo]).toHaveLength(32)
    expect(() => item({ clase: "pieza", [campo]: "a".repeat(33) })).toThrow(DatosInvalidos)
  })

  it("conserva las validaciones de concepto, cantidad e importe", () => {
    expect(() => item({ concepto: "  " })).toThrow(DatosInvalidos)
    for (const cantidad of [0, -1, NaN, Infinity]) expect(() => item({ cantidad })).toThrow(DatosInvalidos)
    expect(item({ cantidad: 1.5 }).importe.centavos).toBe(15000)
  })
})
