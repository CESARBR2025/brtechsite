import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { formatearFecha, nombreDePila } from "@/src/ui/formato"
import { SimboloBrTech } from "@/src/ui/marca/simbolo-brtech"
import { TextoDesenfocado } from "@/src/ui/primitivos/texto-desenfocado"
import { BotonImprimir } from "../boton-imprimir"
import { OndasDiferidas } from "../entrada/ondas-diferidas"

export function PortadaRecibo({ ticket }: { ticket: TicketPublicoDTO }) {
  return (
    <header className="no-print relative isolate overflow-hidden bg-bg-deep text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,color-mix(in_srgb,var(--color-primary)_32%,transparent),transparent_70%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-20"><OndasDiferidas /></div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-b from-transparent to-bg-deep/85" />

      <div className="mx-auto max-w-3xl px-5 pb-20 pt-6 sm:px-6 sm:pb-24 sm:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex shrink-0 items-center gap-2.5">
            <SimboloBrTech className="h-9 w-9" />
            <span className="font-hero text-xl font-semibold tracking-wide">BR TECH</span>
          </div>
          <BotonImprimir variante="oscuro" />
        </div>

        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-primary-light/80 sm:mt-16">
          {ticket.pagado ? "Recibo de pago" : "Nota de servicio"} · {ticket.folio}
        </p>
        <h1 className="mt-4 break-words font-hero text-[44px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl [&_span]:max-w-full">
          <TextoDesenfocado texto={`Hola, ${nombreDePila(ticket.cliente.nombre)}`} retrasoMs={200} />
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/75 sm:text-base">Este es el resumen de tu servicio.</p>

        <dl className="mt-8 grid grid-cols-1 gap-5 border-t border-line-dark pt-6 sm:grid-cols-[1fr_1.4fr] sm:gap-8">
          <div>
            <dt className="text-xs text-white/55">Fecha del servicio</dt>
            <dd className="mt-1 text-sm tabular-nums">{formatearFecha(ticket.fechaServicio)}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs text-white/55">Equipo</dt>
            <dd className="mt-1 break-words text-sm">
              {ticket.equipo.tipo}{ticket.equipo.detalle && ` · ${ticket.equipo.detalle}`}
            </dd>
          </div>
        </dl>
      </div>
    </header>
  )
}
