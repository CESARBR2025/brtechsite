import { beforeEach, describe, expect, it } from "vitest"
import {
  DatosInvalidos,
  OperacionNoPermitida,
  RecursoNoEncontrado,
} from "@/src/modules/shared/domain/errors"
import {
  GeneradorIdSecuencial,
  GeneradorSlugLevantamientoSecuencial,
  RelojFijo,
  RepositorioLevantamientosEnMemoria,
} from "@/src/testing/dobles"
import { CambiarEstadoLevantamiento } from "./cambiar-estado-levantamiento"
import { ConsultarLevantamientos } from "./consultar-levantamientos"
import { CrearLevantamiento } from "./crear-levantamiento"
import type { DatosGeneralesEntrada } from "./entrada"
import { GuardarLevantamiento } from "./guardar-levantamiento"
import { ObtenerDiagnosticoPublico } from "./obtener-diagnostico-publico"

const generales: DatosGeneralesEntrada = {
  clienteNombre: "Clínica Dental Sonrisa",
  clienteContacto: "442 000 0000",
  proyectoNombre: "Agenda de citas",
  fechaReunion: "2026-09-24",
}

const contenido = {
  problema: { situacionActual: "Las citas se anotan en una libreta" },
  actores: [{ id: "a1", nombre: "Recepcionista", rangosEdad: ["26-35"] }],
  notasInternas: "Presupuesto insinuado: bajo. Decide el dueño.",
}

describe("Casos de uso de levantamientos", () => {
  let repo: RepositorioLevantamientosEnMemoria
  let crear: CrearLevantamiento
  let guardar: GuardarLevantamiento
  let estado: CambiarEstadoLevantamiento
  let consultar: ConsultarLevantamientos
  let publico: ObtenerDiagnosticoPublico
  const reloj = new RelojFijo(new Date("2026-09-24T12:00:00.000Z"))

  beforeEach(() => {
    repo = new RepositorioLevantamientosEnMemoria()
    crear = new CrearLevantamiento(
      repo,
      new GeneradorIdSecuencial("lv"),
      new GeneradorSlugLevantamientoSecuencial(),
      reloj,
    )
    guardar = new GuardarLevantamiento(repo, reloj)
    estado = new CambiarEstadoLevantamiento(repo, reloj)
    consultar = new ConsultarLevantamientos(repo)
    publico = new ObtenerDiagnosticoPublico(repo)
  })

  it("crea un levantamiento en borrador con folio y slug", async () => {
    const r = await crear.ejecutar(generales)
    expect(r.folio).toBe("BRD-000001")
    expect(r.slug).toMatch(/^diagtest/)
    const [fila] = await consultar.listar()
    expect(fila.estado).toBe("borrador")
    expect(fila.seccionesCompletas).toBe(0)
  })

  it("el nombre del contacto se guarda en el contexto al crear", async () => {
    const r = await crear.ejecutar({ ...generales, contactoNombre: " César Chávez " })
    const d = await consultar.obtenerDetalle(r.id)
    expect(d.cliente.nombre).toBe("Clínica Dental Sonrisa")
    expect(d.contenido.contexto.contactoNombre).toBe("César Chávez")
  })

  it("rechaza una fecha de reunión mal formada", async () => {
    await expect(
      crear.ejecutar({ ...generales, fechaReunion: "24/09/2026" }),
    ).rejects.toBeInstanceOf(DatosInvalidos)
  })

  it("guardar reemplaza generales y contenido", async () => {
    const r = await crear.ejecutar(generales)
    await guardar.ejecutar(r.id, {
      generales: { ...generales, proyectoNombre: "Agenda y expedientes" },
      contenido,
    })
    const d = await consultar.obtenerDetalle(r.id)
    expect(d.proyectoNombre).toBe("Agenda y expedientes")
    expect(d.contenido.actores[0].nombre).toBe("Recepcionista")
    expect(d.completitud.problema).toBe(true)
  })

  it("un borrador no es visible públicamente", async () => {
    const r = await crear.ejecutar(generales)
    await expect(publico.ejecutar(r.slug)).rejects.toBeInstanceOf(
      RecursoNoEncontrado,
    )
  })

  it("publicado, la vista pública nunca incluye las notas internas", async () => {
    const r = await crear.ejecutar(generales)
    await guardar.ejecutar(r.id, { generales, contenido })
    await estado.publicar(r.id)

    const dto = await publico.ejecutar(r.slug)
    expect(dto.cliente).toEqual({ nombre: "Clínica Dental Sonrisa" })
    expect(dto.contenido.problema.situacionActual).toContain("libreta")
    expect("notasInternas" in dto.contenido).toBe(false)
    expect(JSON.stringify(dto)).not.toContain("Presupuesto insinuado")
  })

  it("no se publica sin problema descrito", async () => {
    const r = await crear.ejecutar(generales)
    await expect(estado.publicar(r.id)).rejects.toBeInstanceOf(
      OperacionNoPermitida,
    )
  })

  it("confirmar se refleja en la vista pública", async () => {
    const r = await crear.ejecutar(generales)
    await guardar.ejecutar(r.id, { generales, contenido })
    await estado.publicar(r.id)
    await estado.confirmar(r.id, true)
    expect((await publico.ejecutar(r.slug)).confirmado).toBe(true)
  })

  it("slug inválido o id inexistente => RecursoNoEncontrado", async () => {
    await expect(publico.ejecutar("$$")).rejects.toBeInstanceOf(
      RecursoNoEncontrado,
    )
    await expect(
      guardar.ejecutar("fantasma", { generales, contenido }),
    ).rejects.toBeInstanceOf(RecursoNoEncontrado)
  })
})
