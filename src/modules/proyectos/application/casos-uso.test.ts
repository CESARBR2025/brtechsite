import { beforeEach, describe, expect, it } from "vitest"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import {
  FuenteLevantamientosEnMemoria,
  GeneradorIdSecuencial,
  GeneradorPdfContratoEnMemoria,
  GeneradorSlugProyectoSecuencial,
  NotificadorAceptacionEnMemoria,
  RelojFijo,
  RepositorioProyectosEnMemoria,
} from "@/src/testing/dobles"
import { AceptarPropuesta } from "./aceptar-propuesta"
import { CambiarEstadoProyecto } from "./cambiar-estado-proyecto"
import { ConsultarProyectos } from "./consultar-proyectos"
import { CrearProyecto } from "./crear-proyecto"
import { GuardarProyecto } from "./guardar-proyecto"
import { ObtenerContratoPdf } from "./obtener-contrato"
import { ObtenerPropuestaPublica } from "./obtener-propuesta-publica"

const generales = {
  clienteNombre: "Tostadas Tio Beto",
  proyectoNombre: "Tostadas Tio Beto Soft",
  fechaPropuesta: "2026-09-25",
}

const contenido = {
  fases: [{ id: "mvp", clave: "MVP", nombre: "Operación base", contratada: true }],
  inversion: { pagos: [{ id: "a", nombre: "Anticipo", montoCentavos: 1_050_000 }] },
  notasInternas: "Margen bajo; negociar mantenimiento.",
}

const origen = {
  id: "lv-1",
  folio: "BRD-000001",
  slug: "diag00000001",
  clienteNombre: "Tostadas Tio Beto",
  clienteContacto: "442 000 0000",
  proyectoNombre: "Control de reparto",
  contactoNombre: "César Chavero",
  giro: "Alimentos",
  promesa: "Cada centavo bajo control",
  objetivo: "Control total de la operación",
  problemas: ["Todo en papel"],
  actores: [{ nombre: "Repartidor", descripcion: "Hace la ruta", dispositivos: "Celular" }],
}

describe("Casos de uso de proyectos", () => {
  let repo: RepositorioProyectosEnMemoria
  let crear: CrearProyecto
  let guardar: GuardarProyecto
  let estado: CambiarEstadoProyecto
  let consultar: ConsultarProyectos
  let publico: ObtenerPropuestaPublica
  const reloj = new RelojFijo(new Date("2026-09-25T12:00:00.000Z"))

  beforeEach(() => {
    repo = new RepositorioProyectosEnMemoria()
    const fuente = new FuenteLevantamientosEnMemoria([origen])
    crear = new CrearProyecto(
      repo,
      fuente,
      new GeneradorIdSecuencial("pr"),
      new GeneradorSlugProyectoSecuencial(),
      reloj,
    )
    guardar = new GuardarProyecto(repo, reloj)
    estado = new CambiarEstadoProyecto(repo, reloj)
    consultar = new ConsultarProyectos(repo, fuente)
    publico = new ObtenerPropuestaPublica(repo)
  })

  it("crea un proyecto en borrador con folio y slug", async () => {
    const r = await crear.ejecutar(generales)
    expect(r.folio).toBe("BRP-000001")
    expect(r.slug).toMatch(/^proptest/)
    const [fila] = await consultar.listar()
    expect(fila).toMatchObject({ estado: "borrador", aceptado: false, totalCentavos: 0 })
  })

  it("a partir de un levantamiento hereda cliente, contacto, promesa y roles", async () => {
    const r = await crear.ejecutar({ clienteNombre: "", fechaPropuesta: "2026-09-25", levantamientoId: "lv-1" })
    const d = await consultar.obtenerDetalle(r.id)
    expect(d.levantamientoId).toBe("lv-1")
    expect(d.cliente).toEqual({ nombre: "Tostadas Tio Beto", contacto: "442 000 0000" })
    expect(d.proyectoNombre).toBe("Control de reparto")
    expect(d.contenido.ficha).toMatchObject({ contactoNombre: "César Chavero", promesa: "Cada centavo bajo control" })
    expect(d.contenido.roles[0]).toMatchObject({ nombre: "Repartidor", dispositivo: "Celular" })
    expect(d.contenido.alcance.problemas[0].texto).toBe("Todo en papel")
  })

  it("un levantamiento inexistente => RecursoNoEncontrado", async () => {
    await expect(
      crear.ejecutar({ ...generales, levantamientoId: "fantasma" }),
    ).rejects.toBeInstanceOf(RecursoNoEncontrado)
  })

  it("publicada, la vista pública nunca incluye las notas internas", async () => {
    const r = await crear.ejecutar(generales)
    await expect(publico.ejecutar(r.slug)).rejects.toBeInstanceOf(RecursoNoEncontrado)
    await guardar.ejecutar(r.id, { generales, contenido })
    await estado.publicar(r.id)
    const dto = await publico.ejecutar(r.slug)
    expect(dto.totalCentavos).toBe(1_050_000)
    expect("notasInternas" in dto.contenido).toBe(false)
    expect("permisos" in dto.contenido).toBe(false)
    expect("arquitectura" in dto.contenido).toBe(false)
    expect("decisiones" in dto.contenido).toBe(false)
    expect(JSON.stringify(dto)).not.toContain("Margen bajo")
  })

  describe("Aceptación", () => {
    const trazo = "M10 10L20 20L30 10L40 20L50 10L60 20"
    const correo = "cesar@tiobeto.mx"
    const conBono = {
      ...contenido,
      inversion: {
        pagos: [
          { id: "a", nombre: "Anticipo", montoCentavos: 600_000 },
          { id: "b", nombre: "Entrega", montoCentavos: 1_050_000 },
        ],
        bonificacion: { nombre: "Caso de éxito", montoCentavos: 250_000, condicion: "A cambio de un testimonio." },
      },
    }

    async function publicada(c: unknown = contenido) {
      const r = await crear.ejecutar(generales)
      await guardar.ejecutar(r.id, { generales, contenido: c })
      await estado.publicar(r.id)
      return r
    }

    it("el cliente acepta, se avisa y se refleja en panel y página", async () => {
      const notificador = new NotificadorAceptacionEnMemoria()
      const aceptar = new AceptarPropuesta(repo, notificador, new GeneradorPdfContratoEnMemoria(), reloj)
      const r = await publicada()

      const firma = { nombre: "César Chavero", trazo }
      expect(await aceptar.ejecutar(r.slug, { firmas: [firma], correo })).toEqual({
        aviso: "enviado",
        avisoCliente: "enviado",
        errores: [],
      })
      expect(notificador.enviados[0]).toMatchObject({
        folio: "BRP-000001",
        aceptadaPor: "César Chavero",
        totalCentavos: 1_050_000,
        moneda: "MXN",
        correoCliente: correo,
        bonificacion: null,
      })
      expect((await publico.ejecutar(r.slug)).aceptacion).toEqual({
        en: "2026-09-25T12:00:00.000Z",
        por: "César Chavero",
        firmas: [firma],
        conBonificacion: false,
        totalCentavos: 1_050_000,
      })
      expect((await consultar.listar())[0].aceptado).toBe(true)
    })

    it("al firmar, el cliente recibe su contrato con la opción que eligió", async () => {
      const notificador = new NotificadorAceptacionEnMemoria()
      const generador = new GeneradorPdfContratoEnMemoria()
      const aceptar = new AceptarPropuesta(repo, notificador, generador, reloj)
      const r = await publicada(conBono)

      await aceptar.ejecutar(r.slug, { firmas: [{ nombre: "César Chavero", trazo }], correo, conBonificacion: true })

      expect(generador.generados[0]).toMatchObject({ firmado: true, estado: "Firmado el 25 de septiembre de 2026" })
      expect(notificador.alCliente[0]).toMatchObject({
        correo,
        folio: "BRP-000001",
        firmantes: "César Chavero",
        totalCentavos: 1_400_000,
      })
      expect(notificador.alCliente[0].contrato.nombreArchivo).toBe("Contrato-Tostadas-Tio-Beto-Soft-BRP-000001.pdf")
      expect(notificador.enviados[0]).toMatchObject({ totalCentavos: 1_400_000, bonificacion: "Caso de éxito" })
      expect(notificador.enviados[0].contrato).not.toBeNull()
      // El correo del cliente se ve en el panel, nunca en la página pública
      expect((await consultar.obtenerDetalle(r.id)).correoAceptacion).toBe(correo)
      expect(JSON.stringify(await publico.ejecutar(r.slug))).not.toContain(correo)
    })

    it("el contrato se puede leer antes de firmar y descargar ya firmado", async () => {
      const generador = new GeneradorPdfContratoEnMemoria()
      const contrato = new ObtenerContratoPdf(repo, generador)
      const r = await crear.ejecutar(generales)
      await expect(contrato.ejecutar(r.slug)).rejects.toBeInstanceOf(RecursoNoEncontrado)
      await guardar.ejecutar(r.id, { generales, contenido: conBono })
      await estado.publicar(r.id)

      expect((await contrato.ejecutar(r.slug)).nombreArchivo).toBe("Contrato-Tostadas-Tio-Beto-Soft-BRP-000001.pdf")
      expect(generador.generados[0].firmado).toBe(false)

      const aceptar = new AceptarPropuesta(repo, new NotificadorAceptacionEnMemoria(), generador, reloj)
      await aceptar.ejecutar(r.slug, { firmas: [{ nombre: "César", trazo }], correo, conBonificacion: false })
      await contrato.ejecutar(r.slug)
      expect(generador.generados.at(-1)).toMatchObject({ firmado: true })
    })

    it("un borrador no se puede aceptar", async () => {
      const aceptar = new AceptarPropuesta(repo, new NotificadorAceptacionEnMemoria(), new GeneradorPdfContratoEnMemoria(), reloj)
      const r = await crear.ejecutar(generales)
      await expect(
        aceptar.ejecutar(r.slug, { firmas: [{ nombre: "César", trazo }], correo }),
      ).rejects.toBeInstanceOf(RecursoNoEncontrado)
    })

    it("si los correos o el PDF fallan, la aceptación igual queda guardada", async () => {
      const notificador = new NotificadorAceptacionEnMemoria()
      notificador.falla = true
      const aceptar = new AceptarPropuesta(repo, notificador, new GeneradorPdfContratoEnMemoria(), reloj)
      const r = await publicada()
      const resultado = await aceptar.ejecutar(r.slug, { firmas: [{ nombre: "César", trazo }], correo })
      expect(resultado).toMatchObject({ aviso: "fallido", avisoCliente: "fallido" })
      expect(resultado.errores).toHaveLength(2)
      expect((await publico.ejecutar(r.slug)).aceptacion?.por).toBe("César")

      // Sin PDF, el aviso a BR TECH sale igual; al cliente no hay nada que enviarle
      const sinPdf = new GeneradorPdfContratoEnMemoria()
      sinPdf.falla = true
      const avisos = new NotificadorAceptacionEnMemoria()
      const otro = await publicada()
      const r2 = await new AceptarPropuesta(repo, avisos, sinPdf, reloj).ejecutar(otro.slug, {
        firmas: [{ nombre: "César", trazo }],
        correo,
      })
      expect(r2).toMatchObject({ aviso: "enviado", avisoCliente: "fallido" })
      expect(avisos.enviados[0].contrato).toBeNull()
      expect(avisos.alCliente).toHaveLength(0)
    })
  })
})
