import type { DatosPagoDTO, TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { formatearDinero } from "@/src/ui/formato"
import { WHATSAPP } from "@/src/ui/marketing/datos-contacto"
import { BotonCopiar } from "./boton-copiar"
import { TarjetaBanco } from "./tarjeta-banco"

export function ComoPagar({ ticket, datos }: { ticket: TicketPublicoDTO; datos: DatosPagoDTO | null }) {
  if (ticket.pagado) return null

  const monto = formatearDinero(ticket.total, ticket.moneda)
  const mensaje = datos
    ? `Hola, ya pagué la nota ${ticket.folio} por ${monto}. Te comparto mi comprobante.`
    : `Hola, quiero pagar la nota ${ticket.folio}.`
  const enlace = `https://wa.me/${WHATSAPP.telefono.replace("+", "")}?text=${encodeURIComponent(mensaje)}`
  const filas = datos ? [
    { etiqueta: "Monto", valor: monto, copiar: ticket.total.toFixed(2) },
    { etiqueta: "Concepto", valor: ticket.folio, copiar: ticket.folio },
  ] : []

  return (
    <section aria-labelledby="como-pagar" className="no-print rounded-2xl border border-border bg-surface p-[26px] shadow-card">
      <h2 id="como-pagar" className="text-lg font-semibold text-text-primary">{datos ? "Paga por transferencia" : "Cómo pagar"}</h2>
      {datos ? (
        <>
          <p className="mt-1 text-sm text-text-muted">Copia los datos y transfiere desde tu banco.</p>
          <TarjetaBanco datos={datos} />
          <dl className="mt-2 divide-y divide-border">
            {filas.map((fila) => (
              <div key={fila.etiqueta} className="relative py-[13px]">
                <dt className="text-xs text-text-muted">{fila.etiqueta}</dt>
                <dd className="mt-0.5 flex items-center justify-between gap-3">
                  <span className="min-w-0 break-words text-[15px] font-medium text-text-primary tabular-nums">{fila.valor}</span>
                  <BotonCopiar texto={fila.copiar} etiqueta={fila.etiqueta} aviso={`${fila.etiqueta} copiado`} />
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : <p className="mt-3 text-sm leading-relaxed text-text-secondary">Escríbenos por WhatsApp y te compartimos los datos para tu pago.</p>}
      <a href={enlace} target="_blank" rel="noopener noreferrer" className="no-print mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-primary px-5 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        {datos ? "Ya transferí, enviar comprobante" : "Pedir datos de pago"}
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0"><path d={WHATSAPP.path} /></svg>
      </a>
    </section>
  )
}
