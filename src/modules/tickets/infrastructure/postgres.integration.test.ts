import { afterAll, describe, expect, it } from "vitest"
import { Pool } from "pg"
import { generadorIdCrypto } from "@/src/modules/shared/infrastructure/generador-id-crypto"
import { relojSistema } from "@/src/modules/shared/infrastructure/reloj-sistema"
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
      equipo: { tipo: "Laptop" },
      fechaServicio: "2026-09-03",
      items: [
        { concepto: "Mantenimiento", cantidad: 1, precioUnitario: 450 },
        { concepto: "Pasta térmica", cantidad: 1, precioUnitario: 120 },
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
      equipo: { tipo: "PC" },
      fechaServicio: "2026-09-03",
      items: [{ concepto: "A", cantidad: 2, precioUnitario: 100 }],
    })
    creados.push(r.id)

    const t = await repo.obtenerPorId(r.id)
    t!.reemplazarItems([], relojSistema)
    await repo.guardar(t!)

    const recargado = await repo.obtenerPorId(r.id)
    expect(recargado?.items).toHaveLength(0)
    expect(recargado?.total.unidades).toBe(0)
  }, TIMEOUT)
})
