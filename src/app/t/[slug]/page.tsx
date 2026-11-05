import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { tickets } from "@/src/modules/tickets/infrastructure/contenedor"
import { nombreDePila } from "@/src/ui/formato"
import { BloqueConoceMas } from "@/src/ui/tickets/bloque-conoce-mas"
import { DocumentoTicket } from "@/src/ui/tickets/documento-ticket"
import { EntradaRecibo } from "@/src/ui/tickets/entrada/entrada-recibo"
import { GuardiaEntrada } from "@/src/ui/tickets/entrada/guardia-entrada"
import { ComoPagar } from "@/src/ui/tickets/recibo/como-pagar"
import { PortadaRecibo } from "@/src/ui/tickets/recibo/portada-recibo"
import { TarjetaTotal } from "@/src/ui/tickets/recibo/tarjeta-total"

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

  return (
    <>
      <GuardiaEntrada slug={slug} />
      <EntradaRecibo slug={slug} objetivoId="pagina-recibo" />
      <div id="pagina-recibo">
        <main className="min-h-screen bg-bg-section">
          <PortadaRecibo ticket={ticket} />
          <div className="relative mx-auto max-w-3xl px-5 pb-16 sm:px-6 print:px-0 print:pb-0">
            <div className="grid gap-6 print:block">
              <TarjetaTotal ticket={ticket} />
              <ComoPagar ticket={ticket} datos={datosPago} />
              <article className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-card print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
                <DocumentoTicket ticket={ticket} />
              </article>
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
