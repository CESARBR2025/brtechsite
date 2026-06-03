"use client"

import { useState } from "react"
import { TrendingDown, DollarSign, CalendarDays, ArrowRight } from "lucide-react"

export function PropCalculator() {
  const [merma, setMerma] = useState(40)

  const mensual = merma * 30
  const anual = merma * 365
  const costoSistema = 7000
  const hostingAnual = 400 * 12
  const mesesRecuperar = Math.ceil(costoSistema / mensual)
  const ahorroRealAnual = anual - hostingAnual

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

        {/* Slider */}
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

        {/* Row 1: Costo del sistema | Pérdida mensual | Meses recuperar inversión */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <DollarSign className="h-6 w-6 text-sky-500" />
            <p className="mt-3 text-xs font-medium text-gray-500">
              Costo del sistema
            </p>
            <p className="mt-1 text-2xl font-bold text-sky-700">
              {format(costoSistema)}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              + $400/mes de hosting
            </p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <TrendingDown className="h-6 w-6 text-red-500" />
            <p className="mt-3 text-xs font-medium text-gray-500">
              Pérdida mensual actual
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {format(mensual)}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              ${merma} × 30 días
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
            <CalendarDays className="h-6 w-6 text-amber-500" />
            <p className="mt-3 text-xs font-medium text-gray-500">
              Meses para recuperar inversión
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-700">
              {mesesRecuperar > 0 ? mesesRecuperar : "—"} meses
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {format(costoSistema)} ÷ {format(mensual)}
            </p>
          </div>
        </div>

        {/* Awareness banner */}
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

        {/* Row 2: Hosting anual vs Merma anual */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 shadow-lg sm:p-8">
          <h3 className="text-center text-lg font-bold text-[#1A1A2E]">
            Hosting anual vs Merma anual
          </h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Lo que pagas de hosting al año frente a lo que pierdes actualmente
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-purple-200 bg-white p-5 text-center">
              <p className="text-xs font-medium text-gray-500">
                Hosting anual
              </p>
              <p className="mt-1 text-2xl font-bold text-purple-700">
                {format(hostingAnual)}
              </p>
              <p className="text-xs text-gray-400">$400 × 12 meses</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-white p-5 text-center">
              <p className="text-xs font-medium text-gray-500">
                Merma anual actual
              </p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {format(anual)}
              </p>
              <p className="text-xs text-gray-400">
                ${merma} × 365 días
              </p>
            </div>
          </div>
        </div>

        {/* Row 3: Ahorro real anual */}
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-lg sm:p-8">
          <h3 className="text-center text-lg font-bold text-[#1A1A2E]">
            Ahorro real anual
          </h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Lo que dejas de perder menos el costo del hosting
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500">Merma anual</p>
              <p className="text-xl font-bold text-red-600">{format(anual)}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
            <div className="text-center">
              <p className="text-xs font-medium text-gray-500">Hosting anual</p>
              <p className="text-xl font-bold text-purple-700">{format(hostingAnual)}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
            <div className="text-center">
              <p className="text-xs font-medium text-emerald-600">Ahorro real</p>
              <p className="text-2xl font-bold text-emerald-700">
                {format(ahorroRealAnual)}
              </p>
            </div>
          </div>
          <div className="mx-auto mt-4 max-w-md rounded-xl bg-emerald-100/50 p-4 text-center">
            <p className="text-xs font-medium text-gray-500">
              Beneficio neto anual
            </p>
            <p className="mt-0.5 text-3xl font-bold text-emerald-700">
              {format(ahorroRealAnual)}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {format(anual)} − {format(hostingAnual)}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
