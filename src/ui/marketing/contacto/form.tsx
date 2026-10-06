"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, HelpCircle, Loader2, Mail, MessageSquare, Phone, User } from "lucide-react"
import { enviarMensajeContacto } from "@/src/modules/contacto/infrastructure/acciones-contacto"
import { servicios } from "@/src/ui/marketing/servicios/datos"
import { BotonEspecular } from "@/src/ui/primitivos/boton-especular"
import { registrarEvento } from "@/src/ui/analitica"

/*
 * Formulario de contacto (panel claro de la tarjeta). "¿Qué te interesa?" usa
 * el `id` de cada servicio: son los mismos valores que valida el dominio
 * (`INTERESES` en modules/contacto/domain), más "otro". Llega preseleccionado
 * con ?interes=<id> desde los botones "Cotiza este servicio".
 */

const intereses = [
  ...servicios.map((s) => ({ valor: s.id, etiqueta: s.pestana, icono: s.icono })),
  { valor: "otro", etiqueta: "Otro / aún no sé", icono: HelpCircle },
]

const campo =
  "w-full rounded-xl border border-border bg-bg-section py-3.5 pl-10 pr-3 text-base text-text-primary placeholder:text-text-muted/70 transition-all hover:border-primary/30 focus:border-primary focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/10 sm:py-3 sm:text-sm"

const etiqueta = "mb-2 block text-xs font-semibold text-text-secondary"

const icono = "pointer-events-none absolute left-3.5 h-4 w-4 text-text-muted"

export function ContactForm({ interesInicial }: { interesInicial?: string }) {
  const [sent, setSent] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inicial = intereses.some((i) => i.valor === interesInicial) ? interesInicial : null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const datos = new FormData(e.currentTarget)
    const result = await enviarMensajeContacto(datos)

    setIsPending(false)
    if (result.success) {
      registrarEvento("contacto-enviado", {
        interes: String(datos.get("interes") ?? "") || "sin-elegir",
        whatsapp: datos.get("telefono") ? "si" : "no",
      })
      setSent(true)
    } else {
      setError(result.error || "Hubo un error al enviar el mensaje.")
    }
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-center justify-center px-6 py-20 text-center sm:px-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-lg shadow-success/25">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-text-primary">Mensaje enviado</h2>
        <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-text-secondary sm:text-base">
          Gracias por escribirnos. Te responderemos en menos de 24 horas.
        </p>
        <Link
          href="/proyectos/parrilla-nortena"
          className="group/enlace mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary outline-none transition-all hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
        >
          Mientras tanto, conoce nuestro último proyecto
          <ArrowRight className="h-4 w-4 transition-transform group-hover/enlace:translate-x-1" />
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-10">
      <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Envíanos un mensaje</h2>
      <p className="mt-2 text-sm text-text-secondary sm:text-base">Cuéntanos en qué podemos ayudarte.</p>

      {/* data-clarity-mask: lo que escribe el visitante no aparece en las grabaciones */}
      <form onSubmit={handleSubmit} data-clarity-mask="true" className="mt-8 space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={etiqueta}>
              Nombre completo
            </label>
            <div className="relative flex items-center">
              <User className={icono} />
              <input id="name" name="name" type="text" required autoComplete="name" placeholder="Tu nombre" className={campo} />
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
          <label htmlFor="telefono" className={etiqueta}>
            WhatsApp <span className="font-normal text-text-muted">(opcional)</span>
          </label>
          <div className="relative flex items-center sm:max-w-[calc(50%-0.625rem)]">
            <Phone className={icono} />
            <input
              id="telefono"
              name="telefono"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="10 dígitos"
              className={campo}
            />
          </div>
        </div>

        <fieldset>
          <legend className={etiqueta}>
            ¿Qué te interesa? <span className="font-normal text-text-muted">(opcional)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {intereses.map((i) => (
              <label
                key={i.valor}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-primary/30 hover:text-text-primary has-[:checked]:border-primary has-[:checked]:bg-primary-light has-[:checked]:text-primary-hover has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary"
              >
                <input
                  type="radio"
                  name="interes"
                  value={i.valor}
                  defaultChecked={i.valor === inicial}
                  className="sr-only"
                />
                <i.icono className="h-4 w-4" aria-hidden="true" />
                {i.etiqueta}
              </label>
            ))}
          </div>
        </fieldset>

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
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-text-muted">
            Te responderemos en menos de 24 horas.
            <br />
            Al enviar aceptas nuestro{" "}
            <Link href="/privacidad" className="font-medium text-primary underline-offset-4 hover:underline">
              aviso de privacidad
            </Link>
            .
          </p>
          <BotonEspecular
            type="submit"
            disabled={isPending}
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
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
  )
}
