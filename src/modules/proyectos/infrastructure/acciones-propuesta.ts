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

const entrada = z.object({ slug: z.string().max(64), nombre: z.string().max(120) })

export async function aceptarPropuesta(slug: string, nombre: string): Promise<ResultadoAccion> {
  const datos = entrada.safeParse({ slug, nombre })
  if (!datos.success) return { ok: false, error: "Datos inválidos" }
  try {
    const r = await proyectos().aceptarPropuesta.ejecutar(datos.data.slug, datos.data.nombre)
    if (r.aviso === "fallido") {
      console.error("[propuesta] no se pudo avisar de la aceptación:", r.errorAviso)
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
