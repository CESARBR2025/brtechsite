import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FormularioTicket } from "@/src/ui/tickets/formulario-ticket"

export default function PaginaNuevoTicket() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/panel"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Tickets
      </Link>
      <h1 className="mt-3 text-xl font-bold text-text-primary sm:text-2xl">
        Nuevo ticket
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Se crea como borrador. Podrás publicarlo después.
      </p>
      <div className="mt-6">
        <FormularioTicket />
      </div>
    </div>
  )
}
