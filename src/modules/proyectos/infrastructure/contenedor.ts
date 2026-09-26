import "server-only"

import { getPool } from "@/src/modules/shared/infrastructure/db/pool"
import { generadorIdCrypto } from "@/src/modules/shared/infrastructure/generador-id-crypto"
import { relojSistema } from "@/src/modules/shared/infrastructure/reloj-sistema"
import { AceptarPropuesta } from "../application/aceptar-propuesta"
import { CambiarEstadoProyecto } from "../application/cambiar-estado-proyecto"
import { ConsultarProyectos } from "../application/consultar-proyectos"
import { CrearProyecto } from "../application/crear-proyecto"
import { GuardarProyecto } from "../application/guardar-proyecto"
import { ObtenerPropuestaPublica } from "../application/obtener-propuesta-publica"
import { fuenteLevantamientos } from "./fuente-levantamientos"
import { generadorSlugProyectoNanoid } from "./generador-slug-nanoid"
import { NotificadorAceptacionResend } from "./notificador-aceptacion-resend"
import { RepositorioProyectosPostgres } from "./repositorio-proyectos-postgres"

/**
 * Raíz de composición del módulo proyectos. La capa de presentación solo
 * importa de aquí; nunca instancia adaptadores por su cuenta.
 */
function construir() {
  const repo = new RepositorioProyectosPostgres(getPool())
  return {
    crearProyecto: new CrearProyecto(
      repo,
      fuenteLevantamientos,
      generadorIdCrypto,
      generadorSlugProyectoNanoid,
      relojSistema,
    ),
    guardarProyecto: new GuardarProyecto(repo, relojSistema),
    cambiarEstado: new CambiarEstadoProyecto(repo, relojSistema),
    consultarProyectos: new ConsultarProyectos(repo, fuenteLevantamientos),
    obtenerPropuestaPublica: new ObtenerPropuestaPublica(repo),
    aceptarPropuesta: new AceptarPropuesta(repo, new NotificadorAceptacionResend(), relojSistema),
  }
}

// Caché a nivel de módulo (no en globalThis): así una recarga en caliente
// reconstruye los casos de uso con el código nuevo. El pool ya vive en globalThis.
let instancia: ReturnType<typeof construir> | null = null

export function proyectos() {
  instancia ??= construir()
  return instancia
}
