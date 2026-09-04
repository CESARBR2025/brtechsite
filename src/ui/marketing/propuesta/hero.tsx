import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"

export function PropHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(225,67,14,0.12)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(225,67,14,0.08)_0%,transparent_50%)]" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#E1430E]/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#E1430E]/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E1430E]" />
            Propuesta exclusiva para ti
          </div>

          <div className="mt-8 flex justify-center">
            <Image
              src="/parrillalogo.png"
              alt="Parrilla Norteña Soft"
              width={120}
              height={120}
              className="h-40 w-auto object-contain"
            />
          </div>

          <h1 className="mt-6 text-[32px] font-bold leading-tight text-white sm:text-4xl md:text-6xl">
            Parrilla{" "}
            <span className="bg-gradient-to-r from-[#E1430E] to-[#FF6B35] bg-clip-text text-transparent">
              Norteña Soft
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-300 sm:text-xl">
            Un sistema hecho para que dejes de perder dinero por errores humanos
            y tengas control total de tu restaurante en tiempo real.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
            <p className="text-base leading-relaxed text-gray-300">
              Sabemos cómo es un restaurante en operación: mesas llenas, presión
              constante, decisiones rápidas… y pequeños errores que al final del
              día se convierten en dinero perdido.
            </p>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-lg font-semibold text-white">
                Esto no es un sistema complicado.
              </p>
              <p className="mt-1 text-base text-[#FF6B35]">
                Es una forma de darte control total del negocio mientras tú estás
                tranquilo, incluso desde tu casa.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#calculadora"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E1430E] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#E1430E]/30 transition-all hover:bg-[#C93A0C] hover:shadow-xl hover:shadow-[#E1430E]/40 active:scale-[0.98] sm:w-auto"
            >
              Ver cuánto estás perdiendo
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#solucion"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-medium text-gray-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white sm:w-auto"
            >
              Entender la propuesta
            </Link>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="#problema"
              className="flex flex-col items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-300"
            >
              <span>Descubre más</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
