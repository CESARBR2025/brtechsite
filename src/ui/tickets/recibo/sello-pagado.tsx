"use client"

import { useEffect, useRef } from "react"
import { ESTRELLA } from "@/src/ui/marca/geometria-diafragma"
import { debeCelebrar } from "./decision-celebracion"

const PARTICULAS = Array.from({ length: 20 }, (_, i) => ({
  estrella: i < 6,
  angulo: (i * 137.5 * Math.PI) / 180,
  distancia: 48 + (i % 4) * 12,
}))

export function SelloPagado({ folio }: { folio: string }) {
  const raizRef = useRef<HTMLDivElement>(null)
  const selloRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const raiz = raizRef.current
    const sello = selloRef.current
    if (!raiz || !sello) return

    const movimiento = window.matchMedia("(prefers-reduced-motion: reduce)")
    const clave = `brtech-pago-${folio}`
    const animaciones: Animation[] = []
    let iniciado = false
    const yaVisto = () => {
      try { return window.localStorage.getItem(clave) !== null } catch { return false }
    }

    function celebrar() {
      if (iniciado || !debeCelebrar({ reducido: movimiento.matches, visto: yaVisto() })) return
      iniciado = true
      window.removeEventListener("brtech:entrada-fin", celebrar)
      if (!sello || !raiz || typeof sello.animate !== "function") return
      try { window.localStorage.setItem(clave, "1") } catch { /* El sello sigue funcionando sin almacenamiento. */ }

      animaciones.push(sello.animate([
        { transform: "rotate(-8deg) scale(2.4)", opacity: 0 },
        { transform: "rotate(-8deg) scale(1)", opacity: 1 },
      ], { duration: 520, easing: "cubic-bezier(.2,1.5,.4,1)" }))

      const tarjeta = raiz.closest<HTMLElement>("[data-tarjeta-total]")
      if (tarjeta) animaciones.push(tarjeta.animate([
        { transform: "translateY(0)" },
        { transform: "translateY(4px)", offset: 0.35 },
        { transform: "translateY(0)" },
      ], { delay: 220, duration: 300, easing: "ease-out" }))

      raiz.querySelectorAll<SVGSVGElement>("[data-particula]").forEach((elemento, i) => {
        const particula = PARTICULAS[i]
        const x = Math.cos(particula.angulo) * particula.distancia
        const y = Math.sin(particula.angulo) * particula.distancia
        animaciones.push(elemento.animate([
          { transform: "translate(0,0) scale(.2)", opacity: 0 },
          { opacity: 1, offset: 0.12 },
          { transform: `translate(${x}px,${y}px) rotate(${i * 28}deg) scale(.65)`, opacity: 0 },
        ], { delay: 220, duration: 800, easing: "cubic-bezier(.2,.7,.2,1)" }))
      })
    }

    const detener = () => {
      if (movimiento.matches) {
        window.removeEventListener("brtech:entrada-fin", celebrar)
        animaciones.forEach((animacion) => animacion.cancel())
      }
    }
    if (debeCelebrar({ reducido: movimiento.matches, visto: yaVisto() })) {
      window.addEventListener("brtech:entrada-fin", celebrar)
      if (window.__brtechEntradaFin && !document.documentElement.dataset.entrada) celebrar()
    }
    movimiento.addEventListener("change", detener)
    return () => {
      window.removeEventListener("brtech:entrada-fin", celebrar)
      movimiento.removeEventListener("change", detener)
      animaciones.forEach((animacion) => animacion.cancel())
    }
  }, [folio])

  return (
    <div ref={raizRef} className="relative mx-3 my-2 shrink-0">
      <span ref={selloRef} className="relative inline-block -rotate-[8deg] rounded-lg border-4 border-double border-success px-5 py-2 font-hero text-2xl font-semibold text-success">Pagado</span>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {PARTICULAS.map((particula, i) => (
          <svg key={i} data-particula viewBox="-16 -16 32 32" fill="currentColor" className={`absolute left-1/2 top-1/2 -ml-3 -mt-3 h-6 w-6 opacity-0 ${i % 2 ? "text-white" : "text-primary"}`}>
            {particula.estrella ? <path d={ESTRELLA} /> : <circle r="2" />}
          </svg>
        ))}
      </div>
    </div>
  )
}
