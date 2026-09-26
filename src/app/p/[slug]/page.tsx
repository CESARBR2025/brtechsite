import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { proyectos } from "@/src/modules/proyectos/infrastructure/contenedor"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { Propuesta } from "@/src/ui/proyectos/propuesta"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

async function cargar(slug: string) {
  try {
    return await proyectos().obtenerPropuestaPublica.ejecutar(slug)
  } catch (err) {
    if (err instanceof RecursoNoEncontrado) return null
    throw err
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await cargar(slug)
  if (!p) {
    return { title: "Propuesta no encontrada · BR TECH", robots: { index: false } }
  }
  const proyecto = p.proyectoNombre ?? "tu proyecto"
  return {
    title: `Propuesta de desarrollo: ${proyecto} · BR TECH`,
    description: `Alcance, fases, calendario e inversión del proyecto de ${p.cliente.nombre}.`,
    robots: { index: false, follow: false },
  }
}

export default async function PaginaPropuesta({ params }: Props) {
  const { slug } = await params
  const p = await cargar(slug)
  if (!p) notFound()
  return <Propuesta p={p} />
}
