"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Code, LifeBuoy, PenTool, Rocket, Search } from "lucide-react"
import type { LucideIcon } from "lucide-react"

/*
 * "Cada paso deja algo en tus manos": el método contado como recorrido. A la
 * izquierda (fija en escritorio) el título y el avance; a la derecha una
 * tarjeta por paso con su entregable, representado con una mini-interfaz
 * (pantalla oscura dentro de tarjeta clara, como en Servicios). Cada
 * mini-interfaz se anima cuando su paso entra en pantalla, así también se ve
 * en celular. Datos genéricos: nada de clientes reales.
 */

interface Paso {
  icono: LucideIcon
  titulo: string
  descripcion: string
  entregable: string
  Pantalla: (props: { activa: boolean }) => React.ReactElement
}

const numero = (i: number) => String(i + 1).padStart(2, "0")

// Base de las mini-interfaces
const marco =
  "relative h-44 overflow-hidden rounded-xl border border-bg-dark bg-bg-dark p-4 shadow-[0_12px_28px_-14px_rgba(21,17,39,0.55)]"
const suave = "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out"

function PantallaDiagnostico({ activa }: { activa: boolean }) {
  return (
    <div className={`${marco} flex flex-col items-center justify-center text-center`} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(157,77,255,0.55),rgba(91,33,230,0.25)_45%,transparent_75%)]" />
      <p className="relative flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.3em] text-white/70">
        <span className="h-px w-5 bg-primary-light/60" />
        Diagnóstico de tu proyecto
        <span className="h-px w-5 bg-primary-light/60" />
      </p>
      <p
        className={`relative mt-3 font-hero text-3xl font-semibold tracking-tight text-white ${suave} ${
          activa ? "opacity-100 blur-0" : "opacity-40 blur-[3px]"
        }`}
      >
        Tu sistema
      </p>
      <p className="relative mt-2 text-[11px] text-white/65">Hola. Esto es lo que entendimos de tu operación.</p>
    </div>
  )
}

function PantallaPropuesta({ activa }: { activa: boolean }) {
  const modulos = ["Inventario", "Ventas en ruta", "Reportes"]
  return (
    <div className={marco} aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-white/55">Propuesta de desarrollo</span>
        <span className="rounded-full bg-primary/25 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary-light">MVP</span>
      </div>
      <ul className="mt-3 space-y-2">
        {modulos.map((m, i) => (
          <li
            key={m}
            className={`flex items-center gap-2 text-xs text-white/80 ${suave} ${activa ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
            style={{ transitionDelay: `${150 + i * 120}ms` }}
          >
            <Check className="h-3.5 w-3.5 text-success" />
            {m}
          </li>
        ))}
      </ul>
      <span
        className={`absolute bottom-4 right-4 inline-flex rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(120,54,226,0.9)] ${suave} ${
          activa ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        style={{ transitionDelay: "550ms" }}
      >
        Aceptar propuesta
      </span>
    </div>
  )
}

function PantallaConstruccion({ activa }: { activa: boolean }) {
  const hitos = ["Sem 1-2", "Sem 3-5", "Sem 6-8", "Sem 9-12"]
  return (
    <div className={marco} aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-white/55">Avance del proyecto</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success ${suave} ${
            activa ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Demo lista
        </span>
      </div>
      <div className="mt-6 grid grid-cols-4 gap-2">
        {hitos.map((h, i) => (
          <div key={h}>
            <span className="block h-2 overflow-hidden rounded-full bg-white/[0.08]">
              <span
                className={`block h-full origin-left rounded-full bg-gradient-to-r from-primary-hover to-primary ${suave} ${
                  activa && i < 3 ? "scale-x-100" : "scale-x-0"
                }`}
                style={{ transitionDelay: `${i * 180}ms` }}
              />
            </span>
            <span className="mt-2 block text-[10px] text-white/50">{h}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] leading-relaxed text-white/65">
        Validas cada entrega funcionando antes de seguir con la siguiente.
      </p>
    </div>
  )
}

function PantallaPuestaEnMarcha({ activa }: { activa: boolean }) {
  const pasos = ["Capacitación del equipo", "Piloto en operación", "Operación completa"]
  return (
    <div className={marco} aria-hidden="true">
      <span className="text-[11px] font-medium text-white/55">Arranque</span>
      <ul className="mt-3 space-y-2.5">
        {pasos.map((p, i) => (
          <li key={p} className="flex items-center gap-2.5 text-xs text-white/80">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${suave} ${
                activa ? "border-success bg-success text-white" : "border-white/20 text-transparent"
              }`}
              style={{ transitionDelay: `${200 + i * 250}ms` }}
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            {p}
          </li>
        ))}
      </ul>
      <span className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[11px] text-white/55">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
        </span>
        En operación
      </span>
    </div>
  )
}

function PantallaAcompanamiento({ activa }: { activa: boolean }) {
  return (
    <div className={marco} aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-white/55">Soporte</span>
        <span className="rounded-full bg-primary/25 px-2 py-0.5 text-[10px] font-semibold text-primary-light">
          6 meses incluidos
        </span>
      </div>
      <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-3">
        <p className="text-xs font-medium text-white/85">Ajuste solicitado</p>
        <p className="mt-0.5 text-[11px] text-white/50">Agregar un campo al reporte de ventas</p>
        <span
          className={`mt-2.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${suave} ${
            activa ? "bg-success/15 text-success" : "bg-white/10 text-white/50"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          {activa && <Check className="h-3 w-3" />}
          {activa ? "Resuelto" : "En revisión"}
        </span>
      </div>
    </div>
  )
}

const pasos: Paso[] = [
  {
    icono: Search,
    titulo: "Entendimiento",
    descripcion: "Nos metemos en tu negocio para entender cómo realmente operas: quién hace qué, dónde se atora y qué te está costando.",
    entregable: "Diagnóstico de tu proyecto",
    Pantalla: PantallaDiagnostico,
  },
  {
    icono: PenTool,
    titulo: "Diseño de la solución",
    descripcion: "Traducimos tu operación en un sistema claro: módulos, etapas, calendario e inversión, antes de escribir una línea de código.",
    entregable: "Propuesta de desarrollo",
    Pantalla: PantallaPropuesta,
  },
  {
    icono: Code,
    titulo: "Construcción",
    descripcion: "Desarrollamos por entregas: cada avance lo ves funcionando y lo validas con nosotros.",
    entregable: "Avances que ves funcionando",
    Pantalla: PantallaConstruccion,
  },
  {
    icono: Rocket,
    titulo: "Puesta en marcha",
    descripcion: "Implementamos el sistema en tu operación real, capacitamos a tu equipo y lo ajustamos sobre la marcha.",
    entregable: "Tu sistema operando",
    Pantalla: PantallaPuestaEnMarcha,
  },
  {
    icono: LifeBuoy,
    titulo: "Acompañamiento",
    descripcion: "Seguimos contigo en la evolución del sistema: correcciones, ajustes y mejora continua.",
    entregable: "Soporte incluido",
    Pantalla: PantallaAcompanamiento,
  },
]

export function ProcessSection() {
  const [activo, setActivo] = useState(0)
  // Una vez que un paso se vio, su pantalla queda en su estado final
  const [vistos, setVistos] = useState<Set<number>>(() => new Set())
  const refs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const els = refs.current.filter((el): el is HTMLLIElement => el !== null)
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue
          const i = Number((e.target as HTMLElement).dataset.paso)
          setActivo(i)
          setVistos((prev) => (prev.has(i) ? prev : new Set(prev).add(i)))
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

                <div className="mt-6 grid items-center gap-5 sm:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                      Lo que recibes
                    </p>
                    <p className="mt-1.5 flex items-center gap-2 font-display text-lg font-semibold text-text-primary">
                      <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                      {p.entregable}
                    </p>
                  </div>
                  <p.Pantalla activa={vistos.has(i)} />
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
