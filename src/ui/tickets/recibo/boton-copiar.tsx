"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, Copy } from "lucide-react"

/** Intenta copiar por selección cuando el portapapeles no está disponible. */
function copiarPorSeleccion(texto: string): boolean {
  const anterior = document.activeElement
  const seleccion = window.getSelection()
  const rangos = seleccion ? Array.from({ length: seleccion.rangeCount }, (_, i) => seleccion.getRangeAt(i).cloneRange()) : []
  const campo = document.createElement("textarea")
  campo.value = texto
  campo.readOnly = true
  campo.style.position = "fixed"
  campo.style.opacity = "0"
  document.body.appendChild(campo)
  try {
    campo.focus({ preventScroll: true })
    campo.select()
    return document.execCommand("copy")
  } catch {
    return false
  } finally {
    campo.remove()
    if (anterior instanceof HTMLElement) anterior.focus({ preventScroll: true })
    seleccion?.removeAllRanges()
    for (const rango of rangos) seleccion?.addRange(rango)
  }
}

export function BotonCopiar({ texto, etiqueta }: { texto: string; etiqueta: string }) {
  const [estado, ponerEstado] = useState<"reposo" | "copiado" | "manual">("reposo")
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)
  const campoManual = useRef<HTMLInputElement>(null)

  useEffect(() => () => { if (temporizador.current) clearTimeout(temporizador.current) }, [])
  useEffect(() => {
    if (estado === "manual") {
      campoManual.current?.focus()
      campoManual.current?.select()
    }
  }, [estado])

  async function copiar() {
    if (temporizador.current) clearTimeout(temporizador.current)
    let copiado = false
    try {
      await navigator.clipboard.writeText(texto)
      copiado = true
    } catch {
      copiado = copiarPorSeleccion(texto)
    }
    ponerEstado(copiado ? "copiado" : "manual")
    if (copiado) temporizador.current = setTimeout(() => ponerEstado("reposo"), 2000)
  }

  return (
    <div className="no-print shrink-0">
      <button type="button" onClick={copiar} aria-label={`Copiar ${etiqueta}`} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold text-primary hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        {estado === "copiado" ? <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-success" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
        <span className={estado === "copiado" ? "text-success" : ""}>{estado === "copiado" ? "Copiado" : "Copiar"}</span>
      </button>
      <span aria-live="polite" className="sr-only">{estado === "copiado" ? `${etiqueta}: copiado` : estado === "manual" ? "Selecciona y copia el texto." : ""}</span>
      {estado === "manual" && (
        <label className="mt-2 block max-w-32 text-xs text-text-secondary">
          Selecciona y copia
          <input ref={campoManual} readOnly value={texto} aria-label={`${etiqueta} para copiar manualmente`} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-surface px-2 text-base text-text-primary" onFocus={(evento) => evento.currentTarget.select()} />
        </label>
      )}
    </div>
  )
}
