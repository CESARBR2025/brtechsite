import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { formatearDinero } from "@/src/ui/formato"
import { Contador } from "@/src/ui/primitivos/contador"

export function TablaConceptos({ ticket, conHistoria }: { ticket: TicketPublicoDTO; conHistoria: boolean }) {
  return <section className={conHistoria ? "exp-conceptos mt-7 border-t border-border pt-9" : "exp-conceptos"} aria-labelledby="titulo-conceptos">
    <h2 id="titulo-conceptos" className="text-xl font-semibold tracking-[-.01em] text-text-primary">Conceptos</h2>
    <table className="exp-tabla tabular-nums">
      <thead><tr><th scope="col">Concepto</th><th scope="col" className="exp-cantidad">Cant.</th><th scope="col" className="exp-unitario">Precio</th><th scope="col" className="exp-importe">Importe</th></tr></thead>
      <tbody>{ticket.items.map((item) => <tr key={item.id}>
        <td><div className="flex flex-wrap items-center gap-2.5 font-medium text-text-primary">{item.concepto}{item.clase === "pieza" && <span className="exp-pieza">Pieza nueva</span>}</div>{item.detalle && <small className="mt-1 block whitespace-pre-wrap break-words text-[13px] text-text-muted">{item.detalle}</small>}</td>
        <td className="exp-cantidad">{item.cantidad}</td>
        <td className="exp-unitario">{formatearDinero(item.precioUnitario, ticket.moneda)}</td>
        <td className="exp-importe font-semibold text-text-primary"><Contador valor={item.importe} moneda={ticket.moneda} duracionMs={900} /></td>
      </tr>)}</tbody>
    </table>
    <dl className="ml-auto mt-6 w-full max-w-[340px] text-[15px] text-text-secondary tabular-nums">
      <div className="flex justify-between gap-3 py-2"><dt>Subtotal</dt><dd>{formatearDinero(ticket.subtotal, ticket.moneda)}</dd></div>
      {ticket.impuesto > 0 && <div className="flex justify-between gap-3 py-2"><dt>Impuesto</dt><dd>{formatearDinero(ticket.impuesto, ticket.moneda)}</dd></div>}
      <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-text-primary pt-4 font-semibold text-text-primary"><dt>Total</dt><dd className="font-hero text-[28px] tracking-[-.01em]">{formatearDinero(ticket.total, ticket.moneda)}</dd></div>
    </dl>
  </section>
}
