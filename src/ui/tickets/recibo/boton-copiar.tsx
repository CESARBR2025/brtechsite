"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
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

export function BotonCopiar({ texto, etiqueta, aviso, oscuro = false }: { texto: string; etiqueta: string; aviso?: string; oscuro?: boolean }) {
  const [estado, ponerEstado] = useState<"reposo" | "copiado" | "manual">("reposo")
  const [avisoVisible, ponerAvisoVisible] = useState(false)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)
  const temporizadorAviso = useRef<ReturnType<typeof setTimeout> | null>(null)
  const campoManual = useRef<HTMLInputElement>(null)

  useEffect(() => () => {
    if (temporizador.current) clearTimeout(temporizador.current)
    if (temporizadorAviso.current) clearTimeout(temporizadorAviso.current)
  }, [])
  useEffect(() => {
    if (estado === "manual") {
      campoManual.current?.focus()
      campoManual.current?.select()
    }
  }, [estado])

  async function copiar() {
    if (temporizador.current) clearTimeout(temporizador.current)
    if (temporizadorAviso.current) clearTimeout(temporizadorAviso.current)
    let copiado = false
    try {
      await navigator.clipboard.writeText(texto)
      copiado = true
    } catch {
      copiado = copiarPorSeleccion(texto)
    }
    ponerEstado(copiado ? "copiado" : "manual")
    ponerAvisoVisible(copiado)
    if (copiado) {
      temporizador.current = setTimeout(() => ponerEstado("reposo"), 1600)
      temporizadorAviso.current = setTimeout(() => ponerAvisoVisible(false), 1800)
    }
  }

  return (
    <div className="no-print shrink-0">
      <button type="button" onClick={copiar} aria-label={`Copiar ${etiqueta}`} className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${oscuro ? "border border-white/18 bg-white/12 text-white hover:bg-white/20" : "bg-primary-light text-primary hover:bg-primary hover:text-white"}`}>
        {estado === "copiado" ? <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-success" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
        <span className={estado === "copiado" ? "text-success" : ""}>{estado === "copiado" ? "Copiado" : "Copiar"}</span>
      </button>
      <span aria-live="polite" className="sr-only">{estado === "copiado" ? aviso || `${etiqueta}: copiado` : estado === "manual" ? "Selecciona y copia el texto." : ""}</span>
      {avisoVisible && aviso && createPortal(<span aria-hidden="true" className="no-print exp-aviso exp-aviso-visible"><CheckCircle2 className="h-5 w-5 shrink-0 text-success" />{aviso}</span>, document.body)}
      {estado === "manual" && (
        <label className="mt-2 block max-w-32 text-xs text-text-secondary">
          Selecciona y copia
          <input ref={campoManual} readOnly value={texto} aria-label={`${etiqueta} para copiar manualmente`} className="mt-1 min-h-11 w-full rounded-lg border border-border bg-surface px-2 text-base text-text-primary" onFocus={(evento) => evento.currentTarget.select()} />
        </label>
      )}
    </div>
  )
}
