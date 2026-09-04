import { describe, expect, it } from "vitest"
import { Dinero } from "@/src/modules/shared/domain/dinero"
import { OperacionNoPermitida } from "@/src/modules/shared/domain/errors"
import { RelojFijo } from "@/src/testing/dobles"
import { ItemTicket } from "./item-ticket"
import { SlugTicket } from "./slug-ticket"
import { Ticket } from "./ticket"

const reloj = new RelojFijo(new Date("2026-09-03T10:00:00.000Z"))

function item(concepto: string, cantidad: number, precio: number): ItemTicket {
  return new ItemTicket({
    id: `it-${concepto}`,
    concepto,
    cantidad,
    precioUnitario: Dinero.desdeUnidades(precio),
  })
}

function nuevoTicket(items: ItemTicket[] = []): Ticket {
  return Ticket.crear(
    {
      cliente: { nombre: "Ana López" },
      equipo: { tipo: "Laptop", detalle: "Dell Inspiron 15" },
      fechaServicio: new Date("2026-09-03T00:00:00.000Z"),
      impuesto: Dinero.desdeUnidades(50),
      items,
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
