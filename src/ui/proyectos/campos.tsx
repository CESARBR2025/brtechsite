"use client"

import { useState } from "react"
import { INPUT } from "@/src/ui/levantamientos/campos"
import type { Tabla } from "@/src/modules/proyectos/domain/contenido"

const LABEL = "block text-sm font-medium text-text-secondary"

function aTexto(centavos: number | null): string {
  if (centavos == null) return ""
  return (centavos / 100).toFixed(2).replace(/\.00$/, "")
}

function aCentavos(texto: string): number | null {
  const limpio = texto.replace(/[$,\s]/g, "")
  if (!limpio) return null
  const n = Number(limpio)
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null
}

/** Monto en pesos; se guarda como centavos enteros. */
export function CampoDinero({
  etiqueta,
  centavos,
  onChange,
}: {
  etiqueta: string
  centavos: number | null
  onChange: (centavos: number | null) => void
}) {
  const [texto, setTexto] = useState(() => aTexto(centavos))
  return (
    <label className="block">
      <span className={LABEL}>{etiqueta}</span>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">$</span>
        <input
          inputMode="decimal"
          className={`${INPUT} pl-7 tabular-nums`}
          value={texto}
          placeholder="0"
          onChange={(e) => {
            setTexto(e.target.value)
            onChange(aCentavos(e.target.value))
          }}
          onBlur={() => setTexto(aTexto(aCentavos(texto)))}
        />
      </div>
    </label>
  )
}

/** Selector de una referencia (fase, pago…) por id. */
export function Selector({
  etiqueta,
  opciones,
  valor,
  onChange,
  vacio = "Sin asignar",
}: {
  etiqueta: string
  opciones: { id: string; texto: string }[]
  valor: string | null
  onChange: (id: string | null) => void
  vacio?: string
}) {
  return (
    <label className="block">
      <span className={LABEL}>{etiqueta}</span>
      <select
        className={`mt-1.5 ${INPUT}`}
        value={valor ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">{vacio}</option>
        {opciones.map((o) => (
          <option key={o.id} value={o.id}>
            {o.texto}
          </option>
        ))}
      </select>
    </label>
  )
}

const SEP = " | "

/**
 * Tabla sencilla capturada como texto: encabezados separados por "|" y una
 * fila por renglón. Pensado para capturar rápido también desde el celular.
 */
export function CampoTabla({
  tabla,
  onChange,
}: {
  tabla: Tabla | null
  onChange: (t: Tabla | null) => void
}) {
  const [columnas, setColumnas] = useState(() => tabla?.columnas.join(SEP) ?? "")
  const [filas, setFilas] = useState(() => tabla?.filas.map((f) => f.join(SEP)).join("\n") ?? "")

  function emitir(cols: string, fs: string) {
    const c = cols.split("|").map((x) => x.trim()).filter(Boolean)
    const f = fs
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => l.split("|").map((x) => x.trim()))
    onChange(c.length || f.length ? { columnas: c, filas: f } : null)
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className={LABEL}>
          Columnas de la tabla <span className="font-normal text-text-muted">(separadas por |)</span>
        </span>
        <input
          className={`mt-1.5 ${INPUT}`}
          value={columnas}
          placeholder="Concepto | Costo | Nota"
          onChange={(e) => {
            setColumnas(e.target.value)
            emitir(e.target.value, filas)
          }}
        />
      </label>
      <label className="block">
        <span className={LABEL}>
          Filas <span className="font-normal text-text-muted">(una por renglón, celdas separadas por |)</span>
        </span>
        <textarea
          className={`mt-1.5 ${INPUT} resize-y font-mono text-xs sm:text-xs`}
          rows={Math.min(12, Math.max(3, filas.split("\n").length + 1))}
          value={filas}
          onChange={(e) => {
            setFilas(e.target.value)
            emitir(columnas, e.target.value)
          }}
        />
      </label>
    </div>
  )
}

/** Casilla con texto (fase contratada, etc.). */
export function Casilla({
  etiqueta,
  valor,
  onChange,
}: {
  etiqueta: string
  valor: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
      <input
        type="checkbox"
        className="h-4 w-4 accent-primary"
        checked={valor}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm font-medium text-text-primary">{etiqueta}</span>
    </label>
  )
}
