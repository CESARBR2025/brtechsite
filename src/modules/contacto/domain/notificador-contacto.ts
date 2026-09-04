import type { MensajeContacto } from "./mensaje-contacto"

/** Puerto: entrega el mensaje de contacto a donde deba llegar (correo, etc.). */
export interface NotificadorContacto {
  enviar(mensaje: MensajeContacto): Promise<void>
}
