"use client"

/**
 * Efectos del diagnóstico público: aparición al hacer scroll, cifras que se
 * cuentan solas, barra de progreso de lectura e índice lateral. Todo respeta
 * `prefers-reduced-motion` y el contenido es legible aunque no corra JS
 * (el SSR ya trae los valores finales).
 */

import { useEffect, useRef, useState } from "react"

function sinMovimiento(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Hace aparecer su contenido (subiendo y con fundido) al entrar en pantalla. */
export function Revelar({
  children,
  retrasoMs = 0,
  className = "",
}: {
  children: React.ReactNode
  retrasoMs?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${retrasoMs}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
        visible ? "translate-y-0 opacity-100 blur-0" : "motion-safe:translate-y-8 motion-safe:opacity-0 motion-safe:blur-[2px]"
      } ${className}`}
    >
      {children}
    </div>
  )
}

/** Número que cuenta desde 0 al entrar en pantalla. */
export function Contador({ valor, duracionMs = 1400 }: { valor: number; duracionMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [mostrado, setMostrado] = useState(valor)

  useEffect(() => {
    const el = ref.current
    if (!el || sinMovimiento() || valor === 0) return
    let cuadro = 0
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      const inicio = performance.now()
      const paso = (t: number) => {
        const p = Math.min(1, (t - inicio) / duracionMs)
        const suave = 1 - Math.pow(1 - p, 3)
        setMostrado(Math.round(valor * suave))
        if (p < 1) cuadro = requestAnimationFrame(paso)
      }
      setMostrado(0)
      cuadro = requestAnimationFrame(paso)
    })
    obs.observe(el)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(cuadro)
    }
  }, [valor, duracionMs])

  return (
    <span ref={ref} className="tabular-nums">
      {mostrado}
    </span>
  )
}

/** Barra fina arriba que avanza con la lectura. */
export function BarraLectura() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cuadro = 0
    const actualizar = () => {
      cuadro = 0
      const el = ref.current
      if (!el) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
    }
    const alScroll = () => {
      if (!cuadro) cuadro = requestAnimationFrame(actualizar)
    }
    actualizar()
    window.addEventListener("scroll", alScroll, { passive: true })
    window.addEventListener("resize", alScroll)
    return () => {
      window.removeEventListener("scroll", alScroll)
      window.removeEventListener("resize", alScroll)
      cancelAnimationFrame(cuadro)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden="true">
      <div
        ref={ref}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-primary-hover via-primary to-primary-light shadow-[0_0_12px_rgba(120,54,226,0.6)]"
      />
    </div>
  )
}

/** Índice lateral (pantallas anchas): puntos que marcan la sección en curso. */
export function IndiceSecciones({ secciones }: { secciones: { id: string; titulo: string }[] }) {
  const [activa, setActiva] = useState<string | null>(null)

  useEffect(() => {
    const els = secciones
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActiva(e.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [secciones])

  if (secciones.length < 3) return null

  return (
    <nav
      aria-label="Secciones del diagnóstico"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ol className="flex flex-col gap-1 rounded-full border border-border/80 bg-surface/80 p-1.5 shadow-elevated backdrop-blur-md">
        {secciones.map((s, i) => {
          const actual = s.id === activa
          return (
            <li key={s.id} className="group relative">
              <a
                href={`#${s.id}`}
                aria-label={s.titulo}
                aria-current={actual ? "true" : undefined}
                className="flex h-7 w-7 items-center justify-center rounded-full"
              >
                <span
                  className={`rounded-full transition-all duration-300 ${
                    actual ? "h-5 w-1.5 bg-primary" : "h-1.5 w-1.5 bg-text-muted/40 group-hover:bg-primary/60"
                  }`}
                />
              </a>
              <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-bg-dark px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                <span className="mr-1.5 font-mono text-primary-light">{String(i + 1).padStart(2, "0")}</span>
                {s.titulo}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
