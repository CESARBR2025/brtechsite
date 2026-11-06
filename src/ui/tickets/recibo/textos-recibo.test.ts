import { describe, expect, it } from "vitest"
import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { derivarEscena } from "@/src/modules/tickets/application/escena-servicio"
import { diasDesdeServicio, hoyDelRecibo, textosRecibo, vigenciaGarantia } from "./textos-recibo"

const ticket: TicketPublicoDTO = {
  folio: "BRT-000001", slug: "prueba", moneda: "MXN", fechaServicio: "2026-11-05", publicadoEn: null,
  pagado: false, cliente: { nombre: "Andrea", contacto: null }, equipo: { categoria: "laptop", tipo: "Laptop", detalle: null },
  problemaReportado: "Se apagaba.", diagnostico: "Polvo en el ventilador.", trabajoRealizado: "Limpieza interna.",
  recomendaciones: null, notaGarantia: null, garantiaDias: 30, escena: derivarEscena("laptop", []),
  desglose: { manoDeObra: 0, piezas: 0 }, totalEnLetra: null, items: [], subtotal: 0, impuesto: 0, total: 0,
}

describe("textos del recibo", () => {
  it.each([
    ["laptop", "laptop", "lista"], ["pc", "PC", "lista"], ["todo_en_uno", "computadora", "lista"], ["otro", "equipo", "listo"],
  ] as const)("usa el nombre corto y el género de %s", (categoria, nombre, genero) => {
    const textos = textosRecibo({ ...ticket, equipo: { ...ticket.equipo, categoria }, escena: derivarEscena(categoria, []) })
    expect(textos.apoyo).toBe(`Tu ${nombre} ya está ${genero} y vuelve a funcionar como debe. Aquí tienes todo lo que le hicimos, tu garantía y la forma de pago.`)
    expect(textos.titulo).toBe(`Así quedó tu ${nombre}`)
  })

  it.each([null, 0])("sin garantía de %s días no la promete en el apoyo", (garantiaDias) => {
    const textos = textosRecibo({ ...ticket, garantiaDias })
    expect(textos.apoyo).not.toContain("tu garantía")
    expect(textos.apoyo).toContain("todo lo que le hicimos y la forma de pago.")
  })

  it("una nota antigua sí cuenta como garantía", () => {
    expect(textosRecibo({ ...ticket, garantiaDias: null, notaGarantia: "Sobre el servicio." }).apoyo).toContain("tu garantía")
  })

  it.each([true, false])("el pago confirmado menciona la garantía solo cuando existe: %s", (conGarantia) => {
    expect(textosRecibo({ ...ticket, pagado: true, garantiaDias: conGarantia ? 30 : 0 }).apoyo).toBe(`Recibimos tu pago. Guarda esta página: es tu comprobante${conGarantia ? " y tu garantía" : ""}.`)
  })

  it("ensamble cambia los títulos sin inventar la historia", () => {
    const escena = derivarEscena("pc", [{ concepto: "Armado", clase: "ensamble", pieza: null, etiqueta: null, piezaAnterior: null }])
    const textos = textosRecibo({ ...ticket, escena })
    expect(textos.apoyo).toBe("Tu nueva PC ya está armada y probada. Aquí tienes cada pieza, tu garantía y la forma de pago.")
    expect(textos.pasos.map((p) => p.titulo)).toEqual(["Lo que buscabas", "Lo que elegimos", "Lo que hicimos"])
    expect(textos.pasos.map((p) => p.texto)).toEqual([ticket.problemaReportado, ticket.diagnostico, ticket.trabajoRealizado])
  })

  it("diagnóstico usa recomendaciones como siguiente paso solo si falta el trabajo", () => {
    const escena = derivarEscena("laptop", [{ concepto: "Revisión", clase: "diagnostico", pieza: null, etiqueta: null, piezaAnterior: null }])
    const textos = textosRecibo({ ...ticket, escena, trabajoRealizado: " ", recomendaciones: "Solicita una cotización." })
    expect(textos.apoyo).toBe("Ya sabemos qué tiene tu laptop. Aquí tienes el diagnóstico, lo que sigue y la forma de pago.")
    expect(textos.pasos[2]).toMatchObject({ titulo: "Lo que sigue", texto: "Solicita una cotización." })
    expect(textosRecibo({ ...ticket, escena, recomendaciones: "No sustituir." }).pasos[2].texto).toBe(ticket.trabajoRealizado)
    expect(textosRecibo({ ...ticket, escena, pagado: true }).apoyo).not.toContain("garantía")
  })

  it("omite pasos vacíos y conserva sus índices para los gestos", () => {
    expect(textosRecibo({ ...ticket, problemaReportado: " ", diagnostico: null }).pasos).toEqual([{ indice: 2, titulo: "Lo que hicimos", texto: ticket.trabajoRealizado }])
    expect(textosRecibo({ ...ticket, problemaReportado: null, diagnostico: null, trabajoRealizado: null }).pasos).toEqual([])
  })
})

describe("fechas del recibo", () => {
  it("usa el día civil de Ciudad de México aunque UTC ya cambió", () => {
    expect(hoyDelRecibo(new Date("2026-11-07T02:00:00Z"))).toBe("2026-11-06")
    expect(diasDesdeServicio("2026-11-05", "2026-11-06")).toBe(1)
    expect(diasDesdeServicio("2026-11-07", "2026-11-06")).toBe(0)
  })

  it("la garantía cuenta desde el servicio, cruza meses y nunca muestra días negativos", () => {
    expect(vigenciaGarantia("2026-11-05", 30, "2026-11-06")).toEqual({ fecha: "2026-12-05", restantes: 29, porcentaje: 29 / 30 * 100 })
    expect(vigenciaGarantia("2026-11-05", 30, "2026-12-05").restantes).toBe(0)
    expect(vigenciaGarantia("2026-11-05", 30, "2027-01-01").porcentaje).toBe(0)
    expect(vigenciaGarantia("2026-11-05", 30, "2026-11-01").restantes).toBe(30)
  })
})
