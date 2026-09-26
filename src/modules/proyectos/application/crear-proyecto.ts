import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import type { GeneradorId } from "@/src/modules/shared/domain/id"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import { Proyecto } from "../domain/proyecto"
import type { FuenteLevantamientos, OrigenLevantamiento } from "../domain/puertos"
import type { RepositorioProyectos } from "../domain/repositorio-proyectos"
import type { GeneradorSlugProyecto } from "../domain/slug-proyecto"
import { aDatosGenerales, type DatosGeneralesEntrada } from "./entrada"

export interface CrearProyectoEntrada extends DatosGeneralesEntrada {
  /** Si viene, el proyecto hereda del levantamiento cliente, contacto y roles. */
  levantamientoId?: string | null
  /** Contenido inicial completo (lo usa la importación de un documento de arranque). */
  contenido?: unknown
}

export interface ResultadoCrearProyecto {
  id: string
  folio: string
  slug: string
}

/** Lo que un proyecto recién creado toma de su levantamiento. */
function contenidoDesde(l: OrigenLevantamiento, nuevoId: () => string) {
  return {
    ficha: {
      contactoNombre: l.contactoNombre,
      giro: l.giro,
      promesa: l.promesa,
      objetivo: l.objetivo,
    },
    alcance: { problemas: l.problemas.map((texto) => ({ id: nuevoId(), texto })) },
    roles: l.actores.map((a) => ({
      id: nuevoId(),
      nombre: a.nombre,
      dispositivo: a.dispositivos,
      responsabilidades: a.descripcion,
    })),
  }
}

/** Abre un proyecto, suelto o a partir de un levantamiento. */
export class CrearProyecto {
  constructor(
    private readonly repo: RepositorioProyectos,
    private readonly levantamientos: FuenteLevantamientos,
    private readonly generadorId: GeneradorId,
    private readonly generadorSlug: GeneradorSlugProyecto,
    private readonly reloj: Reloj,
  ) {}

  async ejecutar(datos: CrearProyectoEntrada): Promise<ResultadoCrearProyecto> {
    let origen: OrigenLevantamiento | null = null
    if (datos.levantamientoId) {
      origen = await this.levantamientos.obtener(datos.levantamientoId)
      if (!origen) {
        throw new RecursoNoEncontrado(`No existe el levantamiento ${datos.levantamientoId}`)
      }
    }
    const generales = aDatosGenerales({
      ...datos,
      clienteNombre: datos.clienteNombre.trim() || origen?.clienteNombre || "",
      clienteContacto: datos.clienteContacto || origen?.clienteContacto,
      proyectoNombre: datos.proyectoNombre || origen?.proyectoNombre,
    })
    const folio = await this.repo.siguienteFolio()
    const proyecto = Proyecto.crear(
      {
        ...generales,
        levantamientoId: origen?.id ?? null,
        contenido: datos.contenido ?? (origen ? contenidoDesde(origen, () => this.generadorId.nuevo()) : undefined),
      },
      { id: this.generadorId.nuevo(), folio, slug: this.generadorSlug.nuevo(), reloj: this.reloj },
    )
    await this.repo.guardar(proyecto)
    return { id: proyecto.id, folio: proyecto.folio, slug: proyecto.slug.valor }
  }
}
