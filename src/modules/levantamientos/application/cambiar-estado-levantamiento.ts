import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { Levantamiento } from "../domain/levantamiento"
import type { RepositorioLevantamientos } from "../domain/repositorio-levantamientos"

/** Transiciones de estado: cargar, aplicar la regla del dominio, guardar. */
export class CambiarEstadoLevantamiento {
  constructor(
    private readonly repo: RepositorioLevantamientos,
    private readonly reloj: Reloj,
  ) {}

  private async aplicar(
    id: string,
    accion: (l: Levantamiento) => void,
  ): Promise<void> {
    const levantamiento = await this.repo.obtenerPorId(id)
    if (!levantamiento) {
      throw new RecursoNoEncontrado(`No existe el levantamiento ${id}`)
    }
    accion(levantamiento)
    await this.repo.guardar(levantamiento)
  }

  publicar(id: string): Promise<void> {
    return this.aplicar(id, (l) => l.publicar(this.reloj))
  }

  despublicar(id: string): Promise<void> {
    return this.aplicar(id, (l) => l.despublicar(this.reloj))
  }

  archivar(id: string): Promise<void> {
    return this.aplicar(id, (l) => l.archivar(this.reloj))
  }

  confirmar(id: string, confirmado: boolean): Promise<void> {
    return this.aplicar(id, (l) => l.marcarConfirmado(confirmado, this.reloj))
  }
}
