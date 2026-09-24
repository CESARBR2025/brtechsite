import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { FormularioNuevoLevantamiento } from "@/src/ui/levantamientos/formulario-nuevo"

export default function PaginaNuevoLevantamiento() {
  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/panel/levantamientos"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Levantamientos
      </Link>
      <h1 className="mt-3 text-xl font-bold text-text-primary sm:text-2xl">
        Nuevo levantamiento
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Solo lo básico para empezar. El resto se captura durante la reunión y se
        guarda solo.
      </p>
      <div className="mt-6">
        <FormularioNuevoLevantamiento />
      </div>
    </div>
  )
}
