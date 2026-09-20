import Image from "next/image"
import { Check, Sparkles } from "lucide-react"

const proyectos = [
  {
    cliente: "Parrilla Norteña",
    titulo: "ParrillaNorteña Soft",
    subtitulo: "Control total de operación diaria multisucursal",
    resumen:
      "Software a la medida que opera todas las sucursales como una sola. Centraliza la toma de órdenes, el control de caja y la operación diaria del restaurante, con control completo del flujo y menos merma operativa.",
    imagen: {
      src: "/clientes/parrilla-nortena/sistema-parrilla.jpg",
      width: 1600,
      height: 1060,
      alt: "Pantalla de inicio de sesión de ParrillaNorteña Soft, el sistema de Parrilla Norteña",
      barra: "ParrillaNorteña Soft · Iniciar sesión",
    },
    puntos: [
      "Operación multisucursal centralizada en un solo sistema",
      "Toma de órdenes y control de caja en tiempo real",
      "Flujo visible de punta a punta: de la orden al corte de caja",
      "Menos merma y errores por captura manual",
    ],
    estado: "En producción · 2026",
  },
]

export function ProyectosRecientesSection() {
  return (
    <section
      id="proyectos"
      className="relative scroll-mt-20 overflow-hidden bg-bg-dark py-20 sm:py-28"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.06)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_50%_20%,black_10%,transparent_70%)]" />
      <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-white/5 to-primary/10 px-4 py-1.5 text-xs font-medium text-text-muted shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Proyectos más recientes
          </div>
          <h2 className="mt-4 text-balance text-[26px] font-bold tracking-tight text-white sm:text-[34px]">
            Lo último que hemos construido
          </h2>
        </div>

        <div className="mt-14 space-y-16">
          {proyectos.map((p) => (
            <article
              key={p.titulo}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14"
            >
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="absolute -inset-6 rounded-full bg-primary/20 blur-3xl" />
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
                  <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                    <span className="ml-3 text-xs text-white/40">
                      {p.imagen.barra}
                    </span>
                  </div>
                  <Image
                    src={p.imagen.src}
                    alt={p.imagen.alt}
                    width={p.imagen.width}
                    height={p.imagen.height}
                    className="h-auto w-full"
                  />
                </div>
              </div>

              <div className="text-center lg:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {p.cliente}
                </p>
                <h3 className="mt-2 text-balance text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {p.titulo}
                </h3>
                <p className="mt-1 text-pretty text-base font-medium text-white/80 sm:text-lg">
                  {p.subtitulo}
                </p>
                <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base lg:mx-0">
                  {p.resumen}
                </p>

                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-primary">
                  Enfoque
                </p>
                <ul className="mx-auto mt-3 max-w-md space-y-2.5 text-left lg:mx-0">
                  {p.puntos.map((punto) => (
                    <li
                      key={punto}
                      className="flex items-start gap-2.5 text-sm text-white/70"
                    >
                      <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-success/15">
                        <Check className="h-2.5 w-2.5 text-success" />
                      </span>
                      {punto}
                    </li>
                  ))}
                </ul>

                <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-text-muted">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                  </span>
                  {p.estado}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
