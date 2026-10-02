import { z } from "zod"

/**
 * Configuración del servidor, validada al arrancar. Solo debe importarse
 * desde código de servidor (adaptadores, server actions, route handlers).
 */
const esquema = z.object({
  DATABASE_URL: z.string().url(),
  DB_POOL_MAX: z.coerce.number().int().positive().max(10).default(3),
  PANEL_PASSWORD: z.string().min(8, "PANEL_PASSWORD debe tener 8+ caracteres"),
  PANEL_SESSION_SECRET: z
    .string()
    .min(16, "PANEL_SESSION_SECRET debe tener 16+ caracteres"),
  SITE_URL: z.string().url().default("http://localhost:3000"),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_TO_EMAIL: z
    .string()
    .email()
    .default("barcenasrosalescesarivan@gmail.com"),
  /**
   * Remitente de los correos de propuestas. El de pruebas de Resend solo
   * entrega al dueño de la cuenta: para escribirle a un cliente hace falta un
   * remitente de un dominio verificado, p. ej. "BR TECH <propuestas@brtechds.com>".
   */
  CORREO_REMITENTE: z.string().min(3).default("BR TECH · Propuestas <onboarding@resend.dev>"),
})

export type Env = z.infer<typeof esquema>

let cache: Env | null = null

export function getEnv(): Env {
  if (cache) return cache
  const parsed = esquema.safeParse(process.env)
  if (!parsed.success) {
    const detalle = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n")
    throw new Error(`Variables de entorno inválidas:\n${detalle}`)
  }
  cache = parsed.data
  return cache
}
