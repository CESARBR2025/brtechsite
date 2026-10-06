import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import { BotonEspecular } from "@/src/ui/primitivos/boton-especular"
import { evento } from "@/src/ui/analitica"
import { OndasGradiente } from "@/src/ui/primitivos/ondas-gradiente"
import { TextoDesenfocado } from "@/src/ui/primitivos/texto-desenfocado"

// Entrada escalonada (clase motion-safe:animate-aparecer + retraso);
// con reduced-motion todo aparece de inmediato.
const retraso = (ms: number) => ({ animationDelay: `${ms}ms` })

/*
 * Hero del inicio: texto a la izquierda y, a la derecha, la foto que cuenta lo
 * que hacemos (el sistema al frente y la operación conectada detrás). La foto
 * se funde hacia la izquierda con una máscara, sobre las ondas de marca.
 * En celular la foto es un bloque propio arriba (el texto nunca se encima) y se
 * funde hacia abajo; la primera pantalla alcanza a mostrar foto, título y botón.
 */
export function HeroSection() {
  return (
    // Al menos una pantalla completa (svh: descuenta la barra del navegador móvil)
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-bg-deep lg:flex-row lg:items-center">
      {/* Ondas de gradiente violeta (WebGL): el efecto de marca del sitio */}
      <div className="absolute inset-0 -z-20">
        <OndasGradiente />
      </div>

      {/* Foto: bloque propio arriba en celular; a la derecha en escritorio, fundida hacia el texto */}
      <div className="relative -z-10 h-[40svh] min-h-[280px] w-full shrink-0 [mask-image:linear-gradient(to_bottom,black_62%,transparent)] lg:absolute lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:min-h-0 lg:w-[74%] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_22%)]">
        <Image
          src="/hero-inicio-v2.webp"
          alt="Tablet con tablero de ventas, celular e impresora de tickets sobre el mostrador de un negocio al anochecer; al fondo, la camioneta de reparto y el almacén conectados por un hilo de luz violeta"
          fill
          priority
          sizes="(min-width: 1024px) 74vw, 100vw"
          className="object-cover object-[92%_center] lg:object-[80%_center]"
        />
      </div>

      {/* Contraste para el texto: velo lateral en escritorio y oscurecido del borde inferior */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-bg-deep/70 via-bg-deep/20 to-transparent lg:block" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/4 bg-gradient-to-b from-transparent to-bg-deep/80" />

      {/* Texto pegado a la izquierda (sin centrar el contenedor) */}
      <div className="relative -mt-14 w-full px-5 pb-12 sm:-mt-10 sm:px-8 sm:pb-20 lg:mt-0 lg:py-40 lg:pl-16 xl:pl-24">
        <div className="max-w-3xl">
          {/* Qué hacemos: rótulo en versalitas, mismo lenguaje que la propuesta */}
          <p
            style={retraso(0)}
            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75 motion-safe:animate-aparecer sm:gap-4 sm:text-xs sm:tracking-[0.32em]"
          >
            <span className="hidden h-px bg-gradient-to-r from-transparent to-primary-light/70 sm:block sm:w-14" aria-hidden="true" />
            Software a la medida para empresas
          </p>

          {/* Eslogan (Poppins): una idea por línea */}
          <h1 className="mt-5 font-display text-[32px] font-semibold leading-[1.12] sm:mt-8 tracking-[-0.03em] text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.45)] min-[400px]:text-[34px] sm:text-[56px] lg:text-[64px]">
            <span className="block">
              <TextoDesenfocado texto="Tu negocio es diferente." retrasoMs={120} />
            </span>
            <span className="mt-1 block text-balance sm:mt-2">
              <TextoDesenfocado texto="Tu software también debería serlo" retrasoMs={460} />
            </span>
          </h1>

          {/* Filete que separa el eslogan de la promesa */}
          <span
            style={retraso(750)}
            aria-hidden="true"
            className="mt-5 block h-px w-16 bg-gradient-to-r from-primary-light/80 to-transparent motion-safe:animate-aparecer sm:mt-10"
          />

          {/* Promesa */}
          <p
            style={retraso(800)}
            className="mt-4 max-w-md text-pretty text-base leading-relaxed text-white/75 sm:mt-6 sm:text-lg motion-safe:animate-aparecer"
          >
            Diseñamos software que se adapta a ti, a tu operación y a tu entorno.
          </p>

          <div
            style={retraso(950)}
            className="mt-7 flex flex-col gap-2 sm:mt-12 sm:flex-row sm:gap-3 motion-safe:animate-aparecer"
          >
            <BotonEspecular
              href="/contacto"
              atributos={evento("agendar-consulta", { origen: "hero" })}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/30 sm:py-3.5 transition-all hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] sm:w-auto"
            >
              Agendar consulta gratuita
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </BotonEspecular>
            <Link
              href="/#proyectos"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-primary/60 hover:bg-primary/20 max-sm:border-transparent max-sm:bg-transparent max-sm:text-white/80 max-sm:backdrop-blur-none sm:w-auto"
            >
              Ver proyectos
              <ArrowDown className="h-4 w-4 text-primary-light transition-transform group-hover:translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
