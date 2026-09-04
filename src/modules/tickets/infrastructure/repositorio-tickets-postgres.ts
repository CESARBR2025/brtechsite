import type { Pool, PoolClient } from "pg"
import type {
  FiltroListado,
  RepositorioTickets,
} from "../domain/repositorio-tickets"
import type { SlugTicket } from "../domain/slug-ticket"
import type { Ticket } from "../domain/ticket"
import {
  type FilaItem,
  type FilaTicket,
  ticketADominio,
} from "./mapa-ticket"

const COLUMNAS_TICKET = `
  id, public_slug, folio, estado,
  cliente_nombre, cliente_contacto, equipo_tipo, equipo_detalle,
  problema_reportado, diagnostico, trabajo_realizado, recomendaciones,
  nota_garantia, moneda, impuesto_centavos, pagado,
  to_char(fecha_servicio, 'YYYY-MM-DD') AS fecha_servicio,
  creado_en, actualizado_en, publicado_en
`

export class RepositorioTicketsPostgres implements RepositorioTickets {
  constructor(private readonly pool: Pool) {}

  async siguienteFolio(): Promise<string> {
    const { rows } = await this.pool.query<{ folio: string }>(
      "SELECT 'BRT-' || lpad(nextval('service_ticket_folio_seq')::text, 6, '0') AS folio",
    )
    return rows[0].folio
  }

  async obtenerPorId(id: string): Promise<Ticket | null> {
    return this.obtenerPor("id", id)
  }

  async obtenerPorSlug(slug: SlugTicket): Promise<Ticket | null> {
    return this.obtenerPor("public_slug", slug.valor)
  }

  private async obtenerPor(
    columna: "id" | "public_slug",
    valor: string,
  ): Promise<Ticket | null> {
    const { rows } = await this.pool.query<FilaTicket>(
      `SELECT ${COLUMNAS_TICKET} FROM service_ticket WHERE ${columna} = $1`,
      [valor],
    )
    if (rows.length === 0) return null

    const filaTicket = rows[0]
    const { rows: filasItems } = await this.pool.query<FilaItem>(
      `SELECT id, ticket_id, posicion, concepto, detalle, cantidad, precio_unitario_centavos
       FROM service_ticket_item WHERE ticket_id = $1 ORDER BY posicion`,
      [filaTicket.id],
    )
    return ticketADominio(filaTicket, filasItems)
  }

  async listar(filtro: FiltroListado = {}): Promise<Ticket[]> {
    const condiciones: string[] = []
    const params: unknown[] = []

    if (filtro.estado) {
      params.push(filtro.estado)
      condiciones.push(`estado = $${params.length}`)
    }
    if (filtro.cursor) {
      params.push(filtro.cursor)
      condiciones.push(
        `(creado_en, id) < (SELECT creado_en, id FROM service_ticket WHERE id = $${params.length})`,
      )
    }

    const where =
      condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : ""
    const limite = Math.min(Math.max(filtro.limite ?? 50, 1), 200)
    params.push(limite)

    const { rows } = await this.pool.query<FilaTicket>(
      `SELECT ${COLUMNAS_TICKET} FROM service_ticket
       ${where}
       ORDER BY creado_en DESC, id DESC
       LIMIT $${params.length}`,
      params,
    )
    if (rows.length === 0) return []

    const ids = rows.map((r) => r.id)
    const { rows: filasItems } = await this.pool.query<FilaItem>(
      `SELECT id, ticket_id, posicion, concepto, detalle, cantidad, precio_unitario_centavos
       FROM service_ticket_item WHERE ticket_id = ANY($1) ORDER BY posicion`,
      [ids],
    )
    const porTicket = new Map<string, FilaItem[]>()
    for (const item of filasItems) {
      const lista = porTicket.get(item.ticket_id) ?? []
      lista.push(item)
      porTicket.set(item.ticket_id, lista)
    }
    return rows.map((fila) => ticketADominio(fila, porTicket.get(fila.id) ?? []))
  }

  async guardar(ticket: Ticket): Promise<void> {
    const s = ticket.instantanea()
    const client = await this.pool.connect()
    try {
      await client.query("BEGIN")

      await client.query(
        `INSERT INTO service_ticket (
           id, public_slug, folio, estado,
           cliente_nombre, cliente_contacto, equipo_tipo, equipo_detalle,
           problema_reportado, diagnostico, trabajo_realizado, recomendaciones,
           nota_garantia, moneda, impuesto_centavos, pagado, fecha_servicio,
           creado_en, actualizado_en, publicado_en
         ) VALUES (
           $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20
         )
         ON CONFLICT (id) DO UPDATE SET
           public_slug = EXCLUDED.public_slug,
           folio = EXCLUDED.folio,
           estado = EXCLUDED.estado,
           cliente_nombre = EXCLUDED.cliente_nombre,
           cliente_contacto = EXCLUDED.cliente_contacto,
           equipo_tipo = EXCLUDED.equipo_tipo,
           equipo_detalle = EXCLUDED.equipo_detalle,
           problema_reportado = EXCLUDED.problema_reportado,
           diagnostico = EXCLUDED.diagnostico,
           trabajo_realizado = EXCLUDED.trabajo_realizado,
           recomendaciones = EXCLUDED.recomendaciones,
           nota_garantia = EXCLUDED.nota_garantia,
           moneda = EXCLUDED.moneda,
           impuesto_centavos = EXCLUDED.impuesto_centavos,
           pagado = EXCLUDED.pagado,
           fecha_servicio = EXCLUDED.fecha_servicio,
           actualizado_en = EXCLUDED.actualizado_en,
           publicado_en = EXCLUDED.publicado_en`,
        [
          s.id,
          s.slug.valor,
          s.folio,
          s.estado,
          s.clienteNombre,
          s.clienteContacto,
          s.equipoTipo,
          s.equipoDetalle,
          s.problemaReportado,
          s.diagnostico,
          s.trabajoRealizado,
          s.recomendaciones,
          s.notaGarantia,
          s.moneda,
          s.impuesto.centavos,
          s.pagado,
          s.fechaServicio.toISOString().slice(0, 10),
          s.creadoEn.toISOString(),
          s.actualizadoEn.toISOString(),
          s.publicadoEn ? s.publicadoEn.toISOString() : null,
        ],
      )

      await client.query(
        "DELETE FROM service_ticket_item WHERE ticket_id = $1",
        [s.id],
      )

      if (s.items.length > 0) {
        const valores: string[] = []
        const params: unknown[] = []
        s.items.forEach((item, i) => {
          const base = i * 7
          valores.push(
            `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7})`,
          )
          params.push(
            item.id,
            s.id,
            i,
            item.concepto,
            item.detalle,
            item.cantidad,
            item.precioUnitario.centavos,
          )
        })
        await client.query(
          `INSERT INTO service_ticket_item
             (id, ticket_id, posicion, concepto, detalle, cantidad, precio_unitario_centavos)
           VALUES ${valores.join(", ")}`,
          params,
        )
      }

      await client.query("COMMIT")
    } catch (err) {
      await safeRollback(client)
      throw err
    } finally {
      client.release()
    }
  }
}

async function safeRollback(client: PoolClient): Promise<void> {
  try {
    await client.query("ROLLBACK")
  } catch {
    /* la conexión ya está rota; release() la descarta */
  }
}
