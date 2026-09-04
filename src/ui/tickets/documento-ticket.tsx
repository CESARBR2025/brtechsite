import Image from "next/image"
import {
  CalendarDays,
  ClipboardList,
  Laptop,
  Lightbulb,
  Phone,
  ShieldCheck,
  Stethoscope,
  User,
  Wrench,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { formatearDinero, formatearFecha } from "@/src/ui/formato"
import { BadgePago } from "@/src/ui/primitivos/badge-estado"

function DatoTile({
  icono: Icono,
  etiqueta,
  valor,
  extra,
}: {
  icono: LucideIcon
  etiqueta: string
  valor: string
  extra?: React.ReactNode
}) {
  return (
    <div className="rounded-xl bg-bg-section p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
        <Icono className="h-3.5 w-3.5" />
        {etiqueta}
      </div>
      <p className="mt-1.5 text-sm font-medium text-text-primary">{valor}</p>
      {extra && (
        <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
          {extra}
        </p>
      )}
    </div>
  )
}

function Narrativa({
  icono: Icono,
  titulo,
  texto,
}: {
  icono: LucideIcon
  titulo: string
  texto: string | null
}) {
  if (!texto) return null
  return (
    <div className="border-l-2 border-primary-light pl-4">
      <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
        <Icono className="h-3.5 w-3.5" />
        {titulo}
      </h3>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
        {texto}
      </p>
    </div>
  )
}

function Callout({
  icono: Icono,
  titulo,
  texto,
  tono,
}: {
  icono: LucideIcon
  titulo: string
  texto: string | null
  tono: "primary" | "success"
}) {
  if (!texto) return null
  const fondo =
    tono === "primary" ? "bg-primary-light/40" : "bg-success-light/50"
  return (
    <div className={`rounded-xl p-4 ${fondo}`}>
      <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
        <Icono className="h-3.5 w-3.5" />
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
  const hayNarrativa =
    ticket.problemaReportado || ticket.diagnostico || ticket.trabajoRealizado

  return (
    <div className="p-6 sm:p-8">
      {/* Encabezado propio del documento (se ve siempre y también al imprimir) */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Image
            src="/logo2.png"
            alt="BR TECH"
            width={48}
            height={48}
            className="h-10 w-auto"
          />
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted">
              Nota de servicio
            </p>
            <p className="text-sm font-bold text-text-primary">{ticket.folio}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatearFecha(ticket.fechaServicio)}
        </div>
      </header>

      <div className="mt-6 space-y-7">
        {/* Cliente y equipo */}
        <div className="grid gap-3 sm:grid-cols-2">
          <DatoTile
            icono={User}
            etiqueta="Cliente"
            valor={ticket.cliente.nombre}
            extra={
              ticket.cliente.contacto ? (
                <>
                  <Phone className="h-3 w-3" />
                  {ticket.cliente.contacto}
                </>
              ) : null
            }
          />
          <DatoTile
            icono={Laptop}
            etiqueta="Equipo"
            valor={ticket.equipo.tipo}
            extra={ticket.equipo.detalle}
          />
        </div>

        {/* Narrativa del servicio */}
        {hayNarrativa && (
          <div className="space-y-4">
            <Narrativa
              icono={ClipboardList}
              titulo="Problema reportado"
              texto={ticket.problemaReportado}
            />
            <Narrativa
              icono={Stethoscope}
              titulo="Diagnóstico"
              texto={ticket.diagnostico}
            />
            <Narrativa
              icono={Wrench}
              titulo="Trabajo realizado"
              texto={ticket.trabajoRealizado}
            />
          </div>
        )}

        {/* Conceptos */}
        <div className="border-t border-border pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Conceptos
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-sm">
              <thead>
                <tr className="rounded-lg bg-bg-section text-left text-[11px] uppercase tracking-wider text-text-muted">
                  <th className="rounded-l-lg px-3 py-2 font-medium">
                    Concepto
                  </th>
                  <th className="px-3 py-2 text-right font-medium">Cant.</th>
                  <th className="px-3 py-2 text-right font-medium">
                    P. unitario
                  </th>
                  <th className="rounded-r-lg px-3 py-2 text-right font-medium">
                    Importe
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ticket.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2.5 align-top text-text-primary">
                      {item.concepto}
                      {item.detalle && (
                        <span className="block text-xs text-text-muted">
                          {item.detalle}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right align-top tabular-nums text-text-secondary">
                      {item.cantidad}
                    </td>
                    <td className="px-3 py-2.5 text-right align-top tabular-nums text-text-secondary">
                      {formatearDinero(item.precioUnitario, moneda)}
                    </td>
                    <td className="px-3 py-2.5 text-right align-top font-medium tabular-nums text-text-primary">
                      {formatearDinero(item.importe, moneda)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="mt-5 flex justify-end">
            <dl className="w-full max-w-xs space-y-2 rounded-xl bg-bg-section p-4 text-sm">
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
                <dt className="font-semibold text-text-primary">Total</dt>
                <dd className="text-2xl font-bold tabular-nums text-primary">
                  {formatearDinero(ticket.total, moneda)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Recomendaciones y garantía */}
        {(ticket.recomendaciones || ticket.notaGarantia) && (
          <div className="space-y-3">
            <Callout
              icono={Lightbulb}
              titulo="Recomendaciones"
              texto={ticket.recomendaciones}
              tono="primary"
            />
            <Callout
              icono={ShieldCheck}
              titulo="Garantía"
              texto={ticket.notaGarantia}
              tono="success"
            />
          </div>
        )}

        {/* Sello de pago */}
        <div className="flex items-center justify-between border-t border-border pt-5">
          <p className="text-xs text-text-muted">
            Gracias por confiar en BR TECH.
          </p>
          <BadgePago pagado={ticket.pagado} />
        </div>
      </div>
    </div>
  )
}
