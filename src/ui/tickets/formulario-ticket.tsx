"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { guardarTicket } from "@/src/app/(panel)/panel/acciones"
import type {
  TicketDetalleDTO,
} from "@/src/modules/tickets/application/dtos"
import type { DatosTicketEntrada } from "@/src/modules/tickets/application/entrada"
import { formatearDinero } from "@/src/ui/formato"

interface FilaItem {
  key: string
  concepto: string
  detalle: string
  cantidad: string
  precioUnitario: string
}

function filaVacia(): FilaItem {
  return {
    key: crypto.randomUUID(),
    concepto: "",
    detalle: "",
    cantidad: "1",
    precioUnitario: "",
  }
}

function hoyISO(): string {
  return new Date().toISOString().slice(0, 10)
}

const INPUT =
  "w-full rounded-lg border border-border py-2.5 px-3 text-sm text-text-primary placeholder-text-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
const LABEL = "block text-sm font-medium text-text-secondary"

export function FormularioTicket({
  inicial,
  ticketId,
}: {
  inicial?: TicketDetalleDTO
  ticketId?: string
}) {
  const router = useRouter()
  const [guardando, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [clienteNombre, setClienteNombre] = useState(
    inicial?.cliente.nombre ?? "",
  )
  const [clienteContacto, setClienteContacto] = useState(
    inicial?.cliente.contacto ?? "",
  )
  const [equipoTipo, setEquipoTipo] = useState(inicial?.equipo.tipo ?? "")
  const [equipoDetalle, setEquipoDetalle] = useState(
    inicial?.equipo.detalle ?? "",
  )
  const [problema, setProblema] = useState(inicial?.problemaReportado ?? "")
  const [diagnostico, setDiagnostico] = useState(inicial?.diagnostico ?? "")
  const [trabajo, setTrabajo] = useState(inicial?.trabajoRealizado ?? "")
  const [recomendaciones, setRecomendaciones] = useState(
    inicial?.recomendaciones ?? "",
  )
  const [garantia, setGarantia] = useState(inicial?.notaGarantia ?? "")
  const [moneda, setMoneda] = useState(inicial?.moneda ?? "MXN")
  const [impuesto, setImpuesto] = useState(
    inicial ? String(inicial.impuesto) : "0",
  )
  const [fechaServicio, setFechaServicio] = useState(
    inicial?.fechaServicio ?? hoyISO(),
  )
  const [items, setItems] = useState<FilaItem[]>(
    inicial && inicial.items.length > 0
      ? inicial.items.map((it) => ({
          key: it.id,
          concepto: it.concepto,
          detalle: it.detalle ?? "",
          cantidad: String(it.cantidad),
          precioUnitario: String(it.precioUnitario),
        }))
      : [filaVacia()],
  )

  const { subtotal, total } = useMemo(() => {
    const sub = items.reduce((acc, it) => {
      const c = Number(it.cantidad)
      const p = Number(it.precioUnitario)
      if (!Number.isFinite(c) || !Number.isFinite(p)) return acc
      return acc + Math.round(c * p * 100) / 100
    }, 0)
    const imp = Number(impuesto)
    return { subtotal: sub, total: sub + (Number.isFinite(imp) ? imp : 0) }
  }, [items, impuesto])

  function actualizarItem(key: string, campo: keyof FilaItem, valor: string) {
    setItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, [campo]: valor } : it)),
    )
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const itemsLimpios = items
      .filter((it) => it.concepto.trim() && it.precioUnitario.trim())
      .map((it) => ({
        concepto: it.concepto.trim(),
        detalle: it.detalle.trim() || null,
        cantidad: Number(it.cantidad),
        precioUnitario: Number(it.precioUnitario),
      }))

    if (itemsLimpios.length === 0) {
      setError("Agrega al menos un concepto con precio.")
      return
    }

    const datos: DatosTicketEntrada = {
      cliente: {
        nombre: clienteNombre.trim(),
        contacto: clienteContacto.trim() || null,
      },
      equipo: {
        tipo: equipoTipo.trim(),
        detalle: equipoDetalle.trim() || null,
      },
      problemaReportado: problema.trim() || null,
      diagnostico: diagnostico.trim() || null,
      trabajoRealizado: trabajo.trim() || null,
      recomendaciones: recomendaciones.trim() || null,
      notaGarantia: garantia.trim() || null,
      moneda: moneda.trim() || "MXN",
      impuesto: Number(impuesto) || 0,
      fechaServicio,
      items: itemsLimpios,
    }

    startTransition(async () => {
      const r = await guardarTicket(ticketId ?? null, datos)
      if (!r.ok) {
        setError(r.error ?? "No se pudo guardar.")
        return
      }
      router.push(`/panel/${r.ticketId}`)
      router.refresh()
    })
  }

  return (
    <form onSubmit={enviar} className="space-y-6">
      {/* Cliente */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <h2 className="text-sm font-semibold text-text-primary">Cliente</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="clienteNombre">
              Nombre *
            </label>
            <input
              id="clienteNombre"
              className={`mt-1 ${INPUT}`}
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="clienteContacto">
              Contacto (teléfono / correo)
            </label>
            <input
              id="clienteContacto"
              className={`mt-1 ${INPUT}`}
              value={clienteContacto}
              onChange={(e) => setClienteContacto(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <h2 className="text-sm font-semibold text-text-primary">Equipo</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="equipoTipo">
              Tipo *
            </label>
            <input
              id="equipoTipo"
              className={`mt-1 ${INPUT}`}
              placeholder="PC de escritorio, Laptop…"
              value={equipoTipo}
              onChange={(e) => setEquipoTipo(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="equipoDetalle">
              Marca / modelo / serie
            </label>
            <input
              id="equipoDetalle"
              className={`mt-1 ${INPUT}`}
              value={equipoDetalle}
              onChange={(e) => setEquipoDetalle(e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="fechaServicio">
              Fecha de servicio *
            </label>
            <input
              id="fechaServicio"
              type="date"
              className={`mt-1 ${INPUT}`}
              value={fechaServicio}
              onChange={(e) => setFechaServicio(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={LABEL} htmlFor="moneda">
              Moneda
            </label>
            <input
              id="moneda"
              className={`mt-1 ${INPUT}`}
              value={moneda}
              onChange={(e) => setMoneda(e.target.value.toUpperCase())}
              maxLength={3}
            />
          </div>
        </div>
      </section>

      {/* Narrativa */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <h2 className="text-sm font-semibold text-text-primary">
          Detalle del servicio
        </h2>
        <div className="mt-4 space-y-4">
          {[
            ["Problema reportado", problema, setProblema],
            ["Diagnóstico", diagnostico, setDiagnostico],
            ["Trabajo realizado", trabajo, setTrabajo],
            ["Recomendaciones", recomendaciones, setRecomendaciones],
            ["Nota de garantía", garantia, setGarantia],
          ].map(([etiqueta, valor, set]) => (
            <div key={etiqueta as string}>
              <label className={LABEL}>{etiqueta as string}</label>
              <textarea
                className={`mt-1 ${INPUT} resize-y`}
                rows={2}
                value={valor as string}
                onChange={(e) =>
                  (set as (v: string) => void)(e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </section>

      {/* Conceptos */}
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Conceptos</h2>
          <button
            type="button"
            onClick={() => setItems((p) => [...p, filaVacia()])}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-light px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Agregar
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((it) => {
            const importe =
              (Number(it.cantidad) || 0) * (Number(it.precioUnitario) || 0)
            return (
              <div
                key={it.key}
                className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_5rem_7rem_7rem_auto] sm:items-start"
              >
                <div>
                  <input
                    className={INPUT}
                    placeholder="Concepto *"
                    value={it.concepto}
                    onChange={(e) =>
                      actualizarItem(it.key, "concepto", e.target.value)
                    }
                  />
                  <input
                    className={`mt-2 ${INPUT}`}
                    placeholder="Detalle (opcional)"
                    value={it.detalle}
                    onChange={(e) =>
                      actualizarItem(it.key, "detalle", e.target.value)
                    }
                  />
                </div>
                <input
                  className={INPUT}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Cant."
                  value={it.cantidad}
                  onChange={(e) =>
                    actualizarItem(it.key, "cantidad", e.target.value)
                  }
                />
                <input
                  className={INPUT}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="P. unitario *"
                  value={it.precioUnitario}
                  onChange={(e) =>
                    actualizarItem(it.key, "precioUnitario", e.target.value)
                  }
                />
                <div className="px-1 py-2.5 text-right text-sm tabular-nums text-text-secondary">
                  {formatearDinero(
                    Number.isFinite(importe) ? importe : 0,
                    moneda,
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setItems((p) =>
                      p.length > 1 ? p.filter((x) => x.key !== it.key) : p,
                    )
                  }
                  className="flex items-center justify-center rounded-md p-2 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                  aria-label="Quitar concepto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <dl className="w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between text-text-secondary">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">
                {formatearDinero(subtotal, moneda)}
              </dd>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <dt>Impuesto</dt>
              <dd>
                <input
                  className={`${INPUT} w-28 text-right`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={impuesto}
                  onChange={(e) => setImpuesto(e.target.value)}
                />
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-border pt-2">
              <dt className="font-semibold text-text-primary">Total</dt>
              <dd className="text-xl font-bold tabular-nums text-text-primary">
                {formatearDinero(total, moneda)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-500">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
        >
          {guardando ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Guardando…
            </>
          ) : ticketId ? (
            "Guardar cambios"
          ) : (
            "Crear ticket"
          )}
        </button>
      </div>
    </form>
  )
}
