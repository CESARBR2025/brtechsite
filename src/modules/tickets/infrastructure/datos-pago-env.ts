import { getEnv, type Env } from "@/src/modules/shared/infrastructure/config/env"
import type { DatosPagoDTO } from "../application/dtos"
import { esClabeValida } from "../domain/clabe"

type EntornoPago = Pick<Env, "PAGO_BANCO" | "PAGO_TITULAR" | "PAGO_CLABE">

/** Configuración del servidor; el entorno se puede inyectar en las pruebas. */
export function obtenerDatosPago(entorno: EntornoPago = getEnv()): DatosPagoDTO | null {
  const banco = entorno.PAGO_BANCO?.trim()
  const titular = entorno.PAGO_TITULAR?.trim()
  const clabe = entorno.PAGO_CLABE?.trim()

  if (clabe && !esClabeValida(clabe)) {
    console.error("Datos de pago no disponibles: la CLABE configurada no es válida.")
    return null
  }
  if (!banco || !titular || !clabe) return null

  return { banco, titular, clabe }
}
