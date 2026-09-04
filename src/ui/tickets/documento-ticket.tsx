import Image from "next/image"
import {
  ClipboardList,
  Lightbulb,
  ListChecks,
  ShieldCheck,
  Stethoscope,
  Wrench,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { formatearDinero } from "@/src/ui/formato"

function SeccionTitulo({
  icono: Icono,
  children,
}: {
  icono: LucideIcon
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-light to-primary/10 text-primary">
        <Icono className="h-4 w-4" />
      </span>
      <h2 className="text-sm font-bold text-text-primary">{children}</h2>
    </div>
  )
}

export function DocumentoTicket({ ticket }: { ticket: TicketPublicoDTO }) {
  const { moneda } = ticket

  const pasos = [
    {
      icono: ClipboardList,
      titulo: "Problema reportado",
      texto: ticket.problemaReportado,
    },
    { icono: Stethoscope, titulo: "Diagnóstico", texto: ticket.diagnostico },
    { icono: Wrench, titulo: "Trabajo realizado", texto: ticket.trabajoRealizado },
  ].filter((p) => p.texto)

  return (
    <div>
      {/* Membrete solo para impresión / PDF */}
      <div className="hidden items-center gap-3 border-b border-border px-8 pb-4 pt-6 print:flex">
        <span className="inline-flex rounded-md bg-bg-dark px-2 py-1.5">
          <Image
            src="/logo.png"
            alt="BR TECH"
            width={411}
            height={147}
            className="h-6 w-auto"
          />
        </span>
        <div className="border-l border-border pl-3">
          <p className="text-[11px] uppercase tracking-wider text-text-muted">
            Nota de servicio
          </p>
          <p className="text-sm font-bold text-text-primary">{ticket.folio}</p>
        </div>
      </div>

      {/* Filo superior de marca (pantalla) */}
      <div className="h-1 bg-gradient-to-r from-primary to-primary-hover print:hidden" />

      {/* Subtítulo (pantalla) */}
      <p className="border-b border-border px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-text-muted print:hidden sm:px-8">
        Desglose de servicio
      </p>

      <div className="space-y-8 p-6 sm:p-8">
        {/* Narrativa del servicio — línea de tiempo */}
        {pasos.length > 0 && (
          <section className="space-y-4">
            <SeccionTitulo icono={ClipboardList}>
              Detalle del servicio
            </SeccionTitulo>
            <div className="relative">
              {pasos.length > 1 && (
                <div className="absolute bottom-4 left-[21px] top-3 hidden w-px bg-gradient-to-b from-primary via-primary/40 to-transparent sm:block" />
              )}
              <div className="space-y-3">
                {pasos.map((paso) => (
                  <div
                    key={paso.titulo}
                    className="relative flex items-start gap-4"
                  >
                    <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-lg shadow-primary/20">
                      <paso.icono className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1 rounded-xl border border-border bg-surface p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {paso.titulo}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                        {paso.texto}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Conceptos */}
        <section className="space-y-4">
          <SeccionTitulo icono={ListChecks}>Conceptos</SeccionTitulo>

          <div className="overflow-hidden rounded-xl border border-border">
            <div className="hidden bg-bg-section px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted sm:grid sm:grid-cols-[1fr_4rem_7rem_7rem] sm:gap-3">
              <span>Concepto</span>
              <span className="text-right">Cant.</span>
              <span className="text-right">P. unitario</span>
              <span className="text-right">Importe</span>
            </div>
            <div className="divide-y divide-border">
              {ticket.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 px-4 py-3 sm:grid-cols-[1fr_4rem_7rem_7rem] sm:items-baseline sm:gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary">
                      {item.concepto}
                    </p>
                    {item.detalle && (
                      <p className="text-xs text-text-muted">{item.detalle}</p>
                    )}
                  </div>
                  <p className="text-right text-sm font-semibold tabular-nums text-text-primary sm:hidden">
                    {formatearDinero(item.importe, moneda)}
                  </p>
                  <p className="col-span-2 text-xs text-text-muted sm:hidden">
                    {item.cantidad} × {formatearDinero(item.precioUnitario, moneda)}
                  </p>
                  <p className="hidden text-right text-sm tabular-nums text-text-secondary sm:block">
                    {item.cantidad}
                  </p>
                  <p className="hidden text-right text-sm tabular-nums text-text-secondary sm:block">
                    {formatearDinero(item.precioUnitario, moneda)}
                  </p>
                  <p className="hidden text-right text-sm font-semibold tabular-nums text-text-primary sm:block">
                    {formatearDinero(item.importe, moneda)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="ml-auto w-full max-w-sm overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary-light/60 to-surface p-5">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">
                  {formatearDinero(ticket.subtotal, moneda)}
                </dd>
              </div>
              {ticket.impuesto > 0 && (
                <div className="flex justify-between text-text-secondary">
                  <dt>Impuesto</dt>
                  <dd className="tabular-nums">
                    {formatearDinero(ticket.impuesto, moneda)}
                  </dd>
                </div>
              )}
              <div className="mt-3 flex items-end justify-between border-t border-primary/20 pt-3">
                <dt className="text-sm font-semibold text-text-primary">Total</dt>
                <dd className="text-3xl font-bold tabular-nums text-primary">
                  {formatearDinero(ticket.total, moneda)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Recomendaciones y garantía */}
        {(ticket.recomendaciones || ticket.notaGarantia) && (
          <section className="grid gap-3 sm:grid-cols-2">
            {ticket.recomendaciones && (
              <div className="rounded-xl border border-primary/15 bg-primary-light/40 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Lightbulb className="h-4 w-4" />
                  Recomendaciones
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                  {ticket.recomendaciones}
                </p>
              </div>
            )}
            {ticket.notaGarantia && (
              <div className="rounded-xl border border-success/20 bg-success-light/50 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-success">
                  <ShieldCheck className="h-4 w-4" />
                  Garantía
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                  {ticket.notaGarantia}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Cierre */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-sm font-semibold text-text-primary">
            Gracias por tu preferencia
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            BR TECH Digital Systems · brtechds.com
          </p>
        </div>
      </div>
    </div>
  )
}
