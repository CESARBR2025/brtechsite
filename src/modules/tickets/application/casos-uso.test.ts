import { beforeEach, describe, expect, it } from "vitest"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import {
  GeneradorIdSecuencial,
  GeneradorSlugSecuencial,
  RelojFijo,
  RepositorioTicketsEnMemoria,
} from "@/src/testing/dobles"
import { ActualizarTicket } from "./actualizar-ticket"
import { CambiarEstadoTicket } from "./cambiar-estado-ticket"
import { CrearTicket } from "./crear-ticket"
import type { DatosTicketEntrada } from "./entrada"
import { ObtenerTicketPublico } from "./obtener-ticket-publico"

function datosBase(): DatosTicketEntrada {
  return {
    cliente: { nombre: "Ana López", contacto: "555-1234" },
    equipo: { tipo: "PC de escritorio" },
    diagnostico: "Disco duro dañado",
    fechaServicio: "2026-09-03",
    impuesto: 0,
    items: [
      { concepto: "Cambio de disco SSD", cantidad: 1, precioUnitario: 900 },
      { concepto: "Mano de obra", cantidad: 1.5, precioUnitario: 200 },
    ],
  }
}

describe("Casos de uso de tickets", () => {
  let repo: RepositorioTicketsEnMemoria
  let crear: CrearTicket
  let actualizar: ActualizarTicket
  let estado: CambiarEstadoTicket
  let publico: ObtenerTicketPublico
  const reloj = new RelojFijo(new Date("2026-09-03T12:00:00.000Z"))

  beforeEach(() => {
    repo = new RepositorioTicketsEnMemoria()
    crear = new CrearTicket(
      repo,
      new GeneradorIdSecuencial(),
      new GeneradorSlugSecuencial(),
      reloj,
    )
    actualizar = new ActualizarTicket(repo, new GeneradorIdSecuencial("it"), reloj)
    estado = new CambiarEstadoTicket(repo, reloj)
    publico = new ObtenerTicketPublico(repo)
  })

  it("crea un ticket en borrador con folio y slug", async () => {
    const r = await crear.ejecutar(datosBase())
    expect(r.folio).toBe("BRT-000001")
    expect(r.slug).toMatch(/^slugtest/)

    const t = await repo.obtenerPorId(r.id)
    expect(t?.estado).toBe("borrador")
    expect(t?.total.unidades).toBe(1200) // 900 + 1.5*200
  })

  it("un ticket en borrador no es visible públicamente", async () => {
    const r = await crear.ejecutar(datosBase())
    await expect(publico.ejecutar(r.slug)).rejects.toBeInstanceOf(
      RecursoNoEncontrado,
    )
  })

  it("tras publicar, la vista pública devuelve el DTO", async () => {
    const r = await crear.ejecutar(datosBase())
    await estado.publicar(r.id)

    const dto = await publico.ejecutar(r.slug)
    expect(dto.folio).toBe("BRT-000001")
    expect(dto.cliente.nombre).toBe("Ana López")
    expect(dto.items).toHaveLength(2)
    expect(dto.total).toBe(1200)
  })

  it("slug inexistente o inválido => RecursoNoEncontrado", async () => {
    await expect(publico.ejecutar("noexiste1234")).rejects.toBeInstanceOf(
      RecursoNoEncontrado,
    )
    await expect(publico.ejecutar("$$")).rejects.toBeInstanceOf(
      RecursoNoEncontrado,
    )
  })

  it("actualizar reemplaza ítems y recalcula", async () => {
    const r = await crear.ejecutar(datosBase())
    await actualizar.ejecutar(r.id, {
      ...datosBase(),
      items: [{ concepto: "Solo revisión", cantidad: 1, precioUnitario: 150 }],
    })
    const t = await repo.obtenerPorId(r.id)
    expect(t?.items).toHaveLength(1)
    expect(t?.total.unidades).toBe(150)
  })

  it("actualizar un id inexistente lanza RecursoNoEncontrado", async () => {
    await expect(
      actualizar.ejecutar("fantasma", datosBase()),
    ).rejects.toBeInstanceOf(RecursoNoEncontrado)
  })
})
