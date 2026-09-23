import { describe, expect, it } from "vitest"
import { MensajeContacto } from "../domain/mensaje-contacto"
import { plantillaCorreoContacto } from "./plantilla-correo-contacto"

const fecha = new Date("2026-09-23T05:52:00Z") // 22 sep 2026, 23:52 en CDMX

function mensaje(datos: Partial<{ nombre: string; email: string; mensaje: string }> = {}) {
  return MensajeContacto.crear({
    nombre: "Ana López",
    email: "ana@negocio.mx",
    mensaje: "Hola, necesito un sistema\npara mis dos sucursales.",
    ...datos,
  })
}

describe("plantillaCorreoContacto", () => {
  it("arma asunto, html y texto con los datos del mensaje", () => {
    const correo = plantillaCorreoContacto(mensaje(), fecha)
    expect(correo.asunto).toBe("🟣 Nuevo contacto · Ana López")
    expect(correo.html).toContain("Ana López")
    expect(correo.html).toContain('href="mailto:ana@negocio.mx"')
    expect(correo.html).toContain("Responder a Ana")
    expect(correo.html).toContain("22 de septiembre de 2026")
    expect(correo.texto).toContain("Correo: ana@negocio.mx")
  })

  it("respeta los saltos de línea del mensaje", () => {
    const { html, texto } = plantillaCorreoContacto(mensaje(), fecha)
    expect(html).toContain("Hola, necesito un sistema<br />para mis dos sucursales.")
    expect(texto).toContain("Hola, necesito un sistema\npara mis dos sucursales.")
  })

  it("escapa el HTML que escribe el visitante (sin inyección)", () => {
    const { html } = plantillaCorreoContacto(
      mensaje({
        nombre: '<img src=x onerror="alert(1)">',
        mensaje: '<a href="https://phishing.example">Pagar aquí</a>',
      }),
      fecha,
    )
    expect(html).not.toContain("<img src=x")
    expect(html).not.toContain('<a href="https://phishing.example"')
    expect(html).toContain("&lt;a href=&quot;https://phishing.example&quot;&gt;")
  })

  it("deja el asunto en una sola línea y acotado", () => {
    const { asunto } = plantillaCorreoContacto(mensaje({ nombre: `Ana\r\nBcc: otro@x.com ${"a".repeat(100)}` }), fecha)
    expect(asunto).not.toMatch(/[\r\n]/)
    expect(asunto.length).toBeLessThanOrEqual(80)
  })
})
