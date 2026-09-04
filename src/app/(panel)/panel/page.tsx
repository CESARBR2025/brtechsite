import Link from "next/link"
import { Plus } from "lucide-react"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import { tickets } from "@/src/modules/tickets/infrastructure/contenedor"
import { formatearDinero, formatearFecha } from "@/src/ui/formato"
import { EncabezadoPanel } from "@/src/ui/panel/encabezado-panel"
import { CopiarEnlace } from "@/src/ui/panel/copiar-enlace"
import { BadgeEstado, BadgePago } from "@/src/ui/primitivos/badge-estado"

export const dynamic = "force-dynamic"

export default async function PaginaPanel() {
  const lista = await tickets().consultarTickets.listar({ limite: 100 })
  const base = getEnv().SITE_URL

  return (
    <>
      <EncabezadoPanel />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              Tickets de servicio
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {lista.length} {lista.length === 1 ? "ticket" : "tickets"}
            </p>
          </div>
          <Link
            href="/panel/nuevo"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Nuevo ticket
          </Link>
        </div>

        {lista.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <p className="text-sm text-text-secondary">
              Aún no hay tickets. Crea el primero.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-text-muted">
                    <th className="px-4 py-3 font-medium">Folio</th>
                    <th className="px-4 py-3 font-medium">Cliente</th>
                    <th className="px-4 py-3 font-medium">Equipo</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lista.map((t) => (
                    <tr key={t.id} className="hover:bg-bg-section">
                      <td className="px-4 py-3 font-medium text-text-primary">
                        {t.folio}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {t.clienteNombre}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {t.equipoTipo}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-text-primary">
                        {formatearDinero(t.total, t.moneda)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <BadgeEstado estado={t.estado} />
                          <BadgePago pagado={t.pagado} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {formatearFecha(t.fechaServicio)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/panel/${t.id}`}
                            className="rounded-md bg-bg-section px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-border"
                          >
                            Editar
                          </Link>
                          {t.estado === "publicado" && (
                            <>
                              <a
                                href={`/t/${t.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-md bg-bg-section px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-border"
                              >
                                Ver
                              </a>
                              <CopiarEnlace url={`${base}/t/${t.slug}`} />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
