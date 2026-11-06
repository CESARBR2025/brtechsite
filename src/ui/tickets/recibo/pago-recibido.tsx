import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { formatearDinero, nombreDePila } from "@/src/ui/formato"

export function PagoRecibido({ ticket }: { ticket: TicketPublicoDTO }) {
  return <section className="exp-confirmado rounded-2xl border border-border bg-surface p-[26px] text-center shadow-card">
    <div className="exp-circulo mx-auto mt-1 grid h-[60px] w-[60px] place-items-center rounded-full bg-success text-white shadow-lg shadow-success/25"><svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path pathLength="1" d="M20 6 9 17l-5-5" /></svg></div>
    <h2 className="mt-4 text-[19px] font-semibold text-text-primary">Pago recibido</h2>
    <p className="mt-1.5 text-sm leading-[1.55] text-text-secondary">Recibimos tus {formatearDinero(ticket.total, ticket.moneda)}. Gracias por confiar en nosotros, {nombreDePila(ticket.cliente.nombre)}.</p>
  </section>
}
