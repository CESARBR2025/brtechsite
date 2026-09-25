import { z } from "zod"
import { DatosInvalidos } from "@/src/modules/shared/domain/errors"

/**
 * Contenido del levantamiento: el documento estructurado que se captura en la
 * primera reunión con un cliente. Se persiste como JSONB con versión de
 * esquema; si la forma cambia de manera incompatible, se sube la versión y se
 * migra en `normalizarContenido`.
 */
export const VERSION_ESQUEMA_CONTENIDO = 1

export const RANGOS_EDAD = [
  "menos-18",
  "18-25",
  "26-35",
  "36-50",
  "51-65",
  "mas-65",
] as const
export type RangoEdad = (typeof RANGOS_EDAD)[number]

export const DISPOSITIVOS = ["celular", "tableta", "laptop", "computadora"] as const
export type Dispositivo = (typeof DISPOSITIVOS)[number]

export const MANEJOS_DIGITALES = ["bajo", "medio", "alto"] as const
export type ManejoDigital = (typeof MANEJOS_DIGITALES)[number]

export const FORMATOS_DOCUMENTO = [
  "papel",
  "hoja-calculo",
  "whatsapp",
  "correo",
  "sistema",
  "otro",
] as const
export type FormatoDocumento = (typeof FORMATOS_DOCUMENTO)[number]

export const TIPOS_RESULTADO = [
  "documento",
  "imagen",
  "solicitud",
  "notificacion",
  "reporte",
  "otro",
] as const
export type TipoResultado = (typeof TIPOS_RESULTADO)[number]

export const NIVELES_PRIORIDAD = ["imprescindible", "deseable", "futuro"] as const
export type NivelPrioridad = (typeof NIVELES_PRIORIDAD)[number]

// --- Esquema ---

const CORTO = 300
const LARGO = 5000

const texto = (max = CORTO) => z.string().trim().max(max).default("")
const id = z.string().trim().min(1).max(64)
const refActor = z.string().trim().max(64).nullable().default(null)
const lista = <T extends z.ZodTypeAny>(item: T) => z.array(item).max(100).default([])
// Bloque de campos con default: un objeto ausente se parsea como {}.
// (El cast es solo para el genérico; cada campo trae su propio default.)
const bloque = <T extends z.ZodRawShape>(forma: T) =>
  z.object(forma).prefault({} as z.input<z.ZodObject<T>>)

const esquemaActor = z.object({
  id,
  nombre: texto(),
  descripcion: texto(LARGO),
  cantidad: texto(),
  rangosEdad: z.array(z.enum(RANGOS_EDAD)).max(RANGOS_EDAD.length).default([]),
  manejoDigital: z.enum(MANEJOS_DIGITALES).nullable().default(null),
  dispositivos: z.array(z.enum(DISPOSITIVOS)).max(DISPOSITIVOS.length).default([]),
})

const esquemaPaso = z.object({
  id,
  descripcion: texto(LARGO),
  actorId: refActor,
  dolor: texto(LARGO),
})

const esquemaFlujo = z.object({
  id,
  nombre: texto(),
  disparador: texto(LARGO),
  resultado: texto(LARGO),
  pasos: lista(esquemaPaso),
})

/** Fecha y hora local del negocio, como la da un input datetime-local. */
const PATRON_FECHA_HORA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

const esquemaFechaCritica = z.object({
  id,
  fecha: z
    .string()
    .trim()
    .default("")
    .refine((v) => v === "" || PATRON_FECHA_HORA.test(v), "Fecha y hora inválidas"),
  motivo: texto(LARGO),
})

// Antes era texto libre: un texto previo se conserva como una fecha sin día asignado
const esquemaFechasCriticas = z.preprocess(
  (v) =>
    typeof v === "string"
      ? v.trim()
        ? [{ id: "previa", fecha: "", motivo: v }]
        : []
      : v,
  lista(esquemaFechaCritica),
)

const esquemaPregunta = z.object({
  id,
  /** Agrupa las preguntas en la página del cliente (ej. "Críticas"). */
  grupo: texto(),
  texto: texto(LARGO),
  /** La escribe solo el cliente; el guardado del panel nunca la sobrescribe. */
  respuesta: texto(LARGO),
  respondidaEn: z.iso.datetime().nullable().default(null),
})

export const esquemaContenido = z.object({
  contexto: bloque({
    /** Persona con la que se hizo la reunión (a quien se saluda en el diagnóstico). */
    contactoNombre: texto(),
    giro: texto(),
    tamano: texto(),
    ubicacion: texto(),
    /** Punto tomado con el GPS del dispositivo durante la reunión. */
    coordenadas: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        /** Radio de precisión en metros que reporta el dispositivo. */
        precision: z.number().nonnegative().nullable().default(null),
      })
      .nullable()
      .default(null),
    participantes: texto(LARGO),
    /** Frase del hero del diagnóstico: el dolor del cliente convertido en resultado. */
    promesa: texto(),
    /** Cifras de su operación para el hero (ej. "5" · "camionetas"). */
    cifras: z
      .array(z.object({ id, valor: texto(20), etiqueta: texto(60) }))
      .max(4)
      .default([]),
  }),
  problema: bloque({
    situacionActual: texto(LARGO),
    solucionActual: texto(LARGO),
    impacto: texto(LARGO),
  }),
  objetivos: lista(z.object({ id, descripcion: texto(LARGO), metrica: texto() })),
  actores: lista(esquemaActor),
  flujos: lista(esquemaFlujo),
  documentos: lista(
    z.object({
      id,
      nombre: texto(),
      formato: z.enum(FORMATOS_DOCUMENTO).nullable().default(null),
      responsableId: refActor,
      frecuencia: texto(),
      descripcion: texto(LARGO),
    }),
  ),
  resultados: lista(
    z.object({
      id,
      tipo: z.enum(TIPOS_RESULTADO).nullable().default(null),
      nombre: texto(),
      descripcion: texto(LARGO),
      destinatarioId: refActor,
    }),
  ),
  recursos: bloque({
    hardware: lista(
      z.object({ id, nombre: texto(), cantidad: texto(), detalle: texto(LARGO) }),
    ),
    softwareActual: texto(LARGO),
    conectividad: texto(LARGO),
  }),
  integraciones: lista(z.object({ id, nombre: texto(), proposito: texto(LARGO) })),
  volumen: bloque({
    operaciones: texto(LARGO),
    usuariosSimultaneos: texto(),
    datosHistoricos: texto(LARGO),
  }),
  restricciones: bloque({
    plazo: texto(LARGO),
    fechasCriticas: esquemaFechasCriticas,
    normativa: texto(LARGO),
    otras: texto(LARGO),
  }),
  prioridades: lista(
    z.object({
      id,
      descripcion: texto(LARGO),
      nivel: z.enum(NIVELES_PRIORIDAD).default("imprescindible"),
    }),
  ),
  /** Preguntas al cliente: las captura el panel y las responde el cliente desde /d/[slug]. */
  preguntasAbiertas: lista(esquemaPregunta),
  proximosPasos: lista(z.object({ id, texto: texto(LARGO) })),
  adjuntos: lista(z.object({ id, nombre: texto(), descripcion: texto(LARGO) })),
  notasInternas: texto(20_000),
})

export type Contenido = z.infer<typeof esquemaContenido>
export type Actor = Contenido["actores"][number]
export type Flujo = Contenido["flujos"][number]
export type PasoFlujo = Flujo["pasos"][number]
export type FechaCritica = Contenido["restricciones"]["fechasCriticas"][number]
export type Pregunta = Contenido["preguntasAbiertas"][number]
export type Coordenadas = NonNullable<Contenido["contexto"]["coordenadas"]>

// --- Normalización ---

/** Una entrada de lista está vacía si ninguno de sus textos ni sublistas tiene algo. */
function tieneContenido(valor: unknown): boolean {
  if (typeof valor === "string") return valor.length > 0
  if (typeof valor === "number") return true
  if (Array.isArray(valor)) return valor.some(tieneContenido)
  if (valor && typeof valor === "object") {
    return Object.entries(valor).some(
      ([clave, v]) => clave !== "id" && !clave.endsWith("Id") && tieneContenido(v),
    )
  }
  return false
}

function sinVacios<T>(lista: T[]): T[] {
  return lista.filter(tieneContenido)
}

/**
 * Valida y limpia un contenido crudo (del formulario o de la BD):
 * recorta textos, descarta filas vacías y suelta referencias a actores que ya
 * no existen, para que un guardado automático a medio capturar nunca falle
 * por una fila recién agregada o un actor recién borrado.
 */
export function normalizarContenido(crudo: unknown): Contenido {
  const r = esquemaContenido.safeParse(crudo ?? {})
  if (!r.success) {
    const detalle = r.error.issues
      .slice(0, 3)
      .map((i) => `${i.path.join(".") || "contenido"}: ${i.message}`)
      .join("; ")
    throw new DatosInvalidos(`Contenido del levantamiento inválido (${detalle})`)
  }
  const c = r.data

  const actores = sinVacios(c.actores).map((a) => ({
    ...a,
    rangosEdad: RANGOS_EDAD.filter((rango) => a.rangosEdad.includes(rango)),
    dispositivos: DISPOSITIVOS.filter((d) => a.dispositivos.includes(d)),
  }))
  const idsActores = new Set(actores.map((a) => a.id))
  const ref = (actorId: string | null) =>
    actorId && idsActores.has(actorId) ? actorId : null

  return {
    ...c,
    objetivos: sinVacios(c.objetivos),
    actores,
    flujos: sinVacios(c.flujos).map((f) => ({
      ...f,
      pasos: sinVacios(f.pasos).map((p) => ({ ...p, actorId: ref(p.actorId) })),
    })),
    documentos: sinVacios(c.documentos).map((d) => ({
      ...d,
      responsableId: ref(d.responsableId),
    })),
    resultados: sinVacios(c.resultados).map((r) => ({
      ...r,
      destinatarioId: ref(r.destinatarioId),
    })),
    contexto: { ...c.contexto, cifras: sinVacios(c.contexto.cifras) },
    recursos: { ...c.recursos, hardware: sinVacios(c.recursos.hardware) },
    restricciones: {
      ...c.restricciones,
      fechasCriticas: sinVacios(c.restricciones.fechasCriticas),
    },
    integraciones: sinVacios(c.integraciones),
    // El nivel siempre trae valor por defecto: la fila solo cuenta si tiene texto
    prioridades: c.prioridades.filter((p) => p.descripcion.length > 0),
    preguntasAbiertas: sinVacios(c.preguntasAbiertas),
    proximosPasos: sinVacios(c.proximosPasos),
    adjuntos: sinVacios(c.adjuntos),
  }
}

export function contenidoVacio(): Contenido {
  return normalizarContenido({})
}

// --- Secciones y completitud ---

/**
 * Secciones del levantamiento en el orden en que se capturan y se muestran.
 * `publica: false` = nunca sale de la página del cliente.
 */
export const SECCIONES = [
  { clave: "contexto", titulo: "Contexto", publica: true },
  { clave: "problema", titulo: "Problema", publica: true },
  { clave: "objetivos", titulo: "Objetivos", publica: true },
  { clave: "actores", titulo: "Actores", publica: true },
  { clave: "flujos", titulo: "Flujos de trabajo", publica: true },
  { clave: "documentos", titulo: "Documentos actuales", publica: true },
  { clave: "resultados", titulo: "Resultados esperados", publica: true },
  { clave: "recursos", titulo: "Recursos disponibles", publica: true },
  { clave: "integraciones", titulo: "Integraciones", publica: true },
  { clave: "volumen", titulo: "Volumen", publica: true },
  { clave: "restricciones", titulo: "Restricciones", publica: true },
  { clave: "prioridades", titulo: "Prioridades", publica: true },
  { clave: "pendientes", titulo: "Preguntas y próximos pasos", publica: true },
  { clave: "adjuntos", titulo: "Archivos compartidos", publica: true },
  { clave: "notasInternas", titulo: "Notas internas", publica: false },
] as const

export type ClaveSeccion = (typeof SECCIONES)[number]["clave"]

function valorDeSeccion(c: Contenido, clave: ClaveSeccion): unknown {
  if (clave === "pendientes") return [c.preguntasAbiertas, c.proximosPasos]
  return c[clave]
}

/** Qué secciones ya tienen información. Sirve al panel y al brief técnico. */
export function completitud(c: Contenido): Record<ClaveSeccion, boolean> {
  return Object.fromEntries(
    SECCIONES.map((s) => [s.clave, tieneContenido(valorDeSeccion(c, s.clave))]),
  ) as Record<ClaveSeccion, boolean>
}
