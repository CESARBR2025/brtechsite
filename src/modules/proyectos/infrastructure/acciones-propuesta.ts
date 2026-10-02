"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { ErrorDominio } from "@/src/modules/shared/domain/errors"
import { proyectos } from "./contenedor"
import type { ResultadoAccion } from "./tipos"

/*
 * Acciones públicas de la página del cliente (/p/[slug]): no piden sesión del
 * panel; el slug de la propuesta publicada es la credencial.
 */

const entrada = z.object({
  slug: z.string().max(64),
  firmas: z.array(z.object({ nombre: z.string().max(120), trazo: z.string().max(12_000) })).min(1).max(10),
  correo: z.string().max(254),
  conBonificacion: z.boolean().nullable(),
})

export async function aceptarPropuesta(
  slug: string,
  aceptacion: { firmas: { nombre: string; trazo: string }[]; correo: string; conBonificacion: boolean | null },
): Promise<ResultadoAccion> {
  const datos = entrada.safeParse({ slug, ...aceptacion })
  if (!datos.success) return { ok: false, error: "Datos inválidos" }
  try {
    const { firmas, correo, conBonificacion } = datos.data
    const r = await proyectos().aceptarPropuesta.ejecutar(datos.data.slug, { firmas, correo, conBonificacion })
    if (r.errores.length > 0) {
      console.error(
        `[propuesta] aceptada, pero falló algo (aviso: ${r.aviso}, contrato al cliente: ${r.avisoCliente}):`,
        ...r.errores,
      )
    }
    revalidatePath(`/p/${datos.data.slug}`)
    revalidatePath("/panel/proyectos", "layout")
    return { ok: true }
  } catch (err) {
    if (err instanceof ErrorDominio) return { ok: false, error: err.message }
    console.error("[propuesta] error al aceptar:", err)
    return { ok: false, error: "No pudimos registrar tu aceptación. Intenta de nuevo." }
  }
}
