import type { ClaveSeccion, IconoVista, NivelImpacto } from "@/src/modules/proyectos/domain/contenido"

/** Textos visibles de los catálogos del proyecto (panel y propuesta). */

export const ETIQUETA_IMPACTO: Record<NivelImpacto, string> = {
  bajo: "Bajo",
  medio: "Medio",
  alto: "Alto",
}

export const ETIQUETA_ICONO: Record<IconoVista, string> = {
  mapa: "Mapa",
  ruta: "Ruta",
  almacen: "Almacén",
  ventas: "Ventas",
  catalogo: "Catálogo",
  celular: "Celular",
  qr: "QR",
  ticket: "Ticket",
  usuarios: "Usuarios",
  avisos: "Avisos",
  reparto: "Reparto",
}

/** Qué capturar en cada sección (solo panel). */
export const GUIA_SECCION: Record<ClaveSeccion, string> = {
  ficha: "Datos generales, promesa del hero, objetivo y entregables.",
  vistas: "Las pantallas que tendrá el cliente, en su idioma: qué verá y qué podrá hacer en cada una. Solo lo contratado.",
  alcance: "Los problemas que resuelve, las grandes áreas del sistema y dónde está el valor central.",
  roles: "Quién usa el sistema, desde qué dispositivo y de qué es responsable.",
  permisos: "Por módulo, qué puede hacer cada rol (CRUD, Lectura, ✔, –).",
  fases: "MVP y fases futuras. Marca como contratada la que cubre esta propuesta.",
  modulos: "Módulos con sus requerimientos (RF-XXX-01…) y la fase en la que entra cada uno.",
  flujo: "Cómo se opera un día con el sistema, por etapas.",
  calendario: "Hitos por semanas y el pago ligado a cada entrega.",
  inversion: "Pagos (montos en pesos), condiciones, mensualidad y costos de terceros.",
  requisitos: "Lo que el cliente debe entregar, para cuándo y qué bloquea si falta.",
  arquitectura: "Visión general, diagrama, stack y notas técnicas.",
  decisiones: "Decisiones tomadas: motivo y alternativas descartadas.",
  riesgos: "Riesgos, su impacto y cómo se mitigan.",
  validacion: "Prototipo o prueba técnica: qué se comprueba y cómo se acepta.",
  glosario: "Términos del negocio y del sistema, para hablar el mismo idioma.",
  anexos: "Secciones libres con texto y tabla opcional (costos de terceros, cuentas, legal…).",
  fuentes: "Enlaces de referencia.",
  notasInternas: "Solo para ti: margen, negociación, riesgos comerciales.",
}
