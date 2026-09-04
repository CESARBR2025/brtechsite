import Link from "next/link"
import { cerrarSesion } from "@/src/app/(panel)/panel/acciones"

export function EncabezadoPanel() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/panel" className="text-sm font-bold text-text-primary">
          Panel BR TECH
        </Link>
        <form action={cerrarSesion}>
          <button
            type="submit"
            className="text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </header>
  )
}
