"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  alternarPago,
  archivarTicket,
  despublicarTicket,
  publicarTicket,
} from "@/src/app/(panel)/panel/acciones"
import type { EstadoFormulario } from "@/src/app/(panel)/panel/tipos"
import type { EstadoTicket } from "@/src/modules/tickets/domain/estado-ticket"

const BTN =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"

export function AccionesTicket({
  id,
  estado,
  pagado,
}: {
  id: string
  estado: EstadoTicket
  pagado: boolean
}) {
  const router = useRouter()
  const [pendiente, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function correr(fn: () => Promise<EstadoFormulario>) {
    setError(null)
    startTransition(async () => {
      const r = await fn()
      if (!r.ok) setError(r.error ?? "No se pudo completar la acción.")
      else router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {estado === "publicado" ? (
          <button
            type="button"
            disabled={pendiente}
            onClick={() => correr(() => despublicarTicket(id))}
            className={`${BTN} border border-border bg-surface text-text-secondary hover:bg-bg-section`}
          >
            Despublicar
          </button>
        ) : (
          <button
            type="button"
            disabled={pendiente || estado === "archivado"}
            onClick={() => correr(() => publicarTicket(id))}
            className={`${BTN} bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover`}
          >
            Publicar
          </button>
        )}

        <button
          type="button"
          disabled={pendiente}
          onClick={() => correr(() => alternarPago(id, !pagado))}
          className={`${BTN} border border-border bg-surface text-text-secondary hover:bg-bg-section`}
        >
          {pagado ? "Marcar como pendiente" : "Marcar como pagado"}
        </button>

        {estado !== "archivado" && (
          <button
            type="button"
            disabled={pendiente}
            onClick={() => correr(() => archivarTicket(id))}
            className={`${BTN} text-text-muted hover:bg-red-500/10 hover:text-red-500`}
          >
            Archivar
          </button>
        )}
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
