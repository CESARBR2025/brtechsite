/** Formas de entrada (primitivas) que la presentación pasa a los casos de uso. */

export interface ItemEntrada {
  clase: string
  pieza?: string | null
  etiqueta?: string | null
  piezaAnterior?: string | null
  concepto: string
  detalle?: string | null
  cantidad: number
  /** Precio unitario en unidades de moneda (p. ej. pesos), no centavos. */
  precioUnitario: number
}

export interface DatosTicketEntrada {
  cliente: { nombre: string; contacto?: string | null }
  equipo: { categoria: string; tipo?: string | null; detalle?: string | null }
  problemaReportado?: string | null
  diagnostico?: string | null
  trabajoRealizado?: string | null
  recomendaciones?: string | null
  notaGarantia?: string | null
  garantiaDias?: number | null
  moneda?: string
  /** Impuesto en unidades de moneda. */
  impuesto?: number
  /** Fecha del servicio en formato ISO "YYYY-MM-DD". */
  fechaServicio: string
  items: ItemEntrada[]
}
