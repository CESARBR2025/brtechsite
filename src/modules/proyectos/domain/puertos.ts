import type { DocumentoContrato } from "./contrato"

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
  /** Lo acordado: el total, menos la bonificación si el cliente la tomó. */
  totalCentavos: number
  moneda: string
  /** Correo que dejó el cliente para recibir su contrato. */
  correoCliente: string | null
  /** Nombre de la bonificación que tomó (p. ej. "Caso de éxito"); null si no tomó o no había. */
  bonificacion: string | null
  /** El contrato firmado; null si no se pudo generar. */
  contrato: ArchivoContrato | null
}

/** El contrato en PDF, listo para adjuntar o descargar. */
export interface ArchivoContrato {
  nombreArchivo: string
  pdf: Uint8Array
}

/** Lo que se le envía al cliente cuando firma: su contrato y las gracias. */
export interface ContratoParaCliente {
  correo: string
  folio: string
  slug: string
  clienteNombre: string
  proyectoNombre: string | null
  /** Nombres de quienes firmaron. */
  firmantes: string
  totalCentavos: number
  moneda: string
  contrato: ArchivoContrato
}

/** Puerto: avisos por correo cuando el cliente acepta la propuesta. */
export interface NotificadorAceptacion {
  /** Avisa a BR TECH. */
  propuestaAceptada(datos: PropuestaAceptada): Promise<void>
  /** Le envía al cliente su contrato firmado. */
  contratoParaCliente(datos: ContratoParaCliente): Promise<void>
}

/** Puerto: pinta el contrato en PDF. */
export interface GeneradorPdfContrato {
  generar(contrato: DocumentoContrato): Promise<Uint8Array>
}
