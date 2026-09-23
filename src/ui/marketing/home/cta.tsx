import Link from "next/link"
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react"
import { BotonEspecular } from "@/src/ui/primitivos/boton-especular"

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-hover" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_50%_40%,black_10%,transparent_75%)]" />
      <div className="absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_60%)] blur-2xl" />
      <div className="absolute left-1/2 top-1/3 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_120deg,transparent,rgba(255,255,255,0.10),transparent_40%)] blur-3xl motion-safe:animate-[spin_36s_linear_infinite]" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm shadow-lg">
          <Sparkles className="h-8 w-8 text-white" />
        </div>

        <h2 className="mt-6 text-balance text-[26px] font-bold tracking-tight text-white sm:text-[34px]">
          ¿Listo para llevar tu negocio al siguiente nivel?
        </h2>
        <p className="mt-4 text-base text-primary-light">
          Cuéntanos cómo funciona tu negocio por dentro y te proponemos la
          solución correcta.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BotonEspecular
            href="/contacto"
            baseColor="#F1EBFF"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl active:scale-[0.98] sm:w-auto"
          >
            Agendar Ahora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </BotonEspecular>
          <Link
            href="/#faq"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:w-auto"
          >
            ¿Preguntas antes? Lee nuestro FAQ
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
