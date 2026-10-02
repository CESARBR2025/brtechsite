import { proyectos } from "@/src/modules/proyectos/infrastructure/contenedor"
import { RecursoNoEncontrado } from "@/src/modules/shared/domain/errors"

export const dynamic = "force-dynamic"

/** El contrato de la propuesta en PDF: para leerlo antes de firmar o descargarlo ya firmado. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { nombreArchivo, pdf } = await proyectos().obtenerContratoPdf.ejecutar(slug)
    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${nombreArchivo}"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    })
  } catch (err) {
    if (err instanceof RecursoNoEncontrado) return new Response("Contrato no encontrado", { status: 404 })
    throw err
  }
}
