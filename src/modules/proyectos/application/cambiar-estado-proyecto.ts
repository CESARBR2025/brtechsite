import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { Proyecto } from "../domain/proyecto"
import type { RepositorioProyectos } from "../domain/repositorio-proyectos"

/** Transiciones de estado del panel: cargar, aplicar la regla del dominio, guardar. */
export class CambiarEstadoProyecto {
  constructor(
    private readonly repo: RepositorioProyectos,
    private readonly reloj: Reloj,
  ) {}

  private async aplicar(id: string, accion: (p: Proyecto) => void): Promise<void> {
    const proyecto = await this.repo.obtenerPorId(id)
    if (!proyecto) throw new RecursoNoEncontrado(`No existe el proyecto ${id}`)
    accion(proyecto)
    await this.repo.guardar(proyecto)
  }

  publicar(id: string): Promise<void> {
    return this.aplicar(id, (p) => p.publicar(this.reloj))
  }

  despublicar(id: string): Promise<void> {
    return this.aplicar(id, (p) => p.despublicar(this.reloj))
  }

  archivar(id: string): Promise<void> {
    return this.aplicar(id, (p) => p.archivar(this.reloj))
  }

  retirarAceptacion(id: string): Promise<void> {
    return this.aplicar(id, (p) => p.retirarAceptacion(this.reloj))
  }
}
