import Image from "next/image"
import { ArrowRight, Lock } from "lucide-react"
import { BotonEspecular } from "@/src/ui/primitivos/boton-especular"

interface Props {
  etiqueta?: string
  titulo?: string
  texto?: string
  boton?: string
  href?: string
  nota?: string
  /** Muestra el botón apagado (sin enlace) y, opcionalmente, un enlace a lo que falta. */
  deshabilitado?: boolean
  enlaceSecundario?: { texto: string; href: string }
}

/** CTA de cierre de página: panel con el velo invertido (eco del hero). */
export function CTAFinal({
  etiqueta = "Hablemos",
  titulo = "¿Listo para llevar tu negocio al siguiente nivel?",
  texto = "Cuéntanos cómo funciona tu negocio por dentro y te proponemos la solución correcta.",
  boton = "Agendar consulta gratuita",
  href = "/contacto",
  nota = "Cotización gratuita y sin compromiso",
  deshabilitado = false,
  enlaceSecundario,
}: Props) {
  return (
    <section className="relative bg-bg-dark px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-line-dark bg-bg-deep">
        {/* Eco del hero: el mismo velo, invertido para que la luz suba desde abajo */}
        <Image
          src="/fondos/velo-poster.webp"
          alt=""
          aria-hidden="true"
          fill
          unoptimized
          sizes="100vw"
          className="translate-y-[15%] -scale-y-100 object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="relative px-6 py-20 text-center sm:px-12 sm:py-28">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/55">
            <span className="h-px w-8 bg-primary" />
            {etiqueta}
            <span className="h-px w-8 bg-primary" />
          </p>
          <h2 className="mx-auto mt-6 max-w-3xl text-balance text-[34px] font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl">
            {titulo}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            {texto}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            {deshabilitado ? (
              <span
                role="link"
                aria-disabled="true"
                className="inline-flex w-full cursor-not-allowed select-none items-center justify-center gap-2 rounded-full border border-line-dark-strong bg-white/5 px-8 py-4 text-sm font-semibold text-white/40 sm:w-auto sm:text-base"
              >
                <Lock className="h-4 w-4" aria-hidden="true" />
                {boton}
              </span>
            ) : (
              <BotonEspecular
                href={href}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] sm:w-auto sm:text-base"
              >
                {boton}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </BotonEspecular>
            )}
            {enlaceSecundario && (
              <a
                href={enlaceSecundario.href}
                className="text-sm font-semibold text-primary-light underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {enlaceSecundario.texto}
              </a>
            )}
            <p className="text-xs text-white/55 sm:text-sm">
              {nota}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
