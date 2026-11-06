import { afterAll, describe, expect, it } from "vitest"
import { Pool } from "pg"
import { generadorIdCrypto } from "@/src/modules/shared/infrastructure/generador-id-crypto"
import { relojSistema } from "@/src/modules/shared/infrastructure/reloj-sistema"
import { ActualizarTicket } from "../application/actualizar-ticket"
import { CambiarEstadoTicket } from "../application/cambiar-estado-ticket"
import { CrearTicket } from "../application/crear-ticket"
import { ObtenerTicketPublico } from "../application/obtener-ticket-publico"
import { generadorSlugNanoid } from "./generador-slug-nanoid"
import { RepositorioTicketsPostgres } from "./repositorio-tickets-postgres"

/**
 * Prueba de integración contra Postgres real. Requiere túnel SSH al VPS y:
 *   RUN_DB_TESTS=1 npx dotenv -e .env.local -- vitest run postgres.integration
 */
const activa = process.env.RUN_DB_TESTS === "1"
const pool = activa
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 10_000,
    })
  : null

// Sobre el túnel SSH la latencia sube; damos margen amplio.
const TIMEOUT = 30_000

afterAll(async () => {
  await pool?.end()
})

describe.skipIf(!activa)("RepositorioTicketsPostgres (integración)", () => {
  const repo = new RepositorioTicketsPostgres(pool!)
  const creados: string[] = []

  afterAll(async () => {
    for (const id of creados) {
      await pool!.query("DELETE FROM service_ticket WHERE id = $1", [id])
    }
  })

  it("crea, publica, lee por slug y recalcula totales", async () => {
    const crear = new CrearTicket(
      repo,
      generadorIdCrypto,
      generadorSlugNanoid,
      relojSistema,
    )
    const estado = new CambiarEstadoTicket(repo, relojSistema)
    const publico = new ObtenerTicketPublico(repo)

    const r = await crear.ejecutar({
      cliente: { nombre: "Cliente Integración" },
      equipo: { categoria: "laptop", tipo: "Laptop" },
      fechaServicio: "2026-09-03",
      items: [
        { clase: "mantenimiento", concepto: "Mantenimiento", cantidad: 1, precioUnitario: 450 },
        { clase: "mantenimiento", concepto: "Pasta térmica", cantidad: 1, precioUnitario: 120 },
      ],
    })
    creados.push(r.id)
    expect(r.folio).toMatch(/^BRT-\d{6}$/)

    await expect(publico.ejecutar(r.slug)).rejects.toThrow() // borrador => oculto

    await estado.publicar(r.id)
    const dto = await publico.ejecutar(r.slug)
    expect(dto.total).toBe(570)
    expect(dto.items).toHaveLength(2)

    await estado.marcarPago(r.id, true)
    const reload = await repo.obtenerPorId(r.id)
    expect(reload?.pagado).toBe(true)
  }, TIMEOUT)

  it("guardar sobre un ticket existente reemplaza sus ítems", async () => {
    const crear = new CrearTicket(
      repo,
      generadorIdCrypto,
      generadorSlugNanoid,
      relojSistema,
    )
    const r = await crear.ejecutar({
      cliente: { nombre: "Reemplazo" },
      equipo: { categoria: "pc", tipo: "PC" },
      fechaServicio: "2026-09-03",
      items: [{ clase: "otro", concepto: "A", cantidad: 2, precioUnitario: 100 }],
    })
    creados.push(r.id)

    const t = await repo.obtenerPorId(r.id)
    t!.reemplazarItems([], relojSistema)
    await repo.guardar(t!)

    const recargado = await repo.obtenerPorId(r.id)
    expect(recargado?.items).toHaveLength(0)
    expect(recargado?.total.unidades).toBe(0)
  }, TIMEOUT)
  it("persiste categoría, garantía y clasificación al crear y actualizar", async () => {
    const crear = new CrearTicket(repo, generadorIdCrypto, generadorSlugNanoid, relojSistema)
    const actualizar = new ActualizarTicket(repo, generadorIdCrypto, relojSistema)
    const datos = {
      cliente: { nombre: "Clasificación" },
      equipo: { categoria: "laptop", tipo: "Mi laptop" },
      garantiaDias: 30,
      fechaServicio: "2026-09-03",
      items: [
        { concepto: "Batería nueva", clase: "pieza", pieza: "bateria", etiqueta: "Batería", piezaAnterior: "Agotada", cantidad: 1, precioUnitario: 125.5 },
        { concepto: "Mantenimiento", clase: "mantenimiento", cantidad: 1, precioUnitario: 50 },
      ],
    }
    const r = await crear.ejecutar(datos)
    creados.push(r.id)
    const creado = await repo.obtenerPorId(r.id)
    expect(creado?.equipo).toMatchObject({ categoria: "laptop", tipo: "Mi laptop" })
    expect(creado?.garantiaDias).toBe(30)
    expect(creado?.items[0]).toMatchObject({ clase: "pieza", pieza: "bateria", etiqueta: "Batería", piezaAnterior: "Agotada" })
    expect(creado?.items[1]).toMatchObject({ clase: "mantenimiento", pieza: null, etiqueta: null, piezaAnterior: null })

    await actualizar.ejecutar(r.id, { ...datos, equipo: { categoria: "pc", tipo: "PC nueva" }, garantiaDias: 365, items: [
      { concepto: "SSD", clase: "pieza", pieza: "disco", etiqueta: "SSD nuevo", piezaAnterior: "HDD", cantidad: 2, precioUnitario: 100 },
    ] })
    const actualizado = await repo.obtenerPorSlug(creado!.slug)
    expect(actualizado?.equipo).toMatchObject({ categoria: "pc", tipo: "PC nueva" })
    expect(actualizado?.garantiaDias).toBe(365)
    expect(actualizado?.items).toHaveLength(1)
    expect(actualizado?.items[0]).toMatchObject({ clase: "pieza", pieza: "disco", etiqueta: "SSD nuevo", piezaAnterior: "HDD" })
    expect(actualizado?.total.centavos).toBe(20000)
    const listado = await repo.listar()
    expect(listado.find((ticket) => ticket.id === r.id)?.items[0].piezaAnterior).toBe("HDD")

    await actualizar.ejecutar(r.id, { ...datos, garantiaDias: null, items: [] })
    expect((await repo.obtenerPorId(r.id))?.garantiaDias).toBeNull()
  }, TIMEOUT)

})
