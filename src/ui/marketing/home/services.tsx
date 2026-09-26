"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BarChart3, Check, Globe, Store } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { WHATSAPP } from "@/src/ui/marketing/datos-contacto"

/*
 * Escaparate de servicios con pestañas: un frente a la vez, en grande, con
 * su foto (public/servicios) y "Ideal para" para mostrar que nos adaptamos a
 * distintos giros sin encasillarnos en uno. Fotos ilustrativas, no de clientes.
 */

/** Foto real del frente con una etiqueta de vidrio flotante (el toque de producto). */
function FotoFrente({ foto }: { foto: Frente["foto"] }) {
  return (
    <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-bg-dark shadow-[0_24px_50px_-24px_rgba(21,17,39,0.6)]">
      <Image
        src={foto.src}
        alt={foto.alt}
        fill
        sizes="(min-width: 1024px) 600px, 100vw"
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg-deep/50 via-transparent to-transparent" />
      <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-bg-dark/60 px-3.5 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md sm:bottom-5 sm:left-5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
        </span>
        {foto.etiqueta}
      </span>
    </div>
  )
}

interface Frente {
  id: string
  pestana: string
  icono: LucideIcon
  titulo: string
  descripcion: string
  idealPara: string[]
  funciones: string[]
  /** Ancla del detalle en /servicios (se conservan las existentes). */
  ancla: string
  /** Foto del frente (public/servicios) y el dato que flota encima. */
  foto: { src: string; alt: string; etiqueta: string }
}

const frentes: Frente[] = [
  {
    id: "operacion",
    pestana: "Operación y ventas",
    icono: Store,
    titulo: "Toda tu operación en un solo sistema",
    descripcion:
      "Ventas, pedidos, caja, sucursales o rutas de reparto operando como una sola, hecha a la medida de cómo trabaja tu negocio.",
    idealPara: ["Restaurantes", "Distribuidoras", "Multisucursal", "Venta en ruta"],
    funciones: [
      "Punto de venta y control de caja con cortes",
      "Sucursales o rutas conectadas en tiempo real",
      "Pedidos, órdenes y entregas de punta a punta",
      "Reportes de ventas sin capturar nada a mano",
    ],
    ancla: "sistema-pos-para-restaurantes",
    foto: {
      src: "/servicios/operacion.webp",
      alt: "Mesero con una tablet que muestra el punto de venta en un restaurante, junto a la impresora de tickets",
      etiqueta: "Operación en vivo · todo en línea",
    },
  },
  {
    id: "inventarios",
    pestana: "Control de inventarios",
    icono: BarChart3,
    titulo: "Sabe qué tienes, qué se mueve y qué se pierde",
    descripcion:
      "Visibilidad precisa de entradas, salidas y existencias, con un responsable en cada movimiento, para detener las fugas antes de que afecten tu margen.",
    idealPara: ["Almacenes", "Producción", "Comercios", "Distribuidoras"],
    funciones: [
      "Existencias en tiempo real por producto",
      "Alertas de reabastecimiento",
      "Historial completo de movimientos",
      "Merma y devoluciones registradas",
    ],
    ancla: "control-de-inventarios",
    foto: {
      src: "/servicios/inventarios.webp",
      alt: "Encargado de almacén con una tablet que muestra el control de existencias entre anaqueles de mercancía",
      etiqueta: "Existencias al día · 1 por reabastecer",
    },
  },
  {
    id: "web",
    pestana: "Presencia digital",
    icono: Globe,
    titulo: "Una página que convierte visitas en clientes",
    descripcion:
      "Presencia digital a la altura de tu marca, diseñada para que te encuentren y te contacten: reservaciones, pedidos y solicitudes directo a tu equipo.",
    idealPara: ["Restaurantes", "Servicios profesionales", "Comercios", "Marcas locales"],
    funciones: [
      "Diseño enfocado en conversión",
      "Adaptable a cualquier dispositivo",
      "Solicitudes directo a correo y WhatsApp",
      "Posicionamiento en buscadores",
    ],
    ancla: "tu-negocio-digital",
    foto: {
      src: "/servicios/presencia-digital.webp",
      alt: "Página web de un restaurante abierta en una laptop y un celular sobre la mesa de un café",
      etiqueta: "Nueva solicitud de contacto",
    },
  },
]

export function ServicesSection() {
  const [activo, setActivo] = useState(0)
  const pestanas = useRef<(HTMLButtonElement | null)[]>([])
  const f = frentes[activo]

  // Flechas izquierda/derecha entre pestañas (patrón de tabs accesible)
  function alTeclado(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const siguiente = (activo + (e.key === "ArrowRight" ? 1 : frentes.length - 1)) % frentes.length
    setActivo(siguiente)
    pestanas.current[siguiente]?.focus()
  }

  const enlaceMedida = `https://wa.me/${WHATSAPP.telefono.replace("+", "")}?text=${encodeURIComponent(
    "Hola, vi su sitio. Mi operación es distinta y me gustaría platicar un sistema a la medida.",
  )}`

  return (
    <section className="relative bg-bg-section py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Servicios
            <span className="h-px w-8 bg-primary" />
          </p>
          <h2 className="mt-5 text-balance font-display text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-5xl">
            Lo que construimos para tu negocio
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            No forzamos tu negocio a encajar en una herramienta: construimos la herramienta que encaja
            con tu negocio.
          </p>
        </div>

        {/* Pestañas (se deslizan de lado en celular) */}
        <div className="mt-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Servicios"
            onKeyDown={alTeclado}
            className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1.5 shadow-card [scrollbar-width:none]"
          >
            {frentes.map((x, i) => {
              const actual = i === activo
              return (
                <button
                  key={x.id}
                  ref={(el) => {
                    pestanas.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`servicio-tab-${x.id}`}
                  aria-selected={actual}
                  aria-controls={`servicio-panel-${x.id}`}
                  tabIndex={actual ? 0 : -1}
                  onClick={() => setActivo(i)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary sm:px-5 ${
                    actual
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-text-secondary hover:bg-bg-section hover:text-text-primary"
                  }`}
                >
                  <x.icono className="h-4 w-4" aria-hidden="true" />
                  {x.pestana}
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel del frente elegido; la key reinicia la animación de entrada */}
        <div
          key={f.id}
          role="tabpanel"
          id={`servicio-panel-${f.id}`}
          aria-labelledby={`servicio-tab-${f.id}`}
          className="mt-8 grid items-center gap-8 rounded-3xl border border-border bg-surface p-5 shadow-card motion-safe:animate-aparecer sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:p-10"
        >
          <FotoFrente foto={f.foto} />

          <div>
            <h3 className="text-balance font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {f.titulo}
            </h3>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-text-secondary sm:text-base">
              {f.descripcion}
            </p>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Ideal para</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {f.idealPara.map((x) => (
                <li
                  key={x}
                  className="rounded-full border border-primary/15 bg-primary-light/60 px-3 py-1 text-xs font-medium text-primary-hover"
                >
                  {x}
                </li>
              ))}
            </ul>

            <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
              {f.funciones.map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-sm text-text-secondary sm:text-base">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>

            <Link
              href={`/servicios#${f.ancla}`}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 outline-none transition-all hover:bg-primary-hover hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              Ver detalles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Cierre: lo que no encaja también se construye */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-primary/30 px-6 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-pretty text-sm text-text-secondary sm:text-base">
            <span className="font-semibold text-text-primary">¿Tu operación no encaja en ninguno?</span>{" "}
            También lo construimos a la medida.
          </p>
          <a
            href={enlaceMedida}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-primary outline-none transition-all hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d={WHATSAPP.path} />
            </svg>
            Platiquemos tu caso
          </a>
        </div>
      </div>
    </section>
  )
}
