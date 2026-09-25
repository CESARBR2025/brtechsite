"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { ErrorDominio } from "@/src/modules/shared/domain/errors"
import { levantamientos } from "./contenedor"
import type { ResultadoAccion } from "./tipos"

/*
 * Acciones públicas de la página del cliente (/d/[slug]): no piden sesión del
 * panel; el slug del diagnóstico publicado es la credencial.
 */

const entrada = z.object({
  slug: z.string().max(64),
  respuestas: z
    .array(z.object({ id: z.string().max(64), respuesta: z.string().max(5000) }))
    .max(100),
})

export async function responderPreguntas(
  slug: string,
  respuestas: { id: string; respuesta: string }[],
): Promise<ResultadoAccion> {
  const datos = entrada.safeParse({ slug, respuestas })
  if (!datos.success) return { ok: false, error: "Respuestas inválidas" }
  try {
    const r = await levantamientos().responderPreguntas.ejecutar(
      datos.data.slug,
      datos.data.respuestas,
    )
    if (r.aviso === "fallido") {
      console.error("[diagnostico] no se pudo avisar de las respuestas:", r.errorAviso)
    }
    revalidatePath("/panel/levantamientos", "layout")
    return { ok: true }
  } catch (err) {
    if (err instanceof ErrorDominio) return { ok: false, error: err.message }
    console.error("[diagnostico] error al responder preguntas:", err)
    return { ok: false, error: "No pudimos guardar tus respuestas. Intenta de nuevo." }
  }
}
