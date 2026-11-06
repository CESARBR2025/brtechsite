import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { tickets } from "@/src/modules/tickets/infrastructure/contenedor"
import { nombreDePila } from "@/src/ui/formato"
import { BloqueConoceMas } from "@/src/ui/tickets/bloque-conoce-mas"
import { EntradaRecibo } from "@/src/ui/tickets/entrada/entrada-recibo"
import { GuardiaEntrada } from "@/src/ui/tickets/entrada/guardia-entrada"
import { ComoPagar } from "@/src/ui/tickets/recibo/como-pagar"
import { PortadaExpediente } from "@/src/ui/tickets/recibo/portada-expediente"
import { ExpedienteServicio } from "@/src/ui/tickets/recibo/expediente-servicio"
import { ResumenCuenta } from "@/src/ui/tickets/recibo/resumen-cuenta"
import { PagoRecibido } from "@/src/ui/tickets/recibo/pago-recibido"
import { TarjetaGarantia } from "@/src/ui/tickets/recibo/tarjeta-garantia"
import { AyudaWhatsApp } from "@/src/ui/tickets/recibo/ayuda-whatsapp"
import { hoyDelRecibo } from "@/src/ui/tickets/recibo/textos-recibo"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

async function cargar(slug: string) {
  try {
    return await tickets().obtenerTicketPublico.ejecutar(slug)
  } catch (err) {
    if (err instanceof RecursoNoEncontrado) return null
    throw err
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ticket = await cargar(slug)
  if (!ticket) {
    return { title: "Nota no encontrada · BR TECH", robots: { index: false, follow: false } }
  }
  return {
    title: `${nombreDePila(ticket.cliente.nombre)}, ${ticket.pagado ? "tu pago está confirmado" : "tu nota de servicio está lista"}`,
    description: "Revisa el detalle de tu servicio con BR TECH.",
    robots: { index: false, follow: false },
  }
}

export default async function PaginaTicket({ params }: Props) {
  const { slug } = await params
  const ticket = await cargar(slug)
  if (!ticket) notFound()
  const datosPago = tickets().datosPago()
  const hoy = hoyDelRecibo()

  return (
    <>
      <GuardiaEntrada slug={slug} />
      <EntradaRecibo slug={slug} objetivoId="pagina-recibo" />
      <div id="pagina-recibo">
        <main className="exp-pagina min-h-screen bg-bg-section">
          <noscript><style>{".ilus * { animation: none !important; } .ilus .ilus-transitoria { display: none; }"}</style></noscript>
          <PortadaExpediente ticket={ticket} hoy={hoy} />
          <div className="exp-cuerpo exp-contenedor relative -mt-[120px] pb-24">
            <div className="exp-rejilla grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_372px]">
              <ExpedienteServicio ticket={ticket} />
              <aside className="exp-lateral order-first grid min-w-0 gap-[18px] lg:sticky lg:top-6 lg:order-none">
                <ResumenCuenta ticket={ticket} />
                {ticket.pagado ? <PagoRecibido ticket={ticket} /> : <ComoPagar ticket={ticket} datos={datosPago} />}
                <TarjetaGarantia ticket={ticket} hoy={hoy} />
                <AyudaWhatsApp />
              </aside>
            </div>
            <BloqueConoceMas />
            <p className="no-print mt-6 text-center text-xs text-text-muted">
              Generado por BR TECH · brtechds.com
            </p>
          </div>
        </main>
      </div>
    </>
  )
}
