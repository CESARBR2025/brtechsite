import { describe, it } from "vitest"
import { EnviarMensajeContacto } from "../application/enviar-mensaje-contacto"
import { NotificadorResend } from "./notificador-resend"

/**
 * Prueba de integración real contra la API de Resend. Envía un correo de
 * verdad a CONTACT_TO_EMAIL. Opt-in para no gastar cuota ni disparar correos
 * en cada `npm test`:
 *   RUN_EMAIL_TEST=1 npx dotenv -e .env.local -- vitest run resend.integration
 */
const activa = process.env.RUN_EMAIL_TEST === "1"

describe.skipIf(!activa)("NotificadorResend (integración)", () => {
  it(
    "envía un correo real vía Resend sin lanzar",
    async () => {
      const enviar = new EnviarMensajeContacto(new NotificadorResend())
      await enviar.ejecutar({
        nombre: "Prueba BR TECH",
        email: "prueba@brtechds.com",
        mensaje:
          "Correo de verificación automática: si llegó esto, Resend y la API key están bien configurados.",
      })
    },
    15_000,
  )
})
