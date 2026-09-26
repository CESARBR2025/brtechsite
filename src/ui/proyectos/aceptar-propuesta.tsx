"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, Loader2, PenLine } from "lucide-react"
import { aceptarPropuesta } from "@/src/modules/proyectos/infrastructure/acciones-propuesta"
import { formatearFechaHora } from "@/src/ui/formato"

// text-base en móvil: con 14 px iOS hace zoom al enfocar el campo
const INPUT =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text-primary placeholder-text-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm"

/**
 * Aceptación de la propuesta por el cliente: escribe su nombre y confirma.
 * Ya aceptada, muestra quién y cuándo.
 */
export function AceptarPropuesta({
  slug,
  total,
  aceptacion,
  sugerido,
}: {
  slug: string
  total: string
  aceptacion: { en: string; por: string } | null
  /** Nombre del contacto, para precargar el campo. */
  sugerido: string
}) {
  const router = useRouter()
  const [nombre, setNombre] = useState(sugerido)
  const [conforme, setConforme] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enviando, iniciar] = useTransition()

  if (aceptacion) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-bg-dark p-8 text-center shadow-glow sm:p-12">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-success/30 blur-3xl" />
        <div className="relative">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success text-white shadow-lg shadow-success/30">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">Propuesta aceptada</p>
          <p className="mt-2 text-sm text-white/70 sm:text-base">
            {aceptacion.por} · {formatearFechaHora(aceptacion.en)}
          </p>
          <p className="mx-auto mt-5 max-w-md text-pretty text-sm leading-relaxed text-white/60">
            Gracias por tu confianza. Te contactamos para firmar el contrato y arrancar con la semana 0.
          </p>
        </div>
      </div>
    )
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    iniciar(async () => {
      const r = await aceptarPropuesta(slug, nombre)
      if (!r.ok) {
        setError(r.error ?? "No pudimos registrar tu aceptación.")
        return
      }
      router.refresh()
    })
  }

  return (
    <form
      onSubmit={enviar}
      className="overflow-hidden rounded-3xl border border-border bg-surface shadow-modal"
    >
      <div className="h-1 bg-gradient-to-r from-primary-hover via-primary to-primary-light" />
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Inversión del desarrollo</p>
          <p className="mt-2 bg-gradient-to-br from-primary to-primary-hover bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            {total}
          </p>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-text-secondary">
            Al aceptar confirmas que estás de acuerdo con el alcance, el calendario y la inversión de
            esta propuesta. Con eso preparamos el contrato; nada se cobra desde esta página.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-text-secondary">Tu nombre completo</span>
            <input
              className={`mt-1.5 ${INPUT}`}
              value={nombre}
              maxLength={120}
              autoComplete="name"
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg-section/60 p-4">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              checked={conforme}
              onChange={(e) => setConforme(e.target.checked)}
            />
            <span className="text-sm leading-relaxed text-text-secondary">
              Leí la propuesta y acepto el alcance, el calendario y la inversión.
            </span>
          </label>

          {error && (
            <p className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-500">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando || !conforme || !nombre.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
            Aceptar propuesta
          </button>
        </div>
      </div>
    </form>
  )
}
