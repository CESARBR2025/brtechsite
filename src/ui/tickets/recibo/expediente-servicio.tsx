import { Lightbulb } from "lucide-react"
import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { HistoriaServicio } from "./historia-servicio"
import { TablaConceptos } from "./tabla-conceptos"
import { textosRecibo } from "./textos-recibo"

export function ExpedienteServicio({ ticket }: { ticket: TicketPublicoDTO }) {
  const textos = textosRecibo(ticket)
  return <article className="exp-servicio exp-con-luz relative min-w-0 rounded-2xl border border-border bg-surface shadow-card">
    {textos.pasos.length > 0 && <>
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div><h2 className="text-[26px] font-semibold tracking-[-.02em] text-text-primary">{textos.titulo}</h2><p className="mt-1.5 text-[15px] text-text-muted">{textos.subtitulo}</p></div>
        <span className="shrink-0 rounded-md border border-border bg-bg-section px-3 py-1.5 font-mono text-xs tracking-[.06em] text-text-muted">{ticket.folio}</span>
      </div>
      <HistoriaServicio ticket={ticket} />
    </>}
    <TablaConceptos ticket={ticket} conHistoria={textos.pasos.length > 0} />
    {ticket.recomendaciones && <p className="mt-7 flex items-start gap-2.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-text-secondary"><Lightbulb aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><strong className="font-semibold">Para que dure:</strong> {ticket.recomendaciones}</span></p>}
  </article>
}
