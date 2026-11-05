import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { DatosPagoDTO, TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { formatearDinero } from "@/src/ui/formato"

const dobles = vi.hoisted(() => ({ obtener: vi.fn(), datos: vi.fn() }))
vi.mock("@/src/modules/tickets/infrastructure/contenedor", () => ({
  tickets: () => ({ obtenerTicketPublico: { ejecutar: dobles.obtener }, datosPago: dobles.datos }),
}))

import PaginaTicket, { generateMetadata } from "@/src/app/t/[slug]/page"

const cuerpo = "98765432109876543"
const suma = [...cuerpo].reduce((s, d, i) => s + (Number(d) * [3, 7, 1][i % 3]) % 10, 0)
const datos: DatosPagoDTO = {
  banco: "Banco de prueba", titular: "Titular de prueba", clabe: `${cuerpo}${(10 - suma % 10) % 10}`,
}
const ticket: TicketPublicoDTO = {
  folio: "BRT-999999", slug: "recibo-ficticio", moneda: "MXN", fechaServicio: "2026-11-05",
  publicadoEn: null, pagado: false,
  cliente: { nombre: "Andrea Apellido de prueba", contacto: null },
  equipo: { tipo: "Computadora portátil", detalle: "Equipo de prueba" },
  problemaReportado: "El equipo se apaga.", diagnostico: "Requiere mantenimiento.",
  trabajoRealizado: "Limpieza del equipo.", recomendaciones: null, notaGarantia: null,
  items: [{ id: "uno", concepto: "Mantenimiento", detalle: null, cantidad: 1, precioUnitario: 1234.5, importe: 1234.5 }],
  subtotal: 1234.5, impuesto: 0, total: 1234.5,
}
const props = { params: Promise.resolve({ slug: ticket.slug }) }

beforeEach(() => {
  vi.clearAllMocks()
  dobles.obtener.mockResolvedValue(ticket)
  dobles.datos.mockReturnValue(datos)
})

describe("recibo público", () => {
  it.each([false, true])("protege los metadatos, pagado=%s", async (pagado) => {
    dobles.obtener.mockResolvedValue({ ...ticket, pagado })
    expect(await generateMetadata(props)).toEqual({
      title: `Andrea, ${pagado ? "tu pago está confirmado" : "tu nota de servicio está lista"}`,
      description: "Revisa el detalle de tu servicio con BR TECH.",
      robots: { index: false, follow: false },
    })
  })

  it("conserva noindex si no existe la nota", async () => {
    dobles.obtener.mockRejectedValue(new RecursoNoEncontrado("Nota"))
    expect((await generateMetadata(props)).robots).toEqual({ index: false, follow: false })
  })

  it("ofrece transferencia antes del desglose y conserva el documento para impresión", async () => {
    const html = renderToStaticMarkup(await PaginaTicket(props))
    expect(dobles.datos).toHaveBeenCalledOnce()
    expect(html.indexOf("<script>")).toBeLessThan(html.indexOf('id="entrada-recibo"'))
    expect(html.indexOf('id="entrada-recibo"')).toBeLessThan(html.indexOf('id="pagina-recibo"'))
    expect(html.indexOf("Total a pagar")).toBeLessThan(html.indexOf("Cómo pagar"))
    expect(html.indexOf("Cómo pagar")).toBeLessThan(html.indexOf("Desglose de servicio"))
    expect(html).toContain("987 654 32109876543 ")
    for (const etiqueta of ["CLABE", "Monto", "Concepto"]) expect(html).toContain(`aria-label="Copiar ${etiqueta}"`)
    expect(html).toContain(encodeURIComponent(`Hola, ya pagué la nota ${ticket.folio} por ${formatearDinero(ticket.total, ticket.moneda)}. Te comparto mi comprobante.`))
    expect(html).toContain("print:flex")
    expect(html).toContain("Mantenimiento")
    expect(html).toContain("Subtotal")
    expect(html).not.toContain("Apellido de prueba")
  })

  it("ofrece WhatsApp cuando no hay configuración bancaria", async () => {
    dobles.datos.mockReturnValue(null)
    const html = renderToStaticMarkup(await PaginaTicket(props))
    expect(html).toContain("Pedir datos de pago")
    expect(html).toContain("Escríbenos por WhatsApp y te compartimos los datos para tu pago.")
    expect(html).toContain(encodeURIComponent(`Hola, quiero pagar la nota ${ticket.folio}.`))
    expect(html).not.toContain("Transferencia bancaria")
    expect(html).not.toContain(datos.banco)
    expect(html).not.toContain('aria-label="Copiar CLABE"')
  })

  it("entrega el sello en reposo desde el servidor y oculta la forma de pago al pagar", async () => {
    dobles.obtener.mockResolvedValue({ ...ticket, pagado: true })
    const html = renderToStaticMarkup(await PaginaTicket(props))
    expect(html).toContain("Recibo de pago")
    expect(html).toContain("Total pagado")
    expect(html).toContain("border-double border-success")
    expect(html).toContain(">Pagado</span>")
    expect(html).not.toContain("Cómo pagar")
    expect(html).not.toContain("Ya pagué, enviar comprobante")
    expect(html).not.toContain(datos.titular)
  })
})
