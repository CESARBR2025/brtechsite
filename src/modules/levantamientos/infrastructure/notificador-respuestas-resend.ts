import { Resend } from "resend"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import type {
  NotificadorRespuestas,
  RespuestasCompletas,
} from "../domain/notificador-respuestas"
import { plantillaCorreoRespuestas } from "./plantilla-correo-respuestas"

/** Adaptador: manda a BR TECH las respuestas del cliente por correo vía Resend. */
export class NotificadorRespuestasResend implements NotificadorRespuestas {
  async respuestasCompletas(datos: RespuestasCompletas): Promise<void> {
    const env = getEnv()
    if (!env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no está configurada en el servidor")
    }
    const base = env.SITE_URL.replace(/\/$/, "")
    const correo = plantillaCorreoRespuestas(datos, {
      panel: `${base}/panel/levantamientos/${datos.levantamientoId}`,
      diagnostico: `${base}/d/${datos.slug}`,
    })
    const respuesta = await new Resend(env.RESEND_API_KEY).emails.send({
      from: "BR TECH · Diagnósticos <onboarding@resend.dev>",
      to: [env.CONTACT_TO_EMAIL],
      subject: correo.asunto,
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
