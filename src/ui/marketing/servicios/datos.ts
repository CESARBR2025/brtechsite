/**
 * Contenido de la página de Servicios. Los títulos coinciden con las tarjetas
 * de Inicio. `ancla` es el id de cada sección (lo enlazan Inicio y el footer):
 * no lo cambies sin actualizar esos enlaces.
 * Sin montos: la inversión se cotiza; aquí solo se listan los factores.
 */

export interface Servicio {
  ancla: string
  titulo: string
  descripcion: string
  necesidad: string[]
  incluye: string[]
  noIncluye: string[]
  resultados: string[]
  factores: string[]
}

export const servicios: Servicio[] = [
  {
    ancla: "sistema-pos-para-restaurantes",
    titulo: "Software multisucursal para restaurantes",
    descripcion:
      "Todas tus sucursales operando como una sola: mesas, pedidos, cocina, caja e inventario en una misma plataforma, hecha a la medida de tu restaurante.",
    necesidad: [
      "Aún tomas pedidos en papel y se pierden comandas",
      "No sabes cuánto vendes hoy frente a ayer, en tiempo real",
      "Cada sucursal lleva sus propios números y no tienes una vista completa",
    ],
    incluye: [
      "Control de caja completo y cortes",
      "Gestión de mesas y comandas",
      "Órdenes en tiempo real a cocina",
      "Impresión de tickets en impresora externa",
      "Reportes de ventas diarios",
      "Tablero con métricas clave",
      "Capacitación de tu equipo",
    ],
    noIncluye: [
      "Hardware (pantallas, impresoras)",
      "Diseño de menús o identidad de marca",
      "Pasarela de pagos integrada",
    ],
    resultados: [
      "Comandas sin errores",
      "Servicio más ágil",
      "Menos tiempo de espera",
      "Reportes de ventas automáticos",
    ],
    factores: ["Número de sucursales", "Vista para comensales"],
  },
  {
    ancla: "control-de-inventarios",
    titulo: "Control de inventarios",
    descripcion:
      "Visibilidad precisa de entradas, salidas y existencias en tiempo real, para reducir errores y detener las fugas de inventario antes de que afecten tu margen.",
    necesidad: [
      "No sabes cuánto inventario tienes sin contarlo a mano",
      "Se te acaban insumos en hora pico sin verlo venir",
      "Hay diferencias entre lo que compras y lo que vendes",
    ],
    incluye: [
      "Control de entradas y salidas",
      "Existencias en tiempo real",
      "Alertas automáticas de reabastecimiento",
      "Movimientos registrados por usuario",
      "Historial completo de ajustes",
      "Reportes de rotación de inventario",
      "Capacitación de tu equipo",
    ],
    noIncluye: [
      "Integración con proveedores",
      "Módulo de compras automatizado",
      "Hardware (lectores, tablets)",
    ],
    resultados: [
      "Sin quiebres de stock en hora pico",
      "Menos mermas y fugas",
      "Reabastecimiento a tiempo",
      "Decisiones con datos reales",
    ],
    factores: [
      "Tamaño del catálogo (más de 500 productos)",
      "Integración con tu punto de venta",
      "Alertas por correo",
      "Número de sucursales",
    ],
  },
  {
    // El id conserva el nombre anterior del servicio ("Tu negocio digital")
    ancla: "tu-negocio-digital",
    titulo: "Páginas web",
    descripcion:
      "Una presencia digital a la altura de tu marca, diseñada para convertir visitas en clientes: reservaciones, pedidos y solicitudes de contacto.",
    necesidad: [
      "No apareces en Google cuando te buscan",
      "Tu competencia tiene sitio web y tú solo redes sociales",
      "Tus clientes no pueden ver tu menú ni hacer pedidos en línea",
    ],
    incluye: [
      "Sitio profesional de hasta 5 secciones",
      "Menú digital interactivo",
      "Formulario de reservaciones o pedidos",
      "Diseño adaptable a móvil y escritorio",
      "Optimización SEO básica",
      "Hosting por 12 meses",
      "Capacitación para actualizar contenido",
    ],
    noIncluye: [
      "Fotografía profesional",
      "Redacción de textos",
      "Manejo de redes sociales",
      "Pasarela de pagos integrada",
    ],
    resultados: [
      "Clientes desde Google las 24 horas",
      "Reservaciones directas, sin intermediarios",
      "Menú digital siempre actualizado",
      "Presencia a la altura de tu marca",
    ],
    factores: [
      "Blog integrado",
      "Galería de fotos profesional",
      "Integración con sistema de pedidos",
      "SEO avanzado",
    ],
  },
]

export const pasos = [
  { titulo: "Te conocemos", descripcion: "Analizamos cómo opera hoy tu negocio.", tiempo: "3 días" },
  { titulo: "Diagnóstico", descripcion: "Identificamos el problema principal que frena tu operación.", tiempo: "1 semana" },
  { titulo: "Propuesta", descripcion: "Te presentamos la funcionalidad de tu sistema para validarla contigo.", tiempo: "3 días" },
  {
    titulo: "Desarrollo",
    descripcion: "Construimos por módulos y cada semana te presentamos los avances.",
    tiempo: "4–8 semanas",
    nota: "2–4 semanas en páginas web",
  },
  { titulo: "Capacitación", descripcion: "Preparamos a tu equipo para aprovechar el sistema al máximo.", tiempo: "1 día" },
  { titulo: "Puesta en marcha", descripcion: "Te acompañamos en el arranque para verificar que todo funcione como debe.", tiempo: "1 día" },
  { titulo: "Entrega", descripcion: "Te damos acceso a las funcionalidades finales y hacemos la entrega formal.", tiempo: "1 día" },
]
