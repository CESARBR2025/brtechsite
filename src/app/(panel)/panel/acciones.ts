"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  crearTokenSesion,
  NOMBRE_COOKIE_SESION,
} from "@/src/modules/panel/infrastructure/sesion"
import { ErrorDominio } from "@/src/modules/shared/domain/errors"
import { getEnv } from "@/src/modules/shared/infrastructure/config/env"
import type { DatosTicketEntrada } from "@/src/modules/tickets/application/entrada"
import { tickets } from "@/src/modules/tickets/infrastructure/contenedor"
import type { EstadoFormulario } from "./tipos"

// --- Autenticación ---

export async function iniciarSesion(
  _prev: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const env = getEnv()
  const password = String(formData.get("password") ?? "")
  const redirigir = String(formData.get("redirigir") ?? "/panel")

  if (password !== env.PANEL_PASSWORD) {
    return { ok: false, error: "Contraseña incorrecta" }
  }

  const { valor, maxAgeSegundos } = await crearTokenSesion(
    env.PANEL_SESSION_SECRET,
  )
  const store = await cookies()
  store.set(NOMBRE_COOKIE_SESION, valor, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSegundos,
  })

  redirect(redirigir.startsWith("/panel") ? redirigir : "/panel")
}

export async function cerrarSesion(): Promise<void> {
  const store = await cookies()
  store.delete(NOMBRE_COOKIE_SESION)
  redirect("/panel/login")
}

// --- Tickets ---

function traducirError(err: unknown): string {
  if (err instanceof ErrorDominio) return err.message
  console.error("[panel] error inesperado:", err)
  return "Ocurrió un error al guardar. Intenta de nuevo."
}

export async function guardarTicket(
  id: string | null,
  datos: DatosTicketEntrada,
): Promise<EstadoFormulario> {
  try {
    if (id) {
      await tickets().actualizarTicket.ejecutar(id, datos)
      revalidatePath(`/panel/${id}`)
      revalidatePath("/panel")
      return { ok: true, ticketId: id }
    }
    const r = await tickets().crearTicket.ejecutar(datos)
    revalidatePath("/panel")
    return { ok: true, ticketId: r.id }
  } catch (err) {
    return { ok: false, error: traducirError(err) }
  }
}

async function transicion(
  accion: (id: string) => Promise<void>,
  id: string,
): Promise<EstadoFormulario> {
  try {
    await accion(id)
    revalidatePath(`/panel/${id}`)
    revalidatePath("/panel")
    return { ok: true, ticketId: id }
  } catch (err) {
    return { ok: false, error: traducirError(err) }
  }
}

export async function publicarTicket(id: string): Promise<EstadoFormulario> {
  return transicion((x) => tickets().cambiarEstado.publicar(x), id)
}

export async function despublicarTicket(id: string): Promise<EstadoFormulario> {
  return transicion((x) => tickets().cambiarEstado.despublicar(x), id)
}

export async function archivarTicket(id: string): Promise<EstadoFormulario> {
  return transicion((x) => tickets().cambiarEstado.archivar(x), id)
}

export async function alternarPago(
  id: string,
  pagado: boolean,
): Promise<EstadoFormulario> {
  return transicion((x) => tickets().cambiarEstado.marcarPago(x, pagado), id)
}
