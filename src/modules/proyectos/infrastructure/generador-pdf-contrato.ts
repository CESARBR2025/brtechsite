import { PDFDocument, type PDFFont, type PDFPage, StandardFonts, rgb } from "pdf-lib"
import type { BloqueContrato, DocumentoContrato } from "../domain/contrato"
import { LIENZO_FIRMA } from "../domain/firma"
import type { GeneradorPdfContrato } from "../domain/puertos"

/*
 * Adaptador: pinta el contrato en PDF con pdf-lib (JavaScript puro, sin
 * navegador: el VPS va justo de memoria). Tamaño carta, tipografías estándar
 * del PDF y un flujo simple de arriba abajo que salta de página cuando el
 * siguiente renglón ya no cabe.
 */

const ANCHO = 612
const ALTO = 792
const MARGEN = 54
const PIE = 46
const UTIL = ANCHO - MARGEN * 2

const hex = (h: string) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255)
const COLOR = {
  marca: hex("#7836E2"),
  marcaProfunda: hex("#471FA3"),
  marcaClara: hex("#F1EBFF"),
  oscuro: hex("#151127"),
  texto: hex("#111827"),
  secundario: hex("#374151"),
  tenue: hex("#6B7280"),
  linea: hex("#E5E7EB"),
  blanco: rgb(1, 1, 1),
}

/** Las tipografías estándar solo traen WinAnsi: lo que no existe ahí se sustituye o se quita. */
function winAnsi(t: string): string {
  return t
    .replace(/[−‐‑]/g, "-")
    .replace(/[→⇒]/g, "->")
    .replace(/[✔✓]/g, "")
    .replace(/ /g, " ")
    .replace(/[^\x20-\x7E\xA1-\xFF€‚„…†‡‰‹›Œœ‘’“”•–—™ŠšŽžŸ]/g, "")
}

interface Trozo {
  texto: string
  negrita: boolean
}

/** "a **b** c" → trozos con su peso; las palabras llevan su espacio final para medir y partir. */
function trozos(md: string): Trozo[] {
  return winAnsi(md)
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .flatMap((parte) => {
      const negrita = parte.startsWith("**") && parte.endsWith("**")
      const texto = negrita ? parte.slice(2, -2) : parte
      return (texto.match(/\S+\s*|\s+/g) ?? []).map((t) => ({ texto: t, negrita }))
    })
}

class Lienzo {
  pagina!: PDFPage
  /** Distancia desde el borde superior de la página. */
  y = 0

  constructor(
    private readonly doc: PDFDocument,
    readonly normal: PDFFont,
    readonly negrita: PDFFont,
    readonly cursiva: PDFFont,
  ) {
    this.nuevaPagina()
  }

  nuevaPagina(): void {
    this.pagina = this.doc.addPage([ANCHO, ALTO])
    this.y = MARGEN
  }

  /** Salta de página si no caben `alto` puntos más. */
  reservar(alto: number): void {
    if (this.y + alto > ALTO - PIE - 8) this.nuevaPagina()
  }

  /** Parte un texto con negritas en renglones que caben en `ancho`. */
  renglones(md: string, ancho: number, tamano: number, todoNegrita = false): Trozo[][] {
    const lineas: Trozo[][] = [[]]
    let usado = 0
    for (const t of trozos(md)) {
      const fuente = t.negrita || todoNegrita ? this.negrita : this.normal
      const w = fuente.widthOfTextAtSize(t.texto.trimEnd(), tamano)
      if (usado + w > ancho && lineas.at(-1)!.length > 0) {
        lineas.push([])
        usado = 0
      }
      if (lineas.at(-1)!.length === 0 && !t.texto.trim()) continue
      lineas.at(-1)!.push({ texto: t.texto, negrita: t.negrita || todoNegrita })
      usado += fuente.widthOfTextAtSize(t.texto, tamano)
    }
    return lineas.filter((l) => l.length > 0)
  }

  /** Sin `color`, las negritas van en el tono fuerte y el resto en el secundario; con `color`, todo el renglón lo usa. */
  pintarRenglon(linea: Trozo[], x: number, y: number, tamano: number, color?: ReturnType<typeof rgb>): void {
    let cx = x
    // Las palabras seguidas del mismo peso se pintan juntas: así el texto se puede seleccionar y copiar
    const tramos = linea.reduce<Trozo[]>((acc, t) => {
      const ultimo = acc.at(-1)
      if (ultimo && ultimo.negrita === t.negrita) ultimo.texto += t.texto
      else acc.push({ ...t })
      return acc
    }, [])
    for (const t of tramos) {
      const fuente = t.negrita ? this.negrita : this.normal
      this.pagina.drawText(t.texto, {
        x: cx,
        y: ALTO - y - tamano,
        size: tamano,
        font: fuente,
        color: color ?? (t.negrita ? COLOR.texto : COLOR.secundario),
      })
      cx += fuente.widthOfTextAtSize(t.texto, tamano)
    }
  }

  /** Texto corrido desde `x`, con salto de página renglón por renglón. */
  texto(md: string, opciones: { x?: number; ancho?: number; tamano?: number; interlinea?: number; negrita?: boolean; color?: ReturnType<typeof rgb> } = {}): void {
    const { x = MARGEN, tamano = 9.5, negrita = false, color } = opciones
    const ancho = opciones.ancho ?? ANCHO - MARGEN - x
    const interlinea = opciones.interlinea ?? tamano * 1.42
    for (const linea of this.renglones(md, ancho, tamano, negrita)) {
      this.reservar(interlinea)
      this.pintarRenglon(linea, x, this.y, tamano, color)
      this.y += interlinea
    }
  }

  linea(x1: number, y: number, x2: number, color = COLOR.linea, grosor = 0.7): void {
    this.pagina.drawLine({ start: { x: x1, y: ALTO - y }, end: { x: x2, y: ALTO - y }, thickness: grosor, color })
  }

  rect(x: number, y: number, ancho: number, alto: number, estilo: { relleno?: ReturnType<typeof rgb>; borde?: ReturnType<typeof rgb> }): void {
    this.pagina.drawRectangle({
      x,
      y: ALTO - y - alto,
      width: ancho,
      height: alto,
      color: estilo.relleno,
      borderColor: estilo.borde,
      borderWidth: estilo.borde ? 0.7 : 0,
    })
  }
}

function tabla(l: Lienzo, b: Extract<BloqueContrato, { tipo: "tabla" }>): void {
  const tamano = 8.5
  const interlinea = tamano * 1.38
  const relleno = 5
  const anchos = b.anchos.map((f) => f * UTIL)
  const fila = (celdas: string[], encabezado: boolean) => {
    const partidas = celdas.map((celda, i) => l.renglones(celda, anchos[i] - relleno * 2, tamano, encabezado))
    const alto = Math.max(...partidas.map((p) => p.length), 1) * interlinea + relleno * 2
    l.reservar(alto)
    if (encabezado) l.rect(MARGEN, l.y, UTIL, alto, { relleno: COLOR.marcaClara })
    let x = MARGEN
    partidas.forEach((lineas, i) => {
      lineas.forEach((linea, k) => l.pintarRenglon(linea, x + relleno, l.y + relleno + k * interlinea, tamano))
      x += anchos[i]
    })
    l.y += alto
    l.linea(MARGEN, l.y, MARGEN + UTIL)
  }
  l.linea(MARGEN, l.y, MARGEN + UTIL)
  fila(b.columnas, true)
  b.filas.forEach((f) => fila(f, false))
  l.y += 8
}

function bloque(l: Lienzo, b: BloqueContrato): void {
  switch (b.tipo) {
    case "parrafo":
      l.texto(b.texto)
      l.y += 6
      return
    case "lista":
      for (const item of b.items) {
        l.reservar(13.5)
        l.pagina.drawText("•", { x: MARGEN + 4, y: ALTO - l.y - 9.5, size: 9.5, font: l.normal, color: COLOR.marca })
        l.texto(item, { x: MARGEN + 16 })
        l.y += 2.5
      }
      l.y += 4
      return
    case "tabla":
      tabla(l, b)
      return
    case "opciones":
      for (const o of b.items) {
        l.reservar(13.5)
        const lado = 9
        l.rect(MARGEN + 2, l.y + 1.5, lado, lado, o.marcada ? { relleno: COLOR.marca, borde: COLOR.marca } : { borde: COLOR.tenue })
        if (o.marcada) {
          // Palomita blanca dentro de la casilla
          const base = ALTO - l.y - 1.5 - lado
          const trazo = { thickness: 1.3, color: COLOR.blanco }
          l.pagina.drawLine({ start: { x: MARGEN + 4, y: base + 4.6 }, end: { x: MARGEN + 5.8, y: base + 2.6 }, ...trazo })
          l.pagina.drawLine({ start: { x: MARGEN + 5.8, y: base + 2.6 }, end: { x: MARGEN + 9.2, y: base + 6.8 }, ...trazo })
        }
        l.texto(o.texto, { x: MARGEN + 18 })
        l.y += 4
      }
      l.y += 3
      return
  }
}

function encabezado(l: Lienzo, c: DocumentoContrato): void {
  const alto = 78
  l.rect(0, 0, ANCHO, alto, { relleno: COLOR.oscuro })
  l.rect(0, alto, ANCHO, 3, { relleno: COLOR.marca })
  l.pagina.drawText("BR TECH", { x: MARGEN, y: ALTO - 42, size: 17, font: l.negrita, color: COLOR.blanco })
  l.pagina.drawText("D I G I T A L   S Y S T E M S", { x: MARGEN, y: ALTO - 55, size: 6.5, font: l.negrita, color: hex("#C9B5F5") })
  const estado = winAnsi(c.estado)
  l.pagina.drawText(estado, {
    x: ANCHO - MARGEN - l.normal.widthOfTextAtSize(estado, 8.5),
    y: ALTO - 46,
    size: 8.5,
    font: l.normal,
    color: hex("#C9B5F5"),
  })

  l.y = alto + 30
  l.texto(c.titulo, { tamano: 19, negrita: true, interlinea: 24 })
  l.texto(c.subtitulo, { tamano: 10, color: COLOR.tenue })
  l.y += 14

  // Las partes, lado a lado
  const ancho = (UTIL - 14) / c.partes.length
  const arriba = l.y
  let abajo = arriba
  c.partes.forEach((parte, i) => {
    const x = MARGEN + i * (ancho + 14)
    l.y = arriba + 12
    l.texto(parte.rotulo.toUpperCase(), { x: x + 12, ancho: ancho - 24, tamano: 7, negrita: true, color: COLOR.marca })
    l.y += 2
    l.texto(parte.nombre, { x: x + 12, ancho: ancho - 24, tamano: 11, negrita: true })
    if (parte.detalle) l.texto(parte.detalle, { x: x + 12, ancho: ancho - 24, tamano: 8.5, color: COLOR.tenue })
    abajo = Math.max(abajo, l.y + 10)
  })
  c.partes.forEach((_, i) => l.rect(MARGEN + i * (ancho + 14), arriba, ancho, abajo - arriba, { borde: COLOR.linea }))
  l.y = abajo + 8
}

function firmas(l: Lienzo, c: DocumentoContrato): void {
  const columnas = 2
  const separacion = 14
  const ancho = (UTIL - separacion) / columnas
  const alto = 124
  l.y += 6
  l.reservar(alto + 30)
  l.texto("Firmas", { tamano: 11.5, negrita: true, color: COLOR.marcaProfunda })
  l.y += 6
  c.firmas.forEach((f, i) => {
    const col = i % columnas
    if (col === 0 && i > 0) l.y += alto + separacion
    if (col === 0) l.reservar(alto)
    const x = MARGEN + col * (ancho + separacion)
    const arriba = l.y
    l.rect(x, arriba, ancho, alto, { borde: COLOR.linea })
    const rotulo = winAnsi(f.rotulo.toUpperCase())
    l.pagina.drawText(rotulo, { x: x + 12, y: ALTO - arriba - 18, size: 7, font: l.negrita, color: COLOR.marca })
    const renglon = arriba + 84
    if (f.trazo) {
      // El trazo se dibujó en un lienzo de LIENZO_FIRMA; aquí se escala a la caja
      const escala = Math.min((ancho - 60) / LIENZO_FIRMA.ancho, 58 / LIENZO_FIRMA.alto)
      l.pagina.drawSvgPath(f.trazo, {
        x: x + 12,
        y: ALTO - (renglon - LIENZO_FIRMA.alto * escala + 12),
        scale: escala,
        borderColor: COLOR.texto,
        borderWidth: 1.6 / escala / 2,
      })
    } else if (!f.nota || f.nota !== "Sin firmar") {
      // Sin trazo dibujado: su nombre en cursiva hace de firma
      l.pagina.drawText(winAnsi(f.nombre), { x: x + 12, y: ALTO - renglon + 6, size: 15, font: l.cursiva, color: COLOR.texto })
    }
    l.linea(x + 12, renglon, x + ancho - 12, COLOR.tenue)
    l.pagina.drawText(winAnsi(f.nombre), { x: x + 12, y: ALTO - renglon - 14, size: 9.5, font: l.negrita, color: COLOR.texto })
    if (f.nota) l.pagina.drawText(winAnsi(f.nota), { x: x + 12, y: ALTO - renglon - 26, size: 8, font: l.normal, color: COLOR.tenue })
  })
  l.y += alto + 10
}

export class GeneradorPdfContratoPdfLib implements GeneradorPdfContrato {
  async generar(c: DocumentoContrato): Promise<Uint8Array> {
    const doc = await PDFDocument.create()
    doc.setTitle(`${c.titulo} · ${c.subtitulo}`)
    doc.setAuthor("BR TECH Digital Systems")
    doc.setLanguage("es-MX")
    const l = new Lienzo(
      doc,
      await doc.embedFont(StandardFonts.Helvetica),
      await doc.embedFont(StandardFonts.HelveticaBold),
      await doc.embedFont(StandardFonts.HelveticaOblique),
    )

    encabezado(l, c)
    for (const s of c.secciones) {
      // El título nunca se queda solo al pie de la página
      l.y += 8
      l.reservar(48)
      l.texto(s.titulo, { tamano: 11.5, negrita: true, color: COLOR.marcaProfunda })
      l.y += 5
      s.bloques.forEach((b) => bloque(l, b))
    }
    firmas(l, c)

    // Pie con la numeración, ya que se sabe cuántas páginas son
    const paginas = doc.getPages()
    paginas.forEach((pagina, i) => {
      const y = PIE - 16
      pagina.drawLine({ start: { x: MARGEN, y: y + 12 }, end: { x: ANCHO - MARGEN, y: y + 12 }, thickness: 0.6, color: COLOR.linea })
      pagina.drawText(winAnsi(`${c.titulo} · ${c.subtitulo}`), { x: MARGEN, y, size: 7.5, font: l.normal, color: COLOR.tenue })
      const numero = `Página ${i + 1} de ${paginas.length}`
      pagina.drawText(numero, {
        x: ANCHO - MARGEN - l.normal.widthOfTextAtSize(numero, 7.5),
        y,
        size: 7.5,
        font: l.normal,
        color: COLOR.tenue,
      })
    })

    return doc.save()
  }
}
