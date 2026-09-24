import "server-only"

import { getPool } from "@/src/modules/shared/infrastructure/db/pool"
import { generadorIdCrypto } from "@/src/modules/shared/infrastructure/generador-id-crypto"
import { relojSistema } from "@/src/modules/shared/infrastructure/reloj-sistema"
import { CambiarEstadoLevantamiento } from "../application/cambiar-estado-levantamiento"
import { ConsultarLevantamientos } from "../application/consultar-levantamientos"
import { CrearLevantamiento } from "../application/crear-levantamiento"
import { GuardarLevantamiento } from "../application/guardar-levantamiento"
import { ObtenerDiagnosticoPublico } from "../application/obtener-diagnostico-publico"
import { generadorSlugLevantamientoNanoid } from "./generador-slug-nanoid"
import { RepositorioLevantamientosPostgres } from "./repositorio-levantamientos-postgres"

/**
 * Raíz de composición del módulo levantamientos. La capa de presentación solo
 * importa de aquí; nunca instancia adaptadores por su cuenta.
 */
function construir() {
  const repo = new RepositorioLevantamientosPostgres(getPool())
  return {
    crearLevantamiento: new CrearLevantamiento(
      repo,
      generadorIdCrypto,
      generadorSlugLevantamientoNanoid,
      relojSistema,
    ),
    guardarLevantamiento: new GuardarLevantamiento(repo, relojSistema),
    cambiarEstado: new CambiarEstadoLevantamiento(repo, relojSistema),
    consultarLevantamientos: new ConsultarLevantamientos(repo),
    obtenerDiagnosticoPublico: new ObtenerDiagnosticoPublico(repo),
  }
}

// Caché a nivel de módulo (no en globalThis): así una recarga en caliente
// reconstruye los casos de uso con el código nuevo. El pool, que sí debe
// sobrevivir a las recargas, ya vive en globalThis dentro de getPool().
let instancia: ReturnType<typeof construir> | null = null

export function levantamientos() {
  instancia ??= construir()
  return instancia
}
