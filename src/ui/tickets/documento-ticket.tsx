import Image from "next/image"
import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { formatearDinero, formatearFecha } from "@/src/ui/formato"
import { BadgePago } from "@/src/ui/primitivos/badge-estado"
import { BotonImprimir } from "./boton-imprimir"

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string | null }) {
  if (!valor) return null
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-text-muted">
        {etiqueta}
      </dt>
      <dd className="mt-0.5 text-sm text-text-primary">{valor}</dd>
    </div>
  )
}

function Parrafo({ titulo, texto }: { titulo: string; texto: string | null }) {
  if (!texto) return null
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
        {titulo}
      </h3>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
        {texto}
      </p>
    </div>
  )
}

export function DocumentoTicket({ ticket }: { ticket: TicketPublicoDTO }) {
  const { moneda } = ticket

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      {/* Encabezado */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <Image
            src="/logo2.png"
            alt="BR TECH"
            width={64}
            height={64}
            className="h-14 w-auto"
          />
          <p className="mt-3 text-xs uppercase tracking-wider text-text-muted">
            Ticket de servicio
          </p>
          <p className="text-lg font-bold text-text-primary">{ticket.folio}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-text-muted">
            Fecha de servicio
          </p>
          <p className="text-sm font-medium text-text-primary">
            {formatearFecha(ticket.fechaServicio)}
          </p>
          <div className="mt-2 flex justify-end">
            <BadgePago pagado={ticket.pagado} />
          </div>
        </div>
      </header>

      {/* Cliente y equipo */}
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <Dato etiqueta="Cliente" valor={ticket.cliente.nombre} />
        <Dato etiqueta="Contacto" valor={ticket.cliente.contacto} />
        <Dato etiqueta="Equipo" valor={ticket.equipo.tipo} />
        <Dato etiqueta="Detalle del equipo" valor={ticket.equipo.detalle} />
      </dl>

      {/* Narrativa del servicio */}
      <div className="mt-6 space-y-4">
        <Parrafo titulo="Problema reportado" texto={ticket.problemaReportado} />
        <Parrafo titulo="Diagnóstico" texto={ticket.diagnostico} />
        <Parrafo titulo="Trabajo realizado" texto={ticket.trabajoRealizado} />
      </div>

      {/* Conceptos */}
      <section className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
          Conceptos
        </h3>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-text-muted">
              <th className="pb-2 font-medium">Concepto</th>
              <th className="pb-2 text-right font-medium">Cant.</th>
              <th className="pb-2 text-right font-medium">P. unitario</th>
              <th className="pb-2 text-right font-medium">Importe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ticket.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2.5 pr-3 align-top text-text-primary">
                  {item.concepto}
                  {item.detalle && (
                    <span className="block text-xs text-text-muted">
                      {item.detalle}
                    </span>
                  )}
                </td>
                <td className="py-2.5 text-right align-top tabular-nums text-text-secondary">
                  {item.cantidad}
                </td>
                <td className="py-2.5 text-right align-top tabular-nums text-text-secondary">
                  {formatearDinero(item.precioUnitario, moneda)}
                </td>
                <td className="py-2.5 text-right align-top tabular-nums text-text-primary">
                  {formatearDinero(item.importe, moneda)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div className="mt-4 flex justify-end">
          <dl className="w-full max-w-xs space-y-1.5 text-sm">
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
            <div className="flex items-baseline justify-between border-t border-border pt-2">
              <dt className="text-sm font-semibold text-text-primary">Total</dt>
              <dd className="text-2xl font-bold tabular-nums text-text-primary">
                {formatearDinero(ticket.total, moneda)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Recomendaciones y garantía */}
      <div className="mt-8 space-y-4">
        <Parrafo titulo="Recomendaciones" texto={ticket.recomendaciones} />
        <Parrafo titulo="Garantía" texto={ticket.notaGarantia} />
      </div>

      <div className="no-print mt-8 flex justify-end">
        <BotonImprimir />
      </div>
    </article>
  )
}
