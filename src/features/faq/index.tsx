"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

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
    <section id="faq" className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[22px] font-bold text-text-primary sm:text-3xl">
          Preguntas Frecuentes
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="rounded-lg border border-border bg-surface shadow-card"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-text-primary">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border px-5 pb-4 pt-3">
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
