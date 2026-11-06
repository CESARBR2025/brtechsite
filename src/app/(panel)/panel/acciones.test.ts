import { beforeEach, describe, expect, it, vi } from "vitest"
import { OperacionNoPermitida } from "@/src/modules/shared/domain/errors"
import type { DatosTicketEntrada } from "@/src/modules/tickets/application/entrada"

const dobles = vi.hoisted(() => ({
  sesion: vi.fn(), contenedor: vi.fn(), crear: vi.fn(), actualizar: vi.fn(),
  publicar: vi.fn(), despublicar: vi.fn(), archivar: vi.fn(), pago: vi.fn(), revalidar: vi.fn(),
}))
vi.mock("@/src/modules/panel/infrastructure/exigir-sesion", () => ({ exigirSesionPanel: dobles.sesion }))
vi.mock("@/src/modules/shared/infrastructure/config/env", () => ({ getEnv: vi.fn() }))
vi.mock("@/src/modules/tickets/infrastructure/contenedor", () => ({ tickets: dobles.contenedor }))
vi.mock("next/cache", () => ({ revalidatePath: dobles.revalidar }))

import { guardarTicket, publicarTicket, despublicarTicket, archivarTicket, alternarPago } from "./acciones"

const datos: DatosTicketEntrada = { cliente: { nombre: "Ana" }, equipo: { categoria: "otro" }, fechaServicio: "2026-11-06", items: [] }
const acciones = [
  { nombre: "crear", ejecutar: () => guardarTicket(null, datos), caso: dobles.crear },
  { nombre: "actualizar", ejecutar: () => guardarTicket("id", datos), caso: dobles.actualizar },
  { nombre: "publicar", ejecutar: () => publicarTicket("id"), caso: dobles.publicar },
  { nombre: "despublicar", ejecutar: () => despublicarTicket("id"), caso: dobles.despublicar },
  { nombre: "archivar", ejecutar: () => archivarTicket("id"), caso: dobles.archivar },
  { nombre: "alternar pago", ejecutar: () => alternarPago("id", true), caso: dobles.pago },
]

beforeEach(() => {
  vi.resetAllMocks()
  dobles.sesion.mockResolvedValue(undefined)
  dobles.crear.mockResolvedValue({ id: "id" })
  dobles.contenedor.mockReturnValue({
    crearTicket: { ejecutar: dobles.crear }, actualizarTicket: { ejecutar: dobles.actualizar },
    cambiarEstado: { publicar: dobles.publicar, despublicar: dobles.despublicar, archivar: dobles.archivar, marcarPago: dobles.pago },
  })
})

describe("seguridad de acciones de tickets", () => {
  it.each(acciones)("$nombre rechaza una sesión inválida antes de acceder al módulo", async ({ ejecutar }) => {
    dobles.sesion.mockRejectedValue(new OperacionNoPermitida("La sesión expiró"))
    expect(await ejecutar()).toEqual({ ok: false, error: "La sesión expiró" })
    expect(dobles.sesion).toHaveBeenCalledOnce()
    expect(dobles.contenedor).not.toHaveBeenCalled()
    expect(dobles.revalidar).not.toHaveBeenCalled()
  })

  it.each(acciones)("$nombre espera la validación de sesión antes de ejecutar", async ({ ejecutar, caso }) => {
    let resolver!: () => void
    dobles.sesion.mockReturnValue(new Promise<void>((resolve) => { resolver = resolve }))
    const pendiente = ejecutar()
    expect(dobles.contenedor).not.toHaveBeenCalled()
    resolver()
    expect(await pendiente).toEqual({ ok: true, ticketId: "id" })
    expect(caso).toHaveBeenCalledOnce()
    expect(dobles.revalidar).toHaveBeenCalledWith("/panel")
  })
})
