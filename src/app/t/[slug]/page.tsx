import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Laptop,
  Phone,
  Sparkles,
  User,
} from "lucide-react"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { tickets } from "@/src/modules/tickets/infrastructure/contenedor"
import { formatearDinero, formatearFecha } from "@/src/ui/formato"
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

function StatHero({
  etiqueta,
  children,
}: {
  etiqueta: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
        {etiqueta}
      </p>
      <div className="mt-1 text-sm font-semibold text-white">{children}</div>
    </div>
  )
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

        <div className="relative mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6">
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

          <div className="mt-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-white/5 to-primary/10 px-4 py-1.5 text-xs font-medium text-text-muted shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Nota de servicio · {ticket.folio}
            </div>

            <h1 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">
              Resumen del{" "}
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                servicio
              </span>
            </h1>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  <User className="h-3.5 w-3.5 text-primary" />
                  Cliente
                </p>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  {ticket.cliente.nombre}
                </p>
                {ticket.cliente.contacto && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                    <Phone className="h-3 w-3" />
                    {ticket.cliente.contacto}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  <Laptop className="h-3.5 w-3.5 text-primary" />
                  Equipo
                </p>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  {ticket.equipo.tipo}
                </p>
                {ticket.equipo.detalle && (
                  <p className="mt-0.5 text-xs text-text-muted">
                    {ticket.equipo.detalle}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatHero etiqueta="Fecha de servicio">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {formatearFecha(ticket.fechaServicio)}
                </span>
              </StatHero>
              <StatHero etiqueta="Total">
                <span className="text-base font-bold tabular-nums">
                  {formatearDinero(ticket.total, ticket.moneda)}
                </span>
              </StatHero>
              <StatHero etiqueta="Estado">
                <span
                  className={`flex items-center gap-1.5 ${
                    ticket.pagado ? "text-success" : "text-warning"
                  }`}
                >
                  {ticket.pagado ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  {ticket.pagado ? "Pagado" : "Pendiente"}
                </span>
              </StatHero>
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
