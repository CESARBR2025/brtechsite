"use server"

import { ErrorDominio } from "@/src/modules/shared/domain/errors"
import { EnviarMensajeContacto } from "../application/enviar-mensaje-contacto"
import { NotificadorResend } from "./notificador-resend"

const enviarMensaje = new EnviarMensajeContacto(new NotificadorResend())

export interface ResultadoContacto {
  success: boolean
  error?: string
}

/** Server Action del formulario de contacto (adaptador primario). */
export async function enviarMensajeContacto(
  formData: FormData,
): Promise<ResultadoContacto> {
  try {
    await enviarMensaje.ejecutar({
      nombre: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      mensaje: String(formData.get("message") ?? ""),
    })
    return { success: true }
  } catch (err) {
    if (err instanceof ErrorDominio) {
      return { success: false, error: err.message }
    }
    console.error("[contacto] fallo al enviar mensaje:", err)
    return {
      success: false,
      error: "No se pudo enviar el mensaje. Intenta de nuevo más tarde.",
    }
  }
}
