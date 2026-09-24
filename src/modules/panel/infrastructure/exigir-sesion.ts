import "server-only"

import { cookies } from "next/headers"
import { OperacionNoPermitida } from "@/src/modules/shared/domain/errors"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import { NOMBRE_COOKIE_SESION, tokenSesionValido } from "./sesion"

/**
 * Las server actions se pueden invocar con un POST a cualquier ruta, no solo
 * bajo /panel, así que el proxy no basta: cada acción del panel valida la
 * cookie de sesión por su cuenta.
 */
export async function exigirSesionPanel(): Promise<void> {
  const token = (await cookies()).get(NOMBRE_COOKIE_SESION)?.value
  if (!(await tokenSesionValido(token, getEnv().PANEL_SESSION_SECRET))) {
    throw new OperacionNoPermitida("La sesión expiró. Vuelve a iniciar sesión.")
  }
}
