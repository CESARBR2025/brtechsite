"use client"

import { useEffect, useRef, useState } from "react"
import { formatearDinero } from "@/src/ui/formato"

/** El servidor y la impresión siempre entregan el valor final, incluidos los centavos. */
export function Contador({ valor, duracionMs = 1400, moneda }: { valor: number; duracionMs?: number; moneda?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [mostrado, ponerMostrado] = useState(valor)
  const formatear = (numero: number) => moneda ? formatearDinero(numero, moneda) : numero

  useEffect(() => {
    const el = ref.current
    const movimiento = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!el || movimiento.matches || valor === 0 || typeof IntersectionObserver === "undefined") return
    let cuadro = 0
    let detenido = false
    const terminar = () => { detenido = true; cancelAnimationFrame(cuadro); ponerMostrado(valor) }
    const alMovimiento = () => { if (movimiento.matches) terminar() }
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || detenido) return
      obs.disconnect()
      const inicio = performance.now()
      const paso = (t: number) => {
        const p = Math.min(1, (t - inicio) / duracionMs)
        const suave = 1 - Math.pow(1 - p, moneda ? 4 : 3)
        const precision = moneda ? 100 : 1
        ponerMostrado(Math.round(valor * precision * suave) / precision)
        if (p < 1) cuadro = requestAnimationFrame(paso)
      }
      ponerMostrado(0)
      cuadro = requestAnimationFrame(paso)
    }, { threshold: moneda ? .6 : 0 })
    obs.observe(el)
    window.addEventListener("beforeprint", terminar)
    movimiento.addEventListener("change", alMovimiento)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(cuadro)
      window.removeEventListener("beforeprint", terminar)
      movimiento.removeEventListener("change", alMovimiento)
    }
  }, [valor, duracionMs, moneda])

  return <span ref={ref} className="tabular-nums">
    <span className="print:hidden">{formatear(mostrado)}</span>
    <span className="hidden print:inline">{formatear(valor)}</span>
  </span>
}
