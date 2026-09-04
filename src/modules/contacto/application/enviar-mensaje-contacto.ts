import { MensajeContacto } from "../domain/mensaje-contacto"
import type { NotificadorContacto } from "../domain/notificador-contacto"

export interface DatosMensajeEntrada {
  nombre: string
  email: string
  mensaje: string
}

export class EnviarMensajeContacto {
  constructor(private readonly notificador: NotificadorContacto) {}

  async ejecutar(datos: DatosMensajeEntrada): Promise<void> {
    const mensaje = MensajeContacto.crear(datos)
    await this.notificador.enviar(mensaje)
  }
}
