import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { DatosPagoDTO, TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { derivarEscena } from "@/src/modules/tickets/application/escena-servicio"
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
  equipo: { categoria: "laptop", tipo: "Computadora portátil", detalle: "Equipo de prueba" },
  problemaReportado: "El equipo se apaga.", diagnostico: "Requiere mantenimiento.",
  trabajoRealizado: "Limpieza del equipo.", recomendaciones: null, notaGarantia: null,
  garantiaDias: 30, escena: derivarEscena("laptop", [{ concepto: "Mantenimiento", clase: "mantenimiento", pieza: null, etiqueta: null, piezaAnterior: null }]), desglose: { manoDeObra: 1234.5, piezas: 0 }, totalEnLetra: "Mil doscientos treinta y cuatro pesos 50/100 M.N.",
  items: [{ clase: "mantenimiento", pieza: null, etiqueta: "Mantenimiento", etiquetaPropia: null, piezaAnterior: null, id: "uno", concepto: "Mantenimiento", detalle: null, cantidad: 1, precioUnitario: 1234.5, importe: 1234.5 }],
  subtotal: 1234.5, impuesto: 0, total: 1234.5,
}
const props = { params: Promise.resolve({ slug: ticket.slug }) }

async function renderizarRecibo() {
  const html = renderToStaticMarkup(await PaginaTicket(props))
  expect(html).not.toMatch(/undefined|NaN/)
  return html
}

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

  it("compone expediente, columna de pago e impresión con los datos reales", async () => {
    const html = await renderizarRecibo()
    expect(dobles.datos).toHaveBeenCalledOnce()
    expect(html.indexOf("<script>")).toBeLessThan(html.indexOf('id="entrada-recibo"'))
    expect(html.indexOf('id="entrada-recibo"')).toBeLessThan(html.indexOf('id="pagina-recibo"'))
    expect(html.indexOf("Total a pagar")).toBeLessThan(html.indexOf("Paga por transferencia"))
    expect(html).toContain("order-first")
    expect(html).toContain("Así quedó tu laptop")
    for (const texto of [ticket.problemaReportado, ticket.diagnostico, ticket.trabajoRealizado, ticket.totalEnLetra]) expect(html).toContain(texto)
    expect(html).toContain('data-interior="mantenimiento"')
    expect(html).toContain("Garantía de 30 días")
    expect(html).toContain("Descargar comprobante")
    expect(html).not.toContain("OndasDiferidas")
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
    const html = await renderizarRecibo()
    expect(html).toContain("Pedir datos de pago")
    expect(html).toContain("Escríbenos por WhatsApp y te compartimos los datos para tu pago.")
    expect(html).toContain(encodeURIComponent(`Hola, quiero pagar la nota ${ticket.folio}.`))
    expect(html).not.toContain("Transferencia bancaria")
    expect(html).not.toContain(datos.banco)
    expect(html).not.toContain('aria-label="Copiar CLABE"')
  })

  it("entrega el sello en reposo desde el servidor y oculta la forma de pago al pagar", async () => {
    dobles.obtener.mockResolvedValue({ ...ticket, pagado: true })
    const html = await renderizarRecibo()
    expect(html).toContain("Recibo de pago")
    expect(html).toContain("Total pagado")
    expect(html).toContain("border-double border-success")
    expect(html).toContain(">Pagado</span>")
    expect(html).not.toContain("Cómo pagar")
    expect(html).not.toContain("Ya transferí, enviar comprobante")
    expect(html).toContain("Pago recibido")
    expect(html).toContain("Gracias por confiar en nosotros, Andrea.")
    expect(html).not.toContain(datos.titular)
  })

  it("en diagnóstico ofrece lo que sigue y omite toda garantía", async () => {
    dobles.obtener.mockResolvedValue({ ...ticket, trabajoRealizado: null, recomendaciones: "Cotizaremos la reparación.", notaGarantia: "No debe salir", escena: derivarEscena("laptop", [{ concepto: "Diagnóstico", clase: "diagnostico", pieza: "placa", etiqueta: null, piezaAnterior: null }]) })
    const html = await renderizarRecibo()
    expect(html).toContain("Lo que encontramos en tu laptop")
    expect(html).toContain("Lo que sigue")
    expect(html).toContain("Cotizaremos la reparación.")
    expect(html).toContain("Falla en tarjeta madre")
    expect(html).not.toContain("Garantía de")
    expect(html).not.toContain("No debe salir")
    expect(html).not.toContain("exp-medalla")
  })

  it.each([null, 0])("con garantía de %s días conserva la nota antigua sin medalla", async (garantiaDias) => {
    dobles.obtener.mockResolvedValue({ ...ticket, garantiaDias, notaGarantia: "Conserva este comprobante." })
    const html = await renderizarRecibo()
    expect(html).toContain("Conserva este comprobante.")
    expect(html).toContain("exp-garantia-simple")
    expect(html).not.toContain("exp-medalla")
  })

  it("sin historia no inventa pasos ni encabezado narrativo", async () => {
    dobles.obtener.mockResolvedValue({ ...ticket, problemaReportado: null, diagnostico: null, trabajoRealizado: null })
    const html = await renderizarRecibo()
    expect(html).not.toContain("Así quedó tu")
    expect(html).not.toContain("exp-historia")
    expect(html).toContain("Conceptos")
  })

  it("incluye piezas, impuesto, recomendaciones y centavos exactos", async () => {
    dobles.obtener.mockResolvedValue({ ...ticket, items: [{ ...ticket.items[0], clase: "pieza", pieza: "disco", detalle: "Unidad de 240 GB" }], impuesto: 197.52, total: 1432.02, desglose: { manoDeObra: 0, piezas: 1234.5 }, recomendaciones: "Evita golpes." })
    const html = await renderizarRecibo()
    for (const texto of ["Pieza nueva", "Unidad de 240 GB", "$1,234.50", "$197.52", "$1,432.02", "Para que dure:", "Evita golpes."]) expect(html).toContain(texto)
  })

  it.each([false, true])("otro equipo tiene escena genérica y HTML íntegro, pagado=%s", async (pagado) => {
    dobles.obtener.mockResolvedValue({ ...ticket, pagado, garantiaDias: null, totalEnLetra: null, equipo: { categoria: "otro", tipo: "Impresora", detalle: null }, escena: derivarEscena("otro", []) })
    const html = await renderizarRecibo()
    expect(html).toContain("Así quedó tu equipo")
    expect(html).toContain("Impresora")
    if (!pagado) expect(html).toContain("Tu equipo ya está listo")
    expect(html).not.toMatch(/undefined|NaN/)
    expect(html).not.toContain("exp-medalla")
  })

  it("ensamble conserva la narrativa capturada y el título de PC", async () => {
    dobles.obtener.mockResolvedValue({ ...ticket, equipo: { categoria: "pc", tipo: "PC de escritorio", detalle: null }, escena: derivarEscena("pc", [{ concepto: "Armado", clase: "ensamble", pieza: null, etiqueta: null, piezaAnterior: null }]) })
    const html = await renderizarRecibo()
    for (const texto of ["Así armamos tu PC", "Lo que buscabas", "Lo que elegimos", "Sobre el armado y la configuración.", ticket.problemaReportado]) expect(html).toContain(texto)
    expect(html).not.toMatch(/undefined|NaN/)
  })
})
