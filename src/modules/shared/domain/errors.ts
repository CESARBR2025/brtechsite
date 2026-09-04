/**
 * Errores de dominio. La capa de infraestructura / presentación los traduce
 * a respuestas HTTP; el dominio nunca conoce HTTP.
 */

export class ErrorDominio extends Error {
  constructor(mensaje: string) {
    super(mensaje)
    this.name = new.target.name
  }
}

/** El recurso solicitado no existe o no es visible para quien lo pide. */
export class RecursoNoEncontrado extends ErrorDominio {}

/** La operación es inválida para el estado actual del agregado. */
export class OperacionNoPermitida extends ErrorDominio {}

/** Los datos de entrada no cumplen las invariantes del dominio. */
export class DatosInvalidos extends ErrorDominio {}
