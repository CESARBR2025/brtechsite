/** Lo que se avisa cuando el cliente termina de responder sus preguntas. */
export interface RespuestasCompletas {
  levantamientoId: string
  folio: string
  slug: string
  clienteNombre: string
  contactoNombre: string
  proyectoNombre: string | null
  /** true si ya estaban todas respondidas y el cliente cambió alguna. */
  esActualizacion: boolean
  preguntas: { grupo: string; texto: string; respuesta: string }[]
}

/** Puerto: avisa a BR TECH (correo, etc.) que llegaron las respuestas del cliente. */
export interface NotificadorRespuestas {
  respuestasCompletas(datos: RespuestasCompletas): Promise<void>
}
