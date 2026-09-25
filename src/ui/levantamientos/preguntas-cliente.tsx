"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Check, CheckCircle2, Loader2, Send } from "lucide-react"
import type { Pregunta } from "@/src/modules/levantamientos/domain/contenido"
import { responderPreguntas } from "@/src/modules/levantamientos/infrastructure/acciones-diagnostico"

const numero = (i: number) => String(i + 1).padStart(2, "0")

type Estado = { tipo: "inactivo" } | { tipo: "guardado" } | { tipo: "error"; mensaje: string }

/**
 * "Preguntas al cliente:" — el cliente escribe sus respuestas y las guarda
 * directo en su diagnóstico. Solo se envían las que cambiaron.
 */
export function PreguntasCliente({ slug, preguntas }: { slug: string; preguntas: Pregunta[] }) {
  const [guardadas, setGuardadas] = useState(
    () => new Map(preguntas.map((p) => [p.id, p.respuesta])),
  )
  const [borrador, setBorrador] = useState(() => new Map(guardadas))
  const [estado, setEstado] = useState<Estado>({ tipo: "inactivo" })
  const [enviando, iniciar] = useTransition()
  const router = useRouter()

  // Grupos en el orden en que aparecen
  const grupos = useMemo(() => {
    const m = new Map<string, Pregunta[]>()
    for (const p of preguntas) m.set(p.grupo, [...(m.get(p.grupo) ?? []), p])
    return [...m.entries()]
  }, [preguntas])

  const cambios = preguntas
    .filter((p) => (borrador.get(p.id) ?? "").trim() !== (guardadas.get(p.id) ?? ""))
    .map((p) => ({ id: p.id, respuesta: borrador.get(p.id) ?? "" }))
  const respondidas = preguntas.filter((p) => (guardadas.get(p.id) ?? "").length > 0).length
  const avance = preguntas.length ? Math.round((respondidas / preguntas.length) * 100) : 0

  function escribir(id: string, valor: string) {
    setBorrador((prev) => new Map(prev).set(id, valor))
    if (estado.tipo !== "inactivo") setEstado({ tipo: "inactivo" })
  }

  function guardar() {
    iniciar(async () => {
      const r = await responderPreguntas(slug, cambios)
      if (!r.ok) {
        setEstado({ tipo: "error", mensaje: r.error ?? "No pudimos guardar tus respuestas." })
        return
      }
      setGuardadas((prev) => {
        const m = new Map(prev)
        for (const c of cambios) m.set(c.id, c.respuesta.trim())
        return m
      })
      setEstado({ tipo: "guardado" })
      // El resto de la página (botón de WhatsApp) depende de cuántas faltan
      router.refresh()
    })
  }

  let n = 0
  return (
    <div className="space-y-6">
      {/* Avance */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm font-semibold text-text-primary">
            {respondidas} de {preguntas.length} respondidas
          </p>
          <p className="font-mono text-xs tabular-nums text-text-muted">{avance}%</p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-section">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-hover to-primary transition-all duration-500"
            style={{ width: `${avance}%` }}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          Puedes responder por partes: guarda y vuelve cuando quieras con este mismo enlace.
        </p>
      </div>

      {grupos.map(([grupo, lista]) => (
        <div key={grupo || "general"} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          {grupo && (
            <p className="border-b border-border bg-bg-section px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary sm:px-6">
              {grupo}
            </p>
          )}
          <ol className="divide-y divide-border">
            {lista.map((p) => {
              const i = n++
              const respondida = (guardadas.get(p.id) ?? "").length > 0
              const campo = `respuesta-${p.id}`
              return (
                <li key={p.id} className="px-5 py-5 sm:px-6">
                  <label htmlFor={campo} className="flex items-start gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold tabular-nums ${
                        respondida ? "bg-success-light text-success" : "bg-primary-light text-primary"
                      }`}
                    >
                      {respondida ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : numero(i)}
                    </span>
                    <span className="whitespace-pre-line pt-0.5 text-pretty text-sm font-medium leading-relaxed text-text-primary sm:text-base">
                      {p.texto}
                    </span>
                  </label>
                  <textarea
                    id={campo}
                    rows={3}
                    maxLength={5000}
                    value={borrador.get(p.id) ?? ""}
                    onChange={(e) => escribir(p.id, e.target.value)}
                    placeholder="Escribe tu respuesta…"
                    className="mt-3 w-full resize-y rounded-xl border border-border bg-bg-section px-4 py-3 text-base text-text-primary placeholder:text-text-muted/70 transition-colors focus:border-primary focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/10 sm:ml-10 sm:w-[calc(100%-2.5rem)] sm:text-sm"
                  />
                </li>
              )
            })}
          </ol>
        </div>
      ))}

      {/* Guardar: fijo abajo en celular mientras haya cambios */}
      <div
        className={`sticky bottom-4 z-20 flex flex-col items-stretch gap-3 rounded-2xl border border-line-dark bg-bg-dark/95 p-3 shadow-hover backdrop-blur-md transition-all sm:flex-row sm:items-center sm:justify-between sm:p-4 ${
          cambios.length || estado.tipo !== "inactivo" ? "" : "opacity-90"
        }`}
        aria-live="polite"
      >
        <p className="flex items-center gap-2 px-2 text-sm text-white/75">
          {estado.tipo === "guardado" ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
              ¡Gracias! Tus respuestas quedaron guardadas.
            </>
          ) : estado.tipo === "error" ? (
            <>
              <AlertCircle className="h-4 w-4 text-warning" aria-hidden="true" />
              {estado.mensaje}
            </>
          ) : cambios.length ? (
            `${cambios.length} ${cambios.length === 1 ? "respuesta sin guardar" : "respuestas sin guardar"}`
          ) : (
            "Todo guardado"
          )}
        </p>
        <button
          type="button"
          onClick={guardar}
          disabled={!cambios.length || enviando}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(120,54,226,0.8)] transition-all hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {enviando ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          Guardar respuestas
        </button>
      </div>
    </div>
  )
}
