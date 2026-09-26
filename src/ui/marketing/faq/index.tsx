"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"

const faqs = [
  {
    q: "¿Cuánto cuesta un proyecto?",
    a: "Depende del alcance: cada sistema se cotiza según cómo opera tu negocio. La cotización es gratuita y sin compromiso.",
  },
  {
    q: "¿Cuánto tiempo toma?",
    a: "Entre 30 y 60 días en la mayoría de los proyectos. El plazo exacto depende del alcance y de la disponibilidad de tu equipo para validar los avances.",
  },
  {
    q: "¿Necesito conocimientos técnicos?",
    a: "No. Nos encargamos de toda la parte técnica y capacitamos a tu equipo para que opere el sistema con confianza desde el primer día.",
  },
  {
    q: "¿Qué pasa al terminar el proyecto?",
    a: "Cada proyecto incluye 6 meses de soporte. Después puedes contratar un plan de soporte continuo o seguir con tu propio equipo.",
  },
  {
    q: "¿Garantizan los resultados?",
    a: "Garantizamos un sistema que funciona como se acordó y que resuelve el problema definido. Los resultados de negocio se construyen en conjunto: te acompañamos en la adopción para que el sistema se aproveche a fondo.",
  },
  {
    q: "¿En qué horario dan soporte?",
    a: "En horario comercial, de lunes a viernes. Para operaciones críticas ofrecemos un plan premium con atención a emergencias.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const base = useId()

  return (
    <section id="faq" className="relative scroll-mt-24 overflow-clip bg-surface py-24 sm:py-32">

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Preguntas frecuentes
          </p>
          <h2 className="mt-5 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-5xl">
            Lo que suelen preguntarnos
          </h2>
          <p className="mt-5 max-w-sm text-pretty text-base leading-relaxed text-text-secondary">
            ¿Tu duda no está aquí? Cuéntanos de tu negocio y te respondemos.
          </p>
          <Link
            href="/contacto"
            className="group mt-8 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary outline-none transition-colors hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-primary"
          >
            Escríbenos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className="divide-y divide-border border-y border-border">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            const idPregunta = `${base}-p${i}`
            const idRespuesta = `${base}-r${i}`
            return (
              <li key={faq.q}>
                <h3>
                  <button
                    id={idPregunta}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={idRespuesta}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span
                      className={`text-base font-medium transition-colors sm:text-lg ${
                        isOpen ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all ${
                        isOpen
                          ? "rotate-45 border-primary bg-primary text-white"
                          : "border-border text-text-muted group-hover:border-primary/40 group-hover:text-primary"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={idRespuesta}
                  role="region"
                  aria-labelledby={idPregunta}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 pr-14 text-pretty text-sm leading-relaxed text-text-secondary sm:text-base">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
