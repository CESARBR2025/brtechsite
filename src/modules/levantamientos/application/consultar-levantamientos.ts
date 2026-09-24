import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type {
  FiltroLevantamientos,
  RepositorioLevantamientos,
} from "../domain/repositorio-levantamientos"
import {
  aLevantamientoDetalleDTO,
  aLevantamientoResumenDTO,
  type LevantamientoDetalleDTO,
  type LevantamientoResumenDTO,
} from "./dtos"

/** Consultas del panel (cualquier estado). */
export class ConsultarLevantamientos {
  constructor(private readonly repo: RepositorioLevantamientos) {}

  async listar(
    filtro?: FiltroLevantamientos,
  ): Promise<LevantamientoResumenDTO[]> {
    const lista = await this.repo.listar(filtro)
    return lista.map(aLevantamientoResumenDTO)
  }

  async obtenerDetalle(id: string): Promise<LevantamientoDetalleDTO> {
    const levantamiento = await this.repo.obtenerPorId(id)
    if (!levantamiento) {
      throw new RecursoNoEncontrado(`No existe el levantamiento ${id}`)
    }
    return aLevantamientoDetalleDTO(levantamiento)
  }
}
