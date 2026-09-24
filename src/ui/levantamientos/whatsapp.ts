import { nombreDePila } from "@/src/ui/formato"

/**
 * Enlace de WhatsApp para mandar el diagnóstico al cliente. Si el contacto
 * capturado es un celular mexicano, el chat abre directo con él; si no,
 * WhatsApp pide elegir el contacto.
 */
export function enlaceEnviarDiagnostico(
  destinatario: { nombre: string | null; telefono: string | null },
  url: string,
): string {
  const digitos = (destinatario.telefono ?? "").replace(/\D/g, "")
  const numero =
    digitos.length === 10
      ? `52${digitos}`
      : digitos.length === 12 && digitos.startsWith("52")
        ? digitos
        : ""
  const saludo = destinatario.nombre ? `Hola ${nombreDePila(destinatario.nombre)}` : "Hola"
  const texto =
    `${saludo}, gracias por tu tiempo. ` +
    `Te comparto el diagnóstico de tu proyecto con lo que platicamos en la reunión: ${url}`
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}
