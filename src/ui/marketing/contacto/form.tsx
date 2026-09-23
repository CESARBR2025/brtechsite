"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Loader2, Mail, MessageSquare, User } from "lucide-react"
import { enviarMensajeContacto } from "@/src/modules/contacto/infrastructure/acciones-contacto"
import { BotonEspecular } from "@/src/ui/primitivos/boton-especular"

const campo =
  "w-full rounded-lg border border-line-dark-strong bg-white/[0.04] py-3 pl-10 pr-3 text-sm text-white placeholder-white/35 transition-all hover:border-white/25 focus:border-primary focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-primary/30"

const etiqueta = "mb-2 block text-xs font-medium text-white/65"

const icono = "pointer-events-none absolute left-3.5 h-4 w-4 text-white/35"

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const result = await enviarMensajeContacto(new FormData(e.currentTarget))

    setIsPending(false)
    if (result.success) {
      setSent(true)
    } else {
      setError(result.error || "Hubo un error al enviar el mensaje.")
    }
  }

  if (sent) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center rounded-2xl border border-line-dark bg-surface-dark px-6 py-16 text-center shadow-glow"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-lg shadow-success/25">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">
          Mensaje enviado
        </h2>
        <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-white/65 sm:text-base">
          Gracias por escribirnos. Te responderemos en menos de 24 horas.
        </p>
        <Link
          href="/#proyectos"
          className="group/enlace mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white outline-none transition-all hover:border-primary hover:bg-primary focus-visible:ring-2 focus-visible:ring-primary"
        >
          Mientras tanto, conoce nuestros proyectos
          <ArrowRight className="h-4 w-4 transition-transform group-hover/enlace:translate-x-1" />
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative rounded-2xl border border-line-dark bg-surface-dark p-6 backdrop-blur-sm sm:p-10">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <h2 className="text-2xl font-semibold tracking-tight text-white">Envíanos un mensaje</h2>
        <p className="mt-2 text-sm text-white/65 sm:text-base">
          Cuéntanos en qué podemos ayudarte.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={etiqueta}>
                Nombre completo
              </label>
              <div className="relative flex items-center">
                <User className={icono} />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Tu nombre"
                  className={campo}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className={etiqueta}>
                Correo electrónico
              </label>
              <div className="relative flex items-center">
                <Mail className={icono} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nombre@tunegocio.com"
                  className={campo}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="message" className={etiqueta}>
              ¿Qué necesitas?
            </label>
            <div className="relative">
              <MessageSquare className={`${icono} top-3.5`} />
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Cuéntanos sobre tu negocio y lo que te gustaría resolver"
                className={`${campo} resize-y`}
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-300"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/55">Te responderemos en menos de 24 horas.</p>
            <BotonEspecular
              type="submit"
              disabled={isPending}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  Enviar mensaje
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </BotonEspecular>
          </div>
        </form>
      </div>
    </div>
  )
}
