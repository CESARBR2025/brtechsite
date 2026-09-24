"use server"

import { revalidatePath } from "next/cache"
import { exigirSesionPanel } from "@/src/modules/panel/infrastructure/exigir-sesion"
import { ErrorDominio } from "@/src/modules/shared/domain/errors"
import type { DatosGeneralesEntrada } from "../application/entrada"
import { levantamientos } from "./contenedor"
import type { ResultadoAccion } from "./tipos"

const RUTA = "/panel/levantamientos"

function traducirError(err: unknown): string {
  if (err instanceof ErrorDominio) return err.message
  console.error("[levantamientos] error inesperado:", err)
  return "Ocurrió un error al guardar. Intenta de nuevo."
}

async function ejecutar(
  fn: () => Promise<Omit<ResultadoAccion, "ok">>,
): Promise<ResultadoAccion> {
  try {
    await exigirSesionPanel()
    return { ok: true, ...(await fn()) }
  } catch (err) {
    return { ok: false, error: traducirError(err) }
  }
}

export async function crearLevantamiento(
  generales: DatosGeneralesEntrada & { contactoNombre?: string | null },
): Promise<ResultadoAccion> {
  return ejecutar(async () => {
    const r = await levantamientos().crearLevantamiento.ejecutar(generales)
    revalidatePath(RUTA)
    return { id: r.id }
  })
}

/** Guardado automático: no revalida la página que se está editando. */
export async function guardarLevantamiento(
  id: string,
  datos: { generales: DatosGeneralesEntrada; contenido: unknown },
): Promise<ResultadoAccion> {
  return ejecutar(async () => {
    const r = await levantamientos().guardarLevantamiento.ejecutar(id, datos)
    revalidatePath(RUTA)
    return { id, actualizadoEn: r.actualizadoEn }
  })
}

function transicion(
  id: string,
  accion: (id: string) => Promise<void>,
): Promise<ResultadoAccion> {
  return ejecutar(async () => {
    await accion(id)
    revalidatePath(RUTA)
    revalidatePath(`${RUTA}/${id}`)
    return { id }
  })
}

export async function publicarLevantamiento(id: string): Promise<ResultadoAccion> {
  return transicion(id, (x) => levantamientos().cambiarEstado.publicar(x))
}

export async function despublicarLevantamiento(
  id: string,
): Promise<ResultadoAccion> {
  return transicion(id, (x) => levantamientos().cambiarEstado.despublicar(x))
}

export async function archivarLevantamiento(id: string): Promise<ResultadoAccion> {
  return transicion(id, (x) => levantamientos().cambiarEstado.archivar(x))
}

export async function confirmarLevantamiento(
  id: string,
  confirmado: boolean,
): Promise<ResultadoAccion> {
  return transicion(id, (x) =>
    levantamientos().cambiarEstado.confirmar(x, confirmado),
  )
}
