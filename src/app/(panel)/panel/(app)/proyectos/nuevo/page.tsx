import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { proyectos } from "@/src/modules/proyectos/infrastructure/contenedor"
import { FormularioNuevoProyecto } from "@/src/ui/proyectos/formulario-nuevo"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: Promise<{ levantamiento?: string }>
}

export default async function PaginaNuevoProyecto({ searchParams }: Props) {
  const { levantamiento } = await searchParams
  const opciones = await proyectos().consultarProyectos.levantamientosDisponibles()
  const inicial = opciones.some((o) => o.id === levantamiento) ? levantamiento! : null

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/panel/proyectos"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Proyectos
      </Link>
      <h1 className="mt-3 text-xl font-bold text-text-primary sm:text-2xl">Nuevo proyecto</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Parte de un levantamiento para no capturar dos veces. El resto se guarda solo en el editor.
      </p>
      <div className="mt-6">
        <FormularioNuevoProyecto levantamientos={opciones} levantamientoInicial={inicial} />
      </div>
    </div>
  )
}
