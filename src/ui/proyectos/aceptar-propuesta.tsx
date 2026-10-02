"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Allura } from "next/font/google"
import { AlertCircle, CheckCircle2, Eraser, Loader2, PenLine, Plus, X } from "lucide-react"
import type { AceptacionDTO } from "@/src/modules/proyectos/application/dtos"
import { LIENZO_FIRMA, MAX_FIRMANTES, trazoValido } from "@/src/modules/proyectos/domain/firma"
import { aceptarPropuesta } from "@/src/modules/proyectos/infrastructure/acciones-propuesta"
import { firmarComoDesarrollador } from "@/src/modules/proyectos/infrastructure/acciones-proyectos"
import { formatearFecha, formatearFechaHora } from "@/src/ui/formato"

// Letra manuscrita: solo para la firma del desarrollador
const manuscrita = Allura({ subsets: ["latin"], weight: "400", display: "swap" })

// text-base en móvil: con 14 px iOS hace zoom al enfocar el campo
const INPUT =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text-primary placeholder-text-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light sm:text-sm"
const ROTULO = "text-[11px] font-semibold uppercase tracking-[0.18em]"
const VISTA = `0 0 ${LIENZO_FIRMA.ancho} ${LIENZO_FIRMA.alto}`

/** Lo que el cliente confirma al firmar. */
const COMPROMISOS = [
  "Conoces lo que se te va a entregar: el alcance descrito en esta propuesta.",
  "Estás de acuerdo con el calendario y con las fechas de entrega.",
  "Aceptas la inversión y los pagos ligados a cada entrega.",
]

interface Firmante {
  id: number
  nombre: string
  trazo: string
}

interface Desarrollador {
  nombre: string
  empresa: string
  /** Fecha en que se emitió la propuesta (YYYY-MM-DD o ISO). */
  fecha: string
  /** Su firma dibujada, si ya firmó. */
  firma: { trazo: string; en: string } | null
  /** Quien ve la página tiene sesión del panel: puede firmar como desarrollador. */
  puedeFirmar: boolean
}

/** Trazo de una firma ya hecha. */
function TrazoFirma({ trazo, className = "" }: { trazo: string; className?: string }) {
  return (
    <svg viewBox={VISTA} className={`w-full ${className}`} role="img" aria-label="Firma">
      <path d={trazo} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Lienzo para dibujar la firma con el dedo, el lápiz o el mouse. */
function LienzoFirma({
  trazo,
  onChange,
}: {
  trazo: string
  onChange: (fn: (anterior: string) => string) => void
}) {
  const lienzo = useRef<SVGSVGElement>(null)
  const ultimo = useRef<[number, number] | null>(null)

  function punto(e: React.PointerEvent): [number, number] {
    const r = lienzo.current!.getBoundingClientRect()
    const limitar = (v: number, max: number) => Math.min(max, Math.max(0, Math.round(v)))
    return [
      limitar(((e.clientX - r.left) / r.width) * LIENZO_FIRMA.ancho, LIENZO_FIRMA.ancho),
      limitar(((e.clientY - r.top) / r.height) * LIENZO_FIRMA.alto, LIENZO_FIRMA.alto),
    ]
  }

  // El límite deja margen bajo el máximo que acepta el dominio
  const agregar = (segmento: string) => onChange((t) => (t.length > 11_800 ? t : t + segmento))

  return (
    <div className="relative">
      <svg
        ref={lienzo}
        viewBox={VISTA}
        role="img"
        aria-label="Lienzo para dibujar la firma"
        className="block w-full cursor-crosshair touch-none rounded-xl border border-dashed border-primary/35 bg-bg-section/60 text-text-primary"
        onPointerDown={(e) => {
          e.preventDefault()
          e.currentTarget.setPointerCapture(e.pointerId)
          const [x, y] = punto(e)
          ultimo.current = [x, y]
          agregar(`M${x} ${y}L${x} ${y}`)
        }}
        onPointerMove={(e) => {
          if (!ultimo.current) return
          const [x, y] = punto(e)
          const [ux, uy] = ultimo.current
          // Se saltan los puntos pegados al anterior: mismo trazo, menos datos
          if ((x - ux) ** 2 + (y - uy) ** 2 < 9) return
          ultimo.current = [x, y]
          agregar(`L${x} ${y}`)
        }}
        onPointerUp={() => (ultimo.current = null)}
        onPointerCancel={() => (ultimo.current = null)}
      >
        {/* Renglón de la firma */}
        <line
          x1={40}
          x2={LIENZO_FIRMA.ancho - 40}
          y1={LIENZO_FIRMA.alto - 45}
          y2={LIENZO_FIRMA.alto - 45}
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeWidth={1.5}
        />
        <path d={trazo} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!trazo && (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 pb-6 text-sm text-text-muted">
          <PenLine className="h-4 w-4" aria-hidden="true" /> Dibuja tu firma aquí
        </p>
      )}
      {trazo && (
        <button
          type="button"
          onClick={() => onChange(() => "")}
          className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Eraser className="h-3.5 w-3.5" aria-hidden="true" /> Borrar
        </button>
      )}
    </div>
  )
}

/**
 * Firma del desarrollador. Si ya firmó, se muestra su trazo; si no, su nombre
 * en manuscrita. Con sesión del panel puede dibujar (o rehacer) su firma aquí.
 */
function FirmaDesarrollador({ slug, d, oscuro = false }: { slug: string; d: Desarrollador; oscuro?: boolean }) {
  const router = useRouter()
  const [editando, setEditando] = useState(false)
  const [trazo, setTrazo] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [guardando, iniciar] = useTransition()
  // El lienzo es claro: mientras se firma, la tarjeta también
  const claro = !oscuro || editando

  function guardar() {
    setError(null)
    iniciar(async () => {
      const r = await firmarComoDesarrollador(slug, trazo)
      if (!r.ok) {
        setError(r.error ?? "No se pudo guardar la firma.")
        return
      }
      setEditando(false)
      setTrazo("")
      router.refresh()
    })
  }

  return (
    <div
      className={`flex flex-col rounded-2xl border p-5 ${
        claro ? "border-border bg-bg-section/60" : "border-line-dark-strong bg-white/[0.04]"
      } ${editando ? "bg-surface" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={`${ROTULO} ${claro ? "text-primary" : "text-primary-light/80"}`}>Por {d.empresa}</p>
        {d.puedeFirmar && !editando && (
          <button
            type="button"
            onClick={() => setEditando(true)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
              claro ? "text-text-muted hover:text-primary" : "text-white/60 hover:text-white"
            }`}
          >
            <PenLine className="h-3.5 w-3.5" aria-hidden="true" /> {d.firma ? "Volver a firmar" : "Firmar"}
          </button>
        )}
      </div>

      {editando ? (
        <div className="mt-4">
          <LienzoFirma trazo={trazo} onChange={(fn) => setTrazo(fn)} />
          {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={guardando || !trazoValido(trazo)}
              onClick={guardar}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-50"
            >
              {guardando && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Guardar mi firma
            </button>
            <button
              type="button"
              onClick={() => {
                setEditando(false)
                setTrazo("")
                setError(null)
              }}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/40"
            >
              Cancelar
            </button>
          </div>
          <p className="mt-2 text-xs text-text-muted">Solo tú ves estos botones: tienes sesión del panel.</p>
        </div>
      ) : d.firma ? (
        <TrazoFirma
          trazo={d.firma.trazo}
          className={`mt-auto border-b ${claro ? "border-text-primary/20 text-text-primary" : "border-white/20 text-white"}`}
        />
      ) : (
        <p
          className={`${manuscrita.className} mt-auto truncate border-b pb-1 pt-6 text-[26px] leading-none sm:text-[34px] ${
            claro ? "border-text-primary/20 text-text-primary" : "border-white/20 text-white"
          }`}
        >
          {d.nombre}
        </p>
      )}

      <p className={`mt-3 text-sm font-semibold ${claro ? "text-text-primary" : "text-white"}`}>{d.nombre}</p>
      <p className={`text-xs ${claro ? "text-text-muted" : "text-white/55"}`}>
        Desarrollador · {d.firma ? `firmó el ${formatearFechaHora(d.firma.en)}` : `firmada el ${formatearFecha(d.fecha)}`}
      </p>
    </div>
  )
}

/**
 * Decisión del cliente: la inversión total, lo que confirma al aceptar y las
 * firmas (de una a `MAX_FIRMANTES` personas del cliente, junto a la del
 * desarrollador). Ya aceptada, muestra quiénes firmaron y cuándo.
 */
export function AceptarPropuesta({
  slug,
  total,
  aceptacion,
  sugerido,
  desarrollador,
}: {
  slug: string
  total: string
  aceptacion: AceptacionDTO | null
  /** Nombre del contacto, para precargar el primer firmante. */
  sugerido: string
  desarrollador: Desarrollador
}) {
  const router = useRouter()
  const siguienteId = useRef(1)
  const [firmantes, setFirmantes] = useState<Firmante[]>([{ id: 0, nombre: sugerido, trazo: "" }])
  const [conforme, setConforme] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enviando, iniciar] = useTransition()

  if (aceptacion) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-bg-dark p-6 shadow-glow sm:p-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-success/30 blur-3xl" />
        <div className="relative text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success text-white shadow-lg shadow-success/30">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">Propuesta aceptada</p>
          <p className="mt-2 text-sm text-white/70 sm:text-base">
            {aceptacion.firmas.length > 0 ? "Firmada el " : `${aceptacion.por} · `}
            {formatearFechaHora(aceptacion.en)}
          </p>
        </div>
        <div className="relative mt-8 grid gap-4 md:grid-cols-2">
          {aceptacion.firmas.map((f, i) => (
            <div key={i} className="flex flex-col rounded-2xl border border-line-dark-strong bg-white/[0.04] p-5">
              <p className={`${ROTULO} text-primary-light/80`}>Por el cliente</p>
              <TrazoFirma trazo={f.trazo} className="mt-2 border-b border-white/20 text-white" />
              <p className="mt-3 text-sm font-semibold text-white">{f.nombre}</p>
              <p className="text-xs text-white/55">Firmó el {formatearFechaHora(aceptacion.en)}</p>
            </div>
          ))}
          <FirmaDesarrollador slug={slug} d={desarrollador} oscuro />
        </div>
        <p className="relative mx-auto mt-8 max-w-md text-pretty text-center text-sm leading-relaxed text-white/60">
          Gracias por tu confianza. Te contactamos para firmar el contrato y arrancar con la semana 0.
        </p>
      </div>
    )
  }

  const cambiar = (id: number, cambio: (f: Firmante) => Firmante) =>
    setFirmantes((fs) => fs.map((f) => (f.id === id ? cambio(f) : f)))
  const completas = firmantes.every((f) => f.nombre.trim() && trazoValido(f.trazo))

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    iniciar(async () => {
      const r = await aceptarPropuesta(
        slug,
        firmantes.map((f) => ({ nombre: f.nombre, trazo: f.trazo })),
      )
      if (!r.ok) {
        setError(r.error ?? "No pudimos registrar tu aceptación.")
        return
      }
      router.refresh()
    })
  }

  return (
    <form onSubmit={enviar} className="overflow-hidden rounded-3xl border border-border bg-surface shadow-modal">
      <div className="h-1 bg-gradient-to-r from-primary-hover via-primary to-primary-light" />

      {/* La inversión y lo que se confirma al firmar */}
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <div>
          <p className={`${ROTULO} text-primary`}>Inversión total del desarrollo</p>
          <p className="mt-3 font-display text-5xl font-bold tracking-tight text-text-primary tabular-nums sm:text-6xl">
            {total}
          </p>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-text-secondary">
            Con tu firma preparamos el contrato. Nada se cobra desde esta página.
          </p>
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-text-primary">Al firmar confirmas que:</p>
          <ul className="mt-4 space-y-3">
            {COMPROMISOS.map((x) => (
              <li key={x} className="flex gap-3 text-sm leading-relaxed text-text-secondary sm:text-base">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Firmas */}
      <div className="border-t border-border bg-bg-section/40 p-6 sm:p-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-display text-lg font-semibold text-text-primary">Firmas</p>
          <p className="text-xs text-text-muted">
            Pueden firmar hasta {MAX_FIRMANTES} personas de tu empresa.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {firmantes.map((f, i) => (
            <div key={f.id} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <p className={`${ROTULO} text-primary`}>
                  Por el cliente{firmantes.length > 1 ? ` · firmante ${i + 1}` : ""}
                </p>
                {firmantes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setFirmantes((fs) => fs.filter((x) => x.id !== f.id))}
                    className="inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-primary"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" /> Quitar
                  </button>
                )}
              </div>
              <label className="mt-4 block">
                <span className="block text-sm font-medium text-text-secondary">Nombre completo</span>
                <input
                  className={`mt-1.5 ${INPUT}`}
                  value={f.nombre}
                  maxLength={120}
                  autoComplete="name"
                  onChange={(e) => cambiar(f.id, (x) => ({ ...x, nombre: e.target.value }))}
                />
              </label>
              <p className="mt-4 text-sm font-medium text-text-secondary">Firma</p>
              <div className="mt-1.5">
                <LienzoFirma
                  trazo={f.trazo}
                  onChange={(fn) => cambiar(f.id, (x) => ({ ...x, trazo: fn(x.trazo) }))}
                />
              </div>
            </div>
          ))}
          <FirmaDesarrollador slug={slug} d={desarrollador} />
        </div>

        {firmantes.length < MAX_FIRMANTES && (
          <button
            type="button"
            onClick={() =>
              setFirmantes((fs) => [...fs, { id: siguienteId.current++, nombre: "", trazo: "" }])
            }
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-dashed border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Agregar otro firmante
          </button>
        )}

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            checked={conforme}
            onChange={(e) => setConforme(e.target.checked)}
          />
          <span className="text-sm leading-relaxed text-text-secondary">
            Leí la propuesta completa y soy consciente de lo que se me va a entregar. Acepto el alcance,
            el calendario y la inversión.
          </span>
        </label>

        {error && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-500">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando || !conforme || !completas}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:px-10"
        >
          {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
          Firmar y aceptar la propuesta
        </button>
      </div>
    </form>
  )
}
