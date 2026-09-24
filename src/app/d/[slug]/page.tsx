import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { levantamientos } from "@/src/modules/levantamientos/infrastructure/contenedor"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { Diagnostico } from "@/src/ui/levantamientos/diagnostico"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

async function cargar(slug: string) {
  try {
    return await levantamientos().obtenerDiagnosticoPublico.ejecutar(slug)
  } catch (err) {
    if (err instanceof RecursoNoEncontrado) return null
    throw err
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const d = await cargar(slug)
  if (!d) {
    return { title: "Diagnóstico no encontrado · BR TECH", robots: { index: false } }
  }
  const proyecto = d.proyectoNombre ?? "tu proyecto"
  return {
    title: `Diagnóstico de ${proyecto} · BR TECH`,
    description: `Lo que entendimos de la operación de ${d.cliente.nombre}: problema, personas, flujos de trabajo y prioridades.`,
    robots: { index: false, follow: false },
  }
}

export default async function PaginaDiagnostico({ params }: Props) {
  const { slug } = await params
  const d = await cargar(slug)
  if (!d) notFound()
  return <Diagnostico d={d} />
}
