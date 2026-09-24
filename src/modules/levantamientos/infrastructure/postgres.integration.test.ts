import { afterAll, describe, expect, it } from "vitest"
import { Pool } from "pg"
import { generadorIdCrypto } from "@/src/modules/shared/infrastructure/generador-id-crypto"
import { relojSistema } from "@/src/modules/shared/infrastructure/reloj-sistema"
import { CambiarEstadoLevantamiento } from "../application/cambiar-estado-levantamiento"
import { CrearLevantamiento } from "../application/crear-levantamiento"
import { GuardarLevantamiento } from "../application/guardar-levantamiento"
import { ObtenerDiagnosticoPublico } from "../application/obtener-diagnostico-publico"
import { generadorSlugLevantamientoNanoid } from "./generador-slug-nanoid"
import { RepositorioLevantamientosPostgres } from "./repositorio-levantamientos-postgres"

/**
 * Prueba de integración contra Postgres real:
 *   RUN_DB_TESTS=1 npx dotenv -e .env.local -- vitest run levantamientos/infrastructure
 */
const activa = process.env.RUN_DB_TESTS === "1"
const pool = activa
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 10_000,
    })
  : null

const TIMEOUT = 30_000

afterAll(async () => {
  await pool?.end()
})

describe.skipIf(!activa)("RepositorioLevantamientosPostgres (integración)", () => {
  const repo = new RepositorioLevantamientosPostgres(pool!)
  const creados: string[] = []

  afterAll(async () => {
    for (const id of creados) {
      await pool!.query("DELETE FROM levantamiento WHERE id = $1", [id])
    }
  })

  it("crea, guarda contenido JSONB, publica y lo lee por slug", async () => {
    const crear = new CrearLevantamiento(
      repo,
      generadorIdCrypto,
      generadorSlugLevantamientoNanoid,
      relojSistema,
    )
    const guardar = new GuardarLevantamiento(repo, relojSistema)
    const estado = new CambiarEstadoLevantamiento(repo, relojSistema)
    const publico = new ObtenerDiagnosticoPublico(repo)

    const generales = {
      clienteNombre: "Cliente Integración",
      fechaReunion: "2026-09-24",
    }
    const r = await crear.ejecutar(generales)
    creados.push(r.id)
    expect(r.folio).toMatch(/^BRD-\d{6}$/)

    await guardar.ejecutar(r.id, {
      generales,
      contenido: {
        problema: { situacionActual: "Pedidos por WhatsApp sin control" },
        actores: [{ id: "a1", nombre: "Vendedor", rangosEdad: ["18-25"] }],
        flujos: [
          {
            id: "f1",
            nombre: "Levantar pedido",
            pasos: [{ id: "s1", descripcion: "Recibe mensaje", actorId: "a1" }],
          },
        ],
        notasInternas: "secreto",
      },
    })
    await expect(publico.ejecutar(r.slug)).rejects.toThrow()

    await estado.publicar(r.id)
    const dto = await publico.ejecutar(r.slug)
    expect(dto.fechaReunion).toBe("2026-09-24")
    expect(dto.contenido.flujos[0].pasos[0].actorId).toBe("a1")
    expect(JSON.stringify(dto)).not.toContain("secreto")

    const recargado = await repo.obtenerPorId(r.id)
    expect(recargado?.contenido.notasInternas).toBe("secreto")
  }, TIMEOUT)
})
