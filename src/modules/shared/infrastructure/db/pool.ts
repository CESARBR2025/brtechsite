import { Pool } from "pg"
import { getEnv } from "../config/env"

/**
 * Pool de conexiones a Postgres, compartido en todo el proceso.
 * En dev, Next recarga módulos con HMR; guardamos el pool en `globalThis`
 * para no abrir un pool nuevo en cada recarga.
 */
const glob = globalThis as unknown as { __brtechPgPool?: Pool }

export function getPool(): Pool {
  if (!glob.__brtechPgPool) {
    const env = getEnv()
    const pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: env.DB_POOL_MAX,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      // Cinturón de seguridad: ninguna consulta del sitio debe colgar recursos
      // en el Postgres compartido con parrilla.
      statement_timeout: 10_000,
      query_timeout: 10_000,
    })
    pool.on("error", (err) => {
      console.error("[pg] error inesperado en cliente ocioso del pool", err)
    })
    glob.__brtechPgPool = pool
  }
  return glob.__brtechPgPool
}
