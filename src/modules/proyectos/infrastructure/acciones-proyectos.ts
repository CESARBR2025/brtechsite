"use server"

import { revalidatePath } from "next/cache"
import { exigirSesionPanel } from "@/src/modules/panel/infrastructure/exigir-sesion"
import { ErrorDominio } from "@/src/modules/shared/domain/errors"
import type { CrearProyectoEntrada } from "../application/crear-proyecto"
import type { DatosGeneralesEntrada } from "../application/entrada"
import { proyectos } from "./contenedor"
import type { ResultadoAccion } from "./tipos"

const RUTA = "/panel/proyectos"

function traducirError(err: unknown): string {
  if (err instanceof ErrorDominio) return err.message
  console.error("[proyectos] error inesperado:", err)
  return "Ocurrió un error al guardar. Intenta de nuevo."
}

async function ejecutar(fn: () => Promise<Omit<ResultadoAccion, "ok">>): Promise<ResultadoAccion> {
  try {
    await exigirSesionPanel()
    return { ok: true, ...(await fn()) }
  } catch (err) {
    return { ok: false, error: traducirError(err) }
  }
}

export async function crearProyecto(
  datos: Omit<CrearProyectoEntrada, "contenido">,
): Promise<ResultadoAccion> {
  return ejecutar(async () => {
    // El contenido completo solo entra por la importación, nunca desde el formulario
    const r = await proyectos().crearProyecto.ejecutar({
      clienteNombre: datos.clienteNombre,
      clienteContacto: datos.clienteContacto,
      proyectoNombre: datos.proyectoNombre,
      fechaPropuesta: datos.fechaPropuesta,
      levantamientoId: datos.levantamientoId,
    })
    revalidatePath(RUTA)
    return { id: r.id }
  })
}

/** Guardado automático: no revalida la página que se está editando. */
export async function guardarProyecto(
  id: string,
  datos: { generales: DatosGeneralesEntrada; contenido: unknown },
): Promise<ResultadoAccion> {
  return ejecutar(async () => {
    const r = await proyectos().guardarProyecto.ejecutar(id, datos)
    revalidatePath(RUTA)
    return { id, actualizadoEn: r.actualizadoEn }
  })
}

function transicion(id: string, accion: (id: string) => Promise<void>): Promise<ResultadoAccion> {
  return ejecutar(async () => {
    await accion(id)
    revalidatePath(RUTA)
    revalidatePath(`${RUTA}/${id}`)
    return { id }
  })
}

export async function publicarProyecto(id: string): Promise<ResultadoAccion> {
  return transicion(id, (x) => proyectos().cambiarEstado.publicar(x))
}

export async function despublicarProyecto(id: string): Promise<ResultadoAccion> {
  return transicion(id, (x) => proyectos().cambiarEstado.despublicar(x))
}

export async function archivarProyecto(id: string): Promise<ResultadoAccion> {
  return transicion(id, (x) => proyectos().cambiarEstado.archivar(x))
}

export async function retirarAceptacion(id: string): Promise<ResultadoAccion> {
  return transicion(id, (x) => proyectos().cambiarEstado.retirarAceptacion(x))
}
