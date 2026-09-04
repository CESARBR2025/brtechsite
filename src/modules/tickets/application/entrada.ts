/** Formas de entrada (primitivas) que la presentación pasa a los casos de uso. */

export interface ItemEntrada {
  concepto: string
  detalle?: string | null
  cantidad: number
  /** Precio unitario en unidades de moneda (p. ej. pesos), no centavos. */
  precioUnitario: number
}

export interface DatosTicketEntrada {
  cliente: { nombre: string; contacto?: string | null }
  equipo: { tipo: string; detalle?: string | null }
  problemaReportado?: string | null
  diagnostico?: string | null
  trabajoRealizado?: string | null
  recomendaciones?: string | null
  notaGarantia?: string | null
  moneda?: string
  /** Impuesto en unidades de moneda. */
  impuesto?: number
  /** Fecha del servicio en formato ISO "YYYY-MM-DD". */
  fechaServicio: string
  items: ItemEntrada[]
}
