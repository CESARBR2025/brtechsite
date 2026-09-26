import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  ChefHat,
  Check,
  ClipboardList,
  LayoutGrid,
  Layers,
  Receipt,
  Smartphone,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { GaleriaAcordeon } from "@/src/ui/primitivos/galeria-acordeon"
import { proyectos } from "@/src/ui/marketing/proyectos/datos"

/*
 * Caso destacado del home: la historia de transformación del proyecto (antes →
 * después) sobre la única banda oscura entre secciones claras. Todo sale de
 * `proyectos/datos.ts`; nada inventado. Con más proyectos, cada uno repite el
 * mismo formato.
 */

/** Ícono de un módulo según su nombre. */
function iconoModulo(titulo: string): LucideIcon {
  if (/mesa/i.test(titulo)) return LayoutGrid
  if (/orden|pedido/i.test(titulo)) return ClipboardList
  if (/cocina|barra/i.test(titulo)) return ChefHat
  if (/caja|ticket|cobro/i.test(titulo)) return Receipt
  if (/tablero|reporte/i.test(titulo)) return BarChart3
  if (/app|móvil/i.test(titulo)) return Smartphone
  return Layers
}

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"

export function ProyectosRecientesSection() {
  return (
    <section
      id="proyectos"
      className="relative isolate scroll-mt-24 overflow-hidden bg-bg-dark py-24 sm:py-32"
    >
      {/*
        Banda protagonista del home (única sección oscura entre las claras):
        degradado del negro violáceo de marca a violeta profundo, resplandores
        y filete de luz arriba. Solo CSS, sin WebGL.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,#120D24_0%,#1A0F3A_45%,#2A1170_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-40 top-1/4 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(120,54,226,0.45),transparent_65%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 right-0 -z-10 h-[28rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(157,77,255,0.35),transparent_65%)] blur-2xl"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-light/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">
            <span className="h-px w-8 bg-primary-light" />
            Proyecto destacado
            <span className="h-px w-8 bg-primary-light" />
          </p>
          <h2 className="mt-5 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
            Lo último que hemos construido
          </h2>
        </div>

        <div className="mt-14 space-y-24">
          {proyectos.map((p) => {
            const plataformas = p.ficha.find((f) => /plataforma/i.test(f.etiqueta))?.valor
            const giro = p.ficha.find((f) => /giro/i.test(f.etiqueta))?.valor
            const alcance = p.ficha.find((f) => /alcance/i.test(f.etiqueta))?.valor
            const ficha = [
              giro && { etiqueta: "Giro", valor: giro },
              alcance && { etiqueta: "Alcance", valor: alcance },
              plataformas && { etiqueta: "Plataformas", valor: plataformas },
              { etiqueta: "Estado", valor: p.estado },
            ].filter(Boolean) as { etiqueta: string; valor: string }[]

            return (
              <article key={p.slug}>
                {/* Identidad del proyecto */}
                <div className="flex flex-col items-center gap-5 text-center">
                  {p.logo && (
                    <span className="flex h-16 items-center rounded-2xl bg-white px-5 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]">
                      <Image src={p.logo} alt={p.cliente} width={659} height={379} className="h-11 w-auto object-contain" />
                    </span>
                  )}
                  <div>
                    <h3 className="text-balance font-hero text-3xl font-semibold tracking-[-0.02em] text-white sm:text-5xl">
                      {p.titulo}
                    </h3>
                    <p className="mt-3 text-pretty text-base text-white/70 sm:text-lg">{p.subtitulo}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                    </span>
                    {p.estado}
                  </span>
                </div>

                {/* Galería panorámica: el sistema en operación */}
                <div className="relative mt-10">
                  <div className="absolute -inset-10 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
                  <GaleriaAcordeon
                    elementos={p.galeria}
                    proporcion={0.62}
                    alturas="h-[560px] sm:h-[420px] lg:h-[520px]"
                    className="relative"
                  />
                </div>

                {/* Ficha técnica */}
                {/* gap-px sobre fondo translúcido = divisores finos entre celdas */}
                <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
                  {ficha.map((f) => (
                    <div key={f.etiqueta} className="bg-[#170E33] p-4 sm:p-5">
                      <dt className="text-[11px] font-medium uppercase tracking-wider text-white/50">{f.etiqueta}</dt>
                      <dd className="mt-1 text-sm font-semibold text-white">{f.valor}</dd>
                    </div>
                  ))}
                </dl>

                {/* Antes → Después */}
                <div className="mt-16 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Antes</p>
                    <p className="mt-3 text-pretty text-sm leading-relaxed text-white/60 sm:text-base">{p.reto.texto}</p>
                    <ul className="mt-6 space-y-3">
                      {p.reto.puntos.map((x) => (
                        <li key={x} className="flex gap-3 text-sm leading-relaxed text-white/55 sm:text-base">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                            <X className="h-3 w-3 text-white/45" aria-hidden="true" />
                          </span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent p-6 shadow-[0_30px_60px_-30px_rgba(120,54,226,0.7)] sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light">Después</p>
                    <p className="mt-3 text-pretty text-sm leading-relaxed text-white/80 sm:text-base">{p.resumen}</p>
                    <ul className="mt-6 space-y-3">
                      {p.puntos.map((x) => (
                        <li key={x} className="flex gap-3 text-sm leading-relaxed text-white sm:text-base">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20">
                            <Check className="h-3 w-3 text-success" strokeWidth={3} aria-hidden="true" />
                          </span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Lo que incluye */}
                {p.modulos.length > 0 && (
                  <div className="mt-12 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Lo que incluye</p>
                    <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
                      {p.modulos.map((m) => {
                        const Icono = iconoModulo(m.titulo)
                        return (
                          <li
                            key={m.titulo}
                            title={m.descripcion}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-sm"
                          >
                            <Icono className="h-4 w-4 text-primary-light" aria-hidden="true" />
                            {m.titulo}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}

                <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href={`/proyectos/${p.slug}`}
                    className={`group/caso inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] sm:w-auto ${focusRing}`}
                  >
                    Ver caso completo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/caso:translate-x-1" />
                  </Link>
                  <Link
                    href="/contacto"
                    className={`group/enlace inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-primary/60 hover:bg-primary/20 sm:w-auto ${focusRing}`}
                  >
                    Quiero un sistema así
                    <ArrowRight className="h-4 w-4 text-primary-light transition-transform group-hover/enlace:translate-x-1" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
