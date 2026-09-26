/**
 * Datos de un levantamiento que el proyecto hereda al crearse. El módulo de
 * proyectos no conoce el agregado Levantamiento: solo esta vista.
 */
export interface OrigenLevantamiento {
  id: string
  folio: string
  slug: string
  clienteNombre: string
  clienteContacto: string | null
  proyectoNombre: string | null
  contactoNombre: string
  giro: string
  promesa: string
  objetivo: string
  problemas: string[]
  actores: { nombre: string; descripcion: string; dispositivos: string }[]
}

/** Puerto: lee levantamientos para crear un proyecto a partir de uno. */
export interface FuenteLevantamientos {
  obtener(id: string): Promise<OrigenLevantamiento | null>
  /** Opciones para el formulario de alta (los más recientes primero). */
  listar(): Promise<{ id: string; folio: string; clienteNombre: string; proyectoNombre: string | null }[]>
}

/** Lo que se avisa cuando el cliente acepta la propuesta. */
export interface PropuestaAceptada {
  proyectoId: string
  folio: string
  slug: string
  clienteNombre: string
  proyectoNombre: string | null
  aceptadaPor: string
  aceptadaEn: Date
  totalCentavos: number
  moneda: string
}

/** Puerto: avisa a BR TECH que el cliente aceptó la propuesta. */
export interface NotificadorAceptacion {
  propuestaAceptada(datos: PropuestaAceptada): Promise<void>
}
