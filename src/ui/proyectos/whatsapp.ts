import { nombreDePila } from "@/src/ui/formato"

/**
 * Enlace de WhatsApp para mandar la propuesta al cliente. Si el contacto es
 * un celular mexicano, el chat abre directo con él; si no, WhatsApp pide
 * elegir el contacto.
 */
export function enlaceEnviarPropuesta(
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
    `${saludo}, te comparto la propuesta de tu proyecto: alcance, calendario e inversión. ` +
    `Cuando la revises, puedes aceptarla ahí mismo: ${url}`
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}
