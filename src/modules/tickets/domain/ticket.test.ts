import { describe, expect, it } from "vitest"
import { Dinero } from "@/src/modules/shared/domain/dinero"
import { DatosInvalidos, OperacionNoPermitida } from "@/src/modules/shared/domain/errors"
import { RelojFijo } from "@/src/testing/dobles"
import { ItemTicket } from "./item-ticket"
import { SlugTicket } from "./slug-ticket"
import { Ticket, type DatosNuevoTicket } from "./ticket"
import { CATEGORIAS_EQUIPO, ETIQUETA_CATEGORIA, type CategoriaEquipo } from "./clasificacion"

const reloj = new RelojFijo(new Date("2026-09-03T10:00:00.000Z"))

function item(concepto: string, cantidad: number, precio: number): ItemTicket {
  return new ItemTicket({
    id: `it-${concepto}`,
    concepto,
    cantidad,
    precioUnitario: Dinero.desdeUnidades(precio),
  })
}

function nuevoTicket(items: ItemTicket[] = [], datos: Partial<DatosNuevoTicket> = {}): Ticket {
  return Ticket.crear(
    {
      cliente: { nombre: "Ana López" },
      equipo: { categoria: "laptop", tipo: "Laptop", detalle: "Dell Inspiron 15" },
      fechaServicio: new Date("2026-09-03T00:00:00.000Z"),
      impuesto: Dinero.desdeUnidades(50),
      items,
      ...datos,
    },
    {
      id: "tk-1",
      folio: "BRT-000001",
      slug: SlugTicket.desde("abcdefgh1234"),
      reloj,
    },
  )
}

describe("Ticket", () => {
  it("nace en borrador y calcula subtotal + total con impuesto", () => {
    const t = nuevoTicket([item("Diagnóstico", 1, 200), item("RAM 8GB", 2, 400)])
    expect(t.estado).toBe("borrador")
    expect(t.subtotal.unidades).toBe(1000)
    expect(t.total.unidades).toBe(1050)
  })

  it("no se puede publicar sin ítems", () => {
    const t = nuevoTicket([])
    expect(() => t.publicar(reloj)).toThrow(OperacionNoPermitida)
    expect(t.estado).toBe("borrador")
  })

  it("publicar fija estado y publicadoEn", () => {
    const t = nuevoTicket([item("Servicio", 1, 500)])
    t.publicar(reloj)
    expect(t.estado).toBe("publicado")
    expect(t.esPublico).toBe(true)
    expect(t.publicadoEn).toEqual(reloj.ahora())
  })

  it("despublicar regresa a borrador y limpia publicadoEn", () => {
    const t = nuevoTicket([item("Servicio", 1, 500)])
    t.publicar(reloj)
    t.despublicar(reloj)
    expect(t.estado).toBe("borrador")
    expect(t.publicadoEn).toBeNull()
  })

  it("un ticket archivado no se puede editar ni publicar", () => {
    const t = nuevoTicket([item("Servicio", 1, 500)])
    t.archivar(reloj)
    expect(() => t.reemplazarItems([], reloj)).toThrow(OperacionNoPermitida)
    expect(() => t.publicar(reloj)).toThrow(OperacionNoPermitida)
  })

  it("reemplazarItems recalcula el total", () => {
    const t = nuevoTicket([item("A", 1, 100)])
    t.reemplazarItems([item("B", 3, 100), item("C", 1, 100)], reloj)
    expect(t.subtotal.unidades).toBe(400)
  })
})

describe("Clasificación del ticket", () => {
  const bateria = new ItemTicket({ id: "bateria", concepto: "Batería", clase: "pieza", pieza: "bateria", cantidad: 1, precioUnitario: Dinero.cero() })
  const ensamble = new ItemTicket({ id: "ensamble", concepto: "Armado", clase: "ensamble", cantidad: 1, precioUnitario: Dinero.cero() })

  it("rechaza una pieza incompatible al crear", () => {
    expect(() => nuevoTicket([bateria], { equipo: { categoria: "pc" } })).toThrow('La pieza "Batería" no aplica a PC de escritorio')
  })

  it.each(CATEGORIAS_EQUIPO.filter((categoria) => categoria !== "pc"))("rechaza ensamble en %s", (categoria) => {
    expect(() => nuevoTicket([ensamble], { equipo: { categoria } })).toThrow("El ensamble solo aplica a PC de escritorio")
  })

  it("permite ensamble en PC", () => {
    expect(nuevoTicket([ensamble], { equipo: { categoria: "pc" } }).items).toHaveLength(1)
  })

  it("valida el cambio de equipo y conserva el estado si falla", () => {
    const t = nuevoTicket([bateria])
    const anterior = t.instantanea()
    expect(() => t.actualizarEquipo({ categoria: "pc" }, reloj)).toThrow(DatosInvalidos)
    expect(t.instantanea()).toEqual(anterior)
  })

  it("valida el reemplazo de conceptos sin dejar cambios parciales", () => {
    const t = nuevoTicket([], { equipo: { categoria: "pc" } })
    const anterior = t.instantanea()
    expect(() => t.reemplazarItems([bateria], reloj)).toThrow(DatosInvalidos)
    expect(t.instantanea()).toEqual(anterior)
  })

  it("cambia laptop a PC quitando la batería en un solo paso", () => {
    const t = nuevoTicket([bateria])
    t.actualizarEquipoYConceptos({ categoria: "pc", tipo: "Mi PC" }, [ensamble], reloj)
    expect(t.equipo).toEqual({ categoria: "pc", tipo: "Mi PC", detalle: null })
    expect(t.items).toEqual([ensamble])
    expect(t.instantanea()).toMatchObject({ equipoCategoria: "pc", garantiaDias: null })
  })

  it.each(CATEGORIAS_EQUIPO)("usa el nombre por defecto de %s", (categoria) => {
    const t = nuevoTicket([], { equipo: { categoria, tipo: "  " } })
    expect(t.equipo.tipo).toBe(ETIQUETA_CATEGORIA[categoria])
    t.actualizarEquipo({ categoria }, reloj)
    expect(t.equipo.tipo).toBe(ETIQUETA_CATEGORIA[categoria])
  })

  it("valida también la categoría en tiempo de ejecución", () => {
    expect(() => nuevoTicket([], { equipo: { categoria: "tablet" as CategoriaEquipo } })).toThrow(DatosInvalidos)
  })

  it.each([-1, 366, 1.5, NaN, Infinity])("rechaza garantía %s al crear y modificar", (garantiaDias) => {
    expect(() => nuevoTicket([], { garantiaDias })).toThrow(DatosInvalidos)
    const t = nuevoTicket([], { garantiaDias: 30 })
    expect(() => t.fijarGarantia(garantiaDias, reloj)).toThrow(DatosInvalidos)
    expect(t.garantiaDias).toBe(30)
  })

  it.each([null, 0, 365])("acepta garantía %s", (garantiaDias) => {
    const t = nuevoTicket([], { garantiaDias })
    expect(t.garantiaDias).toBe(garantiaDias)
    t.fijarGarantia(30, reloj)
    expect(t.instantanea().garantiaDias).toBe(30)
  })

  it("impide reclasificar o fijar garantía de un ticket archivado", () => {
    const t = nuevoTicket()
    t.archivar(reloj)
    expect(() => t.actualizarEquipoYConceptos({ categoria: "pc" }, [], reloj)).toThrow(OperacionNoPermitida)
    expect(() => t.fijarGarantia(30, reloj)).toThrow(OperacionNoPermitida)
  })
})
