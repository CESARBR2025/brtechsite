import Link from "next/link"
import Image from "next/image"
import { LogOut } from "lucide-react"
import { cerrarSesion } from "@/src/app/(panel)/panel/acciones"

export function EncabezadoPanel() {
  return (
    <header className="sticky top-0 z-50 w-full bg-bg-dark">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/panel" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="BR TECH"
            width={90}
            height={90}
            className="h-12 w-auto"
          />
          <span className="hidden border-l border-white/15 pl-2.5 text-xs font-medium text-text-muted sm:block">
            Panel de tickets
          </span>
        </Link>

        <form action={cerrarSesion}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </header>
  )
}
