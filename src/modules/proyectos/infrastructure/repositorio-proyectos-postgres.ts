import type { Pool } from "pg"
import { VERSION_ESQUEMA_CONTENIDO } from "../domain/contenido"
import type { Proyecto } from "../domain/proyecto"
import type { FiltroProyectos, RepositorioProyectos } from "../domain/repositorio-proyectos"
import type { SlugProyecto } from "../domain/slug-proyecto"
import { type FilaProyecto, proyectoADominio } from "./mapa-proyecto"

const COLUMNAS = `
  id, public_slug, folio, estado, levantamiento_id,
  cliente_nombre, cliente_contacto, proyecto_nombre,
  to_char(fecha_propuesta, 'YYYY-MM-DD') AS fecha_propuesta,
  contenido, esquema_version,
  creado_en, actualizado_en, publicado_en, aceptado_en, aceptado_por
`

export class RepositorioProyectosPostgres implements RepositorioProyectos {
  constructor(private readonly pool: Pool) {}

  async siguienteFolio(): Promise<string> {
    const { rows } = await this.pool.query<{ folio: string }>(
      "SELECT 'BRP-' || lpad(nextval('proyecto_folio_seq')::text, 6, '0') AS folio",
    )
    return rows[0].folio
  }

  obtenerPorId(id: string): Promise<Proyecto | null> {
    return this.obtenerPor("id", id)
  }

  obtenerPorSlug(slug: SlugProyecto): Promise<Proyecto | null> {
    return this.obtenerPor("public_slug", slug.valor)
  }

  private async obtenerPor(columna: "id" | "public_slug", valor: string): Promise<Proyecto | null> {
    // Un id que no es uuid no existe (y así Postgres no lanza error de tipo)
    if (columna === "id" && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valor)) return null
    const { rows } = await this.pool.query<FilaProyecto>(
      `SELECT ${COLUMNAS} FROM proyecto WHERE ${columna} = $1`,
      [valor],
    )
    return rows.length > 0 ? proyectoADominio(rows[0]) : null
  }

  async listar(filtro: FiltroProyectos = {}): Promise<Proyecto[]> {
    const params: unknown[] = []
    let where = ""
    if (filtro.estado) {
      params.push(filtro.estado)
      where = `WHERE estado = $1`
    }
    params.push(Math.min(Math.max(filtro.limite ?? 50, 1), 200))

    const { rows } = await this.pool.query<FilaProyecto>(
      `SELECT ${COLUMNAS} FROM proyecto
       ${where}
       ORDER BY creado_en DESC, id DESC
       LIMIT $${params.length}`,
      params,
    )
    return rows.map(proyectoADominio)
  }

  async guardar(proyecto: Proyecto): Promise<void> {
    const s = proyecto.instantanea()
    await this.pool.query(
      `INSERT INTO proyecto (
         id, public_slug, folio, estado, levantamiento_id,
         cliente_nombre, cliente_contacto, proyecto_nombre, fecha_propuesta,
         contenido, esquema_version,
         creado_en, actualizado_en, publicado_en, aceptado_en, aceptado_por
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       ON CONFLICT (id) DO UPDATE SET
         estado = EXCLUDED.estado,
         cliente_nombre = EXCLUDED.cliente_nombre,
         cliente_contacto = EXCLUDED.cliente_contacto,
         proyecto_nombre = EXCLUDED.proyecto_nombre,
         fecha_propuesta = EXCLUDED.fecha_propuesta,
         contenido = EXCLUDED.contenido,
         esquema_version = EXCLUDED.esquema_version,
         actualizado_en = EXCLUDED.actualizado_en,
         publicado_en = EXCLUDED.publicado_en,
         aceptado_en = EXCLUDED.aceptado_en,
         aceptado_por = EXCLUDED.aceptado_por`,
      [
        s.id,
        s.slug.valor,
        s.folio,
        s.estado,
        s.levantamientoId,
        s.clienteNombre,
        s.clienteContacto,
        s.proyectoNombre,
        s.fechaPropuesta.toISOString().slice(0, 10),
        JSON.stringify(s.contenido),
        VERSION_ESQUEMA_CONTENIDO,
        s.creadoEn.toISOString(),
        s.actualizadoEn.toISOString(),
        s.publicadoEn?.toISOString() ?? null,
        s.aceptadoEn?.toISOString() ?? null,
        s.aceptadoPor,
      ],
    )
  }
}
