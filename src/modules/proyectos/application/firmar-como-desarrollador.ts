import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { RepositorioProyectos } from "../domain/repositorio-proyectos"
import { proyectoPublicado } from "./obtener-propuesta-publica"

/**
 * El desarrollador firma la propuesta publicada (desde su página, con sesión
 * del panel). Volver a firmar reemplaza la firma anterior.
 */
export class FirmarComoDesarrollador {
  constructor(
    private readonly repo: RepositorioProyectos,
    private readonly reloj: Reloj,
  ) {}

  async ejecutar(slug: string, trazo: string): Promise<void> {
    const proyecto = await proyectoPublicado(this.repo, slug)
    proyecto.firmarComoDesarrollador(trazo, this.reloj)
    await this.repo.guardar(proyecto)
  }
}
