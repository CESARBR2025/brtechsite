import type { Reloj } from "@/src/modules/shared/domain/reloj"
import type { DatosAceptacion } from "../domain/proyecto"
import type { ArchivoContrato, GeneradorPdfContrato, NotificadorAceptacion } from "../domain/puertos"
import type { RepositorioProyectos } from "../domain/repositorio-proyectos"
import { contratoDe } from "./obtener-contrato"
import { proyectoPublicado } from "./obtener-propuesta-publica"

type Envio = "enviado" | "fallido"

export interface ResultadoAceptarPropuesta {
  /** Si el aviso a BR TECH salió o falló (la aceptación queda guardada igual). */
  aviso: Envio
  /** Si al cliente le salió el correo con su contrato. */
  avisoCliente: Envio
  /** Causas de lo que falló (contrato o correos), para registrarlas en el adaptador. */
  errores: unknown[]
}

/**
 * El cliente acepta la propuesta desde su página pública. El slug es la
 * única credencial: si no está publicada, se comporta como "no existe".
 * Guardada la aceptación, se genera el contrato firmado y salen dos correos:
 * el aviso a BR TECH y el contrato al cliente. Nada de eso deshace la
 * aceptación si falla: el contrato siempre se puede descargar de la página.
 */
export class AceptarPropuesta {
  constructor(
    private readonly repo: RepositorioProyectos,
    private readonly notificador: NotificadorAceptacion,
    private readonly generador: GeneradorPdfContrato,
    private readonly reloj: Reloj,
  ) {}

  async ejecutar(slug: string, datos: DatosAceptacion): Promise<ResultadoAceptarPropuesta> {
    const proyecto = await proyectoPublicado(this.repo, slug)
    proyecto.aceptar(datos, this.reloj)
    await this.repo.guardar(proyecto)

    const aceptacion = proyecto.aceptacion!
    const errores: unknown[] = []
    const intentar = async (fn: () => Promise<void>): Promise<Envio> => {
      try {
        await fn()
        return "enviado"
      } catch (err) {
        errores.push(err)
        return "fallido"
      }
    }

    let contrato: ArchivoContrato | null = null
    try {
      const documento = contratoDe(proyecto)
      contrato = { nombreArchivo: documento.nombreArchivo, pdf: await this.generador.generar(documento) }
    } catch (err) {
      errores.push(err)
    }

    const comun = {
      folio: proyecto.folio,
      slug: proyecto.slug.valor,
      clienteNombre: proyecto.cliente.nombre,
      proyectoNombre: proyecto.proyectoNombre,
      totalCentavos: proyecto.totalAcordadoCentavos,
      moneda: proyecto.contenido.inversion.moneda,
    }
    const aviso = await intentar(() =>
      this.notificador.propuestaAceptada({
        ...comun,
        proyectoId: proyecto.id,
        aceptadaPor: aceptacion.por,
        aceptadaEn: aceptacion.en,
        correoCliente: aceptacion.correo,
        bonificacion: aceptacion.conBonificacion ? proyecto.contenido.inversion.bonificacion.nombre || "Bonificación" : null,
        contrato,
      }),
    )
    // Sin contrato no hay nada que enviarle al cliente
    const avisoCliente =
      contrato && aceptacion.correo
        ? await intentar(() =>
            this.notificador.contratoParaCliente({
              ...comun,
              correo: aceptacion.correo!,
              firmantes: aceptacion.por,
              contrato: contrato!,
            }),
          )
        : "fallido"

    return { aviso, avisoCliente, errores }
  }
}
