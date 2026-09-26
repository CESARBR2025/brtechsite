"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Check, Code, LifeBuoy, PenTool, Rocket, Search } from "lucide-react"
import type { LucideIcon } from "lucide-react"

/*
 * "Cada paso deja algo en tus manos": el método contado como recorrido. A la
 * izquierda (fija en escritorio) el título y el avance; a la derecha una
 * tarjeta por paso con su foto (public/metodo) y el entregable en una
 * etiqueta de vidrio. Fotos ilustrativas, no de clientes.
 */

interface Paso {
  icono: LucideIcon
  titulo: string
  descripcion: string
  entregable: string
  /** Foto del paso (public/metodo). */
  foto: { src: string; alt: string }
}

const numero = (i: number) => String(i + 1).padStart(2, "0")

const pasos: Paso[] = [
  {
    icono: Search,
    titulo: "Entendimiento",
    descripcion: "Nos metemos en tu negocio para entender cómo realmente operas: quién hace qué, dónde se atora y qué te está costando.",
    entregable: "Diagnóstico de tu proyecto",
    foto: {
      src: "/metodo/entendimiento.webp",
      alt: "Consultor tomando notas mientras el encargado de cocina le muestra su bitácora en papel y los anaqueles",
    },
  },
  {
    icono: PenTool,
    titulo: "Diseño de la solución",
    descripcion: "Traducimos tu operación en un sistema claro: módulos, etapas, calendario e inversión, antes de escribir una línea de código.",
    entregable: "Propuesta de desarrollo",
    foto: {
      src: "/metodo/diseno.webp",
      alt: "Escritorio con bocetos de pantallas, notas adhesivas y una laptop con el diagrama del sistema",
    },
  },
  {
    icono: Code,
    titulo: "Construcción",
    descripcion: "Desarrollamos por entregas: cada avance lo ves funcionando y lo validas con nosotros.",
    entregable: "Avances que ves funcionando",
    foto: {
      src: "/metodo/construccion.webp",
      alt: "Desarrollador frente a dos monitores con código y un tablero, con una tablet que muestra la aplicación funcionando",
    },
  },
  {
    icono: Rocket,
    titulo: "Puesta en marcha",
    descripcion: "Implementamos el sistema en tu operación real, capacitamos a tu equipo y lo ajustamos sobre la marcha.",
    entregable: "Tu sistema operando",
    foto: {
      src: "/metodo/puesta-en-marcha.webp",
      alt: "Consultor entregando una tablet con el sistema al personal de un restaurante, junto a la impresora de tickets",
    },
  },
  {
    icono: LifeBuoy,
    titulo: "Acompañamiento",
    descripcion: "Seguimos contigo en la evolución del sistema: correcciones, ajustes y mejora continua.",
    entregable: "Soporte incluido",
    foto: {
      src: "/metodo/acompanamiento.webp",
      alt: "Dueño de un negocio revisando en su celular el chat de soporte resuelto, con el tablero del sistema en la laptop",
    },
  },
]

export function ProcessSection() {
  const [activo, setActivo] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const els = refs.current.filter((el): el is HTMLLIElement => el !== null)
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue
          setActivo(Number((e.target as HTMLElement).dataset.paso))
        }
      },
      { rootMargin: "-40% 0px -45% 0px" },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const avance = ((activo + 1) / pasos.length) * 100

  return (
    <section className="relative bg-bg-section py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8">
        {/* Encabezado y avance (fijo en escritorio) */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Nuestro método
          </p>
          <h2 className="mt-5 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-5xl">
            Así construimos tu sistema
          </h2>
          <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            Cada paso deja algo en tus manos: siempre sabes en qué vamos y qué recibes antes de avanzar al
            siguiente.
          </p>

          <div className="mt-10 hidden lg:block">
            <div className="h-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-hover to-primary transition-[width] duration-500 ease-out"
                style={{ width: `${avance}%` }}
              />
            </div>
            <ol className="mt-6 space-y-1">
              {pasos.map((p, i) => {
                const actual = i === activo
                const hecho = i < activo
                return (
                  <li key={p.titulo}>
                    <a
                      href={`#metodo-${i + 1}`}
                      className={`flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors ${
                        actual ? "bg-surface shadow-card" : "hover:bg-surface/60"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px] font-semibold tabular-nums transition-colors ${
                          actual
                            ? "bg-primary text-white"
                            : hecho
                              ? "bg-primary-light text-primary"
                              : "border border-border text-text-muted"
                        }`}
                      >
                        {hecho ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : numero(i)}
                      </span>
                      <span
                        className={`text-sm font-medium transition-colors ${
                          actual ? "text-text-primary" : "text-text-muted"
                        }`}
                      >
                        {p.titulo}
                      </span>
                      {actual && <span className="ml-auto text-xs text-primary">{p.entregable}</span>}
                    </a>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        {/* Pasos con su entregable */}
        <ol className="relative space-y-6">
          {/* Hilo que une los pasos en celular */}
          <span
            aria-hidden="true"
            className="absolute bottom-10 left-[1.9rem] top-10 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent lg:hidden"
          />
          {pasos.map((p, i) => {
            const actual = i === activo
            return (
              <li
                key={p.titulo}
                id={`metodo-${i + 1}`}
                data-paso={i}
                ref={(el) => {
                  refs.current[i] = el
                }}
                className={`relative scroll-mt-32 rounded-3xl border bg-surface p-6 transition-all duration-500 sm:p-8 ${
                  actual ? "border-primary/30 shadow-hover" : "border-border shadow-card"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-500 ${
                      actual ? "border-primary bg-primary text-white" : "border-border bg-surface text-primary"
                    }`}
                  >
                    <p.icono className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-semibold tabular-nums text-primary/60">
                      Paso {numero(i)}
                    </span>
                    <h3 className="mt-0.5 font-display text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
                      {p.titulo}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-text-secondary sm:text-base">
                  {p.descripcion}
                </p>

                {/* Foto del paso con el entregable en una etiqueta de vidrio */}
                <div className="relative mt-6 overflow-hidden rounded-2xl bg-bg-dark">
                  <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                    <Image
                      src={p.foto.src}
                      alt={p.foto.alt}
                      fill
                      sizes="(min-width: 1024px) 640px, 100vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-b from-bg-deep/40 via-transparent to-transparent"
                    />
                  </div>
                  <p className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-bg-dark/60 px-3.5 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md sm:left-5 sm:top-5">
                    <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} aria-hidden="true" />
                    <span className="text-white/60">Lo que recibes:</span> {p.entregable}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
