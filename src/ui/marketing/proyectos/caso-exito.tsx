import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, X } from "lucide-react"
import { GaleriaAcordeon } from "@/src/ui/primitivos/galeria-acordeon"
import { CTAFinal } from "@/src/ui/marketing/cta-final"
import { iconoModulo } from "@/src/ui/marketing/proyectos/iconos"
import type { Proyecto } from "@/src/ui/marketing/proyectos/datos"

/*
 * Página de un caso de éxito, con el mismo ritmo que el home: hero oscuro con
 * la galería y, debajo, secciones claras alternadas (antes → después, módulos,
 * etapas) hasta el CTA final de tarjeta oscura. Todo sale de `datos.ts`.
 */

const retraso = (ms: number) => ({ animationDelay: `${ms}ms` })
const numero = (i: number) => String(i + 1).padStart(2, "0")

/** Etiqueta de sección centrada con filetes, como en el home. */
function Encabezado({ etiqueta, titulo, texto }: { etiqueta: string; titulo: string; texto?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        <span className="h-px w-8 bg-primary" />
        {etiqueta}
        <span className="h-px w-8 bg-primary" />
      </p>
      <h2 className="mt-4 text-balance font-display text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-5xl">
        {titulo}
      </h2>
      {texto && (
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
          {texto}
        </p>
      )}
    </div>
  )
}

export function CasoExito({ proyecto: p }: { proyecto: Proyecto }) {
  // El último término del nombre lleva el degradado de marca
  const partes = p.titulo.split(" ")
  const final = partes.pop()

  // Datos del proyecto en una línea (sin cliente ni estado, que ya están arriba)
  const meta = p.ficha.filter((f) => !/cliente|estado/i.test(f.etiqueta))

  return (
    <>
      {/* Hero: identidad del proyecto + el sistema en operación */}
      <section className="relative isolate overflow-hidden bg-bg-deep">
        <div
          aria-hidden="true"
          className="absolute -left-40 top-0 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(120,54,226,0.35),transparent_65%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-40 bottom-0 -z-10 h-[30rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(120,54,226,0.25),transparent_65%)] blur-2xl"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-6 sm:pb-28 sm:pt-44 lg:px-8">
          <nav aria-label="Ruta" style={retraso(0)} className="motion-safe:animate-aparecer">
            <ol className="flex items-center gap-1.5 text-xs text-white/55">
              <li>
                <Link href="/#proyectos" className="inline-flex min-h-11 items-center rounded-sm outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary">
                  Proyectos
                </Link>
              </li>
              <li aria-current="page" className="flex items-center gap-1.5 text-white/80">
                <ChevronRight className="h-3.5 w-3.5 text-white/55" aria-hidden="true" />
                {p.cliente}
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid items-end gap-6 sm:mt-10 sm:gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <div>
              <div style={retraso(60)} className="flex flex-wrap items-center gap-3 motion-safe:animate-aparecer">
                {/* Los logos de clientes van sobre tarjeta blanca (DESIGNS.md) */}
                {p.logo && (
                  <span className="flex h-11 items-center rounded-xl bg-white px-3">
                    <Image src={p.logo} alt={`Logotipo de ${p.cliente}`} width={659} height={379} className="h-7 w-auto object-contain" priority />
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                  </span>
                  {p.estado}
                </span>
              </div>
              <h1
                style={retraso(120)}
                className="mt-5 text-balance font-display text-[32px] font-bold leading-[1.08] tracking-[-0.035em] text-white min-[400px]:text-[34px] sm:mt-7 sm:text-6xl motion-safe:animate-aparecer"
              >
                {partes.join(" ")}{" "}
                <span className="bg-gradient-to-br from-primary-light from-30% to-primary bg-clip-text text-transparent">
                  {final}
                </span>
              </h1>
              <p style={retraso(200)} className="mt-3 text-pretty text-base font-medium text-white/85 sm:mt-4 sm:text-xl motion-safe:animate-aparecer">
                {p.subtitulo}
              </p>
            </div>

            <p style={retraso(260)} className="text-pretty text-[15px] leading-relaxed text-white/65 motion-safe:animate-aparecer sm:text-base lg:pb-1">
              {p.resumen}
            </p>
          </div>

          <div style={retraso(320)} className="relative mt-8 motion-safe:animate-aparecer sm:mt-12">
            <div className="absolute -inset-10 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
            <GaleriaAcordeon
              elementos={p.galeria}
              proporcion={0.6}
              alturas="h-[280px] sm:h-[440px] lg:h-[560px]"
              className="relative"
            />
          </div>

          {/* gap-px sobre fondo translúcido = divisores finos entre celdas */}
          <dl className="mt-4 grid gap-px sm:mt-6 overflow-hidden rounded-2xl border border-line-dark bg-line-dark sm:grid-cols-3">
            {meta.map((f) => (
              <div key={f.etiqueta} className="flex items-center justify-between gap-4 bg-bg-deep px-4 py-3 sm:block sm:px-5 sm:py-4">
                <dt className="text-xs font-medium uppercase tracking-wider text-white/55">{f.etiqueta}</dt>
                <dd className="text-right text-sm font-semibold text-white sm:mt-1 sm:text-left">{f.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Antes → Después */}
      <section className="relative bg-bg-section py-12 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <Encabezado etiqueta="La transformación" titulo="Lo que cambió en la operación" texto={p.reto.texto} />

          <div className="mt-8 grid gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-surface p-5 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Antes</p>
              <ul className="mt-6 space-y-4">
                {p.reto.puntos.map((x) => (
                  <li key={x} className="flex gap-3 text-base leading-relaxed text-text-secondary">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-text-muted/10">
                      <X className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative isolate overflow-hidden rounded-3xl border border-line-dark bg-bg-deep p-6 shadow-[0_40px_80px_-40px_rgba(71,31,163,0.55)] sm:p-8">
              <div
                aria-hidden="true"
                className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(120,54,226,0.4),transparent_65%)] blur-2xl"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">Después</p>
              <ul className="mt-6 space-y-4">
                {p.puntos.map((x) => (
                  <li key={x} className="flex gap-3 text-base leading-relaxed text-white">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20">
                      <Check className="h-3.5 w-3.5 text-success" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* La solución: módulos */}
      {p.modulos.length > 0 && (
        <section className="relative bg-bg-section py-12 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <Encabezado etiqueta="La solución" titulo="Un sistema para toda la operación" />

            <ul className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-card sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-y-0 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none lg:grid-cols-3">
              {p.modulos.map((m) => {
                const Icono = iconoModulo(m.titulo)
                return (
                  <li
                    key={m.titulo}
                    className="flex items-start gap-3.5 p-4 sm:block sm:rounded-2xl sm:border sm:border-border sm:bg-surface sm:p-7 sm:shadow-card sm:transition-shadow sm:hover:shadow-hover"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light sm:h-11 sm:w-11">
                      <Icono className="h-5 w-5 text-primary" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-semibold tracking-tight text-text-primary sm:mt-5 sm:text-lg">{m.titulo}</h3>
                      <p className="mt-1 text-pretty text-sm leading-relaxed text-text-secondary sm:mt-2">{m.descripcion}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Cómo lo construimos: línea de tiempo (horizontal en escritorio) */}
      {p.fases.length > 0 && (
        <section className="relative bg-bg-section py-12 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <Encabezado
              etiqueta="Cómo lo construimos"
              titulo="Por etapas, validando cada paso"
              texto="Cada etapa se entregó funcionando y se validó con el equipo antes de pasar a la siguiente."
            />

            <ol className="relative mt-10 grid gap-6 sm:mt-16 sm:gap-8 lg:grid-cols-6 lg:gap-6">
              <span
                aria-hidden="true"
                className="absolute bottom-5 left-5 top-5 w-px bg-gradient-to-b from-primary via-primary/40 to-primary/10 lg:bottom-auto lg:left-5 lg:right-5 lg:top-5 lg:h-px lg:w-auto lg:bg-gradient-to-r"
              />
              {p.fases.map((f, i) => (
                <li key={f.titulo} className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 lg:block">
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-surface font-mono text-xs tabular-nums text-primary">
                    {numero(i)}
                  </span>
                  <div className="pt-1.5 lg:pt-5">
                    <h3 className="font-display text-base font-semibold tracking-tight text-text-primary">{f.titulo}</h3>
                    <p className="mt-1.5 text-pretty text-sm leading-relaxed text-text-secondary">{f.descripcion}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <CTAFinal
        etiqueta="Tu negocio es el siguiente"
        titulo="¿Tu negocio necesita su propio sistema?"
        texto={`Lo diseñamos alrededor de cómo operas tú, igual que con ${p.titulo}.`}
      />
    </>
  )
}
