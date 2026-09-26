"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowRight, CheckCircle2, Menu, X } from "lucide-react"
import { BotonEspecular } from "@/src/ui/primitivos/boton-especular"
import { GlassSurface } from "@/src/ui/primitivos/glass-surface"

// bg-dark (#151127) en canales RGB para el tinte del vidrio (igual que el sitio)
const TINTE_BG_DARK = "21 17 39"

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"

/**
 * Encabezado de vidrio de las páginas que se comparten con un cliente
 * (propuesta, diagnóstico): mismo lenguaje que la barra del sitio, con atajos
 * a las secciones clave y una acción principal o un estado cumplido.
 */
export function NavbarDocumento({
  enlaces,
  accion,
  cumplido,
}: {
  enlaces: { id: string; titulo: string }[]
  /** Botón principal (p. ej. "Aceptar propuesta" → #aceptar). */
  accion?: { texto: string; href: string } | null
  /** Si se indica, sustituye a la acción con una etiqueta verde (p. ej. "Aceptada"). */
  cumplido?: string | null
}) {
  const [abierto, setAbierto] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activa, setActiva] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Resalta el atajo de la sección que se está leyendo
  useEffect(() => {
    const els = enlaces
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null)
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActiva(e.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [enlaces])

  useEffect(() => {
    if (!abierto) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [abierto])

  const tabClass = (id: string) =>
    `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${focusRing} ${
      activa === id
        ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
        : "text-white/65 hover:bg-white/5 hover:text-white"
    }`

  const cta = cumplido ? (
    <span className="hidden items-center gap-1.5 rounded-full bg-success/15 px-4 py-2.5 text-sm font-semibold text-success md:inline-flex">
      <CheckCircle2 className="h-4 w-4" /> {cumplido}
    </span>
  ) : accion ? (
    <BotonEspecular
      href={accion.href}
      className={`group hidden items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(120,54,226,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] transition-colors hover:bg-primary-hover md:inline-flex ${focusRing}`}
    >
      {accion.texto}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </BotonEspecular>
  ) : null

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <div
        className={`mx-auto transition-[max-width] duration-500 ease-out ${
          scrolled ? "max-w-4xl" : "max-w-5xl"
        }`}
      >
        <GlassSurface
          borderRadius={28}
          tint={TINTE_BG_DARK}
          tintOpacity={scrolled || abierto ? 0.72 : 0.4}
          saturation={1.5}
          brightness={50}
          opacity={0.93}
          blur={11}
          distortionScale={-160}
        >
          <div className="flex h-14 items-center justify-between gap-3 pl-5 pr-2">
            <a href="#" className={`flex shrink-0 items-center rounded-full ${focusRing}`} aria-label="Ir al inicio">
              <Image src="/logo.png" alt="BR TECH" width={566} height={191} priority className="h-8 w-auto" />
            </a>

            {enlaces.length > 0 && (
              <nav aria-label="Secciones" className="hidden items-center gap-0.5 md:flex">
                {enlaces.map((e) => (
                  <a key={e.id} href={`#${e.id}`} aria-current={activa === e.id ? "true" : undefined} className={tabClass(e.id)}>
                    {e.titulo}
                  </a>
                ))}
              </nav>
            )}

            {cta}

            <button
              type="button"
              onClick={() => setAbierto(!abierto)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white md:hidden ${focusRing}`}
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={abierto}
              aria-controls="menu-documento"
            >
              {abierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Menú móvil: se despliega dentro del mismo vidrio */}
          <div
            id="menu-documento"
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
              abierto ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
            inert={!abierto}
          >
            <div className="overflow-hidden">
              <div className="border-t border-white/10 px-3 pb-3 pt-2">
                <nav className="flex flex-col gap-1">
                  {enlaces.map((e) => (
                    <a key={e.id} href={`#${e.id}`} onClick={() => setAbierto(false)} className={tabClass(e.id)}>
                      {e.titulo}
                    </a>
                  ))}
                </nav>
                {cumplido ? (
                  <p className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-success/15 px-4 py-3 text-sm font-semibold text-success">
                    <CheckCircle2 className="h-4 w-4" /> {cumplido}
                  </p>
                ) : accion ? (
                  <a
                    href={accion.href}
                    onClick={() => setAbierto(false)}
                    className={`group mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(120,54,226,0.8)] transition-colors hover:bg-primary-hover ${focusRing}`}
                  >
                    {accion.texto}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </GlassSurface>
      </div>
    </header>
  )
}
