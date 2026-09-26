import type { Pool } from "pg"
import { VERSION_ESQUEMA_CONTENIDO } from "../domain/contenido"
import type { Levantamiento } from "../domain/levantamiento"
import type {
  FiltroLevantamientos,
  RepositorioLevantamientos,
} from "../domain/repositorio-levantamientos"
import type { SlugLevantamiento } from "../domain/slug-levantamiento"
import {
  type FilaLevantamiento,
  levantamientoADominio,
} from "./mapa-levantamiento"

const COLUMNAS = `
  id, public_slug, folio, estado,
  cliente_nombre, cliente_contacto, proyecto_nombre,
  to_char(fecha_reunion, 'YYYY-MM-DD') AS fecha_reunion,
  contenido, esquema_version,
  creado_en, actualizado_en, publicado_en, confirmado_en
`

export class RepositorioLevantamientosPostgres
  implements RepositorioLevantamientos
{
  constructor(private readonly pool: Pool) {}

  async siguienteFolio(): Promise<string> {
    const { rows } = await this.pool.query<{ folio: string }>(
      "SELECT 'BRD-' || lpad(nextval('levantamiento_folio_seq')::text, 6, '0') AS folio",
    )
    return rows[0].folio
  }

  obtenerPorId(id: string): Promise<Levantamiento | null> {
    return this.obtenerPor("id", id)
  }

  obtenerPorSlug(slug: SlugLevantamiento): Promise<Levantamiento | null> {
    return this.obtenerPor("public_slug", slug.valor)
  }

  private async obtenerPor(
    columna: "id" | "public_slug",
    valor: string,
  ): Promise<Levantamiento | null> {
    // Un id que no es uuid no existe (y así Postgres no lanza error de tipo)
    if (columna === "id" && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valor)) return null
    const { rows } = await this.pool.query<FilaLevantamiento>(
      `SELECT ${COLUMNAS} FROM levantamiento WHERE ${columna} = $1`,
      [valor],
    )
    return rows.length > 0 ? levantamientoADominio(rows[0]) : null
  }

  async listar(filtro: FiltroLevantamientos = {}): Promise<Levantamiento[]> {
    const params: unknown[] = []
    let where = ""
    if (filtro.estado) {
      params.push(filtro.estado)
      where = `WHERE estado = $1`
    }
    params.push(Math.min(Math.max(filtro.limite ?? 50, 1), 200))

    const { rows } = await this.pool.query<FilaLevantamiento>(
      `SELECT ${COLUMNAS} FROM levantamiento
       ${where}
       ORDER BY creado_en DESC, id DESC
       LIMIT $${params.length}`,
      params,
    )
    return rows.map(levantamientoADominio)
  }

  async guardar(levantamiento: Levantamiento): Promise<void> {
    const s = levantamiento.instantanea()
    await this.pool.query(
      `INSERT INTO levantamiento (
         id, public_slug, folio, estado,
         cliente_nombre, cliente_contacto, proyecto_nombre, fecha_reunion,
         contenido, esquema_version,
         creado_en, actualizado_en, publicado_en, confirmado_en
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO UPDATE SET
         estado = EXCLUDED.estado,
         cliente_nombre = EXCLUDED.cliente_nombre,
         cliente_contacto = EXCLUDED.cliente_contacto,
         proyecto_nombre = EXCLUDED.proyecto_nombre,
         fecha_reunion = EXCLUDED.fecha_reunion,
         contenido = EXCLUDED.contenido,
         esquema_version = EXCLUDED.esquema_version,
         actualizado_en = EXCLUDED.actualizado_en,
         publicado_en = EXCLUDED.publicado_en,
         confirmado_en = EXCLUDED.confirmado_en`,
      [
        s.id,
        s.slug.valor,
        s.folio,
        s.estado,
        s.clienteNombre,
        s.clienteContacto,
        s.proyectoNombre,
        s.fechaReunion.toISOString().slice(0, 10),
        JSON.stringify(s.contenido),
        VERSION_ESQUEMA_CONTENIDO,
        s.creadoEn.toISOString(),
        s.actualizadoEn.toISOString(),
        s.publicadoEn?.toISOString() ?? null,
        s.confirmadoEn?.toISOString() ?? null,
      ],
    )
  }
}
