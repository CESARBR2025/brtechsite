"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2 } from "lucide-react"
import { crearLevantamiento } from "@/src/modules/levantamientos/infrastructure/acciones-levantamientos"
import { Campo } from "./campos"

function hoyLocal(): string {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

/** Alta rápida al empezar la reunión; el resto se captura en el editor. */
export function FormularioNuevoLevantamiento() {
  const router = useRouter()
  const [creando, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [clienteNombre, setClienteNombre] = useState("")
  const [contactoNombre, setContactoNombre] = useState("")
  const [clienteContacto, setClienteContacto] = useState("")
  const [proyectoNombre, setProyectoNombre] = useState("")
  const [fechaReunion, setFechaReunion] = useState(hoyLocal)

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const r = await crearLevantamiento({
        clienteNombre,
        contactoNombre: contactoNombre || null,
        clienteContacto: clienteContacto || null,
        proyectoNombre: proyectoNombre || null,
        fechaReunion,
      })
      if (!r.ok || !r.id) {
        setError(r.error ?? "No se pudo crear.")
        return
      }
      router.push(`/panel/levantamientos/${r.id}`)
    })
  }

  return (
    <form
      onSubmit={enviar}
      className="space-y-4 rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-6"
    >
      <Campo
        etiqueta="Negocio o empresa"
        requerido
        placeholder="Tostadas Don Beto, Clínica Sonrisa…"
        valor={clienteNombre}
        onChange={setClienteNombre}
      />
      <Campo
        etiqueta="Nombre del contacto"
        placeholder="Con quién es la reunión"
        valor={contactoNombre}
        onChange={setContactoNombre}
      />
      <Campo
        etiqueta="WhatsApp o correo"
        tipo="tel"
        placeholder="Para enviarle su diagnóstico"
        valor={clienteContacto}
        onChange={setClienteContacto}
      />
      <Campo
        etiqueta="Nombre de trabajo del proyecto"
        placeholder="Control de inventario, agenda de citas…"
        valor={proyectoNombre}
        onChange={setProyectoNombre}
      />
      <Campo
        etiqueta="Fecha de la reunión"
        tipo="date"
        requerido
        valor={fechaReunion}
        onChange={setFechaReunion}
      />

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={creando || !clienteNombre.trim()}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
      >
        {creando ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Creando…
          </>
        ) : (
          <>
            Empezar captura
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  )
}
