"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2 } from "lucide-react"
import { crearProyecto } from "@/src/modules/proyectos/infrastructure/acciones-proyectos"
import { Campo } from "@/src/ui/levantamientos/campos"
import { Selector } from "./campos"

function hoyLocal(): string {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export interface OpcionLevantamiento {
  id: string
  folio: string
  clienteNombre: string
  proyectoNombre: string | null
}

/**
 * Alta del proyecto. Si parte de un levantamiento, hereda cliente, contacto,
 * promesa y roles; lo demás se captura en el editor.
 */
export function FormularioNuevoProyecto({
  levantamientos,
  levantamientoInicial,
}: {
  levantamientos: OpcionLevantamiento[]
  levantamientoInicial: string | null
}) {
  const router = useRouter()
  const [creando, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [levantamientoId, setLevantamientoId] = useState<string | null>(levantamientoInicial)
  const [clienteNombre, setClienteNombre] = useState("")
  const [proyectoNombre, setProyectoNombre] = useState("")
  const [fechaPropuesta, setFechaPropuesta] = useState(hoyLocal)

  const origen = levantamientos.find((l) => l.id === levantamientoId) ?? null

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const r = await crearProyecto({
        levantamientoId,
        clienteNombre,
        proyectoNombre: proyectoNombre || null,
        fechaPropuesta,
      })
      if (!r.ok || !r.id) {
        setError(r.error ?? "No se pudo crear.")
        return
      }
      router.push(`/panel/proyectos/${r.id}`)
    })
  }

  return (
    <form
      onSubmit={enviar}
      className="space-y-4 rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-6"
    >
      <Selector
        etiqueta="A partir del levantamiento"
        opciones={levantamientos.map((l) => ({
          id: l.id,
          texto: `${l.folio} · ${l.clienteNombre}${l.proyectoNombre ? ` · ${l.proyectoNombre}` : ""}`,
        }))}
        valor={levantamientoId}
        onChange={setLevantamientoId}
        vacio="Ninguno (proyecto suelto)"
      />
      <Campo
        etiqueta="Cliente"
        requerido={!origen}
        placeholder={origen ? origen.clienteNombre : "Tostadas Tio Beto, Clínica Sonrisa…"}
        valor={clienteNombre}
        onChange={setClienteNombre}
      />
      <Campo
        etiqueta="Nombre del producto"
        placeholder={origen?.proyectoNombre ?? "Tostadas Tio Beto Soft"}
        valor={proyectoNombre}
        onChange={setProyectoNombre}
      />
      <Campo
        etiqueta="Fecha de la propuesta"
        tipo="date"
        requerido
        valor={fechaPropuesta}
        onChange={setFechaPropuesta}
      />
      {origen && (
        <p className="text-xs text-text-muted">
          Lo que dejes vacío se toma de {origen.folio}, junto con el contacto, la promesa y los roles.
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={creando || (!origen && !clienteNombre.trim())}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
      >
        {creando ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Creando…
          </>
        ) : (
          <>
            Crear proyecto
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  )
}
