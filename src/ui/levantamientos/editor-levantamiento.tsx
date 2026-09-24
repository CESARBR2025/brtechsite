"use client"

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  Check,
  ChevronDown,
  CloudUpload,
  Lock,
  Loader2,
} from "lucide-react"
import {
  archivarLevantamiento,
  confirmarLevantamiento,
  despublicarLevantamiento,
  guardarLevantamiento,
  publicarLevantamiento,
} from "@/src/modules/levantamientos/infrastructure/acciones-levantamientos"
import type { ResultadoAccion } from "@/src/modules/levantamientos/infrastructure/tipos"
import type { LevantamientoDetalleDTO } from "@/src/modules/levantamientos/application/dtos"
import {
  type ClaveSeccion,
  type Contenido,
  completitud,
  SECCIONES,
} from "@/src/modules/levantamientos/domain/contenido"
import { GUIA_SECCION } from "./etiquetas"
import { CuerpoSeccion, type Generales } from "./secciones-captura"

type EstadoGuardado = "guardado" | "pendiente" | "guardando" | "error"

const ESPERA_MS = 1200

const BTN =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"

function hora(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit" }).format(
    new Date(iso),
  )
}

/**
 * Captura del levantamiento durante la reunión. Guarda solo: cada cambio
 * programa un guardado a los 1.2 s y los guardados van en serie (nunca dos a
 * la vez, para que uno viejo no pise a uno nuevo). También guarda al salir
 * de la pestaña, que en el celular pasa cada vez que se cambia a WhatsApp.
 */
export function EditorLevantamiento({
  inicial,
  urlPublica,
  enlaceWhatsApp,
}: {
  inicial: LevantamientoDetalleDTO
  urlPublica: string
  enlaceWhatsApp: string
}) {
  const router = useRouter()
  const soloLectura = inicial.estado === "archivado"

  const [generales, setGenerales] = useState<Generales>({
    clienteNombre: inicial.cliente.nombre,
    clienteContacto: inicial.cliente.contacto ?? "",
    proyectoNombre: inicial.proyectoNombre ?? "",
    fechaReunion: inicial.fechaReunion,
  })
  const [contenido, setContenido] = useState<Contenido>(inicial.contenido)
  const [abiertas, setAbiertas] = useState<Set<ClaveSeccion>>(() => {
    const primera = SECCIONES.find((s) => !inicial.completitud[s.clave])
    return new Set([primera?.clave ?? "contexto"])
  })

  const [estado, setEstado] = useState<EstadoGuardado>("guardado")
  const [ultimoGuardado, setUltimoGuardado] = useState(inicial.actualizadoEn)
  const [error, setError] = useState<string | null>(null)

  // Estado de guardado fuera de React para no depender de renders
  const datos = useRef({ generales, contenido })
  const version = useRef(0)
  const versionGuardada = useRef(0)
  const enVuelo = useRef<Promise<boolean> | null>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)
  const errorGuardado = useRef<string | null>(null)

  const guardarAhora = useCallback(async (): Promise<boolean> => {
    if (temporizador.current) clearTimeout(temporizador.current)
    while (enVuelo.current) await enVuelo.current
    if (version.current === versionGuardada.current) return true

    const v = version.current
    const { generales: g, contenido: c } = datos.current
    const envio = (async () => {
      setEstado("guardando")
      let r: ResultadoAccion
      try {
        r = await guardarLevantamiento(inicial.id, {
          generales: {
            clienteNombre: g.clienteNombre,
            clienteContacto: g.clienteContacto || null,
            proyectoNombre: g.proyectoNombre || null,
            fechaReunion: g.fechaReunion,
          },
          contenido: c,
        })
      } catch {
        r = { ok: false, error: "Sin conexión. Se reintentará al siguiente cambio." }
      }
      if (!r.ok) {
        errorGuardado.current = r.error ?? "No se pudo guardar."
        setError(errorGuardado.current)
        setEstado("error")
        return false
      }
      versionGuardada.current = v
      errorGuardado.current = null
      setError(null)
      if (r.actualizadoEn) setUltimoGuardado(r.actualizadoEn)
      setEstado(version.current === v ? "guardado" : "pendiente")
      return true
    })()
    enVuelo.current = envio
    try {
      return await envio
    } finally {
      enVuelo.current = null
    }
  }, [inicial.id])

  const marcarCambio = useCallback(() => {
    version.current += 1
    setEstado("pendiente")
    if (temporizador.current) clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => void guardarAhora(), ESPERA_MS)
  }, [guardarAhora])

  const cambiar = useCallback(
    (fn: (c: Contenido) => Contenido) => {
      const siguiente = fn(datos.current.contenido)
      datos.current = { ...datos.current, contenido: siguiente }
      setContenido(siguiente)
      marcarCambio()
    },
    [marcarCambio],
  )

  const cambiarGenerales = useCallback(
    (parcial: Partial<Generales>) => {
      const siguiente = { ...datos.current.generales, ...parcial }
      datos.current = { ...datos.current, generales: siguiente }
      setGenerales(siguiente)
      marcarCambio()
    },
    [marcarCambio],
  )

  useEffect(() => {
    const alOcultar = () => {
      if (document.visibilityState === "hidden") void guardarAhora()
    }
    const alSalir = (e: BeforeUnloadEvent) => {
      if (version.current !== versionGuardada.current) e.preventDefault()
    }
    document.addEventListener("visibilitychange", alOcultar)
    window.addEventListener("beforeunload", alSalir)
    return () => {
      document.removeEventListener("visibilitychange", alOcultar)
      window.removeEventListener("beforeunload", alSalir)
    }
  }, [guardarAhora])

  const hechas = useMemo(() => completitud(contenido), [contenido])
  const totalHechas = SECCIONES.filter((s) => hechas[s.clave]).length

  function alternar(clave: ClaveSeccion) {
    setAbiertas((prev) => {
      const s = new Set(prev)
      if (s.has(clave)) s.delete(clave)
      else s.add(clave)
      return s
    })
  }

  function irA(clave: ClaveSeccion) {
    setAbiertas((prev) => new Set(prev).add(clave))
    requestAnimationFrame(() =>
      document.getElementById(`seccion-${clave}`)?.scrollIntoView({ block: "start" }),
    )
  }

  return (
    <div>
      <BarraEstado
        estado={estado}
        error={error}
        ultimoGuardado={ultimoGuardado}
        soloLectura={soloLectura}
        onReintentar={() => void guardarAhora()}
        hechas={hechas}
        totalHechas={totalHechas}
        onIrA={irA}
      />

      <AccionesLevantamiento
        dto={inicial}
        urlPublica={urlPublica}
        enlaceWhatsApp={enlaceWhatsApp}
        antesDeCambiar={guardarAhora}
        motivoFallo={() => errorGuardado.current}
        onHecho={() => router.refresh()}
      />

      <fieldset disabled={soloLectura} className="mt-6 space-y-3">
        {SECCIONES.map((s, i) => {
          const abierta = abiertas.has(s.clave)
          return (
            <section
              key={s.clave}
              id={`seccion-${s.clave}`}
              className="scroll-mt-36 overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
            >
              <button
                type="button"
                onClick={() => alternar(s.clave)}
                aria-expanded={abierta}
                className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-6"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs tabular-nums transition-colors ${
                    hechas[s.clave]
                      ? "bg-success-light text-success"
                      : "bg-bg-section text-text-muted ring-1 ring-inset ring-border"
                  }`}
                >
                  {hechas[s.clave] ? <Check className="h-4 w-4" /> : String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-base font-semibold text-text-primary">
                    {s.titulo}
                    {!s.publica && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning">
                        <Lock className="h-3 w-3" /> Solo interno
                      </span>
                    )}
                  </span>
                  {abierta && (
                    <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">
                      {GUIA_SECCION[s.clave]}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-text-muted transition-transform ${
                    abierta ? "rotate-180" : ""
                  }`}
                />
              </button>
              {abierta && (
                <div className="border-t border-border px-4 pb-6 pt-5 sm:px-6">
                  <CuerpoSeccion
                    clave={s.clave}
                    c={contenido}
                    cambiar={cambiar}
                    generales={generales}
                    cambiarGenerales={cambiarGenerales}
                  />
                </div>
              )}
            </section>
          )
        })}
      </fieldset>
    </div>
  )
}

function BarraEstado({
  estado,
  error,
  ultimoGuardado,
  soloLectura,
  onReintentar,
  hechas,
  totalHechas,
  onIrA,
}: {
  estado: EstadoGuardado
  error: string | null
  ultimoGuardado: string
  soloLectura: boolean
  onReintentar: () => void
  hechas: Record<ClaveSeccion, boolean>
  totalHechas: number
  onIrA: (clave: ClaveSeccion) => void
}) {
  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-border bg-bg-section/90 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex max-w-3xl items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex gap-1" aria-label={`${totalHechas} de ${SECCIONES.length} secciones con información`}>
            {SECCIONES.map((s) => (
              <button
                key={s.clave}
                type="button"
                title={s.titulo}
                onClick={() => onIrA(s.clave)}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  hechas[s.clave] ? "bg-primary" : "bg-border hover:bg-primary/40"
                }`}
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-text-muted">
            {totalHechas} de {SECCIONES.length} secciones
          </p>
        </div>

        {soloLectura ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
            <Lock className="h-3.5 w-3.5" /> Archivado
          </span>
        ) : estado === "error" ? (
          <button
            type="button"
            onClick={onReintentar}
            title={error ?? undefined}
            className="inline-flex max-w-[55%] items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-500"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{error ?? "Error"} · Reintentar</span>
          </button>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-text-muted">
            {estado === "guardado" ? (
              <>
                <Check className="h-3.5 w-3.5 text-success" /> Guardado {hora(ultimoGuardado)}
              </>
            ) : estado === "guardando" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Guardando…
              </>
            ) : (
              <>
                <CloudUpload className="h-3.5 w-3.5" /> Sin guardar
              </>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

function AccionesLevantamiento({
  dto,
  urlPublica,
  enlaceWhatsApp,
  antesDeCambiar,
  motivoFallo,
  onHecho,
}: {
  dto: LevantamientoDetalleDTO
  /** Motivo del último guardado fallido (se lee en el momento, no en el render). */
  motivoFallo: () => string | null
  urlPublica: string
  enlaceWhatsApp: string
  antesDeCambiar: () => Promise<boolean>
  onHecho: () => void
}) {
  const [pendiente, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const publicado = dto.estado === "publicado"
  const archivado = dto.estado === "archivado"

  function correr(fn: () => Promise<ResultadoAccion>) {
    setError(null)
    startTransition(async () => {
      if (!(await antesDeCambiar())) {
        setError(
          `No se pudo guardar lo pendiente, así que no se aplicó la acción: ${
            motivoFallo() ?? "error desconocido"
          }`,
        )
        return
      }
      const r = await fn()
      if (!r.ok) setError(r.error ?? "No se pudo completar la acción.")
      else onHecho()
    })
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(urlPublica)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      /* portapapeles no disponible */
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Diagnóstico del cliente</h2>
          <p className="mt-0.5 text-xs text-text-muted">
            {publicado
              ? "Visible en su enlace. Los cambios que guardes se ven al recargar."
              : "Solo es visible en su enlace cuando está publicado."}
          </p>
        </div>
        {!archivado && (
          <button
            type="button"
            disabled={pendiente}
            onClick={() => correr(() => confirmarLevantamiento(dto.id, !dto.confirmadoEn))}
            aria-pressed={dto.confirmadoEn !== null}
            className={`${BTN} ${
              dto.confirmadoEn
                ? "bg-success-light text-success"
                : "border border-border bg-surface text-text-secondary hover:bg-bg-section"
            }`}
          >
            <Check className="h-4 w-4" />
            {dto.confirmadoEn ? "Confirmado por el cliente" : "Marcar como confirmado"}
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {publicado ? (
          <>
            <a
              href={enlaceWhatsApp}
              target="_blank"
              rel="noreferrer"
              className={`${BTN} bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover`}
            >
              Enviar por WhatsApp
            </a>
            <button
              type="button"
              onClick={copiar}
              className={`${BTN} bg-primary-light text-primary hover:bg-primary hover:text-white`}
            >
              {copiado ? "Enlace copiado" : "Copiar enlace"}
            </button>
            <a
              href={urlPublica}
              target="_blank"
              rel="noreferrer"
              className={`${BTN} border border-border bg-surface text-text-secondary hover:bg-bg-section`}
            >
              Ver diagnóstico
            </a>
            <button
              type="button"
              disabled={pendiente}
              onClick={() => correr(() => despublicarLevantamiento(dto.id))}
              className={`${BTN} text-text-muted hover:bg-bg-section`}
            >
              Despublicar
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={pendiente || archivado}
            onClick={() => correr(() => publicarLevantamiento(dto.id))}
            className={`${BTN} bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover`}
          >
            {pendiente && <Loader2 className="h-4 w-4 animate-spin" />}
            Publicar diagnóstico
          </button>
        )}
        {!archivado && (
          <button
            type="button"
            disabled={pendiente}
            onClick={() => {
              if (confirm("¿Archivar este levantamiento? Dejará de ser visible y ya no se podrá editar.")) {
                correr(() => archivarLevantamiento(dto.id))
              }
            }}
            className={`${BTN} ml-auto text-text-muted hover:bg-red-500/10 hover:text-red-500`}
          >
            Archivar
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </section>
  )
}
