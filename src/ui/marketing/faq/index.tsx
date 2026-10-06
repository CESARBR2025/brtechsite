"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"
import { evento } from "@/src/ui/analitica"

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
    <section id="faq" className="relative scroll-mt-24 overflow-clip bg-bg-section py-12 sm:py-24">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        {/* Encabezado centrado; las preguntas van debajo */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Preguntas frecuentes
            <span className="h-px w-8 bg-primary" />
          </p>
          <h2 className="mt-4 text-balance font-display text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:mt-5 sm:text-5xl">
            Lo que suelen preguntarnos
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-text-secondary sm:mt-5 sm:text-base">
            ¿Tu duda no está aquí? Cuéntanos de tu negocio y te respondemos.
          </p>
          <Link
            href="/contacto"
            {...evento("agendar-consulta", { origen: "faq" })}
            className="group mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold text-primary sm:mt-6 outline-none transition-colors hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-primary"
          >
            Escríbenos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dos columnas en escritorio, una en celular; items-start: abrir una no estira a su vecina */}
        {/* Celular: una lista agrupada con divisores; desde md, tarjetas en dos columnas */}
        <ul className="mt-6 grid items-start divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-card md:mt-12 md:grid-cols-2 md:gap-4 md:divide-y-0 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent md:shadow-none">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            const idPregunta = `${base}-p${i}`
            const idRespuesta = `${base}-r${i}`
            return (
              <li
                key={faq.q}
                className={`px-4 transition-all md:rounded-2xl md:border md:bg-surface md:px-6 ${
                  isOpen ? "md:border-primary/30 md:shadow-hover" : "md:border-border md:shadow-card md:hover:border-primary/20"
                }`}
              >
                <h3>
                  <button
                    id={idPregunta}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={idRespuesta}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="group flex min-h-14 w-full items-center justify-between gap-4 py-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary md:gap-5 md:py-5"
                  >
                    <span
                      className={`text-[15px] font-medium leading-snug transition-colors md:text-base ${
                        isOpen ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-all md:h-8 md:w-8 ${
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
                    <p className="pb-4 pr-10 text-pretty text-sm leading-relaxed text-text-secondary md:pb-5 md:pr-12">
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
