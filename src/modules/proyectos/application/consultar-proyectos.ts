import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { FuenteLevantamientos } from "../domain/puertos"
import type { FiltroProyectos, RepositorioProyectos } from "../domain/repositorio-proyectos"
import {
  aProyectoDetalleDTO,
  aProyectoResumenDTO,
  type ProyectoDetalleDTO,
  type ProyectoResumenDTO,
} from "./dtos"

/** Consultas del panel (cualquier estado). */
export class ConsultarProyectos {
  constructor(
    private readonly repo: RepositorioProyectos,
    private readonly levantamientos: FuenteLevantamientos,
  ) {}

  async listar(filtro?: FiltroProyectos): Promise<ProyectoResumenDTO[]> {
    const lista = await this.repo.listar(filtro)
    return lista.map(aProyectoResumenDTO)
  }

  async obtenerDetalle(id: string): Promise<ProyectoDetalleDTO> {
    const proyecto = await this.repo.obtenerPorId(id)
    if (!proyecto) throw new RecursoNoEncontrado(`No existe el proyecto ${id}`)
    return aProyectoDetalleDTO(proyecto)
  }

  /** Levantamientos que se pueden usar como punto de partida. */
  levantamientosDisponibles() {
    return this.levantamientos.listar()
  }

  /** Datos del levantamiento de origen para enlazarlo desde el panel. */
  async levantamientoDeOrigen(id: string) {
    const l = await this.levantamientos.obtener(id)
    return l ? { id: l.id, folio: l.folio, slug: l.slug } : null
  }
}
