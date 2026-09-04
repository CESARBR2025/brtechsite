import Link from "next/link"
import { FileQuestion } from "lucide-react"

export default function TicketNoEncontrado() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-section px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-xl font-bold text-text-primary">
        Este ticket no existe
      </h1>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        El enlace es incorrecto o el ticket todavía no se ha publicado. Verifica
        la dirección con quien te lo compartió.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover"
      >
        Ir al inicio
      </Link>
    </main>
  )
}
