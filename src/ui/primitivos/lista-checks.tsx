"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

/*
 * Lista con palomitas que en celular muestra solo los primeros `visibles`
 * elementos y un botón "Ver todo"; desde sm se muestra completa. Evita
 * pantallas enteras de viñetas en móvil sin esconder nada en escritorio.
 */
export function ListaChecks({
  items,
  visibles = 4,
  className = "",
  textoClase = "text-sm text-text-secondary sm:text-base",
}: {
  items: string[]
  visibles?: number
  className?: string
  textoClase?: string
}) {
  const [abierta, setAbierta] = useState(false)
  const sobran = items.length - visibles

  return (
    <>
      <ul className={className}>
        {items.map((x, i) => (
          <li
            key={x}
            className={`flex items-start gap-2.5 ${textoClase} ${!abierta && i >= visibles ? "max-sm:hidden" : ""}`}
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            {x}
          </li>
        ))}
      </ul>
      {sobran > 0 && (
        <button
          type="button"
          aria-expanded={abierta}
          onClick={() => setAbierta((v) => !v)}
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary sm:hidden"
        >
          {abierta ? "Ver menos" : `Ver todo (+${sobran})`}
          <ChevronDown className={`h-4 w-4 transition-transform ${abierta ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      )}
    </>
  )
}
