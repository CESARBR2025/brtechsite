import { beforeEach, describe, expect, it } from "vitest"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import {
  FuenteLevantamientosEnMemoria,
  GeneradorIdSecuencial,
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
    it("el cliente acepta, se avisa y se refleja en panel y página", async () => {
      const notificador = new NotificadorAceptacionEnMemoria()
      const aceptar = new AceptarPropuesta(repo, notificador, reloj)
      const r = await crear.ejecutar(generales)
      await guardar.ejecutar(r.id, { generales, contenido })
      await estado.publicar(r.id)

      expect(await aceptar.ejecutar(r.slug, "César Chavero")).toEqual({ aviso: "enviado" })
      expect(notificador.enviados[0]).toMatchObject({
        folio: "BRP-000001",
        aceptadaPor: "César Chavero",
        totalCentavos: 1_050_000,
        moneda: "MXN",
      })
      expect((await publico.ejecutar(r.slug)).aceptacion).toEqual({
        en: "2026-09-25T12:00:00.000Z",
        por: "César Chavero",
      })
      expect((await consultar.listar())[0].aceptado).toBe(true)
    })

    it("un borrador no se puede aceptar", async () => {
      const aceptar = new AceptarPropuesta(repo, new NotificadorAceptacionEnMemoria(), reloj)
      const r = await crear.ejecutar(generales)
      await expect(aceptar.ejecutar(r.slug, "César")).rejects.toBeInstanceOf(RecursoNoEncontrado)
    })

    it("si el correo falla, la aceptación igual queda guardada", async () => {
      const notificador = new NotificadorAceptacionEnMemoria()
      notificador.falla = true
      const aceptar = new AceptarPropuesta(repo, notificador, reloj)
      const r = await crear.ejecutar(generales)
      await guardar.ejecutar(r.id, { generales, contenido })
      await estado.publicar(r.id)
      expect((await aceptar.ejecutar(r.slug, "César")).aviso).toBe("fallido")
      expect((await publico.ejecutar(r.slug)).aceptacion?.por).toBe("César")
    })
  })
})
