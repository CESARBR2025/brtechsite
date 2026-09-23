import { Resend } from "resend"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import type { MensajeContacto } from "../domain/mensaje-contacto"
import type { NotificadorContacto } from "../domain/notificador-contacto"
import { plantillaCorreoContacto } from "./plantilla-correo-contacto"

/** Adaptador: entrega el mensaje de contacto por correo vía Resend. */
export class NotificadorResend implements NotificadorContacto {
  async enviar(mensaje: MensajeContacto): Promise<void> {
    const env = getEnv()
    if (!env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no está configurada en el servidor")
    }

    const correo = plantillaCorreoContacto(mensaje)
    const resend = new Resend(env.RESEND_API_KEY)
    const respuesta = await resend.emails.send({
      from: "BR TECH · Sitio web <onboarding@resend.dev>",
      to: [env.CONTACT_TO_EMAIL],
      subject: correo.asunto,
      replyTo: mensaje.email,
      html: correo.html,
      text: correo.texto,
    })

    if (respuesta.error) {
      throw new Error(
        `Resend rechazó el envío [${respuesta.error.name}]: ${respuesta.error.message}`,
      )
    }
  }
}
