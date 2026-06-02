"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

const faqs = [
  {
    q: "¿Cuánto cuesta un proyecto?",
    a: "Depende de complejidad. Nuestro rango es $3,000 — $15,000 por proyecto. Ofrecemos cotización gratuita.",
  },
  {
    q: "¿Cuánto toma?",
    a: "30-60 días típicamente. Dependiendo de problema y tu disponibilidad.",
  },
  {
    q: "¿Necesito conocimientos técnicos?",
    a: "No. Nuestro equipo maneja todo técnico. Nosotros capacitamos tu equipo para mantenerlo después.",
  },
  {
    q: "¿Y después del proyecto?",
    a: "Incluye 6 meses de soporte. Después, ofrecemos plan de soporte opcional o trabajas con tu equipo.",
  },
  {
    q: "¿Garantizan los resultados?",
    a: "Garantizamos entrega técnica de calidad. Los resultados de negocio (ventas, ahorro) dependen de ejecución de tu lado también.",
  },
  {
    q: "¿Hacen soporte 24/7?",
    a: "No. Ofrecemos soporte de horario comercial. Para emergencias críticas, tenemos plan premium.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-xs font-medium text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </div>
          <h2 className="mt-4 text-[22px] font-bold text-text-primary sm:text-3xl">
            Preguntas Frecuentes
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isOpen
                    ? "border-primary/30 shadow-hover"
                    : "border-border shadow-card"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-bg-section"
                >
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isOpen ? "text-primary" : "text-text-primary"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                      isOpen
                        ? "bg-primary text-white rotate-180"
                        : "bg-bg-section text-text-secondary"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
                <div
                  className={`transition-all ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {isOpen && (
                    <div className="border-t border-border/50 px-6 pb-5 pt-3">
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
