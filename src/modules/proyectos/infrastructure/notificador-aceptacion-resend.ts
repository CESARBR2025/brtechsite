import { Resend } from "resend"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import type { ArchivoContrato, ContratoParaCliente, NotificadorAceptacion, PropuestaAceptada } from "../domain/puertos"
import { type CorreoAceptacion, plantillaCorreoAceptacion, plantillaCorreoContrato } from "./plantilla-correo-aceptacion"

/**
 * Adaptador: los correos de la aceptación por Resend. A BR TECH, el aviso de
 * que el cliente aceptó; al cliente, las gracias con su contrato adjunto.
 */
export class NotificadorAceptacionResend implements NotificadorAceptacion {
  async propuestaAceptada(datos: PropuestaAceptada): Promise<void> {
    const env = getEnv()
    const base = env.SITE_URL.replace(/\/$/, "")
    const correo = plantillaCorreoAceptacion(datos, {
      panel: `${base}/panel/proyectos/${datos.proyectoId}`,
      propuesta: `${base}/p/${datos.slug}`,
    })
    await this.enviar([env.CONTACT_TO_EMAIL], correo, datos.contrato)
  }

  async contratoParaCliente(datos: ContratoParaCliente): Promise<void> {
    const env = getEnv()
    const base = env.SITE_URL.replace(/\/$/, "")
    const correo = plantillaCorreoContrato(datos, {
      propuesta: `${base}/p/${datos.slug}`,
      contrato: `${base}/p/${datos.slug}/contrato`,
    })
    // Si el cliente responde, le llega a BR TECH aunque el remitente sea de solo envío
    await this.enviar([datos.correo], correo, datos.contrato, env.CONTACT_TO_EMAIL)
  }

  private async enviar(
    para: string[],
    correo: CorreoAceptacion,
    contrato: ArchivoContrato | null,
    responderA?: string,
  ): Promise<void> {
    const env = getEnv()
    if (!env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY no está configurada en el servidor")
    }
    const respuesta = await new Resend(env.RESEND_API_KEY).emails.send({
      from: env.CORREO_REMITENTE,
      to: para,
      replyTo: responderA,
      subject: correo.asunto,
      html: correo.html,
      text: correo.texto,
      attachments: contrato
        ? [{ filename: contrato.nombreArchivo, content: Buffer.from(contrato.pdf), contentType: "application/pdf" }]
        : undefined,
    })
    if (respuesta.error) {
      throw new Error(`Resend rechazó el envío [${respuesta.error.name}]: ${respuesta.error.message}`)
    }
  }
}
