import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Sparkles } from "lucide-react"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { tickets } from "@/src/modules/tickets/infrastructure/contenedor"
import { formatearDinero } from "@/src/ui/formato"
import { BloqueConoceMas } from "@/src/ui/tickets/bloque-conoce-mas"
import { BotonImprimir } from "@/src/ui/tickets/boton-imprimir"
import { DocumentoTicket } from "@/src/ui/tickets/documento-ticket"

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
    return { title: "Ticket no encontrado · BR TECH", robots: { index: false } }
  }
  return {
    title: `Ticket ${ticket.folio} · BR TECH`,
    description: `Servicio de ${ticket.equipo.tipo} para ${ticket.cliente.nombre} — ${formatearDinero(
      ticket.total,
      ticket.moneda,
    )}`,
    robots: { index: false, follow: false },
  }
}

export default async function PaginaTicket({ params }: Props) {
  const { slug } = await params
  const ticket = await cargar(slug)
  if (!ticket) notFound()

  return (
    <main className="min-h-screen bg-bg-section">
      {/* Hero de marca */}
      <div className="no-print relative overflow-hidden bg-bg-dark">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.07)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Image
              src="/logo.png"
              alt="BR TECH"
              width={411}
              height={147}
              className="h-10 w-auto"
              priority
            />
            <BotonImprimir variante="oscuro" />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Resumen del{" "}
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                servicio
              </span>
            </h1>

            <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-white/5 to-primary/10 px-4 py-1.5 text-xs font-medium text-text-muted shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Nota de servicio · {ticket.folio}
            </div>
          </div>
        </div>
      </div>

      {/* Documento */}
      <div className="relative mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <article className="-mt-10 overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated print:mt-0 print:border-0 print:shadow-none">
          <DocumentoTicket ticket={ticket} />
        </article>

        <BloqueConoceMas />

        <p className="no-print mt-6 text-center text-xs text-text-muted">
          Generado por BR TECH · brtechds.com
        </p>
      </div>
    </main>
  )
}
