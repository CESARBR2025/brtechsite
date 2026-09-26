import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ClipboardList } from "lucide-react"
import { proyectos } from "@/src/modules/proyectos/infrastructure/contenedor"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import { formatearFecha } from "@/src/ui/formato"
import { EditorProyecto } from "@/src/ui/proyectos/editor-proyecto"
import { enlaceEnviarPropuesta } from "@/src/ui/proyectos/whatsapp"
import { BadgeEstado } from "@/src/ui/primitivos/badge-estado"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PaginaProyecto({ params }: Props) {
  const { id } = await params

  let dto
  try {
    dto = await proyectos().consultarProyectos.obtenerDetalle(id)
  } catch (err) {
    if (err instanceof RecursoNoEncontrado) notFound()
    throw err
  }
  const origen = dto.levantamientoId
    ? await proyectos().consultarProyectos.levantamientoDeOrigen(dto.levantamientoId)
    : null

  const urlPublica = `${getEnv().SITE_URL}/p/${dto.slug}`

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/panel/proyectos"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Proyectos
      </Link>
      <div className="mt-3 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {dto.folio} · {formatearFecha(dto.fechaPropuesta)}
        </p>
        <h1 className="mt-1 text-xl font-bold text-text-primary sm:text-2xl">{dto.cliente.nombre}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <BadgeEstado estado={dto.estado} />
          {dto.proyectoNombre && <span className="text-sm text-text-secondary">{dto.proyectoNombre}</span>}
          {origen && (
            <Link
              href={`/panel/levantamientos/${origen.id}`}
              className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-0.5 text-[11px] font-semibold text-primary hover:bg-primary hover:text-white"
            >
              <ClipboardList className="h-3 w-3" /> {origen.folio}
            </Link>
          )}
        </div>
      </div>

      <EditorProyecto
        key={dto.id}
        inicial={dto}
        urlPublica={urlPublica}
        enlaceWhatsApp={enlaceEnviarPropuesta(
          { nombre: dto.contenido.ficha.contactoNombre || null, telefono: dto.cliente.contacto },
          urlPublica,
        )}
      />
    </div>
  )
}
