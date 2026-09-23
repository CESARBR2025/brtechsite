import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { TarjetaFoco } from "@/src/ui/primitivos/tarjeta-foco"
import {
  IlustracionInventario,
  IlustracionMultisucursal,
  IlustracionWeb,
} from "@/src/ui/marketing/home/ilustraciones-servicios"

const services = [
  {
    Ilustracion: IlustracionMultisucursal,
    title: "Software multisucursal para restaurantes",
    ancla: "sistema-pos-para-restaurantes",
    description:
      "Todas tus sucursales operando como una sola: mesas, pedidos, cocina, caja e inventario en una misma plataforma, hecha a la medida de tu restaurante.",
    features: [
      "Operación centralizada de sucursales",
      "Control de caja y cortes",
      "Mesas y órdenes en tiempo real",
      "Coordinación con cocina",
    ],
  },
  {
    Ilustracion: IlustracionInventario,
    title: "Control de inventarios",
    ancla: "control-de-inventarios",
    description:
      "Visibilidad precisa de entradas, salidas y existencias en tiempo real, para reducir errores y detener las fugas de inventario antes de que afecten tu margen.",
    features: [
      "Existencias en tiempo real",
      "Alertas de reabastecimiento",
      "Historial completo de movimientos",
    ],
  },
  {
    Ilustracion: IlustracionWeb,
    title: "Páginas web",
    // El id en /servicios sigue siendo el del título original
    ancla: "tu-negocio-digital",
    description:
      "Una presencia digital a la altura de tu marca, diseñada para convertir visitas en clientes: reservaciones, pedidos y solicitudes de contacto.",
    features: [
      "Enfoque en conversión",
      "Diseño adaptable a cualquier dispositivo",
      "Integración con correo y pedidos",
    ],
  },
]

export function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-bg-dark py-24 sm:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.06)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_70%_60%,black_5%,transparent_65%)]" />
      <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/55">
            <span className="h-px w-8 bg-primary" />
            Servicios
          </p>
          <h2 className="mt-5 text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">
            Lo que construimos para tu negocio
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
            No forzamos tu negocio a encajar en una herramienta: construimos la
            herramienta que encaja con tu negocio.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {services.map((service, i) => (
            <TarjetaFoco key={service.title}>
              <div className="flex h-full flex-col p-7 sm:p-8">
                <service.Ilustracion />

                <span className="mt-8 font-mono text-sm tabular-nums text-primary-light/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-white/65 sm:text-base">
                  {service.description}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5 border-t border-line-dark pt-6">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/75">
                      <Check className="h-4 w-4 flex-shrink-0 text-primary-light" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/servicios#${service.ancla}`}
                  className="group/enlace mt-8 inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white outline-none transition-all group-hover:border-primary/50 group-hover:bg-primary/15 hover:!border-primary hover:!bg-primary hover:shadow-lg hover:shadow-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
                >
                  Más detalles
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/enlace:translate-x-1" />
                </Link>
              </div>
            </TarjetaFoco>
          ))}
        </div>
      </div>
    </section>
  )
}
