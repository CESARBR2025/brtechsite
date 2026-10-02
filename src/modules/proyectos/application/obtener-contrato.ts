import { construirContrato, type DocumentoContrato } from "../domain/contrato"
import type { Proyecto } from "../domain/proyecto"
import type { ArchivoContrato, GeneradorPdfContrato } from "../domain/puertos"
import type { RepositorioProyectos } from "../domain/repositorio-proyectos"
import { proyectoPublicado } from "./obtener-propuesta-publica"

/** El contrato de un proyecto, con lo que tenga hasta ahora (opción elegida y firmas, si ya se aceptó). */
export function contratoDe(proyecto: Proyecto): DocumentoContrato {
  const a = proyecto.aceptacion
  return construirContrato({
    folio: proyecto.folio,
    proyectoNombre: proyecto.proyectoNombre,
    clienteNombre: proyecto.cliente.nombre,
    contenido: proyecto.contenido,
    totalCentavos: proyecto.totalCentavos,
    aceptacion: a ? { en: a.en, firmas: a.firmas, conBonificacion: a.conBonificacion } : null,
    firmaDesarrollador: proyecto.firmaDesarrollador,
  })
}

/**
 * El contrato en PDF de una propuesta publicada: para leerlo antes de firmar
 * o descargarlo ya firmado. El slug es la única credencial, igual que la página.
 */
export class ObtenerContratoPdf {
  constructor(
    private readonly repo: RepositorioProyectos,
    private readonly generador: GeneradorPdfContrato,
  ) {}

  async ejecutar(slug: string): Promise<ArchivoContrato> {
    const contrato = contratoDe(await proyectoPublicado(this.repo, slug))
    return { nombreArchivo: contrato.nombreArchivo, pdf: await this.generador.generar(contrato) }
  }
}
