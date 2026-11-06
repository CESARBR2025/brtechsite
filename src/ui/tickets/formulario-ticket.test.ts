import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import type { TicketDetalleDTO } from "@/src/modules/tickets/application/dtos"
import { derivarEscena } from "@/src/modules/tickets/application/escena-servicio"

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }))
vi.mock("@/src/app/(panel)/panel/acciones", () => ({ guardarTicket: vi.fn() }))

import { FormularioTicket } from "./formulario-ticket"

const ticket: TicketDetalleDTO = {
  id: "ticket", folio: "BRT-001", slug: "ticket-prueba", estado: "borrador", moneda: "MXN",
  fechaServicio: "2026-11-06", publicadoEn: null, creadoEn: "2026-11-06", actualizadoEn: "2026-11-06", pagado: false,
  cliente: { nombre: "Andrea", contacto: null },
  equipo: { categoria: "laptop", tipo: "Portátil de trabajo", detalle: "Modelo de prueba" },
  problemaReportado: "Se apaga", diagnostico: "Batería agotada", trabajoRealizado: "Cambio de batería",
  recomendaciones: null, notaGarantia: "Sobre la batería", garantiaDias: 90,
  escena: derivarEscena("laptop", []), desglose: { manoDeObra: 0, piezas: 1500 }, totalEnLetra: null,
  subtotal: 1500, impuesto: 0, total: 1500,
  items: [{ id: "bateria", clase: "pieza", pieza: "bateria", etiqueta: "Batería nueva", etiquetaPropia: "Batería nueva",
    piezaAnterior: "batería agotada", concepto: "Repuesto del equipo", detalle: "Capacidad original", cantidad: 1,
    precioUnitario: 1500, importe: 1500 }],
}

function renderizar(inicial?: TicketDetalleDTO) {
  const html = renderToStaticMarkup(createElement(FormularioTicket, { inicial, ticketId: inicial?.id }))
  expect(html).not.toMatch(/undefined|NaN/)
  return html
}

describe("formulario de tickets", () => {
  it("mantiene los identificadores iniciales al renderizar para hidratar el formulario", () => {
    expect(renderizar()).toBe(renderizar())
  })

  it("inicia con laptop, 30 días y vista previa activa con el material compartido", () => {
    const html = renderizar()
    expect(html).toMatch(/aria-pressed="true"[^>]*>Laptop<\/button>/)
    expect(html).toMatch(/id="garantiaDias"[^>]*value="30"/)
    expect(html).toContain('placeholder="Laptop"')
    expect(html).toContain("exp-portada")
    expect(html).toContain('data-activa=""')
    expect(html).toContain("Repetir animación")
    expect(html).toContain("Sin textos de historia")
    expect(html).toContain('<option value="ensamble" disabled="">')
    expect(html).not.toContain("Sugerida")
  })

  it("carga categoría, garantía y toda la clasificación guardada sin sugerir de nuevo", () => {
    const html = renderizar(ticket)
    expect(html).toContain('value="Portátil de trabajo"')
    expect(html).toMatch(/id="garantiaDias"[^>]*value="90"/)
    expect(html).toContain("Sobre la batería</textarea>")
    expect(html).toContain('<option value="pieza" selected="">')
    expect(html).toContain('<option value="bateria" selected="">')
    expect(html).toContain('value="Batería nueva"')
    expect(html).toContain('value="batería agotada"')
    expect(html).toContain('data-interior="pieza"')
    expect(html).not.toContain("Sugerida")
    expect(html).not.toContain("Sin textos de historia")
  })

  it("distingue la etiqueta capturada de la etiqueta calculada", () => {
    const html = renderizar({ ...ticket, items: [{ ...ticket.items[0], etiquetaPropia: null }] })
    expect(html).toMatch(/id="concepto-bateria-etiqueta"[^>]*placeholder="Repuesto del equipo"[^>]*value=""/)
    expect(html).not.toContain('value="Batería nueva"')
  })

  it.each([null, 0])("conserva la garantía antigua %s", (garantiaDias) => {
    const html = renderizar({ ...ticket, garantiaDias })
    expect(html).toMatch(new RegExp(`id="garantiaDias"[^>]*value="${garantiaDias ?? ""}"`))
    expect(html.includes("Sin garantía: no se mostrará la medalla.")).toBe(garantiaDias === 0)
  })

  it("ofrece armado solo en PC y filtra las piezas y las plantillas por categoría", () => {
    const html = renderizar({ ...ticket, equipo: { ...ticket.equipo, categoria: "pc" }, items: [{ ...ticket.items[0], pieza: "fuente" }] })
    expect(html).toMatch(/aria-pressed="true"[^>]*>PC de escritorio<\/button>/)
    expect(html).toContain('<option value="ensamble">')
    expect(html).toContain("Armado de PC</button>")
    expect(html).toContain('<option value="fuente" selected="">')
    expect(html).not.toContain('<option value="bateria"')
    expect(html).not.toContain("Batería</button>")
  })

  it("muestra los avisos de equipo genérico y pieza sin especificar", () => {
    const html = renderizar({ ...ticket, equipo: { ...ticket.equipo, categoria: "otro" }, items: [{ ...ticket.items[0], pieza: null }] })
    expect(html).toContain("Con «Otro equipo» se muestra la ilustración genérica.")
    expect(html).toContain("Indica qué pieza es para dibujarla.")
    expect(html).not.toContain("Armado de PC</button>")
    expect(html).not.toContain("SSD</button>")
  })
})
