"use client"

import { Printer } from "lucide-react"

export function BotonImprimir({
  variante = "claro",
  texto,
}: {
  variante?: "claro" | "oscuro"
  texto?: string
}) {
  const clase =
    variante === "oscuro"
      ? "border-line-dark-strong bg-surface-dark text-white/85 backdrop-blur-sm hover:bg-surface-dark-hover hover:text-white"
      : "border-border bg-surface text-text-secondary hover:bg-bg-section"

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`no-print inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium motion-safe:transition-all motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${clase}`}
    >
      <Printer aria-hidden="true" className="h-4 w-4 shrink-0" />
      {texto ? <span className="sr-only sm:not-sr-only">{texto}</span> : <><span className="sm:hidden">Imprimir</span><span className="hidden sm:inline">Descargar / Imprimir</span></>}
    </button>
  )
}
