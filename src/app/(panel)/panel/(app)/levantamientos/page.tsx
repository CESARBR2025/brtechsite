import Link from "next/link"
import { CalendarDays, CheckCircle2, ClipboardList, Plus } from "lucide-react"
import { levantamientos } from "@/src/modules/levantamientos/infrastructure/contenedor"
import { formatearFecha } from "@/src/ui/formato"
import { BadgeEstado } from "@/src/ui/primitivos/badge-estado"

export const dynamic = "force-dynamic"

const BOTON_NUEVO =
  "group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]"

export default async function PaginaLevantamientos() {
  const lista = await levantamientos().consultarLevantamientos.listar({ limite: 100 })

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-xs font-medium text-primary">
            <ClipboardList className="h-3.5 w-3.5" />
            Software a la medida
          </div>
          <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">
            Levantamientos
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Requisitos del primer acercamiento y el diagnóstico que recibe cada
            cliente.
          </p>
        </div>
        <Link href="/panel/levantamientos/nuevo" className={BOTON_NUEVO}>
          <Plus className="h-4 w-4" />
          Nuevo levantamiento
        </Link>
      </div>

      {lista.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-primary/10 text-primary shadow-sm">
            <ClipboardList className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-text-primary">
            Aún no hay levantamientos
          </h2>
          <p className="mt-1 max-w-xs text-sm text-text-secondary">
            Ábrelo al empezar la reunión con un cliente nuevo y captura mientras
            platican.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((l) => {
            const avance = Math.round((l.seccionesCompletas / l.seccionesTotales) * 100)
            return (
              <Link
                key={l.id}
                href={`/panel/levantamientos/${l.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:border-primary/30 hover:shadow-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {l.folio}
                  </p>
                  <div className="flex flex-col items-end gap-1">
                    <BadgeEstado estado={l.estado} />
                    {l.confirmado && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-2.5 py-0.5 text-[11px] font-semibold text-success">
                        <CheckCircle2 className="h-3 w-3" /> Confirmado
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="mt-2 truncate text-base font-semibold text-text-primary">
                  {l.clienteNombre}
                </h3>
                <p className="mt-0.5 truncate text-sm text-text-secondary">
                  {l.proyectoNombre ?? "Proyecto sin nombre"}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatearFecha(l.fechaReunion)}
                </p>
                <div className="mt-4 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Captura</span>
                    <span className="tabular-nums">
                      {l.seccionesCompletas}/{l.seccionesTotales}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-section">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-hover to-primary"
                      style={{ width: `${avance}%` }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
