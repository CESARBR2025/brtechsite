export interface ResultadoAccion {
  ok: boolean
  error?: string
  id?: string
  /** ISO del último guardado (lo muestra el indicador de guardado automático). */
  actualizadoEn?: string
}
