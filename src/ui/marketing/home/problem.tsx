"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Calculator,
  Check,
  MessagesSquare,
  PackageSearch,
  PackageX,
  TrendingDown,
  UserRoundX,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { WHATSAPP } from "@/src/ui/marketing/datos-contacto"

/*
 * "¿Te identificas?" como autodiagnóstico: el visitante marca las situaciones
 * que vive hoy y el cierre cambia según lo que eligió, con un WhatsApp ya
 * redactado con sus dolores. Son situaciones típicas del giro, no testimonios
 * ni cifras de clientes.
 */

interface Situacion {
  icono: LucideIcon
  texto: string
  /** Cómo se lee dentro del mensaje de WhatsApp. */
  mensaje: string
}

const situaciones: Situacion[] = [
  {
    icono: Calculator,
    texto: "El corte de caja no cuadra y nadie sabe por qué",
    mensaje: "el corte de caja no cuadra",
  },
  {
    icono: PackageSearch,
    texto: "Me entero de que se acabó un producto cuando el cliente lo pide",
    mensaje: "me entero tarde de que se acabó un producto",
  },
  {
    icono: MessagesSquare,
    texto: "Mi operación vive en WhatsApp, Excel y libretas",
    mensaje: "mi operación vive en WhatsApp, Excel y libretas",
  },
  {
    icono: UserRoundX,
    texto: "Si yo no estoy, el negocio no avanza",
    mensaje: "si yo no estoy, el negocio no avanza",
  },
  {
    icono: PackageX,
    texto: "Se pierde producto y no hay quién responda por él",
    mensaje: "se pierde producto y nadie responde por él",
  },
  {
    icono: TrendingDown,
    texto: "Vendo, pero no sé cuánto gano realmente",
    mensaje: "no sé cuánto gano realmente",
  },
]

/** Lectura del resultado según cuántas situaciones marcó. */
function lectura(n: number): string {
  if (n <= 2) return "Ya es una fuga que vale la pena atender antes de que crezca."
  if (n <= 4) return "Tu operación está perdiendo margen en varios frentes a la vez."
  return "Es momento de ordenar tu operación. No es normal, y tiene solución."
}

export function ProblemSection() {
  const [marcadas, setMarcadas] = useState<Set<number>>(() => new Set())
  const n = marcadas.size

  function alternar(i: number) {
    setMarcadas((prev) => {
      const s = new Set(prev)
      if (s.has(i)) s.delete(i)
      else s.add(i)
      return s
    })
  }

  const elegidas = situaciones.filter((_, i) => marcadas.has(i)).map((x) => x.mensaje)
  const mensaje =
    n > 0
      ? `Hola, vi su sitio y me identifico con esto: ${elegidas.join("; ")}. Me gustaría platicar mi caso.`
      : "Hola, vi su sitio y me gustaría platicar sobre mi negocio."
  const enlaceWhatsApp = `https://wa.me/${WHATSAPP.telefono.replace("+", "")}?text=${encodeURIComponent(mensaje)}`

  return (
    <section className="relative bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            ¿Te identificas?
            <span className="h-px w-8 bg-primary" />
          </p>
          <h2 className="mt-5 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-5xl">
            Problemas que cuestan dinero todos los días
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            Marca lo que te pasa hoy. Si algo te suena, no es normal: es margen que se escapa por
            procesos que se pueden resolver.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {situaciones.map((s, i) => {
            const activa = marcadas.has(i)
            return (
              <li key={s.texto}>
                <button
                  type="button"
                  aria-pressed={activa}
                  onClick={() => alternar(i)}
                  className={`group relative flex h-full w-full items-start gap-4 rounded-2xl border p-5 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.99] sm:p-6 ${
                    activa
                      ? "border-primary/50 bg-primary-light/50 shadow-hover"
                      : "border-border bg-surface shadow-card hover:border-primary/30 hover:shadow-hover"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${
                      activa ? "border-primary bg-primary text-white" : "border-border bg-bg-section text-text-secondary group-hover:text-primary"
                    }`}
                  >
                    <s.icono className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span
                    className={`flex-1 pt-1 font-display text-base font-semibold leading-snug transition-colors ${
                      activa ? "text-text-primary" : "text-text-primary/85"
                    }`}
                  >
                    {s.texto}
                  </span>
                  <span
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      activa ? "scale-100 border-primary bg-primary text-white" : "border-border text-transparent group-hover:border-primary/40"
                    }`}
                    aria-hidden="true"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Cierre: cambia según lo que marcó */}
        <div
          aria-live="polite"
          className={`mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border transition-all duration-500 ${
            n > 0 ? "border-primary/30 bg-bg-dark shadow-[0_30px_60px_-30px_rgba(71,31,163,0.6)]" : "border-border bg-bg-section"
          }`}
        >
          <div className="flex flex-col items-center gap-6 p-6 text-center sm:p-8 md:flex-row md:text-left">
            <div className="flex-1">
              {n > 0 ? (
                <>
                  <p className="font-display text-2xl font-bold tracking-tight text-white">
                    Marcaste {n} de {situaciones.length}
                  </p>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-white/70 sm:text-base">
                    {lectura(n)} Es justo lo que atendemos en el primer paso de nuestro método: el
                    diagnóstico de tu proyecto.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-lg font-semibold text-text-primary">
                    Toca las situaciones que vives hoy
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Con lo que marques, te decimos por dónde empezar.
                  </p>
                </>
              )}
            </div>
            <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
              <a
                href={enlaceWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] ${
                  n > 0
                    ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover focus-visible:ring-offset-bg-dark"
                    : "border border-border bg-surface text-text-primary hover:border-primary/40 hover:text-primary"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d={WHATSAPP.path} />
                </svg>
                Platícanos tu caso
              </a>
              <Link
                href="/servicios"
                className={`group inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary ${
                  n > 0 ? "text-white/80 hover:text-white" : "text-primary hover:text-primary-hover"
                }`}
              >
                Ver cómo lo resolvemos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
