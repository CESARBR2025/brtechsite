"use client"

import { useState } from "react"
import { Check, Link2 } from "lucide-react"

export function CopiarEnlace({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      title={url}
      className="inline-flex items-center gap-1.5 rounded-md bg-primary-light px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
    >
      {copiado ? (
        <>
          <Check className="h-3.5 w-3.5" /> Copiado
        </>
      ) : (
        <>
          <Link2 className="h-3.5 w-3.5" /> Copiar enlace
        </>
      )}
    </button>
  )
}
