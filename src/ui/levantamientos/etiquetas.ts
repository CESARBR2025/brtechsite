import type {
  ClaveSeccion,
  Dispositivo,
  FormatoDocumento,
  ManejoDigital,
  NivelPrioridad,
  RangoEdad,
  TipoResultado,
} from "@/src/modules/levantamientos/domain/contenido"

/** Textos visibles de los catálogos del levantamiento (panel y diagnóstico). */

export const ETIQUETA_RANGO_EDAD: Record<RangoEdad, string> = {
  "menos-18": "Menos de 18",
  "18-25": "18 a 25",
  "26-35": "26 a 35",
  "36-50": "36 a 50",
  "51-65": "51 a 65",
  "mas-65": "Más de 65",
}

export const ETIQUETA_DISPOSITIVO: Record<Dispositivo, string> = {
  celular: "Celular",
  tableta: "Tableta",
  laptop: "Laptop",
  computadora: "Computadora de escritorio",
}

export const ETIQUETA_MANEJO_DIGITAL: Record<ManejoDigital, string> = {
  bajo: "Básico",
  medio: "Intermedio",
  alto: "Avanzado",
}

export const ETIQUETA_FORMATO: Record<FormatoDocumento, string> = {
  papel: "Papel",
  "hoja-calculo": "Hoja de cálculo",
  whatsapp: "WhatsApp",
  correo: "Correo",
  sistema: "Otro sistema",
  otro: "Otro",
}

export const ETIQUETA_TIPO_RESULTADO: Record<TipoResultado, string> = {
  documento: "Documento",
  imagen: "Imagen",
  solicitud: "Solicitud",
  notificacion: "Notificación",
  reporte: "Reporte",
  otro: "Otro",
}

export const ETIQUETA_PRIORIDAD: Record<NivelPrioridad, string> = {
  imprescindible: "Imprescindible",
  deseable: "Deseable",
  futuro: "Para después",
}

/** Guía para la reunión: qué preguntar en cada sección (solo panel). */
export const GUIA_SECCION: Record<ClaveSeccion, string> = {
  contexto: "¿A qué se dedica el negocio, cuántas personas y sucursales tiene, dónde opera?",
  problema: "¿Qué te quita más tiempo hoy? ¿Cómo lo resuelven ahora y cuánto les cuesta?",
  objetivos: "Si el sistema funcionara perfecto, ¿qué cambiaría? ¿Cómo lo mediríamos?",
  actores: "¿Quién va a usar el sistema? Por cada rol: qué hace, cuántos son, edad y manejo digital.",
  flujos: "Pídele que narre un día normal, paso a paso, y quién hace cada paso.",
  documentos: "¿Qué formatos, notas, libretas o archivos usan hoy? Pide que te los manden por WhatsApp.",
  resultados: "¿Qué debe entregar el sistema? Documentos, imágenes, solicitudes, avisos, reportes.",
  recursos: "¿Con qué equipos cuentan? ¿Qué programas usan? ¿Cómo es su internet?",
  integraciones: "¿Facturación, pagos, WhatsApp, otro sistema con el que deba hablar?",
  volumen: "¿Cuántas operaciones al día? ¿Cuántas personas a la vez? ¿Hay historial que migrar?",
  restricciones: "¿Para cuándo lo necesitan? ¿Temporadas altas, normas o reglas que cumplir?",
  prioridades: "Si solo pudiéramos entregar tres cosas primero, ¿cuáles serían?",
  pendientes: "Lo que quedó por confirmar y lo que sigue después de esta reunión.",
  adjuntos: "Archivos que el cliente compartió por WhatsApp: nombre y de qué trata cada uno.",
  notasInternas: "Solo para ti: presupuesto insinuado, quién decide, riesgos, idea de solución.",
}
