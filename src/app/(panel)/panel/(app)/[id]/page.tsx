import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import { tickets } from "@/src/modules/tickets/infrastructure/contenedor"
import { AccionesTicket } from "@/src/ui/panel/acciones-ticket"
import { CopiarEnlace } from "@/src/ui/panel/copiar-enlace"
import { BadgeEstado, BadgePago } from "@/src/ui/primitivos/badge-estado"
import { FormularioTicket } from "@/src/ui/tickets/formulario-ticket"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PaginaEditarTicket({ params }: Props) {
  const { id } = await params

  let ticket
  try {
    ticket = await tickets().consultarTickets.obtenerDetalle(id)
  } catch (err) {
    if (err instanceof RecursoNoEncontrado) notFound()
    throw err
  }

  const base = getEnv().SITE_URL
  const urlPublica = `${base}/t/${ticket.slug}`

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/panel"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Tickets
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {ticket.folio}
            </h1>
            <div className="mt-1.5 flex items-center gap-2">
              <BadgeEstado estado={ticket.estado} />
              <BadgePago pagado={ticket.pagado} />
            </div>
          </div>
          {ticket.estado === "publicado" && (
            <div className="flex items-center gap-2">
              <a
                href={`/t/${ticket.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-bg-section px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-border"
              >
                Ver página pública
              </a>
              <CopiarEnlace url={urlPublica} />
            </div>
          )}
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary">
            Estado del ticket
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            Un ticket solo es visible en su enlace público cuando está publicado.
          </p>
          <div className="mt-4">
            <AccionesTicket
              id={ticket.id}
              estado={ticket.estado}
              pagado={ticket.pagado}
            />
          </div>
        </section>

      <div className="mt-6">
        <FormularioTicket inicial={ticket} ticketId={ticket.id} />
      </div>
    </div>
  )
}
