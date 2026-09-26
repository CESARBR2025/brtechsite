import "server-only"

import { levantamientos } from "@/src/modules/levantamientos/infrastructure/contenedor"
import type { Dispositivo } from "@/src/modules/levantamientos/domain/contenido"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { FuenteLevantamientos, OrigenLevantamiento } from "../domain/puertos"

const DISPOSITIVO: Record<Dispositivo, string> = {
  celular: "Celular",
  tableta: "Tableta",
  laptop: "Laptop",
  computadora: "Computadora",
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Adaptador: lee levantamientos a través de los casos de uso de su módulo. */
export const fuenteLevantamientos: FuenteLevantamientos = {
  async obtener(id: string): Promise<OrigenLevantamiento | null> {
    if (!UUID.test(id)) return null
    let d
    try {
      d = await levantamientos().consultarLevantamientos.obtenerDetalle(id)
    } catch (err) {
      if (err instanceof RecursoNoEncontrado) return null
      throw err
    }
    const c = d.contenido
    return {
      id: d.id,
      folio: d.folio,
      slug: d.slug,
      clienteNombre: d.cliente.nombre,
      clienteContacto: d.cliente.contacto,
      proyectoNombre: d.proyectoNombre,
      contactoNombre: c.contexto.contactoNombre,
      giro: c.contexto.giro,
      promesa: c.contexto.promesa,
      objetivo: c.objetivos.map((o) => o.descripcion).join("\n"),
      problemas: [c.problema.situacionActual, c.problema.impacto].filter(Boolean),
      actores: c.actores.map((a) => ({
        nombre: a.nombre,
        descripcion: a.descripcion,
        dispositivos: a.dispositivos.map((x) => DISPOSITIVO[x]).join(", "),
      })),
    }
  },

  async listar() {
    const lista = await levantamientos().consultarLevantamientos.listar({ limite: 100 })
    return lista
      .filter((l) => l.estado !== "archivado")
      .map((l) => ({
        id: l.id,
        folio: l.folio,
        clienteNombre: l.clienteNombre,
        proyectoNombre: l.proyectoNombre,
      }))
  },
}
