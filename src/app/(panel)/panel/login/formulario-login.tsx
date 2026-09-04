"use client"

import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronRight, Loader2, Lock } from "lucide-react"
import { iniciarSesion } from "@/src/app/(panel)/panel/acciones"
import type { EstadoFormulario } from "@/src/app/(panel)/panel/tipos"

const INICIAL: EstadoFormulario = { ok: false }

export function FormularioLogin() {
  const params = useSearchParams()
  const redirigir = params.get("redirigir") ?? "/panel"
  const [estado, accion, pendiente] = useActionState(iniciarSesion, INICIAL)

  return (
    <form action={accion} className="mt-6 space-y-4">
      <input type="hidden" name="redirigir" value={redirigir} />

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Lock className="h-4 w-4 text-text-muted" />
        </div>
        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Contraseña"
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-text-muted transition-all focus:border-primary focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {estado.error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-400">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-hover px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
      >
        {pendiente ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Entrando…
          </>
        ) : (
          <>
            Entrar
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  )
}
