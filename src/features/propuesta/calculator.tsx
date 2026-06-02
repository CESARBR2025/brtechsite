"use client"

import { useState } from "react"
import { TrendingDown, CalendarDays, BarChart3, AlertCircle } from "lucide-react"

export function PropCalculator() {
  const [merma, setMerma] = useState(40)

  const mensual = merma * 30
  const anual = merma * 365
  const tresAnios = merma * 365 * 3

  const ahorroMensual = merma * 30 * 0.8
  const costoTotal = 7000 + 400 * 12
  const mesesRecuperar = Math.ceil((7000 + 400 * 12) / ahorroMensual)
  const beneficioAnual = ahorroMensual * 12 - 400 * 12

  const format = (n: number) =>
    "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " MXN"

  return (
    <section id="calculadora" className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white py-20 sm:py-28">
      <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-amber-100 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold text-amber-700">
            <TrendingDown className="h-3.5 w-3.5" />
            Calculadora de merma
          </div>
          <h2 className="mt-4 text-[26px] font-bold text-[#1A1A2E] sm:text-4xl">
            ¿Cuánto dinero estás perdiendo sin darte cuenta?
          </h2>
        </div>

        <div className="mt-10 rounded-2xl border border-amber-200 bg-white p-6 shadow-lg sm:p-8">
          <label className="text-sm font-semibold text-gray-700">
            Merma diaria estimada
          </label>
          <p className="mt-0.5 text-xs text-gray-400">
            ¿Cuánto calculas que se pierde al día en tu restaurante?
          </p>
          <div className="mt-3 flex items-center gap-4">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-medium text-gray-400">
                $
              </span>
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={merma}
                onChange={(e) => setMerma(Number(e.target.value))}
                className="w-full accent-[#E1430E]"
              />
            </div>
            <div className="flex h-12 w-24 items-center justify-center rounded-xl bg-amber-100 text-lg font-bold text-amber-700">
              ${merma}
            </div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-gray-400">
            <span>$10</span>
            <span>$200</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <CalendarDays className="h-6 w-6 text-red-500" />
            <p className="mt-3 text-xs font-medium text-gray-500">
              Pérdida mensual
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {format(mensual)}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {merma} × 30 días
            </p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <BarChart3 className="h-6 w-6 text-red-500" />
            <p className="mt-3 text-xs font-medium text-gray-500">
              Pérdida anual
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {format(anual)}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {merma} × 365 días
            </p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <p className="mt-3 text-xs font-medium text-gray-500">
              Pérdida a 3 años
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {format(tresAnios)}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {merma} × 365 × 3
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-2xl text-center">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-medium text-amber-800">
              Este dinero no es teórico.
            </p>
            <p className="mt-0.5 text-sm font-bold text-amber-900">
              Es dinero que hoy se está escapando del restaurante sin control.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-lg sm:p-8">
          <h3 className="text-center text-lg font-bold text-[#1A1A2E]">
            ¿Cuándo se paga el sistema solo?
          </h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Con una reducción del 80% en merma
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-white p-5 text-center">
              <p className="text-xs font-medium text-gray-500">
                Costo del sistema
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">
                $7,000 MXN
              </p>
              <p className="text-xs text-gray-400">+ $400/mes hosting</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-white p-5 text-center">
              <p className="text-xs font-medium text-gray-500">
                Ahorro mensual estimado
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">
                {format(ahorroMensual)}
              </p>
              <p className="text-xs text-gray-400">
                {merma} × 30 × 80%
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-emerald-100/50 p-4 text-center">
              <p className="text-xs font-medium text-gray-500">
                Meses para recuperar inversión
              </p>
              <p className="mt-1 text-xl font-bold text-emerald-700">
                {mesesRecuperar > 0 ? mesesRecuperar : "—"} meses
              </p>
            </div>
            <div className="rounded-xl bg-emerald-100/50 p-4 text-center">
              <p className="text-xs font-medium text-gray-500">
                Ahorro en 1 año
              </p>
              <p className="mt-1 text-xl font-bold text-emerald-700">
                {format(ahorroMensual * 12)}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-100/50 p-4 text-center">
              <p className="text-xs font-medium text-gray-500">
                Beneficio neto anual
              </p>
              <p className="mt-1 text-xl font-bold text-emerald-700">
                {format(beneficioAnual)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
