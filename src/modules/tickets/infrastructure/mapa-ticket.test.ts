import { describe, expect, it } from "vitest"
import { itemADominio, ticketADominio, type FilaItem, type FilaTicket } from "./mapa-ticket"

const filaTicket: FilaTicket = {
  id: "ticket", public_slug: "slugtest0001", folio: "BRT-000001", estado: "borrador",
  cliente_nombre: "Ana", cliente_contacto: null, equipo_categoria: "laptop", equipo_tipo: "Mi laptop", equipo_detalle: null,
  garantia_dias: 30, problema_reportado: null, diagnostico: null, trabajo_realizado: null,
  recomendaciones: null, nota_garantia: null, moneda: "MXN", impuesto_centavos: "50", pagado: false,
  fecha_servicio: "2026-11-06", creado_en: "2026-11-06T00:00:00Z", actualizado_en: "2026-11-06T00:00:00Z", publicado_en: null,
}
const filaItem: FilaItem = {
  id: "item", ticket_id: "ticket", posicion: 0, concepto: "RAM nueva", detalle: null,
  cantidad: "2", precio_unitario_centavos: "12550", clase: "pieza", pieza: "ram", etiqueta: "16 GB", pieza_anterior: "8 GB",
}

describe("mapa de tickets", () => {
  it("rehidrata clasificación y garantía y ordena los conceptos", () => {
    const ticket = ticketADominio(filaTicket, [{ ...filaItem, id: "segundo", posicion: 1 }, filaItem])
    expect(ticket.equipo.categoria).toBe("laptop")
    expect(ticket.garantiaDias).toBe(30)
    expect(ticket.items.map((item) => item.id)).toEqual(["item", "segundo"])
    expect(ticket.items[0]).toMatchObject({ clase: "pieza", pieza: "ram", etiqueta: "16 GB", piezaAnterior: "8 GB" })
    expect(ticket.total.centavos).toBe(50250)
  })

  it("categorías y clases desconocidas caen a otro y eliminan piezas incompatibles con la clase", () => {
    const ticket = ticketADominio({ ...filaTicket, equipo_categoria: "futura", garantia_dias: null }, [{ ...filaItem, clase: "futura" }])
    expect(ticket.equipo.categoria).toBe("otro")
    expect(ticket.garantiaDias).toBeNull()
    expect(ticket.items[0]).toMatchObject({ clase: "otro", pieza: null, piezaAnterior: null })
  })

  it("piezas desconocidas caen a null", () => {
    expect(itemADominio({ ...filaItem, pieza: "futura" }).pieza).toBeNull()
    expect(itemADominio({ ...filaItem, clase: "diagnostico" })).toMatchObject({ clase: "diagnostico", pieza: "ram", piezaAnterior: null })
  })
})
