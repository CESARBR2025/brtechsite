"use client"

import { useId, useMemo, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { guardarTicket } from "@/src/app/(panel)/panel/acciones"
import type {
  TicketDetalleDTO,
} from "@/src/modules/tickets/application/dtos"
import type { DatosTicketEntrada } from "@/src/modules/tickets/application/entrada"
import { sugerirClasificacion } from "@/src/modules/tickets/application/sugerir-clasificacion"
import { derivarEscena, etiquetaDe } from "@/src/modules/tickets/application/escena-servicio"
import {
  CATEGORIAS_EQUIPO, CLASES_CONCEPTO, ETIQUETA_CATEGORIA, ETIQUETA_CLASE,
  ETIQUETA_PIEZA, GARANTIA_MAX_DIAS, LARGO_ETIQUETA, PIEZAS_POR_CATEGORIA,
  type CategoriaEquipo, type ClaseConcepto, type TipoPieza,
} from "@/src/modules/tickets/domain/clasificacion"
import { PLANTILLAS_CONCEPTO, type PlantillaConcepto } from "./plantillas-concepto"
import { Activador } from "./recibo/ilustracion/activador"
import { IlustracionServicio } from "./recibo/ilustracion/ilustracion-servicio"
import { formatearDinero } from "@/src/ui/formato"

interface FilaItem {
  key: string
  concepto: string
  detalle: string
  cantidad: string
  precioUnitario: string
  clase: ClaseConcepto
  pieza: TipoPieza | null
  etiqueta: string
  piezaAnterior: string
  clasificacionManual: boolean
}

function filaVacia(key = crypto.randomUUID()): FilaItem {
  return {
    key,
    concepto: "",
    detalle: "",
    cantidad: "1",
    precioUnitario: "",
    clase: "otro",
    pieza: null,
    etiqueta: "",
    piezaAnterior: "",
    clasificacionManual: false,
  }
}

function hoyISO(): string {
  return new Date().toISOString().slice(0, 10)
}

const INPUT =
  "min-h-11 w-full rounded-lg border border-border py-2.5 px-3 text-base sm:text-sm text-text-primary placeholder-text-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
const LABEL = "block text-sm font-medium text-text-secondary"
const ANTES_PIEZA: Record<TipoPieza, string> = {
  disco: "disco mecánico", ram: "4 GB", bateria: "batería agotada",
  ventilador: "ventilador ruidoso", fuente: "fuente anterior", placa: "tarjeta madre anterior",
  procesador: "procesador anterior", video: "tarjeta de video anterior", gabinete: "gabinete anterior",
}

export function FormularioTicket({
  inicial,
  ticketId,
}: {
  inicial?: TicketDetalleDTO
  ticketId?: string
}) {
  const router = useRouter()
  const idFilaInicial = useId()
  const [guardando, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [clienteNombre, setClienteNombre] = useState(
    inicial?.cliente.nombre ?? "",
  )
  const [clienteContacto, setClienteContacto] = useState(
    inicial?.cliente.contacto ?? "",
  )
  const [categoria, setCategoria] = useState<CategoriaEquipo>(inicial?.equipo.categoria ?? "laptop")
  const [avisosCategoria, setAvisosCategoria] = useState<string[]>([])
  const [repeticion, setRepeticion] = useState(0)
  const enfocarPrecio = useRef<string | null>(null)
  // Si el nombre guardado es la etiqueta automática de la categoría, se deja vacío para que siga a la categoría.
  const [equipoTipo, setEquipoTipo] = useState(
    inicial && inicial.equipo.tipo !== ETIQUETA_CATEGORIA[inicial.equipo.categoria] ? inicial.equipo.tipo : "",
  )
  const [equipoDetalle, setEquipoDetalle] = useState(
    inicial?.equipo.detalle ?? "",
  )
  const [problema, setProblema] = useState(inicial?.problemaReportado ?? "")
  const [diagnostico, setDiagnostico] = useState(inicial?.diagnostico ?? "")
  const [trabajo, setTrabajo] = useState(inicial?.trabajoRealizado ?? "")
  const [recomendaciones, setRecomendaciones] = useState(
    inicial?.recomendaciones ?? "",
  )
  const [garantiaDias, setGarantiaDias] = useState(
    inicial ? inicial.garantiaDias === null ? "" : String(inicial.garantiaDias) : "30",
  )
  const [garantia, setGarantia] = useState(inicial?.notaGarantia ?? "")
  const [moneda, setMoneda] = useState(inicial?.moneda ?? "MXN")
  const [impuesto, setImpuesto] = useState(
    inicial ? String(inicial.impuesto) : "0",
  )
  const [fechaServicio, setFechaServicio] = useState(
    inicial?.fechaServicio ?? hoyISO(),
  )
  const [items, setItems] = useState<FilaItem[]>(() =>
    inicial && inicial.items.length > 0
      ? inicial.items.map((it) => ({
          key: it.id,
          concepto: it.concepto,
          detalle: it.detalle ?? "",
          cantidad: String(it.cantidad),
          precioUnitario: String(it.precioUnitario),
          clase: it.clase,
          pieza: it.pieza,
          etiqueta: it.etiquetaPropia ?? "",
          piezaAnterior: it.piezaAnterior ?? "",
          clasificacionManual: true,
        }))
      : [filaVacia(idFilaInicial)],
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

  const conceptos = items.filter((it) => it.concepto.trim()).map((it) => ({
    ...it,
    etiqueta: it.etiqueta.trim() || null,
    piezaAnterior: it.piezaAnterior.trim() || null,
  }))
  const escena = derivarEscena(categoria, conceptos)
  const avisosVistaPrevia = [
    conceptos.some((it) => it.clase === "pieza" && !it.pieza) && "Indica qué pieza es para dibujarla.",
    categoria === "otro" && "Con «Otro equipo» se muestra la ilustración genérica.",
    garantiaDias.trim() !== "" && Number(garantiaDias) === 0 && "Sin garantía: no se mostrará la medalla.",
    !problema.trim() && !diagnostico.trim() && !trabajo.trim() && "Sin textos de historia: el cliente no verá «Así quedó tu…».",
  ].filter((aviso): aviso is string => Boolean(aviso))

  function cambiarCategoria(nueva: CategoriaEquipo) {
    const avisos: string[] = []
    const siguientes = items.map((it) => {
      let { clase, pieza, piezaAnterior } = it
      if (pieza && !PIEZAS_POR_CATEGORIA[nueva].includes(pieza)) {
        avisos.push(`Quitamos la pieza ${ETIQUETA_PIEZA[pieza]}: no aplica a ${ETIQUETA_CATEGORIA[nueva]}`)
        pieza = null
        piezaAnterior = ""
      }
      if (clase === "ensamble" && nueva !== "pc") {
        clase = "otro"
        avisos.push(`Cambiamos Ensamble a Otro: no aplica a ${ETIQUETA_CATEGORIA[nueva]}`)
      }
      return { ...it, clase, pieza, piezaAnterior }
    })
    setCategoria(nueva)
    setItems(siguientes)
    setAvisosCategoria([...new Set(avisos)])
  }

  function actualizarItem(key: string, cambios: Partial<FilaItem>) {
    setItems((prev) => prev.map((it) => {
      if (it.key !== key) return it
      const fila = { ...it, ...cambios }
      if (!fila.clasificacionManual && (cambios.concepto !== undefined || cambios.detalle !== undefined)) {
        const sugerencia = sugerirClasificacion(fila.concepto, fila.detalle)
        fila.clase = sugerencia.clase === "ensamble" && categoria !== "pc" ? "otro" : sugerencia.clase
        fila.pieza = sugerencia.pieza && PIEZAS_POR_CATEGORIA[categoria].includes(sugerencia.pieza) ? sugerencia.pieza : null
      }
      if (fila.clase !== "pieza" && fila.clase !== "diagnostico") fila.pieza = null
      if (fila.clase !== "pieza" || fila.pieza !== it.pieza) fila.piezaAnterior = ""
      return fila
    }))
  }

  function agregarPlantilla(plantilla: PlantillaConcepto) {
    const fila: FilaItem = {
      ...filaVacia(), concepto: plantilla.concepto, clase: plantilla.clase,
      pieza: plantilla.pieza, clasificacionManual: true,
    }
    enfocarPrecio.current = fila.key
    setItems((prev) => [...prev, fila])
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const itemsLimpios = items
      .filter((it) => it.concepto.trim() && it.precioUnitario.trim())
      .map((it) => ({
        clase: it.clase,
        pieza: it.pieza,
        etiqueta: it.etiqueta.trim() || null,
        piezaAnterior: it.piezaAnterior.trim() || null,
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
        categoria,
        tipo: equipoTipo.trim(),
        detalle: equipoDetalle.trim() || null,
      },
      problemaReportado: problema.trim() || null,
      diagnostico: diagnostico.trim() || null,
      trabajoRealizado: trabajo.trim() || null,
      recomendaciones: recomendaciones.trim() || null,
      notaGarantia: garantia.trim() || null,
      garantiaDias: garantiaDias.trim() === "" ? null : Number(garantiaDias),
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
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,372px)] lg:items-start">
      <form onSubmit={enviar} className="min-w-0 space-y-6">
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
          <fieldset className="mt-4">
            <legend className={LABEL}>Tipo de equipo *</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIAS_EQUIPO.map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  aria-pressed={categoria === opcion}
                  onClick={() => cambiarCategoria(opcion)}
                  className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${categoria === opcion ? "bg-primary text-white" : "bg-primary-light text-primary hover:bg-primary hover:text-white"}`}
                >
                  {ETIQUETA_CATEGORIA[opcion]}
                </button>
              ))}
            </div>
          </fieldset>
          <div role="status" aria-live="polite">
            {avisosCategoria.map((aviso) => (
              <p key={aviso} className="mt-2 rounded-lg bg-warning/15 p-3 text-sm text-text-secondary">{aviso}</p>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="equipoTipo">
                Nombre del equipo
              </label>
              <input
                id="equipoTipo"
                className={`mt-1 ${INPUT}`}
                placeholder={ETIQUETA_CATEGORIA[categoria]}
                value={equipoTipo}
                onChange={(e) => setEquipoTipo(e.target.value)}
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
            ].map(([etiqueta, valor, set]) => (
              <div key={etiqueta as string}>
                <label className={LABEL} htmlFor={`historia-${etiqueta}`}>{etiqueta as string}</label>
                <textarea
                  id={`historia-${etiqueta}`}
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

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary">Garantía</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className={LABEL} htmlFor="garantiaDias">Días de garantía</label>
              <input id="garantiaDias" className={`mt-1 ${INPUT}`} type="number" min="0" max={GARANTIA_MAX_DIAS}
                step="1" value={garantiaDias} onChange={(e) => setGarantiaDias(e.target.value)} />
              <p className="mt-1 text-xs text-text-muted">0 = sin garantía. En tickets antiguos puede quedar vacío.</p>
            </div>
            <div>
              <label className={LABEL} htmlFor="notaGarantia">Nota de garantía</label>
              <textarea id="notaGarantia" className={`mt-1 ${INPUT} resize-y`} rows={2}
                value={garantia} onChange={(e) => setGarantia(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Conceptos */}
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-text-primary">Conceptos</h2>
            <button
              type="button"
              onClick={() => setItems((p) => [...p, filaVacia()])}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary-light px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Agregar
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-text-muted">Agregar rápido</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PLANTILLAS_CONCEPTO.filter((plantilla) => plantilla.categorias.includes(categoria)).map((plantilla) => (
                <button key={plantilla.nombre} type="button" onClick={() => agregarPlantilla(plantilla)}
                  className="min-h-11 rounded-full bg-primary-light px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white">
                  {plantilla.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {items.map((it, indice) => {
              const importe = (Number(it.cantidad) || 0) * (Number(it.precioUnitario) || 0)
              const prefijo = `concepto-${it.key}`
              return (
                <fieldset key={it.key} className="min-w-0 rounded-xl border border-border p-3">
                  <legend className="px-1 text-xs font-medium text-text-muted">Concepto {indice + 1}</legend>
                  <div className="space-y-3">
                    <div>
                      <label className={LABEL} htmlFor={`${prefijo}-nombre`}>Concepto *</label>
                      <input id={`${prefijo}-nombre`} className={`mt-1 ${INPUT}`} value={it.concepto}
                        onChange={(e) => actualizarItem(it.key, { concepto: e.target.value })} />
                    </div>
                    <div>
                      <label className={LABEL} htmlFor={`${prefijo}-detalle`}>Detalle (opcional)</label>
                      <input id={`${prefijo}-detalle`} className={`mt-1 ${INPUT}`} value={it.detalle}
                        onChange={(e) => actualizarItem(it.key, { detalle: e.target.value })} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className={LABEL} htmlFor={`${prefijo}-clase`}>
                          Clase {!it.clasificacionManual && (it.concepto.trim() || it.detalle.trim()) && (
                            <span className="ml-1 rounded-full bg-primary-light px-2 py-1 text-xs text-primary">Sugerida</span>
                          )}
                        </label>
                        <select id={`${prefijo}-clase`} className={`mt-1 bg-surface ${INPUT}`} value={it.clase}
                          onChange={(e) => actualizarItem(it.key, { clase: e.target.value as ClaseConcepto, clasificacionManual: true })}>
                          {CLASES_CONCEPTO.map((clase) => (
                            <option key={clase} value={clase} disabled={clase === "ensamble" && categoria !== "pc"}>
                              {ETIQUETA_CLASE[clase]}
                            </option>
                          ))}
                        </select>
                      </div>
                      {(it.clase === "pieza" || it.clase === "diagnostico") && (
                        <div>
                          <label className={LABEL} htmlFor={`${prefijo}-pieza`}>
                            {it.clase === "pieza" ? "¿Qué pieza?" : "Pieza con falla (opcional)"}
                          </label>
                          <select id={`${prefijo}-pieza`} className={`mt-1 bg-surface ${INPUT}`} value={it.pieza ?? ""}
                            onChange={(e) => actualizarItem(it.key, { pieza: (e.target.value || null) as TipoPieza | null, clasificacionManual: true })}>
                            <option value="">Sin especificar</option>
                            {PIEZAS_POR_CATEGORIA[categoria].map((pieza) => (
                              <option key={pieza} value={pieza}>{ETIQUETA_PIEZA[pieza]}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {it.clase === "pieza" && (
                        <div>
                          <label className={LABEL} htmlFor={`${prefijo}-anterior`}>Antes (opcional)</label>
                          <input id={`${prefijo}-anterior`} className={`mt-1 ${INPUT}`} maxLength={LARGO_ETIQUETA}
                            placeholder={it.pieza ? ANTES_PIEZA[it.pieza] : "pieza anterior"} value={it.piezaAnterior}
                            onChange={(e) => actualizarItem(it.key, { piezaAnterior: e.target.value })} />
                        </div>
                      )}
                      <div>
                        <label className={LABEL} htmlFor={`${prefijo}-etiqueta`}>Texto corto (opcional)</label>
                        <input id={`${prefijo}-etiqueta`} className={`mt-1 ${INPUT}`} maxLength={LARGO_ETIQUETA}
                          placeholder={etiquetaDe({ ...it, etiqueta: null, piezaAnterior: it.piezaAnterior || null })}
                          value={it.etiqueta} onChange={(e) => actualizarItem(it.key, { etiqueta: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={LABEL} htmlFor={`${prefijo}-cantidad`}>Cantidad</label>
                        <input id={`${prefijo}-cantidad`} className={`mt-1 ${INPUT}`} type="number" min="0" step="0.01"
                          value={it.cantidad} onChange={(e) => actualizarItem(it.key, { cantidad: e.target.value })} />
                      </div>
                      <div>
                        <label className={LABEL} htmlFor={`${prefijo}-precio`}>Precio unitario *</label>
                        <input id={`${prefijo}-precio`} className={`mt-1 ${INPUT}`} type="number" min="0" step="0.01"
                          ref={(elemento) => {
                            if (elemento && enfocarPrecio.current === it.key) {
                              elemento.focus()
                              enfocarPrecio.current = null
                            }
                          }}
                          value={it.precioUnitario} onChange={(e) => actualizarItem(it.key, { precioUnitario: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm tabular-nums text-text-secondary">
                        Importe: {formatearDinero(Number.isFinite(importe) ? importe : 0, moneda)}
                      </p>
                      <button type="button" disabled={items.length === 1}
                        onClick={() => setItems((prev) => prev.filter((fila) => fila.key !== it.key))}
                        className="flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40"
                        aria-label={`Quitar concepto ${indice + 1}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </fieldset>
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
                <dt><label htmlFor="impuesto">Impuesto</label></dt>
                <dd>
                  <input
                    id="impuesto"
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
          <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-500">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={guardando}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
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

      <aside className="min-w-0 lg:sticky lg:top-24" aria-label="Vista previa del recibo">
        <div className="exp-portada relative overflow-hidden rounded-2xl border border-line-dark p-5 text-white shadow-card" style={{ paddingBottom: "1.25rem" }}>
          <div className="exp-velo pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-base font-semibold">Vista previa</h2>
            <p className="mt-1 text-xs text-white/75">Lo que verá el cliente</p>
            <div className="relative mt-4">
              <div className="exp-halo pointer-events-none absolute" aria-hidden="true" />
              <Activador siempre key={repeticion}>
                <IlustracionServicio escena={escena} />
              </Activador>
            </div>
            <button type="button" onClick={() => setRepeticion((valor) => valor + 1)}
              className="min-h-11 rounded-full border border-line-dark-strong bg-surface-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface-dark-hover">
              Repetir animación
            </button>
            {escena.chips.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-medium text-white/75">Lo que hicimos</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {escena.chips.map((chip) => (
                    <li key={chip} className="rounded-full bg-primary-light px-3 py-1.5 text-xs font-medium text-primary">{chip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div role="status" aria-live="polite" className="mt-3 space-y-2">
          {avisosVistaPrevia.map((aviso) => (
            <p key={aviso} className="rounded-lg border border-border bg-surface p-3 text-xs leading-relaxed text-text-secondary">{aviso}</p>
          ))}
        </div>
      </aside>
    </div>
  )
}
