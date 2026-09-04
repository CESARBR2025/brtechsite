import Link from "next/link"
import Image from "next/image"
import { ChevronRight, FileQuestion } from "lucide-react"

export default function TicketNoEncontrado() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg-dark px-4 text-center">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.07)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        <Image
          src="/logo.png"
          alt="BR TECH"
          width={120}
          height={120}
          className="mx-auto h-14 w-auto"
        />

        <div className="mx-auto mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover shadow-lg shadow-primary/20">
          <FileQuestion className="h-8 w-8 text-white" />
        </div>

        <h1 className="mt-6 text-xl font-bold text-white">
          Este ticket no existe
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-muted">
          El enlace es incorrecto o el ticket todavía no se ha publicado.
          Verifica la dirección con quien te lo compartió.
        </p>

        <Link
          href="/"
          className="group mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-hover px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]"
        >
          Ir al inicio
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  )
}
