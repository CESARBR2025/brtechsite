import { BarChart3, Globe, UtensilsCrossed } from "lucide-react"
import type { LucideIcon } from "lucide-react"

/**
 * Única fuente de los servicios: la usan el escaparate de Inicio y la página
 * de Servicios. `ancla` es el id de cada sección en /servicios (lo enlazan
 * Inicio y el footer): no lo cambies sin actualizar esos enlaces.
 * Sin montos: la inversión se cotiza; aquí solo se listan los factores.
 * Fotos ilustrativas (public/servicios), no de clientes.
 */

export interface Servicio {
  /** Identificador corto (pestañas del home). */
  id: string
  ancla: string
  /** Nombre corto del frente (pestaña, índice, footer). */
  pestana: string
  icono: LucideIcon
  titulo: string
  descripcion: string
  idealPara: string[]
  /** Lo que hace el sistema; es lo que muestra Inicio. */
  funciones: string[]
  /** Entregables que completan "Qué incluye" en /servicios. */
  entregables: string[]
  /** Dolores del cliente: "¿Te suena familiar?". */
  necesidad: string[]
  noIncluye: string[]
  factores: string[]
  /** Foto del frente y el dato que flota encima. */
  foto: { src: string; alt: string; etiqueta: string }
}

export const servicios: Servicio[] = [
  {
    id: "restaurantes",
    ancla: "sistema-pos-para-restaurantes",
    pestana: "Restaurantes y negocios",
    icono: UtensilsCrossed,
    titulo: "Software para restaurantes multisucursal",
    descripcion:
      "Todas tus sucursales operando como una sola: de la orden en la mesa a la cocina y la barra, y hasta el corte de caja, en tiempo real y desde cualquier dispositivo.",
    idealPara: ["Restaurantes", "Cafeterías", "Bares", "Cadenas con sucursales"],
    funciones: [
      "Operación en tiempo real de todas tus sucursales",
      "Órdenes rápidas desde la mesa o el mostrador",
      "Comandas al instante en cocina y barra",
      "Menú digital siempre actualizado",
      "Cortes de caja al cierre, sin diferencias",
      "Tablero con los indicadores clave del negocio",
      "App para iPhone y Android",
    ],
    entregables: ["Impresión de tickets en impresora externa", "Capacitación de tu equipo"],
    necesidad: [
      "Aún tomas pedidos en papel y se pierden comandas",
      "No sabes cuánto vendes hoy frente a ayer, en tiempo real",
      "Cada sucursal lleva sus propios números y no tienes una vista completa",
    ],
    noIncluye: [
      "Hardware (pantallas, impresoras)",
      "Diseño de menús o identidad de marca",
      "Pasarela de pagos integrada",
    ],
    factores: ["Número de sucursales", "Vista para comensales"],
    foto: {
      src: "/servicios/operacion.webp",
      alt: "Mesero con una tablet que muestra el punto de venta en un restaurante, junto a la impresora de tickets",
      etiqueta: "Operación en vivo · todo en línea",
    },
  },
  {
    id: "inventarios",
    ancla: "control-de-inventarios",
    pestana: "Control de inventarios",
    icono: BarChart3,
    titulo: "Sabe qué tienes, dónde está y cuánto te deja",
    descripcion:
      "Visibilidad precisa de tu almacén y de tus unidades en ruta: cada movimiento con un responsable, finanzas claras y trato directo con tus comerciantes, para detener las fugas antes de que afecten tu margen.",
    idealPara: ["Distribuidoras", "Almacenes", "Producción", "Venta en ruta"],
    funciones: [
      "Existencias en tiempo real por producto",
      "Tus unidades de reparto en el mapa, en tiempo real",
      "Finanzas claras por unidad y por ruta",
      "Contacto directo con tus comerciantes",
      "Alertas de reabastecimiento",
      "Merma y devoluciones registradas",
      "Historial completo de movimientos",
    ],
    entregables: ["Capacitación de tu equipo"],
    necesidad: [
      "No sabes cuánto inventario tienes sin contarlo a mano",
      "Se te acaban insumos en hora pico sin verlo venir",
      "Hay diferencias entre lo que compras y lo que vendes",
    ],
    noIncluye: [
      "Integración con proveedores",
      "Módulo de compras automatizado",
      "Hardware (lectores, tablets)",
    ],
    factores: [
      "Tamaño del catálogo (más de 500 productos)",
      "Integración con tu punto de venta",
      "Alertas por correo",
      "Número de sucursales",
    ],
    foto: {
      src: "/servicios/inventarios.webp",
      alt: "Encargado de almacén con una tablet que muestra el control de existencias entre anaqueles de mercancía",
      etiqueta: "Existencias al día · 1 por reabastecer",
    },
  },
  {
    id: "web",
    // El id conserva el nombre anterior del servicio ("Tu negocio digital")
    ancla: "tu-negocio-digital",
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
    entregables: [
      "Sitio profesional de hasta 5 secciones",
      "Menú digital interactivo",
      "Formulario de reservaciones o pedidos",
      "Hosting por 12 meses",
      "Capacitación para actualizar contenido",
    ],
    necesidad: [
      "No apareces en Google cuando te buscan",
      "Tu competencia tiene sitio web y tú solo redes sociales",
      "Tus clientes no pueden ver tu menú ni hacer pedidos en línea",
    ],
    noIncluye: [
      "Fotografía profesional",
      "Redacción de textos",
      "Manejo de redes sociales",
      "Pasarela de pagos integrada",
    ],
    factores: [
      "Blog integrado",
      "Galería de fotos profesional",
      "Integración con sistema de pedidos",
      "SEO avanzado",
    ],
    foto: {
      src: "/servicios/presencia-digital.webp",
      alt: "Página web de un restaurante abierta en una laptop y un celular sobre la mesa de un café",
      etiqueta: "Nueva solicitud de contacto",
    },
  },
]
