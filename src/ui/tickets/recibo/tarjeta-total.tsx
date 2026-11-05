import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { formatearDinero } from "@/src/ui/formato"
import { BadgePago } from "@/src/ui/primitivos/badge-estado"
import { SelloPagado } from "./sello-pagado"

export function TarjetaTotal({ ticket }: { ticket: TicketPublicoDTO }) {
  return (
    <section data-tarjeta-total className="no-print relative isolate -mt-10 overflow-hidden rounded-2xl bg-bg-dark p-6 shadow-glow ring-1 ring-inset ring-line-dark sm:-mt-12 sm:p-8" aria-label={ticket.pagado ? "Total pagado" : "Total a pagar"}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-line-dark)_1px,transparent_1px),linear-gradient(90deg,var(--color-line-dark)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_left,black,transparent_85%)]" />
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="min-w-0 max-w-full">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light/80">{ticket.pagado ? "Total pagado" : "Total a pagar"}</h2>
          <p className="mt-3 break-words font-hero text-4xl font-semibold leading-tight tracking-tight text-white tabular-nums sm:text-5xl">
            {formatearDinero(ticket.total, ticket.moneda)}
          </p>
        </div>
        {ticket.pagado ? <SelloPagado folio={ticket.folio} /> : <BadgePago pagado={false} />}
      </div>
    </section>
  )
}
