import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { formatearDinero } from "@/src/ui/formato"
import { SelloPagado } from "./sello-pagado"

/** Nueve rosetas de 600 segmentos, con la geometría de la maqueta. */
const ROSETAS = Array.from({ length: 9 }, (_, j) => {
  let trazado = ""
  for (let i = 0; i <= 600; i++) {
    const t = i / 600 * Math.PI * 2, r = 90 + j * 9 + 10 * Math.cos(22 * t + j * .5)
    trazado += `${i ? "L" : "M"}${(330 + r * Math.cos(t)).toFixed(1)} ${(40 + r * Math.sin(t)).toFixed(1)}`
  }
  return `${trazado}Z`
})

export function ResumenCuenta({ ticket }: { ticket: TicketPublicoDTO }) {
  const partes = new Intl.NumberFormat("es-MX", { style: "currency", currency: ticket.moneda }).formatToParts(ticket.total)
  const entero = partes.filter((p) => p.type === "integer" || p.type === "group").map((p) => p.value).join("")
  const simbolo = partes.find((p) => p.type === "currency")?.value ?? "$"
  const centavos = partes.filter((p) => p.type === "decimal" || p.type === "fraction").map((p) => p.value).join("")
  return <section data-tarjeta-total className="exp-resumen relative overflow-hidden rounded-2xl bg-bg-dark p-7 text-white shadow-glow ring-1 ring-inset ring-line-dark" aria-label="Resumen de cuenta">
    <svg className="exp-guilloche" viewBox="0 0 372 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{ROSETAS.map((d, i) => <path key={i} d={d} />)}</svg>
    <div className="relative flex items-center justify-between gap-3"><h2 className="text-sm text-primary-light/70">{ticket.pagado ? "Total pagado" : "Total a pagar"}</h2><span className={`exp-estado ${ticket.pagado ? "exp-estado-pagado" : ""}`}><span aria-hidden="true" />{ticket.pagado ? "Pagado" : "Pendiente"}</span></div>
    <p aria-label={formatearDinero(ticket.total, ticket.moneda)} className="relative mt-[26px] flex flex-wrap items-start font-hero font-semibold leading-none tracking-[-.02em] tabular-nums"><span aria-hidden="true" className="mr-0.5 mt-1 text-2xl text-primary-light">{simbolo}</span><span aria-hidden="true" className="text-5xl">{entero}</span><span aria-hidden="true" className="ml-0.5 mt-1 text-[22px] text-primary-light">{centavos}</span></p>
    {ticket.totalEnLetra && <p className="relative mt-2.5 text-[13px] text-primary-light/55">{ticket.totalEnLetra}</p>}
    <dl className="relative mt-[22px] grid gap-2 border-t border-white/12 pt-[18px] text-[13.5px] text-primary-light/70 tabular-nums">
      <div className="flex justify-between gap-2"><dt>{ticket.escena.soloDiagnostico ? "Diagnóstico" : "Mano de obra"}</dt><dd className="font-medium text-white">{formatearDinero(ticket.desglose.manoDeObra, ticket.moneda)}</dd></div>
      {ticket.desglose.piezas > 0 && <div className="flex justify-between gap-2"><dt>Piezas</dt><dd className="font-medium text-white">{formatearDinero(ticket.desglose.piezas, ticket.moneda)}</dd></div>}
      {ticket.impuesto > 0 && <div className="flex justify-between gap-2"><dt>Impuesto</dt><dd className="font-medium text-white">{formatearDinero(ticket.impuesto, ticket.moneda)}</dd></div>}
    </dl>
    {ticket.pagado && <div className="relative mt-4 flex justify-end"><SelloPagado folio={ticket.folio} /></div>}
  </section>
}
