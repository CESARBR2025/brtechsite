"use client"

import { useState } from "react"
import { Send, User, Mail, MessageSquare, CheckCircle, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { enviarMensajeContacto } from "@/src/modules/contacto/infrastructure/acciones-contacto"

const reasons = [
  "Diagnóstico gratis de tu negocio",
  "Propuesta personalizada en 48 horas",
  "Sin contrato ni compromiso inicial",
]

export function ContactForm() {
  const [sent, setSent] = useState(false)
  // Estado para bloquear el botón y mostrar un spinner mientras se envía
  const [isPending, setIsPending] = useState(false)
  // Estado opcional por si quieres capturar y mostrar un error si falla Resend
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await enviarMensajeContacto(formData)

    setIsPending(false)

    if (result.success) {
      setSent(true)
    } else {
      setError(result.error || "Hubo un error al enviar el mensaje.")
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-success/20 bg-gradient-to-br from-surface to-success-light/30 px-6 py-12 text-center shadow-card">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-white shadow-lg shadow-success/25">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h3 className="mt-6 text-xl font-bold text-text-primary">
          ¡Mensaje enviado con éxito!
        </h3>
        <p className="mt-2 text-sm text-text-secondary">
          Gracias por escribirnos. Nuestro equipo te responderá en menos de 24
          horas.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-full bg-success-light px-4 py-2 text-xs font-medium text-success">
          <Sparkles className="h-3.5 w-3.5" />
          Mientras tanto, revisa nuestro blog
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            Envíanos un mensaje
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Cuéntanos en qué podemos ayudarte
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 text-xs font-medium text-primary">
          <CheckCircle className="h-3.5 w-3.5" />
          Respuesta rápida
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {reasons.map((r) => (
          <div
            key={r}
            className="flex items-center gap-2 rounded-lg bg-bg-section px-3 py-2 text-xs text-text-secondary"
          >
            <CheckCircle className="h-3.5 w-3.5 shrink-0 text-success" />
            {r}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 text-text-muted" />
            </div>
            {/* 3. AÑADIDO: name="name" */}
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Nombre completo"
              className="w-full rounded-lg border border-border py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder-text-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-4 w-4 text-text-muted" />
            </div>
            {/* 3. AÑADIDO: name="email" */}
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Correo electrónico"
              className="w-full rounded-lg border border-border py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder-text-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 flex items-start pt-3 pl-3">
            <MessageSquare className="h-4 w-4 text-text-muted" />
          </div>
          {/* 3. AÑADIDO: name="message" */}
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="Cuéntanos sobre tu proyecto o lo que necesitas..."
            className="w-full resize-y rounded-lg border border-border py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder-text-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
        </div>

        {/* Alerta visual en caso de que ocurra un error con Resend en Vercel */}
        {error && (
          <div className="p-3 text-xs font-medium rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-muted">
            Te responderemos en menos de 24 horas
          </p>
          <button
            type="submit"
            disabled={isPending} // Deshabilitar mientras envía
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl active:scale-[0.98] sm:w-auto disabled:opacity-70 disabled:pointer-events-none"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar Mensaje
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}