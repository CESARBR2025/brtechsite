import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { tickets } from "@/src/modules/tickets/infrastructure/contenedor"
import { formatearDinero } from "@/src/ui/formato"
import { BloqueConoceMas } from "@/src/ui/tickets/bloque-conoce-mas"
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
    description: `Servicio para ${ticket.cliente.nombre} — ${formatearDinero(
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
    <main className="min-h-screen bg-bg-section py-6">
      <div className="mx-auto max-w-3xl px-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <DocumentoTicket ticket={ticket} />
        </div>
        <BloqueConoceMas />
        <p className="no-print mt-6 text-center text-xs text-text-muted">
          Generado por BR TECH · brtechds.com
        </p>
      </div>
    </main>
  )
}
