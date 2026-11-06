import { describe, expect, it } from "vitest"
import type { CategoriaEquipo, ClaseConcepto, TipoPieza } from "../domain/clasificacion"
import { derivarEscena, etiquetaDe, type ConceptoClasificado, type EscenaServicio } from "./escena-servicio"

function concepto(clase: ClaseConcepto, texto: string, datos: Partial<ConceptoClasificado> = {}): ConceptoClasificado {
  return { clase, concepto: texto, pieza: null, etiqueta: null, piezaAnterior: null, ...datos }
}
const mantenimiento = concepto("mantenimiento", "Mantenimiento interno del equipo", { etiqueta: "Mantenimiento" })
const sistema = concepto("sistema", "Instalación de Windows 11")
const programas = [concepto("programa", "Office LTSC"), concepto("programa", "Antivirus ESET", { etiqueta: "Antivirus" }), concepto("programa", "Zoom y navegador", { etiqueta: "Zoom" })]
const manoDeObra = concepto("mano_de_obra", "Instalación de la pieza")
const pieza = (tipo: TipoPieza, nombre: string, anterior: string) => concepto("pieza", nombre, { pieza: tipo, etiqueta: nombre, piezaAnterior: anterior })
const disco = pieza("disco", "SSD 240 GB", "disco mecánico")
const ram = pieza("ram", "RAM 8 GB", "RAM de 4 GB")
const bateria = pieza("bateria", "Batería nueva", "batería agotada")
const fuente = pieza("fuente", "Fuente 600 W", "fuente dañada")
const ventilador = pieza("ventilador", "Ventilador nuevo", "ventilador desgastado")
const piezasArmado = (["placa", "procesador", "ram", "video", "disco", "fuente", "gabinete"] as const).map((tipo) => concepto("pieza", tipo, { pieza: tipo }))

type Caso = { nombre: string; categoria: CategoriaEquipo; items: ConceptoClasificado[]; esperado: Pick<EscenaServicio, "interior" | "pantalla" | "principal" | "pieza" | "chips"> }
const casos: Caso[] = [
  { nombre: "Mari", categoria: "laptop", items: [mantenimiento, disco, sistema], esperado: {
    interior: "pieza", pantalla: "sistema", principal: "pieza", pieza: { tipo: "disco", nuevo: "SSD 240 GB", anterior: "disco mecánico" }, chips: ["Mantenimiento", "SSD 240 GB", "Windows 11"],
  } },
  { nombre: "Luis", categoria: "laptop", items: [mantenimiento], esperado: {
    interior: "mantenimiento", pantalla: "logo", principal: "mantenimiento", pieza: null, chips: ["Mantenimiento"],
  } },
  { nombre: "Carmen", categoria: "laptop", items: [sistema], esperado: {
    interior: null, pantalla: "sistema", principal: "sistema", pieza: null, chips: ["Windows 11"],
  } },
  { nombre: "Jorge", categoria: "todo_en_uno", items: programas, esperado: {
    interior: null, pantalla: "programas", principal: "programa", pieza: null, chips: ["Office LTSC", "Antivirus", "Zoom"],
  } },
  { nombre: "Pato", categoria: "laptop", items: [sistema, ...programas], esperado: {
    interior: null, pantalla: "sistema_y_programas", principal: "sistema", pieza: null, chips: ["Windows 11", "Office LTSC", "Antivirus", "Zoom"],
  } },
  { nombre: "Diego", categoria: "pc", items: [...piezasArmado, concepto("ensamble", "Armado, cableado y pruebas"), sistema], esperado: {
    interior: "ensamble", pantalla: "sistema", principal: "ensamble", pieza: null, chips: ["7 piezas", "Armado y pruebas", "Windows 11"],
  } },
  { nombre: "Laura", categoria: "pc", items: [mantenimiento, ram], esperado: {
    interior: "pieza", pantalla: "logo", principal: "pieza", pieza: { tipo: "ram", nuevo: "RAM 8 GB", anterior: "RAM de 4 GB" }, chips: ["Mantenimiento", "RAM 8 GB"],
  } },
  { nombre: "Ana", categoria: "laptop", items: [bateria, manoDeObra], esperado: {
    interior: "pieza", pantalla: "logo", principal: "pieza", pieza: { tipo: "bateria", nuevo: "Batería nueva", anterior: "batería agotada" }, chips: ["Batería nueva"],
  } },
  { nombre: "Roberto", categoria: "pc", items: [fuente, manoDeObra], esperado: {
    interior: "pieza", pantalla: "logo", principal: "pieza", pieza: { tipo: "fuente", nuevo: "Fuente 600 W", anterior: "fuente dañada" }, chips: ["Fuente 600 W"],
  } },
  { nombre: "Pablo", categoria: "laptop", items: [mantenimiento, ventilador], esperado: {
    interior: "pieza", pantalla: "logo", principal: "pieza", pieza: { tipo: "ventilador", nuevo: "Ventilador nuevo", anterior: "ventilador desgastado" }, chips: ["Mantenimiento", "Ventilador nuevo"],
  } },
  { nombre: "Sofía", categoria: "pc", items: [concepto("diagnostico", "Diagnóstico completo del equipo", { pieza: "placa" })], esperado: {
    interior: "diagnostico", pantalla: "logo", principal: "diagnostico", pieza: null, chips: [],
  } },
  { nombre: "Elena", categoria: "todo_en_uno", items: [concepto("otro", "Configuración de impresora y red Wi-Fi", { etiqueta: "Configuración" })], esperado: {
    interior: null, pantalla: "logo", principal: "otro", pieza: null, chips: ["Configuración"],
  } },
]

describe("derivarEscena", () => {
  it.each(casos)("caso de la maqueta: $nombre", ({ categoria, items, esperado }) => {
    expect(derivarEscena(categoria, items)).toMatchObject(esperado)
  })

  it("es determinista y no muta la entrada", () => {
    const items = Object.freeze([Object.freeze({ ...disco }), Object.freeze({ ...sistema })])
    const copia = JSON.stringify(items)
    expect(derivarEscena("laptop", items)).toEqual(derivarEscena("laptop", items))
    expect(JSON.stringify(items)).toBe(copia)
  })

  it("sin conceptos no es solo diagnóstico", () => {
    expect(derivarEscena("laptop", [])).toEqual({ categoria: "laptop", principal: "otro", interior: null, pantalla: "logo", pieza: null, falla: null, sistema: null, programas: [], totalProgramas: 0, piezasEnsamble: 0, soloDiagnostico: false, chips: [] })
  })

  it("otro siempre usa escena genérica, aun con mantenimiento o diagnóstico", () => {
    expect(derivarEscena("otro", [mantenimiento, sistema])).toMatchObject({ interior: null, principal: "mantenimiento", pantalla: "sistema" })
    expect(derivarEscena("otro", [concepto("diagnostico", "Revisión")])).toMatchObject({ interior: null, principal: "diagnostico", soloDiagnostico: true })
  })

  it("toma la primera pieza compatible con imagen suelta", () => {
    const items = [bateria, concepto("pieza", "Placa", { pieza: "placa" }), ram, disco]
    expect(derivarEscena("pc", items).pieza?.tipo).toBe("ram")
    expect(derivarEscena("todo_en_uno", [bateria, fuente, disco]).pieza?.tipo).toBe("disco")
    expect(derivarEscena("pc", [items[1], mantenimiento])).toMatchObject({ principal: "pieza", interior: "mantenimiento", pieza: null })
  })

  it.each([
    ["disco", "disco anterior"], ["ram", "memoria anterior"], ["bateria", "batería anterior"],
    ["ventilador", "ventilador anterior"], ["fuente", "fuente anterior"],
  ] as const)("anterior por defecto para %s", (tipo, anterior) => {
    expect(derivarEscena(tipo === "fuente" ? "pc" : "laptop", [concepto("pieza", "Nueva", { pieza: tipo })]).pieza).toEqual({ tipo, nuevo: "Nueva", anterior })
  })

  it("solo el primer diagnóstico decide la falla, incluso si no especifica pieza", () => {
    const diagnosticos = [concepto("diagnostico", "Revisión"), concepto("diagnostico", "Falla", { pieza: "ram" })]
    expect(derivarEscena("pc", diagnosticos)).toMatchObject({ soloDiagnostico: true, falla: null, chips: [] })
    expect(derivarEscena("pc", diagnosticos.slice(1)).falla).toBe("ram")
    expect(derivarEscena("pc", [...diagnosticos, manoDeObra])).toMatchObject({ soloDiagnostico: false, principal: "otro", interior: null })
  })

  it("limita programas a tres, conserva el total y deduplica chips hasta seis", () => {
    const items = [sistema, ...programas, ...programas, concepto("programa", "Adobe"), concepto("programa", "AutoCAD"), concepto("programa", "Otro programa")]
    expect(derivarEscena("pc", items)).toMatchObject({ sistema: "Windows 11", programas: ["Office LTSC", "Antivirus", "Zoom"], totalProgramas: 9, chips: ["Windows 11", "Office LTSC", "Antivirus", "Zoom", "Adobe", "AutoCAD"] })
  })

  it("el ensamble solo se activa en PC y cuenta conceptos de pieza", () => {
    const items = [...piezasArmado, concepto("ensamble", "Armado"), sistema, ...programas]
    expect(derivarEscena("pc", items)).toMatchObject({ piezasEnsamble: 7, pieza: null, chips: ["7 piezas", "Armado y pruebas", "Windows 11", "Office LTSC", "Antivirus", "Zoom"] })
    expect(derivarEscena("laptop", [concepto("ensamble", "Armado")])).toMatchObject({ principal: "otro", interior: null, piezasEnsamble: 0 })
  })
})

describe("etiquetaDe", () => {
  it.each(["Instalación de Windows 11", "Instalación del Windows 11", "Activación de Windows 11", "Instalación y activación de Windows 11", "Instalacion de Windows 11"])("quita el prefijo de %s", (texto) => {
    expect(etiquetaDe(concepto("sistema", texto))).toBe("Windows 11")
  })

  it("prioriza etiqueta propia y recorta siempre a 24 caracteres", () => {
    expect(etiquetaDe(concepto("programa", "Instalación de Office", { etiqueta: "Mi Office" }))).toBe("Mi Office")
    for (const clase of ["programa", "otro"] as const) {
      expect(etiquetaDe(concepto(clase, "a".repeat(24)))).toBe("a".repeat(24))
      expect(etiquetaDe(concepto(clase, "a".repeat(25)))).toBe(`${"a".repeat(23)}…`)
    }
    expect(etiquetaDe(concepto("pieza", "Instalación de RAM"))).toBe("Instalación de RAM")
    expect(etiquetaDe(concepto("otro", "Servicio", { etiqueta: "a".repeat(32) }))).toHaveLength(24)
  })
})
