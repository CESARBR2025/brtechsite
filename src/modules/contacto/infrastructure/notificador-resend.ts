import { Resend } from "resend"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import type { MensajeContacto } from "../domain/mensaje-contacto"
import type { NotificadorContacto } from "../domain/notificador-contacto"

function plantilla(mensaje: MensajeContacto): string {
  return `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
      <h2 style="color: #111; margin-bottom: 20px;">Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${mensaje.nombre}</p>
      <p><strong>Correo:</strong> ${mensaje.email}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p><strong>Mensaje:</strong></p>
      <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px; color: #333;">${mensaje.mensaje}</p>
    </div>
  `
}

/** Adaptador: entrega el mensaje de contacto por correo vía Resend. */
export class NotificadorResend implements NotificadorContacto {
  async enviar(mensaje: MensajeContacto): Promise<void> {
    const env = getEnv()
    if (!env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no está configurada en el servidor")
    }

    const resend = new Resend(env.RESEND_API_KEY)
    const respuesta = await resend.emails.send({
      from: "Formulario Web <onboarding@resend.dev>",
      to: [env.CONTACT_TO_EMAIL],
      subject: `Nuevo mensaje de ${mensaje.nombre}`,
      replyTo: mensaje.email,
      html: plantilla(mensaje),
    })

    if (respuesta.error) {
      throw new Error(
        `Resend rechazó el envío [${respuesta.error.name}]: ${respuesta.error.message}`,
      )
    }
  }
}
