export const CATEGORIAS_EQUIPO = ["laptop", "pc", "todo_en_uno", "otro"] as const
export type CategoriaEquipo = (typeof CATEGORIAS_EQUIPO)[number]

export const CLASES_CONCEPTO = ["pieza", "mano_de_obra", "mantenimiento", "sistema", "programa", "ensamble", "diagnostico", "otro"] as const
export type ClaseConcepto = (typeof CLASES_CONCEPTO)[number]

export const TIPOS_PIEZA = ["disco", "ram", "bateria", "ventilador", "fuente", "placa", "procesador", "video", "gabinete"] as const
export type TipoPieza = (typeof TIPOS_PIEZA)[number]

/** Piezas que tienen sentido en cada equipo. */
export const PIEZAS_POR_CATEGORIA: Record<CategoriaEquipo, readonly TipoPieza[]> = {
  laptop: ["disco", "ram", "bateria", "ventilador", "placa"],
  pc: ["disco", "ram", "ventilador", "fuente", "placa", "procesador", "video", "gabinete"],
  todo_en_uno: ["disco", "ram", "ventilador", "placa"],
  otro: [],
}

export const ETIQUETA_CATEGORIA: Record<CategoriaEquipo, string> = { laptop: "Laptop", pc: "PC de escritorio", todo_en_uno: "Todo en uno", otro: "Otro equipo" }
export const ETIQUETA_CLASE: Record<ClaseConcepto, string> = { pieza: "Pieza", mano_de_obra: "Mano de obra", mantenimiento: "Mantenimiento", sistema: "Sistema operativo", programa: "Programa", ensamble: "Ensamble", diagnostico: "Diagnóstico", otro: "Otro" }
export const ETIQUETA_PIEZA: Record<TipoPieza, string> = { disco: "Disco", ram: "Memoria RAM", bateria: "Batería", ventilador: "Ventilador", fuente: "Fuente de poder", placa: "Tarjeta madre", procesador: "Procesador", video: "Tarjeta de video", gabinete: "Gabinete" }

export const esCategoriaEquipo = (v: string): v is CategoriaEquipo => (CATEGORIAS_EQUIPO as readonly string[]).includes(v)
export const esClaseConcepto = (v: string): v is ClaseConcepto => (CLASES_CONCEPTO as readonly string[]).includes(v)
export const esTipoPieza = (v: string): v is TipoPieza => (TIPOS_PIEZA as readonly string[]).includes(v)

export const LARGO_ETIQUETA = 32
export const GARANTIA_MAX_DIAS = 365
