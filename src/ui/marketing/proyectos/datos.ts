/**
 * Proyectos publicados. Inicio muestra el resumen y /proyectos/[slug] el caso
 * completo. Solo datos reales del proyecto: nada de cifras inventadas.
 */

import type { ElementoGaleria } from "@/src/ui/primitivos/galeria-acordeon"

export interface Proyecto {
  slug: string
  cliente: string
  /** Logotipo del cliente (se muestra sobre tarjeta blanca) */
  logo?: string
  titulo: string
  subtitulo: string
  resumen: string
  estado: string
  galeria: ElementoGaleria[]
  datos: { valor: string; etiqueta: string }[]
  puntos: string[]
  ficha: { etiqueta: string; valor: string }[]
  reto: { texto: string; puntos: string[] }
  modulos: { titulo: string; descripcion: string }[]
  fases: { titulo: string; descripcion: string }[]
}

export const proyectos: Proyecto[] = [
  {
    slug: "parrilla-nortena",
    cliente: "Parrilla Norteña",
    logo: "/clientes/parrilla-nortena/logo-arracheras.png",
    titulo: "ParrillaNorteña Soft",
    subtitulo: "Control total de operación diaria multisucursal",
    resumen:
      "Software a la medida que opera todas las sucursales como una sola. Centraliza la toma de órdenes, el control de caja y la operación diaria del restaurante, con control completo del flujo y menos merma operativa.",
    estado: "En producción · 2026",
    galeria: [
      {
        src: "/clientes/parrilla-nortena/galeria-punto-de-venta.webp",
        alt: "Punto de venta de ParrillaNorteña Soft en operación dentro del restaurante",
        etiqueta: "Punto de venta en operación",
      },
      {
        src: "/clientes/parrilla-nortena/galeria-caja-sucursal.webp",
        alt: "Caja de una sucursal de Parrilla Norteña con ParrillaNorteña Soft en pantalla",
        etiqueta: "Caja en sucursal",
      },
      {
        src: "/clientes/parrilla-nortena/galeria-app-movil.webp",
        alt: "App móvil de ParrillaNorteña Soft en un iPhone, en la pantalla de inicio de sesión",
        etiqueta: "App móvil iOS y Android",
        ajuste: "contener",
      },
    ],
    datos: [
      { valor: "2", etiqueta: "sucursales conectadas" },
      { valor: "2026", etiqueta: "en producción" },
    ],
    puntos: [
      "Operación multisucursal centralizada en un solo sistema",
      "Toma de órdenes y control de caja en tiempo real",
      "Flujo visible de punta a punta: de la orden al corte de caja",
      "Menos merma y errores por captura manual",
    ],
    ficha: [
      { etiqueta: "Cliente", valor: "Parrilla Norteña · Arracheras, carnes y quesos al carbón" },
      { etiqueta: "Giro", valor: "Restaurante" },
      { etiqueta: "Alcance", valor: "Multisucursal · 2 sucursales" },
      { etiqueta: "Plataformas", valor: "Web, iOS y Android" },
      { etiqueta: "Estado", valor: "En producción desde 2026" },
    ],
    reto: {
      texto:
        "Parrilla Norteña necesitaba que cada sucursal tomara órdenes, las enviara a cocina y barra y cerrara caja con precisión, y que la operación completa se viera como un solo negocio.",
      puntos: [
        "Comandas mal anotadas que llegaban incompletas a cocina",
        "Pedidos atendidos que nunca entraban al sistema de cobro",
        "Cierres de caja sin claridad entre lo vendido y lo que había en caja",
      ],
    },
    modulos: [
      {
        titulo: "Mesas en tiempo real",
        descripcion: "Asigna, mueve y libera mesas con un par de toques y ve el estado de cada una al momento.",
      },
      {
        titulo: "Toma de órdenes",
        descripcion: "El mesero captura el pedido en el sistema y cada cuenta queda ligada a su mesa.",
      },
      {
        titulo: "Cocina y barra",
        descripcion: "Las comandas llegan al instante a cocina y a la barra de bebidas, sin papeles.",
      },
      {
        titulo: "Caja y tickets",
        descripcion: "Cobro con impresión térmica de tickets y cortes de caja diarios sin discrepancias.",
      },
      {
        titulo: "Tablero del día",
        descripcion: "Totales por mesero, producto y forma de pago, con la operación del día en un vistazo.",
      },
      {
        titulo: "App móvil",
        descripcion: "La operación a la mano en iOS y Android, conectada a todas las sucursales.",
      },
    ],
    fases: [
      {
        titulo: "Entendimiento",
        descripcion: "Conocimos la operación en piso para entender cómo se toma, prepara y cobra cada orden.",
      },
      {
        titulo: "Captura de órdenes",
        descripcion: "Construimos la toma de pedidos para meseros, ligada a mesas y cuentas.",
      },
      {
        titulo: "Cocina y barra",
        descripcion: "Conectamos el envío de órdenes a cocina y barra, con su visualización en pantalla.",
      },
      {
        titulo: "Caja",
        descripcion: "Integramos el cobro, la impresión térmica de tickets y los cortes de caja.",
      },
      {
        titulo: "Indicadores",
        descripcion: "Sumamos tableros con las cifras financieras y operativas del día.",
      },
      {
        titulo: "Capacitación y puesta en línea",
        descripcion: "Capacitamos al equipo y pusimos el sistema en operación en las sucursales.",
      },
    ],
  },
]

export function proyectoPorSlug(slug: string) {
  return proyectos.find((p) => p.slug === slug)
}
