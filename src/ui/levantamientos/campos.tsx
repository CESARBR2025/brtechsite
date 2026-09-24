"use client"

import { useState } from "react"
import { ExternalLink, Loader2, LocateFixed, Plus, Trash2, X } from "lucide-react"
import type {
  Actor,
  Coordenadas,
} from "@/src/modules/levantamientos/domain/contenido"

// text-base en móvil: con 14 px iOS hace zoom al enfocar el campo
export const INPUT =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-base text-text-primary placeholder-text-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light disabled:bg-bg-section disabled:text-text-muted sm:text-sm"
const LABEL = "block text-sm font-medium text-text-secondary"

/** Id local de una fila; solo tiene que ser único dentro del levantamiento. */
export function nuevoId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

export function Campo({
  etiqueta,
  valor,
  onChange,
  placeholder,
  filas,
  tipo = "text",
  requerido,
}: {
  etiqueta: string
  valor: string
  onChange: (v: string) => void
  placeholder?: string
  /** Si se indica, el campo es un textarea con esas filas. */
  filas?: number
  tipo?: "text" | "date" | "datetime-local" | "tel"
  requerido?: boolean
}) {
  const esFecha = tipo === "date" || tipo === "datetime-local"
  return (
    <label className="block">
      <span className={LABEL}>
        {etiqueta}
        {requerido && <span className="text-primary"> *</span>}
      </span>
      {filas ? (
        <textarea
          className={`mt-1.5 ${INPUT} resize-y`}
          rows={filas}
          value={valor}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={tipo}
          className={`mt-1.5 ${INPUT} ${esFecha ? "cursor-pointer" : ""}`}
          value={valor}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onClick={esFecha ? abrirCalendario : undefined}
        />
      )}
    </label>
  )
}

/**
 * Abre el calendario nativo al hacer clic en cualquier parte del campo (por
 * defecto, en escritorio solo lo abre el ícono). En celular ya se abre solo.
 */
function abrirCalendario(e: React.MouseEvent<HTMLInputElement>) {
  try {
    e.currentTarget.showPicker?.()
  } catch {
    /* navegador sin showPicker o sin gesto de usuario: queda el comportamiento nativo */
  }
}

/** Opciones táctiles: selección única (se puede desmarcar) o múltiple. */
export function Chips<T extends string>({
  etiqueta,
  opciones,
  seleccion = [],
  onChange,
}: {
  etiqueta: string
  opciones: Record<T, string>
  /** Ausente = nada seleccionado (p. ej. estado previo a un campo nuevo). */
  seleccion?: T[]
  onChange: (valores: T[]) => void
}) {
  return (
    <fieldset>
      <legend className={LABEL}>{etiqueta}</legend>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {(Object.keys(opciones) as T[]).map((valor) => {
          const activo = seleccion.includes(valor)
          return (
            <button
              key={valor}
              type="button"
              aria-pressed={activo}
              onClick={() =>
                onChange(
                  activo
                    ? seleccion.filter((v) => v !== valor)
                    : [...seleccion, valor],
                )
              }
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                activo
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-bg-section text-text-secondary ring-1 ring-inset ring-border hover:bg-primary-light hover:text-primary"
              }`}
            >
              {opciones[valor]}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Variante de selección única sobre `Chips`. */
export function ChipUnico<T extends string>({
  etiqueta,
  opciones,
  valor,
  onChange,
}: {
  etiqueta: string
  opciones: Record<T, string>
  valor: T | null
  onChange: (v: T | null) => void
}) {
  return (
    <Chips
      etiqueta={etiqueta}
      opciones={opciones}
      seleccion={valor ? [valor] : []}
      onChange={(vs) => onChange(vs.find((v) => v !== valor) ?? null)}
    />
  )
}

export function SelectorActor({
  etiqueta,
  actores,
  valor,
  onChange,
}: {
  etiqueta: string
  actores: Actor[]
  valor: string | null
  onChange: (id: string | null) => void
}) {
  return (
    <label className="block">
      <span className={LABEL}>{etiqueta}</span>
      <select
        className={`mt-1.5 ${INPUT}`}
        value={valor ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">
          {actores.length === 0 ? "Primero registra actores" : "Sin asignar"}
        </option>
        {actores
          .filter((a) => a.nombre)
          .map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
      </select>
    </label>
  )
}

/**
 * Lista de filas editables. Cada fila se pinta con `children` y recibe un
 * `set` para mezclar cambios parciales.
 */
export function ListaEditable<T extends { id: string }>({
  items,
  onChange,
  crear,
  agregar,
  titulo,
  children,
}: {
  items: T[]
  onChange: (items: T[]) => void
  crear: () => T
  agregar: string
  titulo: (item: T, indice: number) => string
  children: (item: T, set: (parcial: Partial<T>) => void) => React.ReactNode
}) {
  // Un estado con la forma anterior (p. ej. tras recarga en caliente) cuenta como lista vacía
  const filas = Array.isArray(items) ? items : []
  return (
    <div className="space-y-3">
      {filas.map((item, i) => (
        <div key={item.id} className="rounded-xl border border-border bg-bg-section/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="font-mono tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="truncate normal-case tracking-normal text-text-primary">
                {titulo(item, i)}
              </span>
            </p>
            <button
              type="button"
              onClick={() => onChange(filas.filter((x) => x.id !== item.id))}
              className="rounded-full p-2 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
              aria-label="Quitar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 space-y-4">
            {children(item, (parcial) =>
              onChange(filas.map((x) => (x.id === item.id ? { ...x, ...parcial } : x))),
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...filas, crear()])}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 px-4 py-3 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary-light"
      >
        <Plus className="h-4 w-4" />
        {agregar}
      </button>
    </div>
  )
}

function mensajeGeo(err: GeolocationPositionError): string {
  if (err.code === err.PERMISSION_DENIED)
    return "Permiso de ubicación denegado. Actívalo en los ajustes del navegador."
  if (err.code === err.TIMEOUT) return "El GPS tardó demasiado. Intenta de nuevo."
  return "No se pudo obtener la ubicación."
}

/**
 * Ubicación en texto + botón que toma las coordenadas del GPS del
 * dispositivo. El navegador solo lo permite en HTTPS (o localhost).
 */
export function CampoUbicacion({
  valor,
  onChange,
  coordenadas,
  onCoordenadas,
}: {
  valor: string
  onChange: (v: string) => void
  coordenadas: Coordenadas | null
  onCoordenadas: (c: Coordenadas | null) => void
}) {
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function ubicar() {
    setError(null)
    if (!("geolocation" in navigator) || !window.isSecureContext) {
      setError("Este navegador no permite obtener la ubicación (se necesita HTTPS).")
      return
    }
    setBuscando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBuscando(false)
        onCoordenadas({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          precision: Math.round(pos.coords.accuracy),
        })
      },
      (err) => {
        setBuscando(false)
        setError(mensajeGeo(err))
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    )
  }

  return (
    <div>
      <label className="block">
        <span className={LABEL}>Ubicación</span>
        <div className="mt-1.5 flex gap-2">
          <input
            className={INPUT}
            value={valor}
            placeholder="Colonia, ciudad"
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            type="button"
            onClick={ubicar}
            disabled={buscando}
            title="Usar mi ubicación actual"
            aria-label="Usar mi ubicación actual"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary-light px-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-60"
          >
            {buscando ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{buscando ? "Ubicando…" : "Mi ubicación"}</span>
          </button>
        </div>
      </label>

      {coordenadas && (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
          <span className="font-mono tabular-nums text-text-secondary">
            {coordenadas.lat.toFixed(6)}, {coordenadas.lng.toFixed(6)}
          </span>
          {coordenadas.precision != null && <span>±{coordenadas.precision} m</span>}
          <a
            href={`https://www.google.com/maps?q=${coordenadas.lat},${coordenadas.lng}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            Ver en mapa <ExternalLink className="h-3 w-3" />
          </a>
          <button
            type="button"
            onClick={() => onCoordenadas(null)}
            className="inline-flex items-center gap-1 hover:text-red-500"
          >
            <X className="h-3 w-3" /> Quitar
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}
