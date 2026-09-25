import Image from "next/image"
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Lock,
  Bell,
  CheckCircle2,
  FileText,
  ImageIcon,
  Paperclip,
  Send,
  Sparkles,
  User,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { DiagnosticoPublicoDTO } from "@/src/modules/levantamientos/application/dtos"
import {
  NIVELES_PRIORIDAD,
  type ManejoDigital,
  type TipoResultado,
} from "@/src/modules/levantamientos/domain/contenido"
import { formatearFecha, nombreDePila } from "@/src/ui/formato"
import { CTAFinal } from "@/src/ui/marketing/cta-final"
import { EMPRESA, WHATSAPP } from "@/src/ui/marketing/datos-contacto"
import {
  ETIQUETA_DISPOSITIVO,
  ETIQUETA_FORMATO,
  ETIQUETA_MANEJO_DIGITAL,
  ETIQUETA_PRIORIDAD,
  ETIQUETA_RANGO_EDAD,
  ETIQUETA_TIPO_RESULTADO,
} from "./etiquetas"
import { formatearFechaHora } from "./fechas"
import { VeloOscuro } from "@/src/ui/primitivos/velo-oscuro"
import { BarraLectura, Contador, IndiceSecciones, Revelar } from "./efectos-diagnostico"
import { PreguntasCliente } from "./preguntas-cliente"

/*
 * Mismo lenguaje que el ticket público: hero oscuro de marca, cuerpo claro con
 * tarjetas blancas y acentos oscuros puntuales en las piezas protagonistas
 * (encabezado de cada flujo, lo que el sistema entregará, lo imprescindible)
 * y en el cierre.
 */

const retraso = (ms: number) => ({ animationDelay: `${ms}ms` })
const numero = (i: number) => String(i + 1).padStart(2, "0")

const ICONO_RESULTADO: Record<TipoResultado, LucideIcon> = {
  documento: FileText,
  imagen: ImageIcon,
  solicitud: Send,
  notificacion: Bell,
  reporte: BarChart3,
  otro: Sparkles,
}

const NIVEL_MANEJO: Record<ManejoDigital, number> = { bajo: 1, medio: 2, alto: 3 }

const TARJETA = "rounded-2xl border border-border bg-surface shadow-card"
const TARJETA_INTERACTIVA = `${TARJETA} transition-all hover:border-primary/30 hover:shadow-hover`
const REJILLA =
  "absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.07)_1px,transparent_1px)] bg-[size:48px_48px]"

function Seccion({
  id,
  indice,
  etiqueta,
  titulo,
  texto,
  children,
}: {
  id: string
  indice: number
  etiqueta: string
  titulo: string
  texto?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-10 py-12 sm:py-20">
      <Revelar>
        <div className="relative pr-20 sm:pr-40">
          {/* Número editorial gigante en contorno, al lado del título */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-3 right-0 select-none font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(120,54,226,0.22)] text-[72px] sm:-top-6 sm:text-[140px]"
          >
            {numero(indice)}
          </span>
          <p className="relative flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            {etiqueta}
          </p>
          <h2 className="relative mt-4 max-w-2xl text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-[44px]">
            {titulo}
          </h2>
          {texto && (
            <p className="relative mt-4 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
              {texto}
            </p>
          )}
        </div>
      </Revelar>
      <Revelar retrasoMs={120} className="mt-10 sm:mt-12">
        {children}
      </Revelar>
    </section>
  )
}

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`

/** Resumen ejecutivo armado solo con lo capturado (nada inventado). */
function resumenEjecutivo(c: DiagnosticoPublicoDTO["contenido"]): string[] {
  const flujos = c.flujos.length
  const dolores = c.flujos.reduce((n, f) => n + f.pasos.filter((p) => p.dolor).length, 0)
  const roles = c.actores.length
  const entregables = c.resultados.length
  const imprescindibles = c.prioridades.filter((p) => p.nivel === "imprescindible").length
  const frases: string[] = []

  if (flujos > 0) {
    frases.push(
      `Mapeamos ${plural(flujos, "flujo de trabajo", "flujos de trabajo")} de tu operación` +
        (dolores > 0 ? ` y detectamos ${plural(dolores, "punto de dolor", "puntos de dolor")}.` : "."),
    )
  }
  if (roles > 0) {
    frases.push(
      `El sistema se diseñará para ${plural(roles, "rol", "roles")} de tu equipo` +
        (entregables > 0
          ? ` y entregará ${plural(entregables, "resultado concreto", "resultados concretos")}.`
          : "."),
    )
  } else if (entregables > 0) {
    frases.push(`El sistema entregará ${plural(entregables, "resultado concreto", "resultados concretos")}.`)
  }
  if (imprescindibles > 0) {
    frases.push(
      `La primera versión se enfoca en ${plural(imprescindibles, "prioridad imprescindible", "prioridades imprescindibles")}.`,
    )
  }
  return frases
}

/** Dato con etiqueta sobre claro; no pinta nada si viene vacío. */
function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  if (!valor) return null
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">{etiqueta}</dt>
      <dd className="mt-1 whitespace-pre-line text-pretty text-sm leading-relaxed text-text-primary sm:text-base">
        {valor}
      </dd>
    </div>
  )
}

function Panel({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className={`${TARJETA} overflow-hidden`}>
      <h3 className="border-b border-border px-6 py-4 text-sm font-bold text-text-primary">{titulo}</h3>
      <div className="p-6">{children}</div>
    </div>
  )
}

function PildoraActor({ nombre, oscura }: { nombre: string; oscura?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        oscura
          ? "border border-line-dark bg-surface-dark text-white/80"
          : "bg-primary-light text-primary"
      }`}
    >
      <User className="h-3 w-3" aria-hidden="true" />
      {nombre}
    </span>
  )
}

function Nodo({ i }: { i: number }) {
  return (
    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface font-mono text-xs font-semibold tabular-nums text-primary shadow-sm transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
      {numero(i)}
    </span>
  )
}

function LineaTiempo() {
  return (
    <span
      aria-hidden="true"
      className="absolute bottom-6 left-5 top-6 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent"
    />
  )
}

/** Página completa del "Diagnóstico de tu proyecto". */
export function Diagnostico({ d }: { d: DiagnosticoPublicoDTO }) {
  const c = d.contenido
  const actor = new Map(c.actores.map((a) => [a.id, a.nombre]))
  const nombreActor = (id: string | null) => (id ? actor.get(id) ?? null : null)

  const titulo = d.proyectoNombre ?? "Tu proyecto"
  const promesa = c.contexto.promesa

  const ficha = [
    ["Negocio", d.cliente.nombre],
    ["Contacto", c.contexto.contactoNombre],
    ["Giro", c.contexto.giro],
    ["Tamaño", c.contexto.tamano],
    ["Ubicación", c.contexto.ubicacion],
    ["Reunión", formatearFecha(d.fechaReunion)],
  ].filter(([, v]) => v)

  const hayProblema = Boolean(
    c.problema.situacionActual || c.problema.solucionActual || c.problema.impacto,
  )
  const r = c.restricciones
  const hayRestricciones = Boolean(
    r.plazo || r.normativa || r.otras || r.fechasCriticas.length,
  )
  // Con fecha primero y en orden; las que no tienen día asignado al final
  const fechasCriticas = [...r.fechasCriticas].sort(
    (a, b) => (a.fecha || "9999").localeCompare(b.fecha || "9999"),
  )
  const hayVolumen = Object.values(c.volumen).some(Boolean)
  const hayRecursos = Boolean(
    c.recursos.hardware.length || c.recursos.softwareActual || c.recursos.conectividad,
  )
  const hayTerreno =
    hayRecursos || c.integraciones.length > 0 || hayVolumen || hayRestricciones
  const haySiguiente = c.proximosPasos.length > 0

  const dolores = c.flujos.reduce((k, f) => k + f.pasos.filter((p) => p.dolor).length, 0)
  const cifras = [
    { valor: c.actores.length, etiqueta: c.actores.length === 1 ? "Rol analizado" : "Roles analizados" },
    { valor: c.flujos.length, etiqueta: c.flujos.length === 1 ? "Flujo mapeado" : "Flujos mapeados" },
    { valor: dolores, etiqueta: dolores === 1 ? "Punto de dolor" : "Puntos de dolor" },
    { valor: c.resultados.length, etiqueta: c.resultados.length === 1 ? "Entregable" : "Entregables" },
  ].filter((x) => x.valor > 0)
  const resumen = resumenEjecutivo(c)
  const saludo = c.contexto.contactoNombre
    ? nombreDePila(c.contexto.contactoNombre)
    : d.cliente.nombre

  // Solo las secciones con información; su orden da la numeración 01, 02…
  const indice = [
    { id: "problema", titulo: "Punto de partida", mostrar: hayProblema },
    { id: "objetivos", titulo: "Objetivos", mostrar: c.objetivos.length > 0 },
    { id: "personas", titulo: "Personas", mostrar: c.actores.length > 0 },
    { id: "operacion", titulo: "Operación", mostrar: c.flujos.length > 0 },
    { id: "entradas-salidas", titulo: "Entradas y salidas", mostrar: c.documentos.length > 0 || c.resultados.length > 0 },
    { id: "terreno", titulo: "El terreno", mostrar: hayTerreno },
    { id: "prioridades", titulo: "Prioridades", mostrar: c.prioridades.length > 0 },
    { id: "material", titulo: "Material de apoyo", mostrar: c.adjuntos.length > 0 },
    { id: "siguiente", titulo: "Lo que sigue", mostrar: haySiguiente },
    { id: "preguntas", titulo: "Preguntas al cliente", mostrar: c.preguntasAbiertas.length > 0 },
  ].filter((x) => x.mostrar)
  const num = (id: string) => indice.findIndex((x) => x.id === id)

  const mensajeWhatsApp = `Hola, revisé el diagnóstico ${d.folio} de ${titulo}. `
  const enlaceWhatsApp = `https://wa.me/${WHATSAPP.telefono.replace("+", "")}?text=${encodeURIComponent(mensajeWhatsApp)}`

  return (
    <main className="min-h-screen bg-bg-section">
      <BarraLectura />
      <IndiceSecciones secciones={indice.map(({ id, titulo }) => ({ id, titulo }))} />

      {/* Hero: solo saludar e impactar. Pensado primero para celular (100svh). */}
      <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-bg-deep">
        <div className="absolute inset-0 -z-10">
          <VeloOscuro hueShift={0} poster="/fondos/velo-poster.webp" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg-deep/30 via-transparent to-bg-dark" />
        <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-8 lg:px-8">
          <Image
            src="/logo.png"
            alt="BR TECH"
            width={566}
            height={191}
            className="h-8 w-auto sm:h-10"
            priority
          />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/75 backdrop-blur-md">
            <Lock className="h-3 w-3 text-primary-light" aria-hidden="true" />
            <span className="font-mono tabular-nums">{d.folio}</span>
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-10 text-center sm:px-6 sm:pb-20">
          <span
            style={retraso(0)}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm motion-safe:animate-aparecer"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(120,54,226,0.7)]" />
            <span className="truncate">Tu diagnóstico especial está listo</span>
          </span>

          <p
            style={retraso(120)}
            className="mt-8 text-balance text-2xl font-medium tracking-tight text-white/85 sm:text-3xl motion-safe:animate-aparecer"
          >
            Hola, <span className="font-semibold text-white">{saludo}</span>
          </p>

          {!promesa && (
            <p
              style={retraso(200)}
              className="mt-3 text-base text-white/65 sm:text-lg motion-safe:animate-aparecer"
            >
              Este será tu próximo sistema
            </p>
          )}

          <h1
            style={retraso(280)}
            className={`${promesa ? "mt-3" : "mt-2"} text-balance bg-gradient-to-br from-white from-25% via-primary-light to-primary bg-clip-text pb-2 text-[46px] font-bold leading-[1.02] tracking-[-0.04em] text-transparent sm:text-7xl lg:text-8xl motion-safe:animate-aparecer`}
          >
            {titulo}
          </h1>

          {promesa && (
            <p
              style={retraso(340)}
              className="mt-4 max-w-2xl text-balance text-lg font-medium leading-snug text-white/80 sm:text-2xl motion-safe:animate-aparecer"
            >
              {promesa}
            </p>
          )}

          {c.contexto.cifras.length > 0 && (
            <dl
              style={retraso(400)}
              className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 motion-safe:animate-aparecer sm:gap-x-7"
            >
              {c.contexto.cifras.map((x, i) => (
                <div key={x.id} className="flex items-center gap-5 sm:gap-7">
                  {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-primary-light/50" />}
                  <div className="flex items-baseline gap-1.5">
                    <dd className="text-2xl font-bold tabular-nums tracking-tight text-white sm:text-3xl">{x.valor}</dd>
                    <dt className="text-sm text-white/60 sm:text-base">{x.etiqueta}</dt>
                  </div>
                </div>
              ))}
            </dl>
          )}

          <a
            href="#resumen"
            style={retraso(460)}
            className="group mt-9 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_24px_-4px_rgba(120,54,226,0.6)] backdrop-blur-md transition-all hover:border-primary/60 hover:bg-primary/25 active:scale-[0.98] motion-safe:animate-aparecer"
          >
            Ver cómo lo vamos a lograr
            <ArrowDown className="h-4 w-4 text-primary-light motion-safe:animate-bounce" aria-hidden="true" />
          </a>

          {d.confirmado && (
            <span
              style={retraso(420)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success motion-safe:animate-aparecer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Confirmado
            </span>
          )}
        </div>

      </section>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Resumen ejecutivo: primera tarjeta después del hero (el hero ocupa toda la pantalla) */}
        <div
          id="resumen"
          style={retraso(480)}
          className="relative mt-12 scroll-mt-10 overflow-hidden rounded-3xl sm:mt-16 border border-border bg-surface shadow-modal motion-safe:animate-aparecer"
        >
          <div className="h-1 bg-gradient-to-r from-primary-hover via-primary to-primary-light" />
          <div className="grid lg:grid-cols-[1.35fr_1fr]">
            <div className="relative overflow-hidden p-6 sm:p-10">
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary-light blur-3xl" aria-hidden="true" />
              <p className="relative flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="h-px w-8 bg-primary" />
                Resumen ejecutivo
              </p>
              <p className="relative mt-5 text-pretty text-xl font-semibold leading-snug tracking-tight text-text-primary sm:text-2xl">
                Esto es lo que entendimos de tu operación en nuestra reunión.
              </p>
              {resumen.length > 0 && (
                <ul className="relative mt-6 space-y-3">
                  {resumen.map((frase) => (
                    <li key={frase} className="flex gap-3 text-pretty text-sm leading-relaxed text-text-secondary sm:text-base">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      </span>
                      {frase}
                    </li>
                  ))}
                </ul>
              )}
              <p className="relative mt-6 text-sm text-text-muted">
                Revísalo con calma: es la base sobre la que vamos a diseñar tu sistema.
              </p>
            </div>

            <dl className="grid grid-cols-2 content-start border-t border-border bg-bg-section/70 lg:border-l lg:border-t-0">
              {ficha.map(([etiqueta, valor]) => (
                <div key={etiqueta} className="border-b border-border p-5 odd:border-r">
                  <dt className="text-[11px] font-medium uppercase tracking-wider text-text-muted">{etiqueta}</dt>
                  <dd className="mt-1 text-pretty text-sm font-semibold text-text-primary">{valor}</dd>
                </div>
              ))}
              {c.contexto.participantes && (
                <div className="col-span-2 p-5">
                  <dt className="text-[11px] font-medium uppercase tracking-wider text-text-muted">Participaron</dt>
                  <dd className="mt-1 whitespace-pre-line text-sm text-text-secondary">{c.contexto.participantes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Cifras del análisis (solo datos capturados) */}
        {cifras.length > 0 && (
          <Revelar className="mt-6">
            <dl
              className={`grid gap-3 ${
                cifras.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : cifras.length === 3 ? "grid-cols-3" : "grid-cols-2"
              }`}
            >
              {cifras.map((x) => (
                <div
                  key={x.etiqueta}
                  className="relative flex flex-col-reverse overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5"
                >
                  <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary-light/70" aria-hidden="true" />
                  <dt className="relative mt-1 text-xs leading-snug text-text-secondary sm:text-sm">{x.etiqueta}</dt>
                  <dd className="relative bg-gradient-to-br from-primary to-primary-hover bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
                    <Contador valor={x.valor} />
                  </dd>
                </div>
              ))}
            </dl>
          </Revelar>
        )}

        {/* Problema */}
        {hayProblema && (
          <Seccion id="problema" indice={num("problema")} etiqueta="El punto de partida" titulo="Lo que hoy te quita tiempo">
            <div className={`${TARJETA} grid overflow-hidden lg:grid-cols-[1.15fr_0.85fr]`}>
              {c.problema.situacionActual && (
                <div className="relative p-6 sm:p-8">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-8 h-12 w-1 rounded-r-full bg-gradient-to-b from-primary to-primary-hover"
                  />
                  <p className="whitespace-pre-line text-pretty text-lg font-medium leading-relaxed text-text-primary sm:text-xl">
                    {c.problema.situacionActual}
                  </p>
                </div>
              )}
              <dl className="divide-y divide-border border-t border-border bg-bg-section/60 lg:border-l lg:border-t-0">
                {(
                  [
                    ["Cómo se resuelve hoy", c.problema.solucionActual],
                    ["Lo que está costando", c.problema.impacto],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([etiqueta, valor]) => (
                    <div key={etiqueta} className="p-6 sm:px-8">
                      <Dato etiqueta={etiqueta} valor={valor} />
                    </div>
                  ))}
              </dl>
            </div>
          </Seccion>
        )}

        {/* Objetivos */}
        {c.objetivos.length > 0 && (
          <Seccion id="objetivos" indice={num("objetivos")} etiqueta="Objetivos" titulo="A dónde queremos llegar">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.objetivos.map((o, i) => (
                <div key={o.id} className={`${TARJETA_INTERACTIVA} group relative flex flex-col overflow-hidden p-6`}>
                  <div className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 rounded-full bg-primary-light/60 transition-transform group-hover:scale-150" />
                  <span className="relative font-mono text-xs font-semibold tabular-nums text-primary">{numero(i)}</span>
                  <p className="relative mt-3 whitespace-pre-line text-pretty text-base font-semibold leading-snug text-text-primary sm:text-lg">
                    {o.descripcion}
                  </p>
                  {o.metrica && (
                    <p className="relative mt-auto flex items-start gap-2 pt-5 text-sm text-text-secondary">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
                        <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="pt-0.5">{o.metrica}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Seccion>
        )}

        {/* Actores */}
        {c.actores.length > 0 && (
          <Seccion
            id="personas"
            indice={num("personas")}
            etiqueta="Las personas"
            titulo="Quiénes usarán el sistema"
            texto="Cada rol tiene su propia forma de trabajar. El sistema se diseña alrededor de ellos, no al revés."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.actores.map((a) => (
                <div key={a.id} className={`${TARJETA_INTERACTIVA} flex flex-col p-6`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-lg shadow-primary/20">
                      <User className="h-5 w-5" aria-hidden="true" />
                    </div>
                    {a.cantidad && (
                      <span className="rounded-full bg-bg-section px-2.5 py-0.5 text-xs font-medium text-text-secondary ring-1 ring-inset ring-border">
                        {a.cantidad} {/^\d+$/.test(a.cantidad) ? (a.cantidad === "1" ? "persona" : "personas") : ""}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">{a.nombre || "Rol sin nombre"}</h3>
                  {a.descripcion && (
                    <p className="mt-1.5 whitespace-pre-line text-pretty text-sm leading-relaxed text-text-secondary">
                      {a.descripcion}
                    </p>
                  )}
                  <dl className="mt-auto space-y-3 pt-5 text-sm">
                    {a.rangosEdad.length > 0 && (
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                        <dt className="text-xs text-text-muted">Edad</dt>
                        <dd className="flex flex-wrap justify-end gap-1.5">
                          {a.rangosEdad.map((rango) => (
                            <span key={rango} className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                              {ETIQUETA_RANGO_EDAD[rango]}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}
                    {a.manejoDigital && (
                      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                        <dt className="text-xs text-text-muted">Manejo digital</dt>
                        <dd className="flex items-center gap-2 text-xs font-medium text-text-primary">
                          <span className="flex gap-1" aria-hidden="true">
                            {[1, 2, 3].map((k) => (
                              <span
                                key={k}
                                className={`h-1.5 w-5 rounded-full ${
                                  k <= NIVEL_MANEJO[a.manejoDigital!] ? "bg-primary" : "bg-border"
                                }`}
                              />
                            ))}
                          </span>
                          {ETIQUETA_MANEJO_DIGITAL[a.manejoDigital]}
                        </dd>
                      </div>
                    )}
                    {a.dispositivos.length > 0 && (
                      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                        <dt className="text-xs text-text-muted">
                          {a.dispositivos.length === 1 ? "Dispositivo" : "Dispositivos"}
                        </dt>
                        <dd className="text-right text-xs font-medium text-text-primary">
                          {a.dispositivos.map((x) => ETIQUETA_DISPOSITIVO[x]).join(" · ")}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              ))}
            </div>
          </Seccion>
        )}

        {/* Flujos */}
        {c.flujos.length > 0 && (
          <Seccion
            id="operacion"
            indice={num("operacion")}
            etiqueta="La operación"
            titulo="Cómo trabajan hoy"
            texto="Así nos contaste que fluye el trabajo, paso a paso. Donde algo se atora, lo marcamos."
          >
            <div className="space-y-5">
              {c.flujos.map((f, fi) => (
                <div key={f.id} className={`${TARJETA} grid overflow-hidden lg:grid-cols-[0.8fr_1.2fr]`}>
                  <div className="relative overflow-hidden bg-bg-dark p-6 sm:p-8">
                    <div className={REJILLA} />
                    <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
                    <div className="relative">
                      <span className="font-mono text-xs tabular-nums text-primary-light">Flujo {numero(fi)}</span>
                      <h3 className="mt-2 text-balance text-xl font-bold text-white sm:text-2xl">
                        {f.nombre || "Flujo sin nombre"}
                      </h3>
                      <dl className="mt-6 space-y-4">
                        {(
                          [
                            ["Empieza cuando", f.disparador],
                            ["Termina con", f.resultado],
                          ] as const
                        )
                          .filter(([, v]) => v)
                          .map(([etiqueta, valor]) => (
                            <div key={etiqueta}>
                              <dt className="text-xs uppercase tracking-wider text-white/55">{etiqueta}</dt>
                              <dd className="mt-1 whitespace-pre-line text-sm leading-relaxed text-white/85">{valor}</dd>
                            </div>
                          ))}
                      </dl>
                    </div>
                  </div>
                  {f.pasos.length > 0 && (
                    <div className="p-6 sm:p-8">
                      <ol className="relative">
                        <LineaTiempo />
                        {f.pasos.map((p, i) => {
                          const quien = nombreActor(p.actorId)
                          return (
                            <li key={p.id} className="group relative grid grid-cols-[2.5rem_1fr] gap-x-4 pb-6 last:pb-0">
                              <Nodo i={i} />
                              <div className="pt-2">
                                <p className="whitespace-pre-line text-pretty text-base font-medium text-text-primary">
                                  {p.descripcion}
                                </p>
                                {quien && (
                                  <div className="mt-2">
                                    <PildoraActor nombre={quien} />
                                  </div>
                                )}
                                {p.dolor && (
                                  <p className="mt-3 rounded-xl border border-warning/30 bg-warning/10 px-3.5 py-2.5 text-sm leading-relaxed text-text-secondary">
                                    <span className="mr-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-warning">
                                      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                                      Punto de dolor
                                    </span>
                                    <span className="whitespace-pre-line">{p.dolor}</span>
                                  </p>
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Seccion>
        )}

        {/* Documentos → Resultados */}
        {(c.documentos.length > 0 || c.resultados.length > 0) && (
          <Seccion
            id="entradas-salidas"
            indice={num("entradas-salidas")}
            etiqueta="Entradas y salidas"
            titulo="De lo que usan hoy a lo que el sistema entregará"
          >
            <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
              <div className={`${TARJETA} overflow-hidden`}>
                <p className="border-b border-border px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Lo que usan hoy
                </p>
                {c.documentos.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {c.documentos.map((doc) => {
                      const quien = nombreActor(doc.responsableId)
                      return (
                        <li key={doc.id} className="px-6 py-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <FileText className="h-4 w-4 text-text-muted" aria-hidden="true" />
                            <p className="font-semibold text-text-primary">{doc.nombre || "Documento"}</p>
                            {doc.formato && (
                              <span className="rounded-full bg-bg-section px-2 py-0.5 text-[11px] font-medium text-text-secondary ring-1 ring-inset ring-border">
                                {ETIQUETA_FORMATO[doc.formato]}
                              </span>
                            )}
                          </div>
                          {doc.descripcion && (
                            <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                              {doc.descripcion}
                            </p>
                          )}
                          {(quien || doc.frecuencia) && (
                            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                              {quien && <PildoraActor nombre={quien} />}
                              {doc.frecuencia && <span>{doc.frecuencia}</span>}
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="px-6 py-5 text-sm text-text-muted">Sin documentos registrados.</p>
                )}
              </div>

              <div className="flex items-center justify-center" aria-hidden="true">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-white shadow-lg shadow-primary/30">
                  <ArrowDown className="h-5 w-5 lg:hidden" />
                  <ArrowRight className="hidden h-5 w-5 lg:block" />
                </span>
              </div>

              {/* Pieza protagonista: oscura, como el bloque de marca del ticket */}
              <div className="relative overflow-hidden rounded-2xl bg-bg-dark shadow-glow">
                <div className={REJILLA} />
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
                <p className="relative border-b border-line-dark px-6 py-4 text-xs font-semibold uppercase tracking-wider text-primary-light">
                  Lo que el sistema entregará
                </p>
                {c.resultados.length > 0 ? (
                  <ul className="relative divide-y divide-line-dark">
                    {c.resultados.map((res) => {
                      const Icono = ICONO_RESULTADO[res.tipo ?? "otro"]
                      const quien = nombreActor(res.destinatarioId)
                      return (
                        <li key={res.id} className="flex gap-4 px-6 py-5">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-lg shadow-primary/30">
                            <Icono className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-white">
                              {res.nombre || (res.tipo ? ETIQUETA_TIPO_RESULTADO[res.tipo] : "Resultado")}
                            </p>
                            {res.tipo && res.nombre && (
                              <p className="text-xs text-white/55">{ETIQUETA_TIPO_RESULTADO[res.tipo]}</p>
                            )}
                            {res.descripcion && (
                              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-white/70">
                                {res.descripcion}
                              </p>
                            )}
                            {quien && (
                              <div className="mt-2.5 flex items-center gap-2 text-xs text-white/55">
                                Para <PildoraActor nombre={quien} oscura />
                              </div>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="relative px-6 py-5 text-sm text-white/55">Por definir juntos.</p>
                )}
              </div>
            </div>
          </Seccion>
        )}

        {/* Recursos, integraciones, volumen, restricciones */}
        {hayTerreno && (
          <Seccion id="terreno" indice={num("terreno")} etiqueta="El terreno" titulo="Con qué contamos y qué hay que cuidar">
            <div className="grid gap-4 md:grid-cols-2">
              {hayRecursos && (
                <Panel titulo="Recursos disponibles">
                  {c.recursos.hardware.length > 0 && (
                    <ul className="-mt-2 mb-5 divide-y divide-border">
                      {c.recursos.hardware.map((h) => (
                        <li key={h.id} className="flex items-center justify-between gap-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{h.nombre || "Equipo"}</p>
                            {h.detalle && <p className="mt-0.5 text-xs text-text-muted">{h.detalle}</p>}
                          </div>
                          {h.cantidad && (
                            <span className="rounded-full bg-primary-light px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-primary">
                              ×{h.cantidad}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  <dl className="space-y-4">
                    <Dato etiqueta="Programas que usan hoy" valor={c.recursos.softwareActual} />
                    <Dato etiqueta="Conectividad" valor={c.recursos.conectividad} />
                  </dl>
                </Panel>
              )}
              {c.integraciones.length > 0 && (
                <Panel titulo="Integraciones">
                  <ul className="space-y-4">
                    {c.integraciones.map((i) => (
                      <li key={i.id} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{i.nombre}</p>
                          {i.proposito && (
                            <p className="mt-0.5 whitespace-pre-line text-sm text-text-secondary">{i.proposito}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}
              {hayVolumen && (
                <Panel titulo="Volumen de operación">
                  <dl className="space-y-4">
                    <Dato etiqueta="Operaciones" valor={c.volumen.operaciones} />
                    <Dato etiqueta="Personas a la vez" valor={c.volumen.usuariosSimultaneos} />
                    <Dato etiqueta="Historial por migrar" valor={c.volumen.datosHistoricos} />
                  </dl>
                </Panel>
              )}
              {hayRestricciones && (
                <Panel titulo="Plazos y condiciones">
                  <dl className="space-y-4">
                    <Dato etiqueta="Plazo" valor={r.plazo} />
                    {fechasCriticas.length > 0 && (
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">Fechas críticas</dt>
                        <dd className="mt-2">
                          <ul className="space-y-2">
                            {fechasCriticas.map((f) => (
                              <li
                                key={f.id}
                                className="flex gap-3 rounded-xl border border-warning/30 bg-warning/10 px-3.5 py-2.5"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                                <div>
                                  {f.fecha && (
                                    <p className="text-sm font-semibold text-text-primary">
                                      {formatearFechaHora(f.fecha)}
                                    </p>
                                  )}
                                  {f.motivo && (
                                    <p className="mt-0.5 whitespace-pre-line text-sm text-text-secondary">{f.motivo}</p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    )}
                    <Dato etiqueta="Normas" valor={r.normativa} />
                    <Dato etiqueta="Otras" valor={r.otras} />
                  </dl>
                </Panel>
              )}
            </div>
          </Seccion>
        )}

        {/* Prioridades */}
        {c.prioridades.length > 0 && (
          <Seccion
            id="prioridades"
            indice={num("prioridades")}
            etiqueta="Prioridades"
            titulo="Qué construimos primero"
            texto="Lo imprescindible define la primera versión. Lo demás llega por etapas, cuando lo primero ya esté funcionando."
          >
            <div className="grid gap-4 md:grid-cols-3">
              {NIVELES_PRIORIDAD.map((nivel) => {
                const items = c.prioridades.filter((p) => p.nivel === nivel)
                const principal = nivel === "imprescindible"
                return (
                  <div
                    key={nivel}
                    className={`relative overflow-hidden p-6 ${
                      principal ? "rounded-2xl bg-bg-dark shadow-glow" : TARJETA
                    }`}
                  >
                    {principal && (
                      <>
                        <div className={REJILLA} />
                        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
                      </>
                    )}
                    <div className="relative flex items-center justify-between">
                      <h3
                        className={`text-xs font-bold uppercase tracking-wider ${
                          principal ? "text-primary-light" : "text-text-muted"
                        }`}
                      >
                        {ETIQUETA_PRIORIDAD[nivel]}
                      </h3>
                      <span
                        className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 font-mono text-xs font-semibold tabular-nums ${
                          principal ? "bg-primary text-white" : "bg-bg-section text-text-muted ring-1 ring-inset ring-border"
                        }`}
                      >
                        {items.length}
                      </span>
                    </div>
                    {items.length > 0 ? (
                      <ul className="relative mt-5 space-y-3">
                        {items.map((p) => (
                          <li
                            key={p.id}
                            className={`flex items-start gap-3 text-sm leading-relaxed ${
                              principal ? "text-white/90" : "text-text-secondary"
                            }`}
                          >
                            <CheckCircle2
                              className={`mt-0.5 h-4 w-4 shrink-0 ${principal ? "text-primary-light" : "text-primary/50"}`}
                              aria-hidden="true"
                            />
                            <span className="whitespace-pre-line">{p.descripcion}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="relative mt-5 text-sm text-text-muted">—</p>
                    )}
                  </div>
                )
              })}
            </div>
          </Seccion>
        )}

        {/* Archivos */}
        {c.adjuntos.length > 0 && (
          <Seccion
            id="material"
            indice={num("material")}
            etiqueta="Material de apoyo"
            titulo="Archivos que nos compartiste"
            texto="Los tenemos a la mano para diseñar sobre tus formatos reales."
          >
            <ul className="grid gap-3 sm:grid-cols-2">
              {c.adjuntos.map((a) => (
                <li key={a.id} className={`${TARJETA_INTERACTIVA} flex gap-4 p-5`}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary/10 text-primary">
                    <Paperclip className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-text-primary">{a.nombre || "Archivo"}</p>
                    {a.descripcion && (
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-text-secondary">{a.descripcion}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Seccion>
        )}

        {/* Lo que sigue */}
        {haySiguiente && (
          <Seccion id="siguiente" indice={num("siguiente")} etiqueta="Lo que sigue" titulo="Próximos pasos">
            <div className="max-w-3xl">
              {c.proximosPasos.length > 0 && (
                <div className={`${TARJETA} p-6 sm:p-8`}>
                  <ol className="relative">
                    <LineaTiempo />
                    {c.proximosPasos.map((p, i) => (
                      <li key={p.id} className="group relative grid grid-cols-[2.5rem_1fr] gap-x-4 pb-6 last:pb-0">
                        <Nodo i={i} />
                        <p className="whitespace-pre-line pt-2 text-pretty text-base font-medium text-text-primary">
                          {p.texto}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </Seccion>
        )}

        {/* Preguntas al cliente: siempre al final, las responde el cliente aquí mismo */}
        {c.preguntasAbiertas.length > 0 && (
          <Seccion
            id="preguntas"
            indice={num("preguntas")}
            etiqueta="Tu turno"
            titulo="Preguntas al cliente:"
            texto="Para cerrar el diseño necesitamos estos datos de tu operación. Escribe tus respuestas aquí mismo; si alguna no la sabes todavía, déjala en blanco y la vemos juntos."
          >
            <PreguntasCliente slug={d.slug} preguntas={c.preguntasAbiertas} />
          </Seccion>
        )}
      </div>

      <div className="mt-8">
        {d.preguntasPendientes > 0 ? (
          <CTAFinal
            etiqueta="Un paso más"
            titulo="Responde las preguntas para continuar"
            texto={`Te ${d.preguntasPendientes === 1 ? "falta 1 pregunta" : `faltan ${d.preguntasPendientes} preguntas`} por responder. En cuanto las completes, se activa el botón para escribirnos.`}
            boton="Escribir por WhatsApp"
            deshabilitado
            enlaceSecundario={{ texto: "Ir a las preguntas ↑", href: "#preguntas" }}
            nota={`Horario de atención: ${EMPRESA.horario}`}
          />
        ) : (
          <CTAFinal
            etiqueta={d.confirmado ? "Diagnóstico confirmado" : "Tu opinión cuenta"}
            titulo={d.confirmado ? "Gracias por confirmarlo" : "¿Lo entendimos bien?"}
            texto={
              d.confirmado
                ? "Con esto ya podemos diseñar tu sistema. Si surge algo nuevo, escríbenos y lo sumamos."
                : "Si algo no refleja cómo trabajas, dínoslo y lo ajustamos antes de diseñar tu sistema."
            }
            boton="Escribir por WhatsApp"
            href={enlaceWhatsApp}
            nota={`Horario de atención: ${EMPRESA.horario}`}
          />
        )}
      </div>

      <footer className="border-t border-line-dark bg-bg-dark px-4 py-8 text-center text-xs text-white/55">
        <p>
          Documento preparado exclusivamente para {d.cliente.nombre} · {d.folio}
        </p>
        <p className="mt-1 text-white/40">{EMPRESA.nombre} · brtechds.com</p>
      </footer>
    </main>
  )
}
