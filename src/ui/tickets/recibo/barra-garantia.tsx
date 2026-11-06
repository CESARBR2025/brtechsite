"use client"

import { useEffect, useRef } from "react"

export function BarraGarantia({ dias, restantes, porcentaje }: { dias: number; restantes: number; porcentaje: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current, barra = el?.firstElementChild as HTMLElement | null
    if (!el || !barra || window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") return
    let cuadro = 0
    barra.style.width = "0%"
    const terminar = () => { barra.style.width = `${porcentaje}%` }
    const observador = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return
      cuadro = requestAnimationFrame(terminar)
      observador.disconnect()
    }, { threshold: .8 })
    observador.observe(el)
    return () => { observador.disconnect(); cancelAnimationFrame(cuadro) }
  }, [porcentaje])
  return <div ref={ref} className="exp-barra-g mt-3 h-1.5 overflow-hidden rounded-full bg-bg-section" role="progressbar" aria-label="Días de garantía restantes" aria-valuemin={0} aria-valuemax={dias} aria-valuenow={restantes}><i className="block h-full rounded-full bg-success" style={{ width: `${porcentaje}%` }} /></div>
}
