import "server-only"

import { getPool } from "@/src/modules/shared/infrastructure/db/pool"
import { generadorIdCrypto } from "@/src/modules/shared/infrastructure/generador-id-crypto"
import { relojSistema } from "@/src/modules/shared/infrastructure/reloj-sistema"
import { AceptarPropuesta } from "../application/aceptar-propuesta"
import { CambiarEstadoProyecto } from "../application/cambiar-estado-proyecto"
import { ConsultarProyectos } from "../application/consultar-proyectos"
import { CrearProyecto } from "../application/crear-proyecto"
import { FirmarComoDesarrollador } from "../application/firmar-como-desarrollador"
import { GuardarProyecto } from "../application/guardar-proyecto"
import { ObtenerContratoPdf } from "../application/obtener-contrato"
import { ObtenerPropuestaPublica } from "../application/obtener-propuesta-publica"
import { fuenteLevantamientos } from "./fuente-levantamientos"
import { GeneradorPdfContratoPdfLib } from "./generador-pdf-contrato"
import { generadorSlugProyectoNanoid } from "./generador-slug-nanoid"
import { NotificadorAceptacionResend } from "./notificador-aceptacion-resend"
import { RepositorioProyectosPostgres } from "./repositorio-proyectos-postgres"

/**
 * Raíz de composición del módulo proyectos. La capa de presentación solo
 * importa de aquí; nunca instancia adaptadores por su cuenta.
 */
function construir() {
  const repo = new RepositorioProyectosPostgres(getPool())
  const generadorPdf = new GeneradorPdfContratoPdfLib()
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
    firmarComoDesarrollador: new FirmarComoDesarrollador(repo, relojSistema),
    obtenerContratoPdf: new ObtenerContratoPdf(repo, generadorPdf),
    aceptarPropuesta: new AceptarPropuesta(repo, new NotificadorAceptacionResend(), generadorPdf, relojSistema),
  }
}

// Caché a nivel de módulo (no en globalThis): así una recarga en caliente
// reconstruye los casos de uso con el código nuevo. El pool ya vive en globalThis.
let instancia: ReturnType<typeof construir> | null = null

export function proyectos() {
  instancia ??= construir()
  return instancia
}
