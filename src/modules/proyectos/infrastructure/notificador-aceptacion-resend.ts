import { Resend } from "resend"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import type { NotificadorAceptacion, PropuestaAceptada } from "../domain/puertos"
import { plantillaCorreoAceptacion } from "./plantilla-correo-aceptacion"

/** Adaptador: avisa a BR TECH por correo (Resend) que el cliente aceptó la propuesta. */
export class NotificadorAceptacionResend implements NotificadorAceptacion {
  async propuestaAceptada(datos: PropuestaAceptada): Promise<void> {
    const env = getEnv()
    if (!env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no está configurada en el servidor")
    }
    const base = env.SITE_URL.replace(/\/$/, "")
    const correo = plantillaCorreoAceptacion(datos, {
      panel: `${base}/panel/proyectos/${datos.proyectoId}`,
      propuesta: `${base}/p/${datos.slug}`,
    })
    const respuesta = await new Resend(env.RESEND_API_KEY).emails.send({
      from: "BR TECH · Propuestas <onboarding@resend.dev>",
      to: [env.CONTACT_TO_EMAIL],
      subject: correo.asunto,
      html: correo.html,
      text: correo.texto,
    })
    if (respuesta.error) {
      throw new Error(`Resend rechazó el envío [${respuesta.error.name}]: ${respuesta.error.message}`)
    }
  }
}
