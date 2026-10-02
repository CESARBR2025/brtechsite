import { z } from "zod"
import { DatosInvalidos } from "@/src/modules/shared/domain/errors"

/**
 * Contenido del proyecto: la propuesta técnica y comercial (qué se construye,
 * cómo, en cuánto tiempo y a qué costo). Se persiste como JSONB con versión de
 * esquema; si la forma cambia de manera incompatible, se sube la versión y se
 * migra en `normalizarContenido`.
 *
 * Los montos van en centavos (enteros), igual que `Dinero`.
 */
export const VERSION_ESQUEMA_CONTENIDO = 1

export const NIVELES_IMPACTO = ["bajo", "medio", "alto"] as const
export type NivelImpacto = (typeof NIVELES_IMPACTO)[number]

/** Íconos disponibles para las pantallas que verá el cliente. */
export const ICONOS_VISTA = [
  "mapa",
  "ruta",
  "almacen",
  "ventas",
  "catalogo",
  "celular",
  "qr",
  "ticket",
  "usuarios",
  "avisos",
  "reparto",
] as const
export type IconoVista = (typeof ICONOS_VISTA)[number]

/** Dispositivo en el que se ve una maqueta: define en qué pestaña de la propuesta sale. */
export const DISPOSITIVOS_MAQUETA = ["movil", "web"] as const
export type DispositivoMaqueta = (typeof DISPOSITIVOS_MAQUETA)[number]

/** Tipos de requisito que se muestran al cliente, cada uno en su tarjeta. */
export const TIPOS_REQUISITO = ["hardware", "licencia", "operativa"] as const
export type TipoRequisito = (typeof TIPOS_REQUISITO)[number]

// --- Esquema ---

const CORTO = 300
const LARGO = 5000

const texto = (max = CORTO) => z.string().trim().max(max).default("")
const id = z.string().trim().min(1).max(64)
const ref = z.string().trim().max(64).nullable().default(null)
const lista = <T extends z.ZodTypeAny>(item: T, max = 100) => z.array(item).max(max).default([])
// Bloque de campos con default: un objeto ausente se parsea como {}.
const bloque = <T extends z.ZodRawShape>(forma: T) =>
  z.object(forma).prefault({} as z.input<z.ZodObject<T>>)
const centavos = z.number().int().nonnegative().max(1_000_000_000_00).nullable().default(null)
const renglon = z.object({ id, texto: texto(LARGO) })

const esquemaRequerimiento = z.object({
  id,
  /** Clave legible, p. ej. "RF-AUT-01". */
  clave: texto(40),
  texto: texto(LARGO),
  /** Fase en la que se entrega (id de `fases`); null = sin asignar. */
  faseId: ref,
})

const esquemaModulo = z.object({
  id,
  /** Prefijo de sus requerimientos, p. ej. "RF-AUT". */
  clave: texto(40),
  nombre: texto(),
  /** Agrupa módulos en la página (p. ej. "Catálogos", "App del repartidor"). */
  grupo: texto(),
  descripcion: texto(LARGO),
  requerimientos: lista(esquemaRequerimiento, 200),
})

const esquemaFase = z.object({
  id,
  /** Etiqueta corta: "MVP", "F2"… */
  clave: texto(20),
  nombre: texto(),
  lema: texto(),
  /** Forma parte de lo contratado en esta propuesta. */
  contratada: z.boolean().default(false),
  duracion: texto(),
  /** Qué se entrega en la fase y qué resuelve para el negocio. */
  entregables: lista(
    z.object({ id, nombre: texto(), resuelve: texto(LARGO), incluye: texto(LARGO) }),
  ),
  notas: texto(LARGO),
})

const esquemaPago = z.object({
  id,
  nombre: texto(),
  montoCentavos: centavos,
  cuando: texto(),
  /** Contra qué entrega se paga. */
  contra: texto(LARGO),
})

const esquemaTabla = z
  .object({
    columnas: z.array(texto(120)).max(8).default([]),
    filas: z.array(z.array(texto(LARGO)).max(8)).max(60).default([]),
  })
  .nullable()
  .default(null)

export const esquemaContenido = z.object({
  ficha: bloque({
    /** Persona a la que se saluda en la propuesta. */
    contactoNombre: texto(),
    version: texto(20),
    giro: texto(),
    tipoSistema: texto(),
    /** Titular de la portada: el beneficio, en una línea. Vacío = se usa el nombre del producto. */
    titular: texto(),
    /** Foto de la portada: ruta dentro de `public/` (p. ej. "/propuestas/tio-beto.webp"). */
    imagenHero: texto(),
    /** Frase del hero de la propuesta. */
    promesa: texto(),
    objetivo: texto(LARGO),
    entregables: lista(z.object({ id, nombre: texto(), descripcion: texto(LARGO) }), 10),
    /** Datos sueltos de la ficha (Flota, Rutas, Duración…). */
    datos: lista(z.object({ id, etiqueta: texto(60), valor: texto() }), 20),
  }),
  alcance: bloque({
    problemas: lista(renglon, 30),
    areas: lista(z.object({ id, nombre: texto(), descripcion: texto(LARGO) }), 12),
    /** Dónde está el valor central (fórmula, conciliación…). */
    valorCentral: texto(LARGO),
  }),
  /**
   * Lo que el cliente verá y usará en su sistema, en su idioma (no técnico):
   * pantallas agrupadas por dónde se usan ("Panel de administración", "App del repartidor").
   */
  vistas: lista(
    z.object({
      id,
      /** "Panel de administración · web, iPhone y Android": título · subtítulo del grupo. */
      grupo: texto(),
      nombre: texto(),
      icono: z.enum(ICONOS_VISTA).nullable().default(null),
      descripcion: texto(LARGO),
      puntos: lista(renglon, 20),
    }),
    30,
  ),
  /**
   * Maquetas ilustrativas de las pantallas (imágenes en `public/`). Son una
   * vista conceptual: el diseño final se define con el cliente.
   */
  maquetas: lista(
    z.object({
      id,
      dispositivo: z.enum(DISPOSITIVOS_MAQUETA).default("movil"),
      titulo: texto(),
      /** Una línea: qué se ve en la pantalla. */
      descripcion: texto(),
      /** Ruta dentro de `public/` (p. ej. "/propuestas/tio-beto-app-ruta.webp"). */
      imagen: texto(),
    }),
    16,
  ),
  glosario: lista(z.object({ id, termino: texto(), definicion: texto(LARGO) }), 200),
  roles: lista(
    z.object({
      id,
      nombre: texto(),
      quien: texto(),
      dispositivo: texto(),
      responsabilidades: texto(LARGO),
    }),
    20,
  ),
  /** Matriz módulo × rol. `accesos` va de id de rol a texto corto ("CRUD", "Lectura"…). */
  permisos: lista(
    z.object({ id, modulo: texto(), accesos: z.record(z.string().max(64), texto(80)).default({}) }),
    60,
  ),
  modulos: lista(esquemaModulo, 80),
  flujo: lista(
    z.object({
      id,
      nombre: texto(),
      pasos: lista(z.object({ id, texto: texto(LARGO), detalle: texto(LARGO) }), 40),
    }),
    10,
  ),
  decisiones: lista(
    z.object({
      id,
      clave: texto(20),
      decision: texto(LARGO),
      motivo: texto(LARGO),
      descartadas: texto(LARGO),
    }),
    100,
  ),
  arquitectura: bloque({
    resumen: texto(LARGO),
    /** Diagrama en texto monoespaciado. */
    diagrama: texto(LARGO),
    stack: lista(z.object({ id, capa: texto(), tecnologia: texto(LARGO) }), 40),
    notas: lista(z.object({ id, titulo: texto(), texto: texto(LARGO) }), 30),
  }),
  fases: lista(esquemaFase, 10),
  calendario: lista(
    z.object({
      id,
      /** "0", "1-2", "Desde la entrega"… */
      semanas: texto(40),
      /** Nombre corto de la etapa ("App del repartidor"). */
      titulo: texto(),
      entregable: texto(LARGO),
      /** Módulos que se construyen en esas semanas; si hay, se muestran en lugar del entregable. */
      modulos: lista(renglon, 12),
      /** Pago ligado a este hito (id de `inversion.pagos`). */
      pagoId: ref,
    }),
    40,
  ),
  inversion: bloque({
    moneda: texto(3).transform((m) => m.toUpperCase() || "MXN"),
    pagos: lista(esquemaPago, 12),
    /**
     * Descuento opcional sobre el último pago, a cambio de algo que da el
     * cliente (p. ej. ser caso de éxito). El total sigue siendo la suma de los
     * pagos: la bonificación se muestra aparte y se formaliza en el contrato.
     */
    bonificacion: bloque({
      nombre: texto(),
      montoCentavos: centavos,
      /** Qué da el cliente a cambio. */
      condicion: texto(LARGO),
    }),
    condiciones: lista(renglon, 20),
    mensualidad: bloque({
      montoCentavos: centavos,
      descripcion: texto(LARGO),
      incluye: lista(renglon, 20),
      noIncluye: lista(renglon, 20),
    }),
    terceros: lista(z.object({ id, concepto: texto(), costo: texto(), nota: texto(LARGO) }), 20),
  }),
  requisitos: bloque({
    intro: texto(LARGO),
    grupos: lista(
      z.object({
        id,
        nombre: texto(),
        cuando: texto(),
        nota: texto(LARGO),
        items: lista(
          z.object({
            id,
            clave: texto(20),
            que: texto(LARGO),
            paraQue: texto(LARGO),
            formato: texto(),
            bloquea: texto(),
            /** Tarjeta en la que sale en la propuesta; null = solo en el panel. */
            // "software" fue un tipo que ya no existe: lo guardado así queda sin tarjeta
            tipo: z.preprocess(
              (v) => (v === "software" ? null : v),
              z.enum(TIPOS_REQUISITO).nullable().default(null),
            ),
          }),
          40,
        ),
      }),
      12,
    ),
    /** Lo que hacemos nosotros en paralelo. */
    nuestroLado: lista(renglon, 20),
  }),
  riesgos: lista(
    z.object({
      id,
      riesgo: texto(LARGO),
      impacto: z.enum(NIVELES_IMPACTO).nullable().default(null),
      mitigacion: texto(LARGO),
    }),
    60,
  ),
  validacion: bloque({
    objetivo: texto(LARGO),
    alcance: lista(renglon, 30),
    criterios: lista(renglon, 30),
    necesita: texto(LARGO),
  }),
  /** Secciones libres (costos de terceros, cuentas, legal…), con tabla opcional. */
  anexos: lista(
    z.object({ id, titulo: texto(), texto: texto(20_000), tabla: esquemaTabla }),
    30,
  ),
  fuentes: lista(z.object({ id, titulo: texto(), url: texto(1000) }), 60),
  notasInternas: texto(20_000),
})

export type Contenido = z.infer<typeof esquemaContenido>
export type Modulo = Contenido["modulos"][number]
export type Requerimiento = Modulo["requerimientos"][number]
export type Fase = Contenido["fases"][number]
export type Pago = Contenido["inversion"]["pagos"][number]
export type Rol = Contenido["roles"][number]
export type Anexo = Contenido["anexos"][number]
export type Tabla = NonNullable<Anexo["tabla"]>

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
 * Valida y limpia un contenido crudo (del formulario o de la BD): recorta
 * textos, descarta filas vacías y suelta referencias a fases, roles o pagos
 * que ya no existen, para que un guardado automático a medio capturar nunca
 * falle por una fila recién agregada o recién borrada.
 */
export function normalizarContenido(crudo: unknown): Contenido {
  const r = esquemaContenido.safeParse(crudo ?? {})
  if (!r.success) {
    const detalle = r.error.issues
      .slice(0, 3)
      .map((i) => `${i.path.join(".") || "contenido"}: ${i.message}`)
      .join("; ")
    throw new DatosInvalidos(`Contenido del proyecto inválido (${detalle})`)
  }
  const c = r.data

  // Una fase solo con "contratada" marcada no cuenta como capturada
  const fases = c.fases
    .filter((f) => tieneContenido({ ...f, contratada: "" }))
    .map((f) => ({ ...f, entregables: sinVacios(f.entregables) }))
  const idsFases = new Set(fases.map((f) => f.id))
  const roles = sinVacios(c.roles)
  const idsRoles = new Set(roles.map((x) => x.id))
  const pagos = sinVacios(c.inversion.pagos)
  const idsPagos = new Set(pagos.map((p) => p.id))
  const soloSi = (ids: Set<string>) => (v: string | null) => (v && ids.has(v) ? v : null)

  return {
    ...c,
    ficha: {
      ...c.ficha,
      entregables: sinVacios(c.ficha.entregables),
      datos: sinVacios(c.ficha.datos),
    },
    alcance: {
      ...c.alcance,
      problemas: sinVacios(c.alcance.problemas),
      areas: sinVacios(c.alcance.areas),
    },
    vistas: sinVacios(c.vistas).map((v) => ({ ...v, puntos: sinVacios(v.puntos) })),
    // Sin imagen no hay maqueta que mostrar; el dispositivo por sí solo no cuenta como contenido
    maquetas: c.maquetas.filter((m) => m.imagen),
    glosario: sinVacios(c.glosario),
    roles,
    permisos: sinVacios(
      c.permisos.map((p) => ({
        ...p,
        accesos: Object.fromEntries(
          Object.entries(p.accesos).filter(([rolId, v]) => idsRoles.has(rolId) && v),
        ),
      })),
    ),
    modulos: sinVacios(c.modulos).map((m) => ({
      ...m,
      requerimientos: sinVacios(m.requerimientos).map((q) => ({
        ...q,
        faseId: soloSi(idsFases)(q.faseId),
      })),
    })),
    flujo: sinVacios(c.flujo).map((e) => ({ ...e, pasos: sinVacios(e.pasos) })),
    decisiones: sinVacios(c.decisiones),
    arquitectura: {
      ...c.arquitectura,
      stack: sinVacios(c.arquitectura.stack),
      notas: sinVacios(c.arquitectura.notas),
    },
    fases,
    calendario: sinVacios(c.calendario).map((h) => ({
      ...h,
      modulos: sinVacios(h.modulos),
      pagoId: soloSi(idsPagos)(h.pagoId),
    })),
    inversion: {
      ...c.inversion,
      pagos,
      condiciones: sinVacios(c.inversion.condiciones),
      mensualidad: {
        ...c.inversion.mensualidad,
        incluye: sinVacios(c.inversion.mensualidad.incluye),
        noIncluye: sinVacios(c.inversion.mensualidad.noIncluye),
      },
      terceros: sinVacios(c.inversion.terceros),
    },
    requisitos: {
      ...c.requisitos,
      grupos: sinVacios(c.requisitos.grupos).map((g) => ({ ...g, items: sinVacios(g.items) })),
      nuestroLado: sinVacios(c.requisitos.nuestroLado),
    },
    riesgos: c.riesgos.filter((x) => x.riesgo || x.mitigacion),
    validacion: {
      ...c.validacion,
      alcance: sinVacios(c.validacion.alcance),
      criterios: sinVacios(c.validacion.criterios),
    },
    anexos: sinVacios(c.anexos).map((a) => ({
      ...a,
      tabla:
        a.tabla && tieneContenido(a.tabla)
          ? { columnas: a.tabla.columnas, filas: a.tabla.filas.filter(tieneContenido) }
          : null,
    })),
    fuentes: sinVacios(c.fuentes),
  }
}

export function contenidoVacio(): Contenido {
  return normalizarContenido({})
}

// --- Cálculos ---

/** Suma de los pagos del desarrollo, en centavos. */
export function totalInversion(c: Pick<Contenido, "inversion">): number {
  return c.inversion.pagos.reduce((s, p) => s + (p.montoCentavos ?? 0), 0)
}

/**
 * Total del desarrollo si el cliente toma la bonificación, en centavos.
 * null si no hay bonificación o si no cabe en el último pago.
 */
export function totalConBonificacion(c: Pick<Contenido, "inversion">): number | null {
  const monto = c.inversion.bonificacion.montoCentavos ?? 0
  const ultimo = c.inversion.pagos.filter((p) => p.montoCentavos).at(-1)?.montoCentavos ?? 0
  return monto > 0 && monto < ultimo ? totalInversion(c) - monto : null
}

/** Requerimientos que entran en las fases contratadas. */
export function requerimientosContratados(c: Pick<Contenido, "fases" | "modulos">): number {
  const contratadas = new Set(c.fases.filter((f) => f.contratada).map((f) => f.id))
  return c.modulos.reduce(
    (n, m) => n + m.requerimientos.filter((q) => q.faseId && contratadas.has(q.faseId)).length,
    0,
  )
}

// --- Secciones y completitud ---

/**
 * Secciones del proyecto en el orden en que se capturan.
 * `publica: false` = nunca sale de la página del cliente.
 */
export const SECCIONES = [
  { clave: "ficha", titulo: "Ficha del proyecto", publica: true },
  { clave: "alcance", titulo: "Problema y alcance", publica: true },
  { clave: "vistas", titulo: "Lo que verás en tu sistema", publica: true },
  { clave: "maquetas", titulo: "Cómo se vería", publica: true },
  { clave: "roles", titulo: "Roles", publica: true },
  { clave: "permisos", titulo: "Matriz de permisos", publica: false },
  { clave: "fases", titulo: "Fases", publica: true },
  { clave: "modulos", titulo: "Módulos y requerimientos", publica: true },
  { clave: "flujo", titulo: "Flujo operativo", publica: true },
  { clave: "calendario", titulo: "Calendario", publica: true },
  { clave: "inversion", titulo: "Inversión", publica: true },
  { clave: "requisitos", titulo: "Lo que necesitamos del cliente", publica: true },
  { clave: "arquitectura", titulo: "Arquitectura", publica: false },
  { clave: "decisiones", titulo: "Decisiones", publica: false },
  { clave: "riesgos", titulo: "Riesgos", publica: true },
  { clave: "validacion", titulo: "Validación técnica", publica: true },
  { clave: "glosario", titulo: "Glosario", publica: true },
  { clave: "anexos", titulo: "Anexos", publica: true },
  { clave: "fuentes", titulo: "Fuentes", publica: true },
  { clave: "notasInternas", titulo: "Notas internas", publica: false },
] as const

export type ClaveSeccion = (typeof SECCIONES)[number]["clave"]

/** Qué secciones ya tienen información. */
export function completitud(c: Contenido): Record<ClaveSeccion, boolean> {
  return Object.fromEntries(
    SECCIONES.map((s) => [
      s.clave,
      // La moneda siempre trae valor: la inversión cuenta por sus montos y textos
      s.clave === "inversion"
        ? tieneContenido({ ...c.inversion, moneda: "" })
        : tieneContenido(c[s.clave]),
    ]),
  ) as Record<ClaveSeccion, boolean>
}
