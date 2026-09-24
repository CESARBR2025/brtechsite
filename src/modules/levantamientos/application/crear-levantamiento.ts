import type { GeneradorId } from "@/src/modules/shared/domain/id"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import { Levantamiento } from "../domain/levantamiento"
import type { RepositorioLevantamientos } from "../domain/repositorio-levantamientos"
import type { GeneradorSlugLevantamiento } from "../domain/slug-levantamiento"
import { aDatosGenerales, type DatosGeneralesEntrada } from "./entrada"

export interface ResultadoCrearLevantamiento {
  id: string
  folio: string
  slug: string
}

/** Abre un levantamiento al iniciar la reunión: solo datos generales. */
export class CrearLevantamiento {
  constructor(
    private readonly repo: RepositorioLevantamientos,
    private readonly generadorId: GeneradorId,
    private readonly generadorSlug: GeneradorSlugLevantamiento,
    private readonly reloj: Reloj,
  ) {}

  async ejecutar(
    datos: DatosGeneralesEntrada & { contactoNombre?: string | null },
  ): Promise<ResultadoCrearLevantamiento> {
    const generales = aDatosGenerales(datos)
    const folio = await this.repo.siguienteFolio()
    const levantamiento = Levantamiento.crear(generales, {
      id: this.generadorId.nuevo(),
      folio,
      slug: this.generadorSlug.nuevo(),
      reloj: this.reloj,
    })
    if (datos.contactoNombre?.trim()) {
      levantamiento.reemplazarContenido(
        { contexto: { contactoNombre: datos.contactoNombre } },
        this.reloj,
      )
    }
    await this.repo.guardar(levantamiento)
    return {
      id: levantamiento.id,
      folio: levantamiento.folio,
      slug: levantamiento.slug.valor,
    }
  }
}
