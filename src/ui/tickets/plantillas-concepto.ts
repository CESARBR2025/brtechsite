import {
  CATEGORIAS_EQUIPO,
  type CategoriaEquipo,
  type ClaseConcepto,
  type TipoPieza,
} from "@/src/modules/tickets/domain/clasificacion"

export interface PlantillaConcepto {
  nombre: string
  concepto: string
  clase: ClaseConcepto
  pieza: TipoPieza | null
  categorias: readonly CategoriaEquipo[]
}

export const PLANTILLAS_CONCEPTO: readonly PlantillaConcepto[] = [
  { nombre: "Mantenimiento", concepto: "Mantenimiento interno del equipo", clase: "mantenimiento", pieza: null, categorias: CATEGORIAS_EQUIPO },
  { nombre: "Windows 11", concepto: "Instalación de Windows 11", clase: "sistema", pieza: null, categorias: CATEGORIAS_EQUIPO },
  { nombre: "Office", concepto: "Instalación de Office", clase: "programa", pieza: null, categorias: CATEGORIAS_EQUIPO },
  { nombre: "Antivirus", concepto: "Instalación de antivirus", clase: "programa", pieza: null, categorias: CATEGORIAS_EQUIPO },
  { nombre: "SSD", concepto: "SSD", clase: "pieza", pieza: "disco", categorias: ["laptop", "pc", "todo_en_uno"] },
  { nombre: "Memoria RAM", concepto: "Memoria RAM", clase: "pieza", pieza: "ram", categorias: ["laptop", "pc", "todo_en_uno"] },
  { nombre: "Batería", concepto: "Batería", clase: "pieza", pieza: "bateria", categorias: ["laptop"] },
  { nombre: "Ventilador", concepto: "Ventilador", clase: "pieza", pieza: "ventilador", categorias: ["laptop", "pc", "todo_en_uno"] },
  { nombre: "Fuente de poder", concepto: "Fuente de poder", clase: "pieza", pieza: "fuente", categorias: ["pc"] },
  { nombre: "Diagnóstico", concepto: "Diagnóstico completo", clase: "diagnostico", pieza: null, categorias: CATEGORIAS_EQUIPO },
  { nombre: "Armado de PC", concepto: "Armado de PC", clase: "ensamble", pieza: null, categorias: ["pc"] },
]
