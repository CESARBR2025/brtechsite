import { notFound } from "next/navigation"
import { CasoExito } from "@/src/ui/marketing/proyectos/caso-exito"
import { proyectoPorSlug, proyectos } from "@/src/ui/marketing/proyectos/datos"
import { metadatosPagina } from "@/src/ui/marketing/metadatos"

export const dynamicParams = false

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params
  const proyecto = proyectoPorSlug(slug)
  if (!proyecto) return {}
  return metadatosPagina({
    titulo: `Caso de éxito: ${proyecto.titulo} | BR TECH Digital Systems`,
    descripcion: `${proyecto.subtitulo}. ${proyecto.resumen}`,
    ruta: `/proyectos/${proyecto.slug}`,
  })
}

export default async function ProyectoPage({ params }: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params
  const proyecto = proyectoPorSlug(slug)
  if (!proyecto) notFound()
  return <CasoExito proyecto={proyecto} />
}
