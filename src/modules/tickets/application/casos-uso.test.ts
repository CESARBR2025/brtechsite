import { beforeEach, describe, expect, it } from "vitest"
import { DatosInvalidos, RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import {
  GeneradorIdSecuencial,
  GeneradorSlugSecuencial,
  RelojFijo,
  RepositorioTicketsEnMemoria,
} from "@/src/testing/dobles"
import { ActualizarTicket } from "./actualizar-ticket"
import { CambiarEstadoTicket } from "./cambiar-estado-ticket"
import { ConsultarTickets } from "./consultar-tickets"
import { CrearTicket } from "./crear-ticket"
import type { DatosTicketEntrada } from "./entrada"
import { ObtenerTicketPublico } from "./obtener-ticket-publico"

function datosBase(): DatosTicketEntrada {
  return {
    cliente: { nombre: "Ana López", contacto: "555-1234" },
    equipo: { categoria: "pc", tipo: "PC de escritorio" },
    diagnostico: "Disco duro dañado",
    garantiaDias: 30,
    fechaServicio: "2026-09-03",
    impuesto: 0,
    items: [
      { clase: "pieza", pieza: "disco", etiqueta: "SSD nuevo", piezaAnterior: "HDD", concepto: "Cambio de disco SSD", cantidad: 1, precioUnitario: 900 },
      { clase: "mano_de_obra", concepto: "Mano de obra", cantidad: 1.5, precioUnitario: 200 },
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
      items: [{ clase: "diagnostico", concepto: "Solo revisión", cantidad: 1, precioUnitario: 150 }],
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
  it("crear guarda clasificación y garantía y expone los DTO nuevos", async () => {
    const r = await crear.ejecutar(datosBase())
    const guardado = await repo.obtenerPorId(r.id)
    expect(guardado?.equipo.categoria).toBe("pc")
    expect(guardado?.garantiaDias).toBe(30)
    expect(guardado?.items[0]).toMatchObject({ clase: "pieza", pieza: "disco", etiqueta: "SSD nuevo", piezaAnterior: "HDD" })
    await estado.publicar(r.id)
    const dto = await publico.ejecutar(r.slug)
    expect(dto.equipo.categoria).toBe("pc")
    expect(dto.garantiaDias).toBe(30)
    expect(dto.items[0]).toMatchObject({ clase: "pieza", pieza: "disco", etiqueta: "SSD nuevo", etiquetaPropia: "SSD nuevo", piezaAnterior: "HDD" })
    expect(dto.items[1]).toMatchObject({ etiqueta: "Mano de obra", etiquetaPropia: null })
    expect(dto.escena).toMatchObject({ interior: "pieza", principal: "pieza", pieza: { tipo: "disco", nuevo: "SSD nuevo", anterior: "HDD" } })
    expect(dto.desglose).toEqual({ manoDeObra: 300, piezas: 900 })
    expect(dto.totalEnLetra).toBe("Mil doscientos pesos 00/100 M.N.")
    const consultar = new ConsultarTickets(repo)
    expect((await consultar.listar())[0].equipoCategoria).toBe("pc")
    expect((await consultar.obtenerDetalle(r.id)).garantiaDias).toBe(30)
  })

  it("actualizar guarda todos los campos y cambia equipo y conceptos juntos", async () => {
    const datos: DatosTicketEntrada = { ...datosBase(), equipo: { categoria: "laptop" }, items: [
      { concepto: "Batería", clase: "pieza", pieza: "bateria", etiqueta: "Batería nueva", piezaAnterior: "Batería agotada", cantidad: 1, precioUnitario: 100 },
    ] }
    const r = await crear.ejecutar(datos)
    await actualizar.ejecutar(r.id, { ...datos, equipo: { categoria: "pc", tipo: "PC armada" }, garantiaDias: 365, impuesto: 10, items: [
      { concepto: "Memoria RAM", clase: "pieza", pieza: "ram", etiqueta: "RAM nueva", piezaAnterior: "4 GB", cantidad: 2, precioUnitario: 200 },
      { concepto: "Armado", clase: "ensamble", cantidad: 1, precioUnitario: 100 },
      { concepto: "Instalación de Linux", clase: "sistema", cantidad: 1, precioUnitario: 50 },
    ] })
    await estado.publicar(r.id)
    const dto = await publico.ejecutar(r.slug)
    expect(dto.equipo).toMatchObject({ categoria: "pc", tipo: "PC armada" })
    expect(dto.garantiaDias).toBe(365)
    expect(dto.items[0]).toMatchObject({ clase: "pieza", pieza: "ram", etiqueta: "RAM nueva", etiquetaPropia: "RAM nueva", piezaAnterior: "4 GB" })
    expect(dto.items[2]).toMatchObject({ etiqueta: "Linux", etiquetaPropia: null })
    expect(dto.escena).toMatchObject({ principal: "ensamble", interior: "ensamble", pantalla: "sistema", piezasEnsamble: 1 })
    expect(dto.desglose).toEqual({ piezas: 400, manoDeObra: 150 })
    expect(dto.totalEnLetra).toBe("Quinientos sesenta pesos 00/100 M.N.")
    expect((await repo.obtenerPorId(r.id))?.instantanea()).toMatchObject({ equipoCategoria: "pc", garantiaDias: 365 })
  })

  it.each([
    { equipo: { categoria: "inventada" } },
    { garantiaDias: 366 },
    { items: [{ concepto: "Servicio", clase: "inventada", cantidad: 1, precioUnitario: 1 }] },
    { items: [{ concepto: "Servicio", clase: "pieza", pieza: "tornillo", cantidad: 1, precioUnitario: 1 }] },
  ])("rechaza entrada inválida: %j", async (invalido) => {
    await expect(crear.ejecutar({ ...datosBase(), ...invalido })).rejects.toBeInstanceOf(DatosInvalidos)
    expect(await repo.listar()).toHaveLength(0)
  })

})
