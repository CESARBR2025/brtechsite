import Link from "next/link"
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Laptop,
  Plus,
  ReceiptText,
  Wrench,
} from "lucide-react"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import { tickets } from "@/src/modules/tickets/infrastructure/contenedor"
import { formatearDinero, formatearFecha } from "@/src/ui/formato"
import { EncabezadoPanel } from "@/src/ui/panel/encabezado-panel"
import { CopiarEnlace } from "@/src/ui/panel/copiar-enlace"
import { BadgeEstado, BadgePago } from "@/src/ui/primitivos/badge-estado"

export const dynamic = "force-dynamic"

const PILL =
  "inline-flex items-center gap-1 rounded-lg bg-bg-section px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-border"

function Kpi({
  icono: Icono,
  valor,
  etiqueta,
}: {
  icono: typeof ReceiptText
  valor: number
  etiqueta: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary/10 text-primary shadow-sm">
          <Icono className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums text-text-primary">
            {valor}
          </p>
          <p className="text-xs text-text-muted">{etiqueta}</p>
        </div>
      </div>
    </div>
  )
}

export default async function PaginaPanel() {
  const lista = await tickets().consultarTickets.listar({ limite: 100 })
  const base = getEnv().SITE_URL

  const publicados = lista.filter((t) => t.estado === "publicado").length
  const pendientesPago = lista.filter(
    (t) => !t.pagado && t.estado !== "archivado",
  ).length

  return (
    <>
      <EncabezadoPanel />
      <main className="min-h-screen bg-bg-section">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-xs font-medium text-primary">
                <ReceiptText className="h-3.5 w-3.5" />
                Panel
              </div>
              <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">
                Tickets de servicio
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                {lista.length} {lista.length === 1 ? "ticket" : "tickets"} en
                total
              </p>
            </div>
            <Link
              href="/panel/nuevo"
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-hover px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Nuevo ticket
            </Link>
          </div>

          {lista.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Kpi icono={ReceiptText} valor={lista.length} etiqueta="Tickets" />
              <Kpi
                icono={CheckCircle2}
                valor={publicados}
                etiqueta="Publicados"
              />
              <Kpi
                icono={Clock}
                valor={pendientesPago}
                etiqueta="Pendientes de pago"
              />
            </div>
          )}

          {lista.length === 0 ? (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-primary/10 text-primary shadow-sm">
                <ReceiptText className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-text-primary">
                Aún no hay tickets
              </h2>
              <p className="mt-1 max-w-xs text-sm text-text-secondary">
                Crea el primero para generar la nota de servicio y su página
                pública.
              </p>
              <Link
                href="/panel/nuevo"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                <Plus className="h-4 w-4" />
                Nuevo ticket
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lista.map((t) => (
                <div
                  key={t.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:border-primary/30 hover:shadow-hover"
                >
                  <div className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 rounded-full bg-primary-light/30 transition-all group-hover:scale-150" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary/10 text-primary shadow-sm">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <BadgeEstado estado={t.estado} />
                      <BadgePago pagado={t.pagado} />
                    </div>
                  </div>

                  <p className="relative mt-4 text-xs font-semibold uppercase tracking-wider text-primary">
                    {t.folio}
                  </p>
                  <h3 className="relative mt-0.5 truncate text-base font-semibold text-text-primary">
                    {t.clienteNombre}
                  </h3>
                  <p className="relative mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
                    <Laptop className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                    <span className="truncate">{t.equipoTipo}</span>
                  </p>
                  <p className="relative mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatearFecha(t.fechaServicio)}
                  </p>

                  <div className="relative mt-4 flex items-end justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-text-muted">
                        Total
                      </p>
                      <p className="text-lg font-bold tabular-nums text-text-primary">
                        {formatearDinero(t.total, t.moneda)}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-3 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/panel/${t.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary-light px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      Editar
                    </Link>
                    {t.estado === "publicado" && (
                      <>
                        <a
                          href={`/t/${t.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className={PILL}
                        >
                          Ver
                        </a>
                        <CopiarEnlace url={`${base}/t/${t.slug}`} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
