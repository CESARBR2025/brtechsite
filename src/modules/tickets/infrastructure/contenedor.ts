import "server-only"

import { getPool } from "@/src/modules/shared/infrastructure/db/pool"
import { generadorIdCrypto } from "@/src/modules/shared/infrastructure/generador-id-crypto"
import { relojSistema } from "@/src/modules/shared/infrastructure/reloj-sistema"
import { ActualizarTicket } from "../application/actualizar-ticket"
import { CambiarEstadoTicket } from "../application/cambiar-estado-ticket"
import { ConsultarTickets } from "../application/consultar-tickets"
import { CrearTicket } from "../application/crear-ticket"
import { ObtenerTicketPublico } from "../application/obtener-ticket-publico"
import { generadorSlugNanoid } from "./generador-slug-nanoid"
import { RepositorioTicketsPostgres } from "./repositorio-tickets-postgres"

/**
 * Raíz de composición del módulo tickets. La capa de presentación solo
 * importa de aquí; nunca instancia adaptadores por su cuenta.
 */
function construir() {
  const repo = new RepositorioTicketsPostgres(getPool())
  return {
    crearTicket: new CrearTicket(
      repo,
      generadorIdCrypto,
      generadorSlugNanoid,
      relojSistema,
    ),
    actualizarTicket: new ActualizarTicket(
      repo,
      generadorIdCrypto,
      relojSistema,
    ),
    cambiarEstado: new CambiarEstadoTicket(repo, relojSistema),
    consultarTickets: new ConsultarTickets(repo),
    obtenerTicketPublico: new ObtenerTicketPublico(repo),
  }
}

// Caché a nivel de módulo (no en globalThis): así una recarga en caliente
// reconstruye los casos de uso con el código nuevo. El pool, que sí debe
// sobrevivir a las recargas, ya vive en globalThis dentro de getPool().
let instancia: ReturnType<typeof construir> | null = null

export function tickets() {
  instancia ??= construir()
  return instancia
}
