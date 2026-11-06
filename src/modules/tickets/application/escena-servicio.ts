import { type CategoriaEquipo, type ClaseConcepto, type TipoPieza, PIEZAS_POR_CATEGORIA } from "../domain/clasificacion"

export type EscenaInterior = "pieza" | "mantenimiento" | "ensamble" | "diagnostico" | null
export type EscenaPantalla = "logo" | "sistema" | "programas" | "sistema_y_programas"
export type ClasePrincipal = "ensamble" | "diagnostico" | "pieza" | "mantenimiento" | "sistema" | "programa" | "otro"

export interface EscenaServicio {
  categoria: CategoriaEquipo
  principal: ClasePrincipal
  interior: EscenaInterior
  pantalla: EscenaPantalla
  /** Pieza protagonista de la escena "pieza". */
  pieza: { tipo: TipoPieza; nuevo: string; anterior: string } | null
  /** Pieza con falla en un diagnóstico (null = tarjeta madre). */
  falla: TipoPieza | null
  sistema: string | null
  programas: string[]
  totalProgramas: number
  piezasEnsamble: number
  soloDiagnostico: boolean
  chips: string[]
}

export interface ConceptoClasificado {
  concepto: string
  clase: ClaseConcepto
  pieza: TipoPieza | null
  etiqueta: string | null
  piezaAnterior: string | null
}

const ANTERIOR: Partial<Record<TipoPieza, string>> = {
  disco: "disco anterior", ram: "memoria anterior", bateria: "batería anterior",
  ventilador: "ventilador anterior", fuente: "fuente anterior",
}

export function etiquetaDe(item: ConceptoClasificado): string {
  let texto = item.etiqueta || item.concepto
  if (!item.etiqueta && (item.clase === "sistema" || item.clase === "programa")) {
    texto = texto.replace(/^(?:instalaci[oó]n y activaci[oó]n de|instalaci[oó]n del?|activaci[oó]n de)\s+/i, "")
  }
  return texto.length > 24 ? `${texto.slice(0, 23)}…` : texto
}

export function derivarEscena(categoria: CategoriaEquipo, items: readonly ConceptoClasificado[]): EscenaServicio {
  const tiene = (clase: ClaseConcepto) => items.some((item) => item.clase === clase)
  const soloDiagnostico = items.length > 0 && items.every((item) => item.clase === "diagnostico")
  const ensamble = categoria === "pc" && tiene("ensamble")
  const protagonista = ensamble ? undefined : items.find((item) => item.clase === "pieza" && item.pieza !== null &&
    PIEZAS_POR_CATEGORIA[categoria].includes(item.pieza) && ANTERIOR[item.pieza] !== undefined)
  const sistema = items.find((item) => item.clase === "sistema")
  const programas = items.filter((item) => item.clase === "programa")
  const piezasEnsamble = ensamble ? items.filter((item) => item.clase === "pieza").length : 0
  const chips = soloDiagnostico ? [] : ensamble
    ? [`${piezasEnsamble} piezas`, "Armado y pruebas", ...items.filter((item) => item.clase === "sistema" || item.clase === "programa").map(etiquetaDe)]
    : items.filter((item) => item.clase !== "mano_de_obra" && item.clase !== "diagnostico").map(etiquetaDe)

  return {
    categoria,
    principal: ensamble ? "ensamble" : soloDiagnostico ? "diagnostico" : tiene("pieza") ? "pieza" : tiene("mantenimiento") ? "mantenimiento" : sistema ? "sistema" : programas.length ? "programa" : "otro",
    interior: categoria === "otro" ? null : ensamble ? "ensamble" : soloDiagnostico ? "diagnostico" : protagonista ? "pieza" : tiene("mantenimiento") ? "mantenimiento" : null,
    pantalla: sistema && programas.length ? "sistema_y_programas" : sistema ? "sistema" : programas.length ? "programas" : "logo",
    pieza: protagonista?.pieza ? {
      tipo: protagonista.pieza,
      nuevo: etiquetaDe(protagonista),
      anterior: protagonista.piezaAnterior || ANTERIOR[protagonista.pieza]!,
    } : null,
    falla: items.find((item) => item.clase === "diagnostico")?.pieza ?? null,
    sistema: sistema ? etiquetaDe(sistema) : null,
    programas: programas.slice(0, 3).map(etiquetaDe),
    totalProgramas: programas.length,
    piezasEnsamble,
    soloDiagnostico,
    chips: [...new Set(chips)].slice(0, 6),
  }
}
