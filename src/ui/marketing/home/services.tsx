import Link from "next/link"
import { ShoppingCart, Settings, Globe, ArrowRight, Check } from "lucide-react"

const services = [
  {
    icon: ShoppingCart,
    title: "Sistema POS para Restaurantes",
    tagline: "Obten el control de tu operación",
    description:
      "Creamos tu herramienta diseñada a tu restaurante gestionando: mesas, pedidos, cocina e inventario integrados en una sola plataforma.",
    price: "Desde $7,000 MXN",
    features: ["Control de caja", "Gestión de mesas", "Órdenes en tiempo real", "Control de cocina"],
  },
  {
    icon: Settings,
    title: "Control de Inventarios",
    tagline: "Elimina tu venda de stock faltante",
    description:
      "Sistema para controlar entradas, salidas y existencias en tiempo real. Reduce errores y evita fugas de inventario.",
    price: "Desde $6,000 MXN",
    features: ["Stock en tiempo real", "Alertas de inventario", "Movimientos registrados"],
  },
  {
    icon: Globe,
    title: "Tu negocio digital",
    tagline: "Haz que te encuentren",
    description:
      "Paginas web enfocadas en conversión para restaurantes y negocios locales. Diseñadas para generar reservas o pedidos.",
    price: "Desde $3,000 MXN",
    features: ["Optimización de conversión", "Diseño responsive", "Integración con Email o pedidos"],
  },
]

const serviceIconsList = [
  { icon: ShoppingCart, label: "POS" },
  { icon: Settings, label: "Inventarios" },
  { icon: Globe, label: "Web" },
]

export function ServicesSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute -right-32 top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-xs font-medium text-primary">
            Nuestro Portafolio
          </div>
          <h2 className="mt-4 text-[22px] font-bold text-text-primary sm:text-3xl">
            Servicios que Transforman
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card transition-all hover:border-primary/30 hover:shadow-hover"
            >
              <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full bg-primary-light/30 transition-all group-hover:scale-150" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary/10 text-primary shadow-sm">
                <service.icon className="h-6 w-6" />
              </div>
              <p className="relative mt-4 text-xs font-semibold uppercase tracking-wider text-primary">
                {service.tagline}
              </p>
              <h3 className="relative mt-1 text-lg font-semibold text-text-primary">
                {service.title}
              </h3>
              <p className="relative mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                {service.description}
              </p>
              <ul className="relative mt-4 space-y-1.5">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-1.5 text-xs text-text-secondary"
                  >
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-success-light">
                      <Check className="h-2.5 w-2.5 text-success" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="relative mt-4 flex items-center justify-between border-t border-border pt-4">
                <p className="text-lg font-bold text-text-primary">
                  {service.price}
                </p>
                <Link
                  href={`/servicios#${service.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary-light px-3 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white"
                >
                  Más detalles
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
