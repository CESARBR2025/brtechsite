"use client"

import { useState } from "react"
import { ChevronDown, Check, Building2, Target, Star } from "lucide-react"

const cases = [
  {
    company: "Distribuidora del Centro",
    industry: "Retail",
    challenge:
      "Vendía solo en tienda física, competencia online le comía mercado",
    solution: "E-commerce profesional + inventory sync",
    results: [
      "150K USD en ventas online primer trimestre",
      "Reducción de costos operativos 30%",
      "Expansión a 2 ciudades nuevas",
    ],
    testimonial:
      "Pasamos de no tener presencia online a ser referencia en nuestro sector. El equipo está feliz.",
    author: "J.M., Dueño Distribuidora del Centro",
  },
]

export function CasesSection() {
  const [expanded, setExpanded] = useState<number | null>(0)

  return (
    <section className="bg-bg-section py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Social Proof
          </p>
          <h2 className="mt-2 text-[22px] font-bold text-text-primary sm:text-3xl">
            Resultados Reales de Clientes Reales
          </h2>
        </div>
        <div className="mt-12 grid gap-6">
          {cases.map((c, i) => {
            const isOpen = expanded === i
            return (
              <div
                key={c.company}
                className="rounded-xl border border-border bg-surface shadow-card transition-all hover:shadow-hover"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-text-primary">
                        {c.company}
                      </h3>
                      <p className="mt-0.5 text-sm text-text-secondary">
                        {c.industry} — {c.solution}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-text-secondary transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border px-5 pb-5 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
                          <Target className="h-3.5 w-3.5" />
                          Desafío
                        </div>
                        <p className="mt-1 text-sm text-text-primary">
                          {c.challenge}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
                          <Star className="h-3.5 w-3.5" />
                          Resultados
                        </div>
                        <ul className="mt-1 space-y-1">
                          {c.results.map((r) => (
                            <li
                              key={r}
                              className="flex items-start gap-1.5 text-sm text-text-primary"
                            >
                              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 rounded-xl bg-primary-light/50 p-4">
                      <p className="text-sm italic text-text-secondary">
                        &ldquo;{c.testimonial}&rdquo;
                      </p>
                      <p className="mt-2 text-xs font-medium text-text-muted">
                        — {c.author}
                      </p>
                    </div>
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
