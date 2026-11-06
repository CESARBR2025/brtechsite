import { ShieldCheck } from "lucide-react"
import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { formatearFecha } from "@/src/ui/formato"
import { MedallaGarantia } from "./medalla-garantia"
import { BarraGarantia } from "./barra-garantia"
import { vigenciaGarantia } from "./textos-recibo"

export function TarjetaGarantia({ ticket, hoy }: { ticket: TicketPublicoDTO; hoy: string }) {
  if (ticket.escena.soloDiagnostico) return null
  const dias = ticket.garantiaDias ?? 0
  if (dias <= 0) return ticket.notaGarantia?.trim() ? <section className="exp-garantia-simple rounded-2xl border border-border bg-surface p-6 shadow-card">
    <h2 className="flex items-center gap-2 text-base font-semibold text-text-primary"><ShieldCheck aria-hidden="true" className="h-5 w-5 text-primary" />Garantía</h2>
    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-text-secondary">{ticket.notaGarantia}</p>
  </section> : null

  const vigencia = vigenciaGarantia(ticket.fechaServicio, dias, hoy)
  return <section className="exp-garantia grid items-center gap-[18px] rounded-2xl border border-border bg-surface px-6 py-[22px] shadow-card">
    <MedallaGarantia dias={dias} />
    <div className="min-w-0"><h2 className="text-base font-semibold text-text-primary">Garantía de {dias} días</h2>
      <p className="mt-1 whitespace-pre-wrap break-words text-[13.5px] leading-[1.5] text-text-secondary">{ticket.notaGarantia || (ticket.escena.principal === "ensamble" ? "Sobre el armado y la configuración." : "Sobre el trabajo realizado.")}</p>
      <BarraGarantia dias={dias} restantes={vigencia.restantes} porcentaje={vigencia.porcentaje} />
      <p className="mt-1.5 text-xs text-text-muted">{vigencia.restantes > 0 ? `Te quedan ${vigencia.restantes} ${vigencia.restantes === 1 ? "día" : "días"}, vigente hasta el ${formatearFecha(vigencia.fecha)}` : `Garantía vencida el ${formatearFecha(vigencia.fecha)}`}</p>
    </div>
  </section>
}
