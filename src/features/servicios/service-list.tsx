import Link from "next/link"
import {
  ShoppingCart,
  Settings,
  Globe,
  Check,
  X,
  ChevronRight,
  Clock,
  Star,
  TrendingUp,
  Users,
  BarChart3,
  Layers,
  Zap,
  Calculator,
  ClipboardList,
  Smartphone,
  Search,
  Palette,
  MessageSquare,
} from "lucide-react"

const services = [
  {
    icon: ShoppingCart,
    title: "Sistema POS para Restaurantes",
    tagline: "Obten el control de tu operación",
    description:
      "Creamos tu herramienta diseñada a tu restaurante gestionando: mesas, pedidos, cocina e inventario integrados en una sola plataforma.",
    price: "$7,000 MXN",
    problem: [
      "Aún tomas pedidos en papel y se pierden comandas",
      "No sabes cuánto vendes hoy vs ayer en tiempo real",
      "El inventario se descontrola y no sabes qué falta",
    ],
    includes: [
      "Control de caja completo",
      "Gestión de mesas y comandas",
      "Órdenes en tiempo real a cocina",
      "Ticket impresora integrada",
      "Reportes de ventas diarios",
      "Dashboard con métricas clave",
      "Capacitación del equipo",
    ],
    excludes: [
      "Hardware (pantallas, impresoras)",
      "Diseño de menús o branding",
      "Pasarela de pagos integrada",
    ],
    process: [
      { step: "Te conoceremos", desc: "Analizamos tu operación actual", time: "3 días" },
      { step: "Identificación de tu problema", desc: "Buscaremos hasta encontrar el problema principal de tu negocio", time: "1 semana" },
      { step: "Propuesta de desarrollo", desc: "Con tu validación, te presentaremos la funcionalidad de tu herramienta", time: "3 días" },
      { step: "Desarrollo de tu herramienta", desc: "Desarrollaremos modulos y semana semana nos reuniremos contigo para presentarte avances realizados", time: "4 - 8 semanas" },
      { step: "Tu capacitación", desc: "Nos encargaremos de capacitarte para que exprimas al maximo tu sistema", time: "1 día" },
      { step: "Puesta en marcha", desc: "Cuando arranque, estaremos contigo para verificar que el funcionamiento sea el adecuado", time: "1 día" },
      { step: "Entrega", desc: "Te brindaremos acceso a las funcionalidades finales del sistema y haremos entrega formal de tu herramienta", time: "1 día" },
    ],
    results: [
      "Elimina errores en comandas",
      "Agiliza el servicio al cliente",
      "Reduce tiempos de espera",
      "Reportes de ventas automáticos",
    ],
    variables: [
      { label: "Multi-sucursal", add: "+$1,200" },
      { label: "Vista para comensales", add: "+$1,000" },
    ],
  },
  {
    icon: Settings,
    title: "Control de Inventarios",
    tagline: "Elimina tu venda de stock faltante",
    description:
      "Sistema para controlar entradas, salidas y existencias en tiempo real. Reduce errores y evita fugas de inventario.",
    price: "$6,000 MXN",
    problem: [
      "No sabes cuánto inventario tienes sin contar manualmente",
      "Se te acaban insumos en horas pico y no lo prevés",
      "Diferencias entre lo que compras y lo que vendes",
    ],
    includes: [
      "Control de entradas y salidas",
      "Stock en tiempo real",
      "Alertas automáticas de reorden",
      "Movimientos registrados con usuario",
      "Historial completo de ajustes",
      "Reportes de rotación de inventario",
      "Capacitación del equipo",
    ],
    excludes: [
      "Integración con proveedores",
      "Módulo de compras automatizado",
      "Hardware (lectores, tablets)",
    ],
    process: [
      { step: "Te conoceremos", desc: "Analizamos tu operación actual", time: "3 días" },
      { step: "Identificación de tu problema", desc: "Buscaremos hasta encontrar el problema principal de tu negocio", time: "1 semana" },
      { step: "Propuesta de desarrollo", desc: "Con tu validación, te presentaremos la funcionalidad de tu herramienta", time: "3 días" },
      { step: "Desarrollo de tu herramienta", desc: "Desarrollaremos modulos y semana semana nos reuniremos contigo para presentarte avances realizados", time: "4 - 8 semanas" },
      { step: "Tu capacitación", desc: "Nos encargaremos de capacitarte para que exprimas al maximo tu sistema", time: "1 día" },
      { step: "Puesta en marcha", desc: "Cuando arranque, estaremos contigo para verificar que el funcionamiento sea el adecuado", time: "1 día" },
      { step: "Entrega", desc: "Te brindaremos acceso a las funcionalidades finales del sistema y haremos entrega formal de tu herramienta", time: "1 día" },
    ],
    results: [
      "Evita quiebres de stock en hora pico",
      "Reduce mermas y fugas hasta 40%",
      "Alertas automáticas de reorden",
      "Decisiones basadas en datos reales",
    ],
    variables: [
      { label: "+500 SKUs en catálogo", add: "+$1,000" },
      { label: "Integración con POS existente", add: "+$1,500" },
      { label: "Alertas Email", add: "+$500" },
      { label: "Multi-sucursal", add: "+$2,000" },
    ],
  },
  {
    icon: Globe,
    title: "Tu negocio digital",
    tagline: "Haz que te encuentren",
    description:
      "Páginas web enfocadas en conversión para restaurantes y negocios locales. Diseñadas para generar reservas o pedidos.",
    price: "$3,000 MXN",
    problem: [
      "No apareces en Google cuando te buscan",
      "Competencia tiene web y redes, tú solo redes sociales",
      "Clientes no pueden ver tu menú ni hacer pedidos online",
    ],
    includes: [
      "Página web profesional (hasta 5 secciones)",
      "Menú digital interactivo",
      "Formulario de reservas o pedidos",
      "Diseño responsive (móvil + desktop)",
      "Optimización SEO básica",
      "Hosting 12 meses incluido",
      "Capacitación para actualizar contenido",
    ],
    excludes: [
      "Fotografía profesional",
      "Copia de textos (redacción)",
      "Manejo de redes sociales",
      "Pasarela de pagos integrada",
    ],
    process: [
      { step: "Te conoceremos", desc: "Analizamos tu operación actual", time: "3 días" },
      { step: "Identificación de tu problema", desc: "Buscaremos hasta encontrar el problema principal de tu negocio", time: "1 semana" },
      { step: "Propuesta de desarrollo", desc: "Con tu validación, te presentaremos la funcionalidad de tu herramienta", time: "3 días" },
      { step: "Desarrollo de tu herramienta", desc: "Desarrollaremos modulos y semana semana nos reuniremos contigo para presentarte avances realizados", time: "2 - 4 semanas" },
      { step: "Tu capacitación", desc: "Nos encargaremos de capacitarte para que exprimas al maximo tu sistema", time: "1 día" },
      { step: "Puesta en marcha", desc: "Cuando arranque, estaremos contigo para verificar que el funcionamiento sea el adecuado", time: "1 día" },
      { step: "Entrega", desc: "Te brindaremos acceso a las funcionalidades finales del sistema y haremos entrega formal de tu herramienta", time: "1 día" },
    ],
    results: [
      "Atrae clientes 24/7 desde Google",
      "Genera reservas directas sin intermediarios",
      "Menú digital siempre actualizado",
      "Inversión desde $3,000 MXN",
    ],
    variables: [
      { label: "Blog integrado (3 artículos/mes)", add: "+$500" },
      { label: "Galería de fotos profesional", add: "+$500" },
      { label: "Integración con sistema de pedidos", add: "+$1,000" },
      { label: "SEO avanzado (5 keywords)", add: "+$1,000" },
    ],
  },
]

const serviceIcons = [
  { icon: Smartphone, label: "Mobile first" },
  { icon: BarChart3, label: "Reportes" },
  { icon: Users, label: "Multi-usuario" },
  { icon: Layers, label: "Escalable" },
]

export function ServiceList() {
  return (
    <section>
      {services.map((service, i) => {
        const isDark = i % 2 === 0
        const bg = isDark ? "bg-bg-dark" : "bg-surface"
        const textColor = isDark ? "text-white" : "text-text-primary"
        const mutedColor = isDark ? "text-text-muted" : "text-text-secondary"

        return (
          <div
              key={service.title}
              id={service.title.toLowerCase().replace(/\s+/g, "-")}
              className={`relative overflow-hidden ${bg}`}>
            {isDark && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />
            )}

            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
              {/* Header */}
              <div className="mx-auto max-w-3xl text-center">
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-primary/20 text-primary" : "bg-primary-light text-primary"
                    }`}
                >
                  <service.icon className="h-8 w-8" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                  {service.tagline}
                </p>
                <h2 className={`mt-2 text-[26px] font-bold sm:text-4xl ${textColor}`}>
                  {service.title}
                </h2>
                <p className={`mt-3 text-base leading-relaxed ${mutedColor}`}>
                  {service.description}
                </p>
              </div>

              {/* Problem */}
              <div className="mx-auto mt-12 max-w-3xl">
                <div className={`rounded-2xl border p-6 sm:p-8 ${isDark
                  ? "border-white/10 bg-white/5"
                  : "border-red-100 bg-red-50/50"
                  }`}>
                  <h3 className={`flex items-center gap-2 text-base font-semibold ${isDark ? "text-white" : "text-red-600"}`}>
                    <X className="h-5 w-5" />
                    ¿Por qué lo necesitas?
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {service.problem.map((p) => (
                      <li key={p} className={`flex items-start gap-2 text-sm ${mutedColor}`}>
                        <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Includes / Excludes */}
              <div className="mx-auto mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-success">
                    <Check className="h-5 w-5" />
                    ¿Qué incluye?
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-text-muted">
                    <X className="h-5 w-5" />
                    ¿Qué NO incluye?
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {service.excludes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                        <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-muted" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Process */}
              <div className="mx-auto mt-16 max-w-4xl">
                <h3 className={`text-center text-lg font-bold ${textColor}`}>
                  ¿Cómo lo hacemos?
                </h3>
                <div className="relative mt-8">
                  <div className={`absolute left-6 top-0 hidden h-full w-0.5 md:block ${isDark ? "bg-white/10" : "bg-border"
                    }`} />
                  <div className="space-y-6">
                    {service.process.map((step, si) => (
                      <div key={step.step} className="relative flex items-start gap-5">
                        <div className={`relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-elevated ${isDark ? "bg-primary text-white" : "bg-primary text-white"
                          }`}>
                          {si + 1}
                        </div>
                        <div className="min-w-0 flex-1 rounded-xl border border-border bg-surface p-4 shadow-card">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-text-primary">
                                {step.step}
                              </p>
                              <p className="text-xs text-text-secondary">
                                {step.desc}
                              </p>
                            </div>
                            <span className="flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary whitespace-nowrap">
                              <Clock className="h-3 w-3" />
                              {step.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="mx-auto mt-16 max-w-4xl">
                <h3 className={`text-center text-lg font-bold ${textColor}`}>
                  Resultados esperados
                </h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {service.results.map((r) => (
                    <div
                      key={r}
                      className={`rounded-xl border p-4 text-center shadow-card ${isDark
                        ? "border-white/10 bg-white/5"
                        : "border-border bg-surface"
                        }`}
                    >
                      <Star className="mx-auto h-5 w-5 text-primary" />
                      <p className={`mt-2 text-xs ${isDark ? "text-text-muted" : "text-text-secondary"}`}>
                        {r}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="mx-auto mt-16 max-w-3xl">
                <div className={`rounded-2xl border p-6 text-center sm:p-8 ${isDark
                  ? "border-primary/30 bg-gradient-to-br from-primary/10 to-transparent"
                  : "border-primary/30 bg-gradient-to-br from-primary-light/50 to-surface"
                  }`}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Inversión
                  </p>
                  <p className={`mt-2 text-4xl font-bold ${isDark ? "text-white" : "text-text-primary"}`}>
                    {service.price}
                  </p>
                  <p className={`mt-1 text-sm ${mutedColor}`}>
                    Proyecto base — pago único
                  </p>

                  <div className="mx-auto mt-6 max-w-md">
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                      Variables que pueden aumentar el precio
                    </p>
                    <div className="mt-3 space-y-2">
                      {service.variables.map((v) => (
                        <div
                          key={v.label}
                          className={`flex items-center justify-between rounded-lg px-4 py-2 text-sm ${isDark ? "bg-white/5" : "bg-surface"
                            }`}
                        >
                          <span className={isDark ? "text-text-muted" : "text-text-secondary"}>
                            {v.label}
                          </span>
                          <span className="font-semibold text-primary">{v.add}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/contacto"
                    className="mt-8 inline-flex items-center gap-1.5 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl"
                  >
                    Cotiza este servicio
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Tech icons row for dark sections */}
              {isDark && (
                <div className="mx-auto mt-12 grid max-w-lg grid-cols-4 gap-4">
                  {serviceIcons.map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <p className="mt-1.5 text-xs text-text-muted">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}
