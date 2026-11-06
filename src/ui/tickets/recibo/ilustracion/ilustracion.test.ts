import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import {
  derivarEscena, type EscenaInterior, type EscenaPantalla, type EscenaServicio,
} from "@/src/modules/tickets/application/escena-servicio"
import {
  CATEGORIAS_EQUIPO, PIEZAS_POR_CATEGORIA, type CategoriaEquipo, type TipoPieza,
} from "@/src/modules/tickets/domain/clasificacion"
import { Activador } from "./activador"
import { IlustracionServicio } from "./ilustracion-servicio"
import { PIEZAS_3D } from "./geometria"

const interiores: EscenaInterior[] = [null, "pieza", "mantenimiento", "diagnostico", "ensamble"]
const pantallas: EscenaPantalla[] = ["logo", "sistema", "programas", "sistema_y_programas"]

function escenario(categoria: CategoriaEquipo, interior: EscenaInterior, pantalla: EscenaPantalla): EscenaServicio {
  return {
    ...derivarEscena(categoria, []), interior, pantalla,
    pieza: interior === "pieza" ? { tipo: "ram", nuevo: "16 GB", anterior: "4 GB" } : null,
    sistema: pantalla === "sistema" || pantalla === "sistema_y_programas" ? "Windows 11" : null,
    programas: pantalla === "programas" || pantalla === "sistema_y_programas" ? ["Office", "Antivirus", "Zoom"] : [],
    totalProgramas: pantalla === "programas" || pantalla === "sistema_y_programas" ? 4 : 0,
    piezasEnsamble: interior === "ensamble" ? 6 : 0,
    soloDiagnostico: interior === "diagnostico",
  }
}

const renderizar = (escena: EscenaServicio, activa = true) => renderToStaticMarkup(createElement(IlustracionServicio, { escena, activa }))

function verificarImagenes(html: string) {
  const rutas = [...html.matchAll(/\bhref="([^"]+)"/g)].map(coincidencia => coincidencia[1])
  for (const ruta of rutas) {
    expect(ruta).toMatch(/^\/recibo\/3d\/[a-z-]+\.webp$/)
    expect(existsSync(resolve(process.cwd(), "public", `.${ruta}`))).toBe(true)
  }
  return rutas
}

describe("ilustración del servicio", () => {
  const combinaciones = CATEGORIAS_EQUIPO.flatMap(categoria => interiores.flatMap(interior =>
    pantallas.map(pantalla => ({ categoria, interior, pantalla }))))

  it.each(combinaciones)("renderiza $categoria / $interior / $pantalla sin valores inválidos", ({ categoria, interior, pantalla }) => {
    const html = renderizar(escenario(categoria, interior, pantalla))
    expect(html).not.toMatch(/undefined|NaN/)
    expect(html).toContain(`data-interior="${interior ?? "ninguno"}"`)
    expect(html).toContain(`data-pantalla="${pantalla}"`)
    expect(html).toContain('viewBox="0 0 520 400"')
    const rutas = verificarImagenes(html)
    if (categoria === "otro") {
      expect(rutas).toHaveLength(0)
      expect(html).not.toContain("matrix3d(")
    } else {
      expect(rutas.length).toBeGreaterThan(0)
      expect(html).toContain("matrix3d(")
      expect(html).toContain('viewBox="0 0 300 180"')
    }
  })

  it("reutiliza las imágenes anterior y nueva para cada pieza que aplica al equipo", () => {
    for (const categoria of CATEGORIAS_EQUIPO) {
      for (const tipo of PIEZAS_POR_CATEGORIA[categoria]) {
        if (!(tipo in PIEZAS_3D)) continue
        const escena = escenario(categoria, "pieza", "logo")
        escena.pieza = { tipo, anterior: "Pieza anterior", nuevo: "Pieza nueva" }
        const html = renderizar(escena)
        const rutas = verificarImagenes(html)
        for (const imagen of PIEZAS_3D[tipo as keyof typeof PIEZAS_3D]) {
          expect(rutas).toContain(`/recibo/3d/${imagen}.webp`)
        }
        expect(html).toContain("Antes: Pieza anterior")
        expect(html).toContain("Nuevo: Pieza nueva")
      }
    }
  })

  it("dibuja el mantenimiento con doce partículas deterministas y dos destellos", () => {
    const escena = escenario("laptop", "mantenimiento", "logo")
    const html = renderizar(escena)
    expect(renderizar(escena)).toBe(html)
    expect(html.match(/class="ilus-polvo"/g)).toHaveLength(12)
    expect(html.match(/class="ilus-destello"/g)).toHaveLength(2)
    expect(html).toContain("Antes: polvo acumulado")
    expect(html).toContain("Limpieza interna")
    expect(verificarImagenes(html)).toEqual(expect.arrayContaining([
      "/recibo/3d/ventilador-sucio.webp", "/recibo/3d/ventilador.webp",
    ]))
  })

  it.each([null, "ram", "gabinete"] as (TipoPieza | null)[])("marca la falla %s o la zona de placa de respaldo", falla => {
    const html = renderizar({ ...escenario("pc", "diagnostico", "logo"), falla })
    expect(html).not.toMatch(/undefined|NaN/)
    expect(html).toContain('class="ilus-marca-falla"')
    expect(html).toContain('stroke="#FCD34D"')
    expect(html).toContain(`Falla: ${falla === "ram" ? "memoria ram" : falla === "gabinete" ? "gabinete" : "tarjeta madre"}`)
  })

  it("compone la PC vacía, las seis piezas y la PC completa sin perder el total capturado", () => {
    const html = renderizar({ ...escenario("pc", "ensamble", "sistema_y_programas"), piezasEnsamble: 8 })
    const rutas = verificarImagenes(html)
    expect(rutas).toHaveLength(8)
    expect(rutas).toContain("/recibo/3d/pc-vacia.webp")
    expect(rutas).toContain("/recibo/3d/pc.webp")
    expect(html.match(/class="ilus-destello"/g)).toHaveLength(6)
    expect(html).toContain("8 piezas armadas")
  })

  it.each([
    ["logo", "Servicio completado"], ["sistema", "Windows 11 instalado"],
    ["programas", "4 programas instalados"], ["sistema_y_programas", "Sistema y programas listos"],
  ] as const)("muestra la pastilla final de %s sin interior y en otro equipo", (pantalla, texto) => {
    for (const categoria of ["pc", "otro"] as const) {
      const html = renderizar(escenario(categoria, null, pantalla))
      expect(html).toContain(texto)
    }
  })

  it("limita las tarjetas a tres programas y conserva el número total en la pastilla", () => {
    const html = renderizar({ ...escenario("laptop", null, "programas"), programas: ["Office", "Antivirus", "Zoom", "Cuarto"] })
    expect(html.match(/class="ilus-app"/g)).toHaveLength(3)
    expect(html).toContain("Programas instalados")
    expect(html).not.toContain("Cuarto")
    expect(html).toContain("4 programas instalados")
  })

  it("escapa los textos capturados en piezas, sistema y programas", () => {
    const escena = escenario("laptop", "pieza", "sistema_y_programas")
    const texto = '<script>alert("dato")</script>'
    const html = renderizar({ ...escena, sistema: texto, programas: [texto], pieza: { tipo: "ram", anterior: texto, nuevo: texto } })
    expect(html).not.toContain("<script>")
    expect(html).toContain("&lt;script&gt;")
  })

  it("expone la activación y entrega el respaldo sin JavaScript dentro del componente", () => {
    const escena = escenario("laptop", null, "logo")
    expect(renderizar(escena)).toContain('data-activa=""')
    expect(renderizar(escena, false)).not.toContain("data-activa")
    expect(renderizar(escena)).toContain("<noscript><style>")
    const envolver = (siempre: boolean) => renderToStaticMarkup(createElement(Activador, { siempre }, createElement("span", null, "Ilustración")))
    expect(envolver(false)).toBe('<div class="ilus"><span>Ilustración</span></div>')
    expect(envolver(true)).toBe('<div class="ilus" data-activa=""><span>Ilustración</span></div>')
  })
})
