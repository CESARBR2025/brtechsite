import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { SimboloBrTech } from "@/src/ui/marca/simbolo-brtech"
import { nombreDePila } from "@/src/ui/formato"

export function MembreteImpresion({ ticket }: { ticket: TicketPublicoDTO }) {
  return <div className="hidden items-center gap-3 border-b border-border pb-4 print:flex">
    <SimboloBrTech className="h-10 w-10" titulo="BR TECH" />
    <div className="border-l border-border pl-3">
      <p className="text-xs uppercase tracking-wider text-text-muted">BR TECH · {ticket.pagado ? "Recibo de pago" : "Nota de servicio"}</p>
      <p className="text-sm font-bold text-text-primary">{ticket.folio} · {nombreDePila(ticket.cliente.nombre)}</p>
    </div>
  </div>
}
