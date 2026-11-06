import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { formatearFecha, nombreDePila } from "@/src/ui/formato"
import { SimboloBrTech } from "@/src/ui/marca/simbolo-brtech"
import { TextoDesenfocado } from "@/src/ui/primitivos/texto-desenfocado"
import { BotonImprimir } from "../boton-imprimir"
import { Activador } from "./ilustracion/activador"
import { IlustracionServicio } from "./ilustracion/ilustracion-servicio"
import { MembreteImpresion } from "./membrete-impresion"
import { diasDesdeServicio, textosRecibo } from "./textos-recibo"

export function PortadaExpediente({ ticket, hoy }: { ticket: TicketPublicoDTO; hoy: string }) {
  const textos = textosRecibo(ticket)
  const dias = diasDesdeServicio(ticket.fechaServicio, hoy)
  const estado = ticket.escena.soloDiagnostico ? "Diagnóstico listo" : ticket.equipo.categoria === "otro" ? "Listo" : "Lista"
  const entrega = dias === 0 ? `${estado} hoy` : `${estado} hace ${dias} ${dias === 1 ? "día" : "días"}`
  return (
    <header className="exp-portada relative isolate overflow-hidden text-white">
      <MembreteImpresion ticket={ticket} />
      <div aria-hidden="true" className="exp-velo pointer-events-none absolute inset-0" />
      <div className="exp-contenedor relative">
        <div className="no-print flex items-center justify-between gap-4 py-7">
          <div className="flex shrink-0 items-center gap-2.5">
            <SimboloBrTech className="h-[34px] w-[34px]" />
            <span className="font-hero text-xl font-semibold tracking-wide">BR TECH</span>
          </div>
          <BotonImprimir variante="oscuro" texto="Descargar comprobante" />
        </div>
        <div className="exp-heroe grid items-center gap-10 pt-4 lg:grid-cols-[1.05fr_.95fr] lg:pt-12">
          <div className="min-w-0">
            <p className="exp-rotulo flex items-center gap-2.5 text-sm text-primary-light/70"><span aria-hidden="true" className="h-px w-7 bg-primary-light/40" />{ticket.pagado ? "Recibo de pago" : "Nota de servicio"} {ticket.folio}</p>
            <h1 className="exp-saludo mt-5 break-words font-hero text-[clamp(56px,8vw,104px)] font-semibold leading-[.98] tracking-[-.03em] [&_span]:max-w-full">
              <TextoDesenfocado texto={`${ticket.pagado ? "Gracias" : "Hola"}, ${nombreDePila(ticket.cliente.nombre)}`} retrasoMs={200} />
            </h1>
            <p className="exp-apoyo mt-[22px] max-w-[460px] text-base leading-[1.6] text-white/75 sm:text-lg">{textos.apoyo}</p>
            <dl className="exp-metas mt-10 flex flex-wrap gap-x-7 gap-y-3.5 border-t border-white/12 pt-6 sm:gap-x-10">
              <div className="min-w-0"><dt>Equipo</dt><dd className="break-words">{ticket.equipo.detalle || ticket.equipo.tipo}</dd></div>
              <div><dt>Fecha del servicio</dt><dd>{formatearFecha(ticket.fechaServicio)}</dd></div>
              <div><dt>Entrega</dt><dd><span aria-hidden="true" className="exp-vivo" />{entrega}</dd></div>
            </dl>
          </div>
          <div className="exp-ilustracion relative mx-auto w-full max-w-[460px] lg:max-w-none">
            <div aria-hidden="true" className="exp-halo pointer-events-none absolute" />
            <Activador><IlustracionServicio escena={ticket.escena} /></Activador>
          </div>
        </div>
      </div>
    </header>
  )
}
