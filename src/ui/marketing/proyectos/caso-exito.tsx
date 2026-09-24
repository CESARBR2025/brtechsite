import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight } from "lucide-react"
import { GaleriaAcordeon } from "@/src/ui/primitivos/galeria-acordeon"
import { TarjetaFoco } from "@/src/ui/primitivos/tarjeta-foco"
import { CTAFinal } from "@/src/ui/marketing/cta-final"
import type { Proyecto } from "@/src/ui/marketing/proyectos/datos"

const retraso = (ms: number) => ({ animationDelay: `${ms}ms` })
const numero = (i: number) => String(i + 1).padStart(2, "0")

function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/55">
      <span className="h-px w-8 bg-primary" />
      {children}
    </p>
  )
}

function Rejilla({ foco }: { foco: string }) {
  return (
    <div
      style={{ maskImage: `radial-gradient(ellipse at ${foco}, black 5%, transparent 65%)` }}
      className="absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.06)_1px,transparent_1px)] bg-[size:64px_64px]"
    />
  )
}

/** Página completa de un caso de éxito, armada con los datos de `proyectos`. */
export function CasoExito({ proyecto: p }: { proyecto: Proyecto }) {
  // El último término del nombre lleva el degradado de marca, como en los demás H1
  const partes = p.titulo.split(" ")
  const final = partes.pop()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-dark">
        <Rejilla foco="30% 40%" />
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-36 sm:px-6 sm:pb-20 sm:pt-44 lg:px-8">
          <nav aria-label="Ruta" style={retraso(0)} className="motion-safe:animate-aparecer">
            <ol className="flex items-center gap-1.5 text-xs text-white/55">
              <li>
                <Link href="/#proyectos" className="rounded-sm outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary">
                  Proyectos
                </Link>
              </li>
              <li aria-current="page" className="flex items-center gap-1.5 text-white/80">
                <ChevronRight className="h-3.5 w-3.5 text-white/55" aria-hidden="true" />
                {p.cliente}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div style={retraso(60)} className="flex flex-wrap items-center gap-3 motion-safe:animate-aparecer">
                <Etiqueta>Caso de éxito</Etiqueta>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line-dark bg-surface-dark px-2.5 py-0.5 text-[11px] font-medium text-white/75">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                  </span>
                  {p.estado}
                </span>
              </div>
              <h1
                style={retraso(120)}
                className="mt-6 text-balance text-[38px] font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl motion-safe:animate-aparecer"
              >
                {partes.join(" ")}{" "}
                <span className="bg-gradient-to-br from-primary-light from-30% to-primary bg-clip-text text-transparent">
                  {final}
                </span>
              </h1>
              <p
                style={retraso(200)}
                className="mt-4 text-pretty text-lg font-medium text-white/85 sm:text-xl motion-safe:animate-aparecer"
              >
                {p.subtitulo}
              </p>
              <p
                style={retraso(260)}
                className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg motion-safe:animate-aparecer"
              >
                {p.resumen}
              </p>
            </div>

            {p.logo && (
              <div style={retraso(320)} className="relative motion-safe:animate-aparecer">
                <div className="absolute -inset-6 rounded-full bg-primary/15 blur-3xl" />
                {/* Los logos de clientes van sobre tarjeta blanca (DESIGNS.md) */}
                <div className="relative mx-auto flex max-w-sm items-center justify-center rounded-2xl bg-white p-10 shadow-glow">
                  <Image
                    src={p.logo}
                    alt={`Logotipo de ${p.cliente}`}
                    width={659}
                    height={379}
                    className="h-auto w-full max-w-[260px]"
                    priority
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ficha del proyecto */}
          <dl
            style={retraso(380)}
            className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line-dark bg-line-dark sm:grid-cols-2 lg:grid-cols-5 motion-safe:animate-aparecer"
          >
            {p.ficha.map((f) => (
              <div key={f.etiqueta} className="bg-bg-dark p-5">
                <dt className="text-xs uppercase tracking-wider text-white/55">{f.etiqueta}</dt>
                <dd className="mt-1.5 text-pretty text-sm font-medium text-white">{f.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Galería */}
      <section className="relative bg-bg-dark pb-24 sm:pb-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-x-8 -inset-y-8 rounded-full bg-primary/10 blur-3xl" />
          <GaleriaAcordeon
            elementos={p.galeria}
            proporcion={0.6}
            alturas="h-[560px] sm:h-[460px] lg:h-[560px]"
            className="relative"
          />
        </div>
      </section>

      {/* El reto */}
      <section className="relative overflow-hidden border-t border-line-dark bg-bg-dark py-24 sm:py-32">
        <Rejilla foco="75% 50%" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div>
            <Etiqueta>El reto</Etiqueta>
            <h2 className="mt-5 text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
              Lo que había que resolver
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
              {p.reto.texto}
            </p>
          </div>
          <ol className="divide-y divide-line-dark border-y border-line-dark lg:self-center">
            {p.reto.puntos.map((punto, i) => (
              <li key={punto} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-6">
                <span className="font-mono text-xs tabular-nums text-primary-light">{numero(i)}</span>
                <p className="text-pretty text-base font-medium text-white sm:text-lg">{punto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* La solución */}
      <section className="relative overflow-hidden border-t border-line-dark bg-bg-dark py-24 sm:py-32">
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Etiqueta>La solución</Etiqueta>
            <h2 className="mt-5 text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
              Un sistema para toda la operación
            </h2>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.modulos.map((m, i) => (
              <TarjetaFoco key={m.titulo} className="p-6 sm:p-7">
                <span className="font-mono text-xs tabular-nums text-primary-light">{numero(i)}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">{m.titulo}</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-white/65">{m.descripcion}</p>
              </TarjetaFoco>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo lo construimos */}
      <section className="relative overflow-clip border-t border-line-dark bg-bg-dark py-24 sm:py-32">
        <Rejilla foco="75% 50%" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Etiqueta>Cómo lo construimos</Etiqueta>
            <h2 className="mt-5 text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
              Por etapas, validando cada paso
            </h2>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
              Cada etapa se entregó funcionando y se validó con el equipo del
              restaurante antes de pasar a la siguiente.
            </p>
          </div>
          <ol className="relative">
            <span
              aria-hidden="true"
              className="absolute bottom-6 left-5 top-6 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent"
            />
            {p.fases.map((f, i) => (
              <li key={f.titulo} className="group relative grid grid-cols-[2.5rem_1fr] gap-x-5 pb-8 last:pb-0">
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line-dark-strong bg-bg-dark font-mono text-xs tabular-nums text-primary-light transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                  {numero(i)}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-lg font-semibold tracking-tight text-white">{f.titulo}</h3>
                  <p className="mt-1.5 text-pretty text-sm leading-relaxed text-white/65 sm:text-base">
                    {f.descripcion}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Resultados */}
      <section className="relative overflow-hidden border-t border-line-dark bg-bg-dark py-24 sm:py-32">
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div>
            <Etiqueta>Resultados</Etiqueta>
            <h2 className="mt-5 text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
              Un sistema que se opera a diario
            </h2>
            <dl className="mt-10 grid grid-cols-2 gap-4">
              {p.datos.map((d) => (
                <div
                  key={d.etiqueta}
                  className="flex flex-col-reverse rounded-2xl border border-line-dark bg-surface-dark p-5"
                >
                  <dt className="mt-1 text-xs text-white/55">{d.etiqueta}</dt>
                  <dd className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{d.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ul className="divide-y divide-line-dark border-y border-line-dark lg:self-end">
            {p.puntos.map((punto) => (
              <li key={punto} className="flex items-start gap-3 py-5 text-base text-white/80">
                <Check className="mt-1 h-4 w-4 flex-shrink-0 text-primary-light" />
                {punto}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTAFinal
        etiqueta="Tu negocio es el siguiente"
        titulo="¿Tu negocio necesita su propio sistema?"
        texto={`Lo diseñamos alrededor de cómo operas tú, igual que con ${p.titulo}.`}
      />
    </>
  )
}
