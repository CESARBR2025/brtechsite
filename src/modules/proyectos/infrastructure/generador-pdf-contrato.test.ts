import { PDFDocument } from "pdf-lib"
import { describe, expect, it } from "vitest"
import type { DocumentoContrato } from "../domain/contrato"
import { GeneradorPdfContratoPdfLib } from "./generador-pdf-contrato"

const trazo = "M10 10L20 20L30 10L40 20L50 10L60 20"

const contrato: DocumentoContrato = {
  titulo: "Contrato de Desarrollo, Licencia y Servicio",
  subtitulo: "TioBetoSoft · Propuesta BRP-000001",
  estado: "Firmado el 2 de octubre de 2026",
  firmado: true,
  partes: [
    { rotulo: "Proveedor", nombre: "BR TECH Digital Systems", detalle: "Representado por César Iván Bárcenas Rosales" },
    { rotulo: "Cliente", nombre: "Tostadas Tío Beto", detalle: "" },
  ],
  secciones: [
    {
      titulo: "1. Objeto",
      bloques: [
        // Caracteres fuera de WinAnsi (✔, →, −, Σ) no deben tirar la generación
        { tipo: "parrafo", texto: "Texto con **negritas**, acentos (ñ, á, ü), «comillas» y signos raros: ✔ → − Σ 😀." },
        { tipo: "lista", items: ["Uno", "Dos con **negrita**"] },
        { tipo: "tabla", columnas: ["Pago", "Monto"], anchos: [0.5, 0.5], filas: [["Anticipo", "$6,000"]] },
        { tipo: "opciones", items: [{ marcada: true, texto: "**Con** caso de éxito" }, { marcada: false, texto: "Sin" }] },
      ],
    },
    // Suficiente texto para obligar a saltar de página
    { titulo: "2. Largo", bloques: Array.from({ length: 60 }, (_, i) => ({ tipo: "parrafo" as const, texto: `Párrafo ${i}. ${"palabra ".repeat(40)}` })) },
  ],
  firmas: [
    { rotulo: "Por BR TECH Digital Systems", nombre: "César Iván Bárcenas Rosales", trazo: null, nota: "" },
    { rotulo: "Por Tostadas Tío Beto", nombre: "César Chavero", trazo, nota: "Firmó el 2 de octubre de 2026" },
    { rotulo: "Por Tostadas Tío Beto", nombre: "Ana Ruiz", trazo, nota: "Firmó el 2 de octubre de 2026" },
  ],
  nombreArchivo: "Contrato-TioBetoSoft-BRP-000001.pdf",
}

describe("GeneradorPdfContratoPdfLib", () => {
  it("genera un PDF válido, de varias páginas, con su título", async () => {
    const pdf = await new GeneradorPdfContratoPdfLib().generar(contrato)
    expect(new TextDecoder().decode(pdf.slice(0, 5))).toBe("%PDF-")
    const doc = await PDFDocument.load(pdf)
    expect(doc.getPageCount()).toBeGreaterThan(2)
    expect(doc.getTitle()).toBe("Contrato de Desarrollo, Licencia y Servicio · TioBetoSoft · Propuesta BRP-000001")
  })
})
