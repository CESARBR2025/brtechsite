import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { levantamientos } from "@/src/modules/levantamientos/infrastructure/contenedor"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import { formatearFecha } from "@/src/ui/formato"
import { EditorLevantamiento } from "@/src/ui/levantamientos/editor-levantamiento"
import { enlaceEnviarDiagnostico } from "@/src/ui/levantamientos/whatsapp"
import { BadgeEstado } from "@/src/ui/primitivos/badge-estado"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PaginaLevantamiento({ params }: Props) {
  const { id } = await params

  let dto
  try {
    dto = await levantamientos().consultarLevantamientos.obtenerDetalle(id)
  } catch (err) {
    if (err instanceof RecursoNoEncontrado) notFound()
    throw err
  }

  const urlPublica = `${getEnv().SITE_URL}/d/${dto.slug}`

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/panel/levantamientos"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Levantamientos
      </Link>
      <div className="mt-3 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {dto.folio} · {formatearFecha(dto.fechaReunion)}
        </p>
        <h1 className="mt-1 text-xl font-bold text-text-primary sm:text-2xl">
          {dto.cliente.nombre}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <BadgeEstado estado={dto.estado} />
          {dto.proyectoNombre && (
            <span className="text-sm text-text-secondary">{dto.proyectoNombre}</span>
          )}
        </div>
      </div>

      <EditorLevantamiento
        key={dto.id}
        inicial={dto}
        urlPublica={urlPublica}
        enlaceWhatsApp={enlaceEnviarDiagnostico(
          {
            nombre: dto.contenido.contexto.contactoNombre || null,
            telefono: dto.cliente.contacto,
          },
          urlPublica,
        )}
      />
    </div>
  )
}
