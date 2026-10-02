import { describe, expect, it } from "vitest"
import { normalizarContenido } from "./contenido"
import { construirContrato, type BloqueContrato, type DatosContrato } from "./contrato"

const trazo = "M10 10L20 20L30 10L40 20L50 10L60 20"

function datos(parcial: Partial<DatosContrato> = {}, contenido: Record<string, unknown> = {}): DatosContrato {
  const c = normalizarContenido({
    ficha: { contactoNombre: "César Chavero", tipoSistema: "Sistema de venta en ruta." },
    fases: [
      { id: "mvp", clave: "MVP", nombre: "Operación base", contratada: true, duracion: "3.5 meses (15 semanas)" },
      { id: "f2", clave: "F2", nombre: "Control avanzado", entregables: [{ id: "e1", nombre: "**Navegación dentro de la app** _(opcional)_ (`RF-NAV`)" }] },
    ],
    vistas: [
      { id: "v1", grupo: "App del repartidor · En el celular", nombre: "Venta y ticket", descripcion: "Vende e imprime." },
    ],
    calendario: [
      { id: "h0", semanas: "0", titulo: "Arranque" },
      { id: "h1", semanas: "1-2", titulo: "Base del sistema" },
      { id: "h9", semanas: "Desde la entrega", entregable: "Mantenimiento" },
    ],
    inversion: {
      pagos: [
        { id: "a", nombre: "Anticipo", montoCentavos: 600_000, cuando: "Semana 0", contra: "Firma" },
        { id: "b", nombre: "Entrega", montoCentavos: 2_900_000, cuando: "Semana 15", contra: "**Sistema operando**" },
      ],
      bonificacion: { nombre: "Caso de éxito", montoCentavos: 250_000, condicion: "A cambio de un testimonio." },
      condiciones: [
        { id: "c1", texto: "**Plazo de validación:** 5 días hábiles." },
        { id: "c2", texto: "**Vigencia:** válida hasta el 16 de octubre de 2026." },
      ],
      mensualidad: {
        montoCentavos: 165_000,
        descripcion: "A partir de la entrega, con un plazo mínimo de 12 meses.",
        incluye: [{ id: "i1", texto: "Servidor" }],
      },
      terceros: [
        { id: "t1", concepto: "Google Maps", costo: "$0" },
        { id: "t2", concepto: "Localizador GPS _(opcional, fase futura)_", costo: "Según el proveedor" },
      ],
    },
    ...contenido,
  })
  return {
    folio: "BRP-000001",
    proyectoNombre: "TioBetoSoft",
    clienteNombre: "Tostadas Tío Beto",
    contenido: c,
    totalCentavos: 3_500_000,
    aceptacion: null,
    firmaDesarrollador: null,
    ...parcial,
  }
}

const texto = (bloques: BloqueContrato[]) => JSON.stringify(bloques)

describe("Contrato del proyecto", () => {
  it("sin firmar: ejemplar para lectura, con las dos opciones sin marcar", () => {
    const c = construirContrato(datos())
    expect(c).toMatchObject({
      titulo: "Contrato de Desarrollo, Licencia y Servicio",
      subtitulo: "TioBetoSoft · Propuesta BRP-000001",
      estado: "Ejemplar para lectura: aún sin firmar",
      firmado: false,
      nombreArchivo: "Contrato-TioBetoSoft-BRP-000001.pdf",
    })
    expect(c.partes.map((p) => p.nombre)).toEqual(["BR TECH Digital Systems", "Tostadas Tío Beto"])
    expect(c.secciones.map((s) => s.titulo)).toEqual([
      "1. Objeto del contrato",
      "2. Alcance (Anexo A)",
      "3. Exclusiones (Anexo B)",
      "4. Calendario",
      "5. Precio y forma de pago",
      "6. Servicio mensual de hospedaje y mantenimiento",
      "7. Cambios de alcance",
      "8. Aceptación de la entrega y condiciones",
      "9. Obligaciones del Cliente",
      "10. Licencia, propiedad y código fuente",
      "11. Garantía",
      "12. Autorización de uso como caso de éxito",
      "13. Datos, respaldos y confidencialidad",
      "14. Límite de responsabilidad",
      "15. Suspensión y terminación",
      "16. Vigencia, firma y jurisdicción",
    ])
    const precio = c.secciones[4].bloques
    expect(precio.find((b) => b.tipo === "opciones")).toMatchObject({
      items: [{ marcada: false }, { marcada: false }],
    })
    expect(texto(precio)).toContain("el precio total queda en **$32,500**")
    expect(texto(precio)).toContain("el último pago baja a **$26,500**")
    expect(c.firmas).toEqual([
      { rotulo: "Por BR TECH Digital Systems", nombre: "César Iván Bárcenas Rosales", trazo: null, nota: "" },
      { rotulo: "Por Tostadas Tío Beto", nombre: "César Chavero", trazo: null, nota: "Sin firmar" },
    ])
  })

  it("toma el alcance, las exclusiones y el calendario de lo capturado", () => {
    const c = construirContrato(datos())
    expect(texto(c.secciones[1].bloques)).toContain("**App del repartidor**, en el celular:")
    expect(texto(c.secciones[1].bloques)).toContain("**Venta y ticket.** Vende e imprime.")
    // Las claves técnicas y las marcas de Markdown no llegan al contrato
    const exclusiones = texto(c.secciones[2].bloques)
    expect(exclusiones).toContain("Las funciones de fases futuras: navegación dentro de la app.")
    expect(exclusiones).toContain("consumos de terceros (Google Maps)")
    expect(exclusiones).not.toMatch(/RF-NAV|opcional|Localizador/)
    // Solo las etapas con semanas; el mantenimiento va en su propia cláusula
    expect(c.secciones[3].bloques[1]).toMatchObject({ tipo: "tabla", filas: [["0", "Arranque"], ["1-2", "Base del sistema"]] })
    expect(texto(c.secciones[3].bloques)).toContain("dura **15 semanas**")
    // La vigencia de la propuesta no es una condición del contrato
    expect(texto(c.secciones[7].bloques)).toContain("Plazo de validación")
    expect(texto(c.secciones[7].bloques)).not.toContain("Vigencia")
  })

  it("el código fuente se cotiza sobre el precio de lista: 50 % la copia, 100 % la cesión", () => {
    const licencia = texto(construirContrato(datos()).secciones[9].bloques)
    expect(licencia).toContain("50 % del precio del desarrollo contratado a esa fecha (hoy $17,500)")
    expect(licencia).toContain("100 % del precio del desarrollo contratado a esa fecha (hoy $35,000)")
    expect(licencia).toContain("el plazo mínimo de 12 meses ya contratado se mantiene")
  })

  it("firmado: marca la opción elegida y lleva las firmas de ambas partes", () => {
    const en = new Date("2026-10-02T18:00:00.000Z")
    const c = construirContrato(
      datos({
        aceptacion: { en, firmas: [{ nombre: "César Chavero", trazo }], conBonificacion: true },
        firmaDesarrollador: { trazo, en },
      }),
    )
    expect(c).toMatchObject({ firmado: true, estado: "Firmado el 2 de octubre de 2026" })
    expect(c.secciones[4].bloques.find((b) => b.tipo === "opciones")).toMatchObject({
      items: [{ marcada: true }, { marcada: false }],
    })
    expect(c.firmas).toEqual([
      { rotulo: "Por BR TECH Digital Systems", nombre: "César Iván Bárcenas Rosales", trazo, nota: "Firmó el 2 de octubre de 2026" },
      { rotulo: "Por Tostadas Tío Beto", nombre: "César Chavero", trazo, nota: "Firmó el 2 de octubre de 2026" },
    ])
  })

  it("sin bonificación ni mensualidad, esas cláusulas no aparecen", () => {
    const c = construirContrato(
      datos({}, { inversion: { pagos: [{ id: "a", nombre: "Pago único", montoCentavos: 3_500_000 }] } }),
    )
    const titulos = c.secciones.map((s) => s.titulo).join(" | ")
    expect(titulos).not.toMatch(/Servicio mensual|caso de éxito/)
    expect(c.secciones[4].bloques.some((b) => b.tipo === "opciones")).toBe(false)
    expect(JSON.stringify(c.secciones)).not.toMatch(/servicio mensual|plazo mínimo/i)
  })
})
