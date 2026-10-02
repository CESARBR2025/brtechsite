import {
  ArrowDown,
  ClipboardList,
  KeyRound,
  BarChart3,
  Bell,
  MapPinned,
  MonitorSmartphone,
  Package,
  QrCode,
  Receipt,
  Route,
  Smartphone,
  Truck,
  Users,
  Warehouse,
  Boxes,
  CircleAlert,
  EyeOff,
  FileWarning,
  MapPinOff,
  PackageX,
  UserX,
  FileSignature,
  FileText,
  Fuel,
  Navigation,
  ScrollText,
  ShieldCheck,
  UserCog,
  ShoppingCart,
  Sparkles,
  Store,
  Wrench,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  User,
  Wallet,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { createElement } from "react"
import Image from "next/image"
import type { PropuestaPublicaDTO } from "@/src/modules/proyectos/application/dtos"
import {
  TIPOS_REQUISITO,
  type TipoRequisito,
  type IconoVista,
} from "@/src/modules/proyectos/domain/contenido"
import { formatearFecha } from "@/src/ui/formato"
import { BarraLectura, Revelar } from "@/src/ui/levantamientos/efectos-diagnostico"
import { EMPRESA } from "@/src/ui/marketing/datos-contacto"
import { OndasGradiente } from "@/src/ui/primitivos/ondas-gradiente"
import { TextoDesenfocado } from "@/src/ui/primitivos/texto-desenfocado"
import { AceptarPropuesta } from "./aceptar-propuesta"
import { PestanasSistema } from "./pestanas-sistema"
import { ETIQUETA_TIPO_REQUISITO } from "./etiquetas"
import { NavbarDocumento } from "@/src/ui/primitivos/navbar-documento"

/*
 * Mismo lenguaje que el diagnóstico: hero oscuro de marca a pantalla
 * completa, cuerpo claro con tarjetas blancas y acentos oscuros en las piezas
 * protagonistas (la fase contratada, la inversión, la aceptación).
 */

type C = PropuestaPublicaDTO["contenido"]

const retraso = (ms: number) => ({ animationDelay: `${ms}ms` })
const numero = (i: number) => String(i + 1).padStart(2, "0")

const TARJETA = "rounded-2xl border border-border bg-surface shadow-card"
const REJILLA =
  "absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.07)_1px,transparent_1px)] bg-[size:48px_48px]"

const ICONO_VISTA: Record<IconoVista, LucideIcon> = {
  mapa: MapPinned,
  ruta: Route,
  almacen: Warehouse,
  ventas: BarChart3,
  catalogo: Package,
  celular: Smartphone,
  qr: QrCode,
  ticket: Receipt,
  usuarios: Users,
  avisos: Bell,
  reparto: Truck,
}

const TIPO_REQUISITO: Record<TipoRequisito, { Icono: LucideIcon; nota: string }> = {
  hardware: { Icono: Smartphone, nota: "Equipo y materiales" },
  licencia: { Icono: KeyRound, nota: "Pagos a terceros, a tu nombre" },
  operativa: { Icono: ClipboardList, nota: "Tareas de tu operación" },
}

function dinero(centavos: number, moneda: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: centavos % 100 === 0 ? 0 : 2,
  }).format(centavos / 100)
}

function Seccion({
  id,
  indice,
  etiqueta,
  titulo,
  texto,
  children,
}: {
  id: string
  indice: number
  etiqueta: string
  titulo: string
  texto?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28 py-12 sm:py-20">
      <Revelar>
        <div>
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="tabular-nums">{numero(indice)}</span>
            <span className="h-0.5 w-3 rounded-full bg-current" aria-hidden="true" />
            {etiqueta}
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-[44px]">
            {titulo}
          </h2>
          {texto && (
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
              {texto}
            </p>
          )}
        </div>
      </Revelar>
      <Revelar retrasoMs={120} className="mt-10 sm:mt-12">
        {children}
      </Revelar>
    </section>
  )
}

/** Enlace Markdown: los anclas internas del documento original se muestran como texto. */
function Enlace({ md }: { md: string }) {
  const [, texto, url] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(md)!
  if (!/^https?:\/\//.test(url)) return <>{texto}</>
  return (
    <a href={url} target="_blank" rel="noreferrer noopener" className="font-medium text-primary underline-offset-2 hover:underline">
      {texto}
    </a>
  )
}

/** **negritas**, *cursivas*, `código` y [enlaces](url) dentro de una línea. */
function EnLinea({ texto }: { texto: string }) {
  const partes = texto.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*\s][^*]*\*)/g)
  return (
    <>
      {partes.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-text-primary">
            {p.slice(2, -2)}
          </strong>
        ) : p.startsWith("`") && p.endsWith("`") ? (
          <code key={i} className="break-all rounded bg-bg-section px-1 py-0.5 font-mono text-[0.85em] text-primary-hover">
            {p.slice(1, -1)}
          </code>
        ) : /^\[[^\]]+\]\([^)]+\)$/.test(p) ? (
          <Enlace key={i} md={p} />
        ) : p.length > 2 && p.startsWith("*") && p.endsWith("*") ? (
          <em key={i}>{p.slice(1, -1)}</em>
        ) : (
          p
        ),
      )}
    </>
  )
}

function ChipFase({ clave, contratada }: { clave: string; contratada: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold ${
        contratada ? "bg-primary text-white" : "bg-bg-section text-text-muted ring-1 ring-inset ring-border"
      }`}
    >
      {clave}
    </span>
  )
}

/** "**Alertas automáticas** (`RF-ALR`)" → "Alertas automáticas": sin claves técnicas ni marcas. */
function nombreFuncion(md: string): string {
  return md
    .replace(/\(`[^`]*`\)|\((?:D|RF)-[^)]*\)/g, "")
    .replace(/_?\*?\(opcional\)\*?_?/gi, "")
    .replace(/\*\*/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
}

/**
 * "**Merma operativa**: producto que se pierde…" → título + detalle.
 * Sin dos puntos después de las negritas, todo el texto es el título.
 */
function partesProblema(texto: string): { titulo: string; detalle: string } {
  const m = /^\*\*(.+?)\*\*\s*:\s*(.+)$/.exec(texto.trim())
  if (m) return { titulo: m[1], detalle: m[2].charAt(0).toUpperCase() + m[2].slice(1) }
  return { titulo: texto.replace(/\*\*/g, "").replace(/\.$/, ""), detalle: "" }
}

/**
 * Ancho de la tarjeta `i` de `total` en una rejilla de 6 columnas que acomoda
 * tres por fila: las de la última fila se reparten el ancho, así nunca queda un hueco.
 */
function anchoEnFila(i: number, total: number): string {
  const sobran = total % 3
  if (i < total - sobran) return "lg:col-span-2"
  return sobran === 1 ? "lg:col-span-6" : "lg:col-span-3"
}

/** Ícono de un rol según su nombre. */
function IconoRol({ nombre, className }: { nombre: string; className?: string }) {
  const props = { className, "aria-hidden": true } as const
  if (/super/i.test(nombre)) return <ShieldCheck {...props} />
  if (/admin|gerent/i.test(nombre)) return <UserCog {...props} />
  if (/almac/i.test(nombre)) return <Warehouse {...props} />
  if (/repart|chofer|operador|vended/i.test(nombre)) return <Truck {...props} />
  if (/comerci|cliente/i.test(nombre)) return <Store {...props} />
  return <User {...props} />
}

/** Ícono del dispositivo desde el que entra un rol ("App Android nativa", "Panel web (PWA)"). */
function IconoDispositivo({ texto, className }: { texto: string; className?: string }) {
  const props = { className, "aria-hidden": true } as const
  return /^\W*app\b/i.test(texto) ? <Smartphone {...props} /> : <MonitorSmartphone {...props} />
}

/**
 * Las responsabilidades de un rol como lista: la primera oración se parte por
 * comas (fuera de paréntesis) y el resto queda como nota al pie.
 */
function actividadesRol(texto: string): { actividades: string[]; nota: string } {
  const [primera = "", ...resto] = texto.trim().split(/(?<=\.)\s+/)
  const actividades = primera
    .replace(/\.$/, "")
    .split(/,\s+(?![^()]*\))/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
  return { actividades, nota: resto.join(" ") }
}

/** Ícono de un problema según su texto. */
function iconoProblema(texto: string): LucideIcon {
  if (/merma|pierde/i.test(texto)) return PackageX
  if (/visibilidad|histórico/i.test(texto)) return EyeOff
  if (/inventario|entradas|salidas/i.test(texto)) return Boxes
  if (/responsable|acepta/i.test(texto)) return UserX
  if (/ruta|parada|ubicaci/i.test(texto)) return MapPinOff
  if (/factura|papel|manual/i.test(texto)) return FileWarning
  return CircleAlert
}

/** Ícono de una función futura según su nombre (no hay campo propio para eso). */
const ICONOS_FUNCION: [RegExp, LucideIcon][] = [
  [/alerta|notificaci/i, Bell],
  [/producto extra|pedido/i, ShoppingCart],
  [/comercio|comerciante|portal/i, Store],
  [/tráfico|tiempo real|localizador|gps/i, MapPinned],
  [/navegaci/i, Navigation],
  [/bitácora/i, ScrollText],
  [/mantenimiento/i, Wrench],
  [/documento/i, FileText],
  [/combustible/i, Fuel],
  [/dashboard|analítica|reporte/i, BarChart3],
  [/factura|aspel/i, Receipt],
  [/contrato/i, FileSignature],
]

/** Ícono de un entregable o de una parte del sistema según su nombre. */
function IconoEntregable({ nombre, className }: { nombre: string; className?: string }) {
  const props = { className, "aria-hidden": true } as const
  if (/^app\b|android|ios|celular|móvil/i.test(nombre)) return <Smartphone {...props} />
  if (/panel|web|pwa|portal|sitio/i.test(nombre)) return <MonitorSmartphone {...props} />
  return <Package {...props} />
}

function IconoFuncion({ nombre, className }: { nombre: string; className?: string }) {
  const Icono = ICONOS_FUNCION.find(([r]) => r.test(nombre))?.[1] ?? Sparkles
  return createElement(Icono, { className, "aria-hidden": true })
}

/**
 * "Avisos de parada saltada, desvío y cierre con diferencias" → viñetas.
 * Separa por comas y por la última "y"; si queda en una sola pieza, se deja entera.
 */
function partesIncluye(texto: string): string[] {
  // Comas fuera de paréntesis: "(detalle, taller, fecha)" no se parte
  const partes: string[] = []
  let actual = ""
  let nivel = 0
  for (const ch of texto) {
    if (ch === "(") nivel++
    if (ch === ")") nivel = Math.max(0, nivel - 1)
    if (ch === "," && nivel === 0) {
      partes.push(actual)
      actual = ""
    } else actual += ch
  }
  const ultima = /^(.*\S)\s+y\s+([^()]+)$/.exec(actual)
  partes.push(...(ultima && partes.length > 0 ? [ultima[1], ultima[2]] : [actual]))
  const limpias = partes.map((x) => x.trim()).filter(Boolean)
  // Frases con punto o paréntesis largos se leen mejor completas
  if (limpias.length < 2 || /\.\s/.test(texto)) return [texto]
  // "Pantalla de búsqueda del historial, con filtros por usuario, módulo y fecha": la
  // enumeración cuelga de una frase larga; partida quedarían viñetas de una palabra
  const palabras = (x: string) => x.split(/\s+/).length
  if (palabras(limpias[0]) > 4 && limpias.slice(1).some((x) => palabras(x) === 1)) return [texto]
  return limpias.map((x) => x.charAt(0).toUpperCase() + x.slice(1))
}

/** Cuántas semanas abarca un hito: "3-5" → 3, "7" → 1; "0" o texto libre → 0. */
function duracionSemanas(semanas: string): number {
  const m = /^\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*$/.exec(semanas)
  if (!m) return 0
  const ini = Number(m[1])
  const fin = m[2] ? Number(m[2]) : ini
  return ini === 0 && fin === 0 ? 0 : Math.max(0, fin - Math.max(ini, 1) + 1)
}

function Nodo({ i }: { i: number }) {
  return (
    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface font-mono text-xs font-semibold tabular-nums text-primary shadow-sm transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
      {numero(i)}
    </span>
  )
}

function LineaTiempo() {
  return (
    <span
      aria-hidden="true"
      className="absolute bottom-6 left-5 top-6 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent"
    />
  )
}

/** Página completa de la propuesta del proyecto. */
/**
 * Los módulos de una parte del sistema (el sistema web, la app…): dónde se
 * usa y, por módulo, qué verá el cliente y qué podrá hacer.
 */
function ModulosGrupo({ grupo, vistas }: { grupo: string; vistas: C["vistas"] }) {
  const [titulo, donde] = grupo.split(/\s+·\s+/)
  return (
    <div>
      {titulo && (
        <div className="flex items-center gap-4 rounded-2xl bg-bg-dark p-5 shadow-card sm:p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/25 ring-1 ring-inset ring-primary-light/20">
            <IconoEntregable nombre={titulo} className="h-6 w-6 text-primary-light" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">{titulo}</h3>
            {donde && <p className="mt-0.5 text-pretty text-sm text-white/60 first-letter:uppercase">{donde}</p>}
          </div>
          <p className="ml-auto hidden shrink-0 text-right sm:block">
            <span className="block font-display text-3xl font-bold leading-none text-white tabular-nums">
              {vistas.length}
            </span>
            <span className="text-xs text-white/55">{vistas.length === 1 ? "módulo" : "módulos"}</span>
          </p>
        </div>
      )}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vistas.map((v, i) => {
          const IconoVista = ICONO_VISTA[v.icono ?? "celular"]
          return (
            <div
              key={v.id}
              className={`${TARJETA} flex flex-col p-6 transition-all hover:border-primary/30 hover:shadow-hover`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-sm">
                  <IconoVista className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs font-semibold tabular-nums text-text-muted">
                  Módulo {numero(i)}
                </span>
              </div>
              <h4 className="mt-4 text-lg font-semibold leading-snug text-text-primary">{v.nombre}</h4>
              {v.descripcion && (
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-text-secondary">
                  <EnLinea texto={v.descripcion} />
                </p>
              )}
              {v.puntos.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                    Qué podrás hacer
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {v.puntos.map((x) => (
                      <li key={x.id} className="flex gap-2.5 text-sm leading-snug text-text-secondary">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                        <span>
                          <EnLinea texto={x.texto} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** "F2" → "Fase 2"; cualquier otra clave se deja como está. */
function nombreFase(clave: string): string {
  const m = /^F\s*(\d+)$/i.exec(clave.trim())
  return m ? `Fase ${m[1]}` : clave
}

/**
 * Una fase futura: de qué trata y, por función, qué le resuelve al negocio y
 * qué incluye.
 */
function FuncionesFase({ fase }: { fase: C["fases"][number] }) {
  return (
    <div>
      <div className="flex items-center gap-4 rounded-2xl bg-bg-dark p-5 shadow-card sm:p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/25 ring-1 ring-inset ring-primary-light/20">
          <Sparkles className="h-6 w-6 text-primary-light" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-light/80">
            {nombreFase(fase.clave)}
          </p>
          <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">{fase.nombre}</h3>
          {fase.lema && <p className="mt-0.5 text-pretty text-sm text-white/60">{fase.lema}</p>}
        </div>
        <p className="ml-auto hidden shrink-0 text-right sm:block">
          <span className="block font-display text-3xl font-bold leading-none text-white tabular-nums">
            {fase.entregables.length}
          </span>
          <span className="text-xs text-white/55">{fase.entregables.length === 1 ? "función" : "funciones"}</span>
        </p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {fase.entregables.map((e) => {
          const nombre = nombreFuncion(e.nombre)
          const opcional = /opcional/i.test(e.nombre)
          return (
            <div
              key={e.id}
              className={`${TARJETA} flex flex-col p-6 transition-all hover:border-primary/30 hover:shadow-hover`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-sm">
                  <IconoFuncion nombre={nombre} className="h-5 w-5" />
                </span>
                {opcional && (
                  <span className="rounded-full bg-bg-section px-2.5 py-0.5 text-[11px] font-medium text-text-muted ring-1 ring-inset ring-border">
                    Opcional
                  </span>
                )}
              </div>
              <h4 className="mt-4 text-lg font-semibold leading-snug text-text-primary">{nombre}</h4>
              {e.resuelve && (
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-text-secondary">
                  <EnLinea texto={e.resuelve} />
                </p>
              )}
              {e.incluye && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Qué incluye</p>
                  <ul className="mt-3 space-y-2.5">
                    {partesIncluye(e.incluye).map((x) => (
                      <li key={x} className="flex gap-2.5 text-sm leading-snug text-text-secondary">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/50" aria-hidden="true" />
                        <span>
                          <EnLinea texto={x} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Propuesta({ p, puedeFirmar = false }: { p: PropuestaPublicaDTO; puedeFirmar?: boolean }) {
  const c: C = p.contenido
  const moneda = c.inversion.moneda || "MXN"

  const contratadas = c.fases.filter((f) => f.contratada)
  const fasesFuturas = c.fases.filter((f) => !f.contratada && f.entregables.length > 0)
  // Pantallas agrupadas por dónde se usan, en el orden en que se capturaron
  const gruposVistas = [...c.vistas.reduce((m, v) => m.set(v.grupo, [...(m.get(v.grupo) ?? []), v]), new Map<string, C["vistas"]>())]
  const etapasIncluidas = contratadas.flatMap((f) =>
    f.entregables.map((e) => ({ ...e, fase: f.clave })),
  )
  const pago = new Map(c.inversion.pagos.map((x) => [x.id, x]))
  const total = p.totalCentavos
  // Tramos de la barra del calendario: solo las etapas con semanas numéricas ("3-5")
  const tramos = c.calendario
    .map((h) => ({
      id: h.id,
      semanas: h.semanas.replace(/\s+/g, ""),
      titulo: h.titulo,
      dura: duracionSemanas(h.semanas),
      conPago: Boolean(h.pagoId && pago.get(h.pagoId)?.montoCentavos),
    }))
    .filter((t) => t.dura > 0)
  const semanasTotales = tramos.reduce((n, t) => n + t.dura, 0)
  const mensual = c.inversion.mensualidad


  const roles = c.roles.filter((r) => r.nombre)
  const hayAlcance = c.alcance.problemas.length > 0
  const hayInversion = total > 0 || mensual.montoCentavos != null || c.inversion.terceros.length > 0
  // Al cliente solo se le muestra lo que tiene tipo, una tarjeta por tipo
  const requisitosPorTipo = TIPOS_REQUISITO.map((tipo) => ({
    tipo,
    items: c.requisitos.grupos.flatMap((g) => g.items.filter((r) => r.tipo === tipo)),
  })).filter((x) => x.items.length > 0)
  const hayRequisitos = requisitosPorTipo.length > 0

  const indice = [
    { id: "reto", titulo: "El reto", mostrar: hayAlcance },
    { id: "personas", titulo: "Personas", mostrar: roles.length > 0 },
    { id: "tu-sistema", titulo: "Tu sistema", mostrar: c.vistas.length > 0 || etapasIncluidas.length > 0 },
    { id: "calendario", titulo: "Calendario", mostrar: c.calendario.length > 0 },
    { id: "inversion", titulo: "Inversión", mostrar: hayInversion },
    { id: "tu-lado", titulo: "Lo que necesitamos", mostrar: hayRequisitos },
    { id: "futuras", titulo: "Lo que sigue", mostrar: fasesFuturas.length > 0 },
    { id: "aceptar", titulo: "Aceptar", mostrar: true },
  ].filter((x) => x.mostrar)
  const num = (id: string) => indice.findIndex((x) => x.id === id)
  // Atajos del encabezado: solo las secciones que el cliente más consulta
  const ATAJOS: Record<string, string> = {
    "tu-sistema": "Tu sistema",
    calendario: "Calendario",
    inversion: "Inversión",
    "tu-lado": "Tu parte",
  }
  const atajos = indice.filter((x) => x.id in ATAJOS).map((x) => ({ id: x.id, titulo: ATAJOS[x.id] }))

  const local = (ruta: string) => (/^\/[^/]/.test(ruta) ? ruta : null)
  const imagenHero = local(c.ficha.imagenHero)
  const pagos = c.inversion.pagos.filter((x) => x.montoCentavos)

  return (
    <main className="min-h-screen bg-bg-section">
      <BarraLectura />

      <NavbarDocumento
        enlaces={atajos}
        accion={{ texto: "Aceptar propuesta", href: "#aceptar" }}
        cumplido={p.aceptacion ? "Aceptada" : null}
      />

      {/*
        Portada, como la de un documento: qué es (propuesta de desarrollo) y de
        qué producto, su promesa en una línea y, al pie, la ficha: para quién,
        de quién, folio y fecha. Texto a la izquierda y, si hay foto, fundida a
        la derecha (arriba en celular) sobre las ondas de marca.
      */}
      <section id="portada" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-bg-deep">
        {/* Resplandor base (también es el respaldo sin WebGL) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(120,54,226,0.32),transparent_70%)]"
        />
        <div className="absolute inset-0 -z-20">
          <OndasGradiente />
        </div>
        {imagenHero && (
          <>
            <div className="absolute inset-x-0 top-0 -z-10 h-80 [mask-image:linear-gradient(to_bottom,black_35%,transparent)] sm:h-96 lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[70%] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_45%)]">
              <Image
                src={imagenHero}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="object-cover object-[78%_center] lg:object-center"
              />
            </div>
            {/* Contraste para el texto: velo lateral en escritorio */}
            <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-bg-deep/75 via-bg-deep/25 to-transparent lg:block" />
          </>
        )}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-b from-transparent to-bg-deep/85" />

        {/* pt deja libre el espacio del encabezado de vidrio (fijo) */}
        <div
          className={`flex w-full flex-1 flex-col justify-end px-5 pb-10 sm:px-8 lg:justify-center lg:px-16 xl:px-24 ${
            imagenHero ? "pt-64 sm:pt-80 lg:pt-32" : "pt-28 sm:pt-32"
          }`}
        >
          {p.aceptacion && (
            <p
              style={retraso(0)}
              className="mb-6 inline-flex items-center gap-1.5 self-start rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success motion-safe:animate-aparecer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Aceptada
            </p>
          )}

          {/* El título es el del documento: qué es y, en grande, el nombre del producto */}
          <h1 className="max-w-4xl text-white [text-shadow:0_2px_40px_rgba(0,0,0,0.45)]">
            <span
              style={retraso(0)}
              className={
                p.proyectoNombre
                  ? "flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-white/70 motion-safe:animate-aparecer sm:gap-4 sm:text-sm"
                  : "block text-balance pb-1 font-hero text-[40px] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-6xl lg:text-7xl"
              }
            >
              {p.proyectoNombre && (
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary-light/70 sm:w-14" aria-hidden="true" />
              )}
              Propuesta de desarrollo
            </span>
            {p.proyectoNombre && (
              <span className="mt-5 block text-balance pb-1 font-hero text-[44px] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-7xl lg:text-[88px]">
                <TextoDesenfocado texto={p.proyectoNombre} retrasoMs={200} />
              </span>
            )}
          </h1>

          {c.ficha.titular && (
            <p
              style={retraso(500)}
              className="mt-5 max-w-2xl text-pretty font-display text-xl font-medium leading-snug text-white/90 motion-safe:animate-aparecer sm:text-2xl"
            >
              {c.ficha.titular}
            </p>
          )}

          {c.ficha.tipoSistema && (
            <p
              style={retraso(580)}
              className="mt-2 max-w-2xl text-pretty text-sm text-white/55 motion-safe:animate-aparecer sm:text-base"
            >
              {c.ficha.tipoSistema}
            </p>
          )}

          <a
            style={retraso(700)}
            href={`#${indice[0].id}`}
            className="group mt-9 inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-primary/60 hover:bg-primary/20 active:scale-[0.98] motion-safe:animate-aparecer sm:mt-10"
          >
            Ver la propuesta
            <ArrowDown className="h-4 w-4 text-primary-light transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
          </a>
        </div>

        {/* Pie de portada: la ficha del documento */}
        <dl
          style={retraso(850)}
          className="relative grid w-full grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 px-5 py-6 motion-safe:animate-aparecer sm:px-8 sm:py-8 lg:grid-cols-[1.4fr_1.4fr_1fr_1fr] lg:px-16 xl:px-24"
        >
          {[
            {
              rotulo: "Preparada para",
              valor: c.ficha.contactoNombre || p.cliente.nombre,
              nota: c.ficha.contactoNombre ? p.cliente.nombre : "",
            },
            { rotulo: "Preparada por", valor: EMPRESA.fundador, nota: EMPRESA.nombre },
            { rotulo: "Folio", valor: p.folio, nota: "" },
            { rotulo: "Fecha", valor: formatearFecha(p.fechaPropuesta), nota: "" },
          ].map((x) => (
            <div key={x.rotulo}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">{x.rotulo}</dt>
              <dd className="mt-2 text-sm font-medium text-white tabular-nums sm:text-base">
                {x.valor}
                {x.nota && <span className="mt-0.5 block text-xs font-normal text-white/55 sm:text-sm">{x.nota}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* El reto */}
        {hayAlcance && (
          <Seccion id="reto" indice={num("reto")} etiqueta="El reto" titulo="Qué resolvemos y hasta dónde llega">
            <div className="space-y-8">
              {c.alcance.problemas.length > 0 && (
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                      <span className="h-6 w-1 rounded-full bg-text-primary/25" aria-hidden="true" />
                      La situación actual
                    </h3>
                    <p className="text-sm text-text-muted">
                      {c.alcance.problemas.length === 1
                        ? "Un problema que el sistema resuelve"
                        : `${c.alcance.problemas.length} problemas que el sistema resuelve`}
                    </p>
                  </div>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                    {c.alcance.problemas.map((x, i) => {
                      const { titulo, detalle } = partesProblema(x.texto)
                      const Icono = iconoProblema(x.texto)
                      return (
                        <li
                          key={x.id}
                          className={`${TARJETA} p-6 transition-all hover:border-primary/30 hover:shadow-hover ${anchoEnFila(i, c.alcance.problemas.length)}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-bg-dark text-primary-light">
                              <Icono className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span className="font-mono text-xs font-semibold tabular-nums text-text-muted">{numero(i)}</span>
                          </div>
                          <p className="mt-4 font-display text-lg font-semibold leading-snug text-text-primary">{titulo}</p>
                          {detalle && (
                            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-text-secondary">
                              <EnLinea texto={detalle} />
                            </p>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </Seccion>
        )}

        {/* Personas: cada rol con su dispositivo y sus actividades */}
        {roles.length > 0 && (
          <Seccion
            id="personas"
            indice={num("personas")}
            etiqueta="Las personas"
            titulo="Quién usa el sistema"
            texto={`${roles.length === 1 ? "Un rol" : `${roles.length} roles`}, cada uno con su acceso y sus actividades.`}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              {roles.map((r, i) => {
                const { actividades, nota } = actividadesRol(r.responsabilidades)
                const sobran = roles.length % 3
                const ultimaFila = i >= roles.length - sobran
                const ancho = anchoEnFila(i, roles.length)
                return (
                  <div
                    key={r.id}
                    className={`${TARJETA} flex flex-col p-6 transition-all hover:border-primary/30 hover:shadow-hover ${ancho}`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-dark text-primary-light">
                        <IconoRol nombre={r.nombre} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-semibold leading-snug text-text-primary">{r.nombre}</h3>
                        {r.quien && <p className="text-sm text-text-muted">{r.quien}</p>}
                      </div>
                    </div>
                    {r.dispositivo && (
                      <p className="mt-4 inline-flex items-start gap-2 self-start rounded-xl bg-primary-light/60 px-3 py-1.5 text-xs font-medium leading-snug text-primary-hover ring-1 ring-inset ring-primary/15">
                        <IconoDispositivo texto={r.dispositivo} className="mt-px h-3.5 w-3.5 shrink-0" />
                        <span>
                          <EnLinea texto={r.dispositivo.replace(/\*\*/g, "")} />
                        </span>
                      </p>
                    )}
                    {actividades.length > 0 && (
                      <div className="mt-5 border-t border-border pt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                          Sus actividades
                        </p>
                        <ul
                          className={`mt-3 grid gap-x-6 gap-y-2.5 ${ultimaFila && sobran > 0 ? "sm:grid-cols-2" : ""}`}
                        >
                          {actividades.map((x) => (
                            <li key={x} className="flex gap-2.5 text-sm leading-snug text-text-secondary">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                              <span className="text-pretty">
                                <EnLinea texto={x} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {nota && (
                      <p className="mt-4 text-pretty text-xs leading-relaxed text-text-muted [&_strong]:font-semibold [&_strong]:text-text-secondary">
                        <EnLinea texto={nota} />
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </Seccion>
        )}

        {/* Tu sistema: lo que el cliente verá y usará (o, si no se capturó, las etapas) */}
        {(c.vistas.length > 0 || etapasIncluidas.length > 0) && (
          <Seccion
            id="tu-sistema"
            indice={num("tu-sistema")}
            etiqueta="Tu sistema"
            titulo="Lo que contendrá tu sistema"
            texto={
              contratadas[0]
                ? `Esto es lo que tendrás funcionando al terminar ${contratadas[0].clave === "MVP" ? "la primera etapa" : contratadas[0].nombre.toLowerCase()}${contratadas[0].duracion ? `, en ${contratadas[0].duracion}` : ""}.`
                : undefined
            }
          >
            {c.vistas.length > 0 ? (
              gruposVistas.length > 1 ? (
                <PestanasSistema
                  nombre="Partes del sistema"
                  prefijo="sistema"
                  pestanas={gruposVistas.map(([grupo, vistas], i) => {
                    const titulo = grupo.split(/\s+·\s+/)[0] || "Sistema"
                    return {
                      id: String(i),
                      titulo,
                      cuenta: vistas.length,
                      icono: <IconoEntregable nombre={titulo} className="h-4 w-4" />,
                      panel: <ModulosGrupo grupo={grupo} vistas={vistas} />,
                    }
                  })}
                />
              ) : (
                <ModulosGrupo grupo={gruposVistas[0][0]} vistas={gruposVistas[0][1]} />
              )
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {etapasIncluidas.map((e, i) => (
                  <div key={e.id} className={`${TARJETA} flex flex-col p-5 sm:p-6`}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs font-semibold tabular-nums text-primary">{numero(i)}</span>
                      <ChipFase clave={e.fase} contratada />
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-snug text-text-primary">{e.nombre}</h3>
                    {e.incluye && <p className="mt-2 text-sm leading-relaxed text-text-secondary">{e.incluye}</p>}
                  </div>
                ))}
              </div>
            )}
          </Seccion>
        )}

        {/* Calendario: el reparto de las semanas, los módulos de cada etapa y el pago que le toca */}
        {c.calendario.length > 0 && (
          <Seccion
            id="calendario"
            indice={num("calendario")}
            etiqueta="El calendario"
            titulo="El proceso, semana a semana"
          >
            {/* Barra del proyecto: cada tramo mide lo que dura su etapa */}
            {tramos.length > 1 && (
              <div className="mb-6 rounded-2xl bg-bg-dark p-5 shadow-card sm:p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light/80">
                    {semanasTotales} semanas de desarrollo
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-white/55">
                    <Wallet className="h-3.5 w-3.5 text-primary-light" aria-hidden="true" /> Pago al cierre de la etapa
                  </p>
                </div>
                <div className="mt-4 flex gap-1">
                  {tramos.map((t, k) => (
                    <div key={t.id} style={{ flexGrow: t.dura }} className="min-w-0 basis-0">
                      <div
                        className={`relative h-2.5 rounded-full ${
                          ["bg-primary-light", "bg-primary", "bg-primary-hover"][k % 3]
                        }`}
                      >
                        {t.conPago && (
                          <span className="absolute -right-1 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-2 ring-bg-dark">
                            <Wallet className="h-3 w-3" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                      <p className="mt-2.5 truncate font-mono text-[11px] font-semibold tabular-nums text-white/80">
                        S{t.semanas}
                      </p>
                      {t.titulo && <p className="hidden truncate text-xs text-white/55 sm:block">{t.titulo}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ol className="relative space-y-4">
              <LineaTiempo />
              {c.calendario.map((h, i) => {
                const x = h.pagoId ? pago.get(h.pagoId) : null
                const dura = duracionSemanas(h.semanas)
                return (
                  <li key={h.id} className="group relative grid grid-cols-[2.5rem_1fr] gap-x-4">
                    <div className="pt-5">
                      <Nodo i={i} />
                    </div>
                    <div className={`${TARJETA} overflow-hidden`}>
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                            {/^\d/.test(h.semanas) ? `Semana${/[-–,]/.test(h.semanas) ? "s" : ""} ${h.semanas}` : h.semanas}
                          </p>
                          {dura > 1 && (
                            <span className="rounded-full bg-bg-section px-2.5 py-0.5 text-xs text-text-muted ring-1 ring-inset ring-border">
                              {dura} semanas
                            </span>
                          )}
                        </div>
                        {h.titulo && (
                          <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-text-primary sm:text-xl">
                            {h.titulo}
                          </h3>
                        )}
                        {h.modulos.length > 0 ? (
                          <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                            {h.modulos.map((m) => (
                              <li key={m.id} className="flex gap-2.5 text-sm leading-relaxed text-text-secondary">
                                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                                <span className="text-pretty [&_strong]:font-semibold [&_strong]:text-text-primary">
                                  <EnLinea texto={m.texto} />
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          h.entregable && (
                            <p
                              className={`text-pretty text-text-primary ${
                                h.titulo ? "mt-2 text-sm leading-relaxed text-text-secondary" : "mt-1 text-base font-medium"
                              }`}
                            >
                              <EnLinea texto={h.entregable} />
                            </p>
                          )
                        )}
                      </div>
                      {x && x.montoCentavos != null && (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border bg-primary-light/50 px-5 py-3 sm:px-6">
                          <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
                          <p className="text-sm font-semibold text-primary-hover">
                            Pago de esta etapa: {x.nombre}
                            {x.cuando && <span className="font-normal text-primary/80"> · {x.cuando.toLowerCase()}</span>}
                          </p>
                          <p className="ml-auto font-display text-lg font-bold tabular-nums text-text-primary">
                            {dinero(x.montoCentavos, moneda)}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </Seccion>
        )}

        {/* Inversión: el total, los pagos, las condiciones, la mensualidad y lo que paga el cliente a terceros */}
        {hayInversion && (
          <Seccion
            id="inversion"
            indice={num("inversion")}
            etiqueta="La inversión"
            titulo="Claro desde el principio"
            texto={`Montos en ${moneda === "MXN" ? "pesos mexicanos" : moneda}.`}
          >
            <div className="space-y-5">
              {total > 0 && (
                <>
                  {/* El total y cómo se reparte entre los pagos */}
                  <div className="relative isolate overflow-hidden rounded-3xl bg-bg-dark p-6 shadow-glow ring-1 ring-inset ring-white/10 sm:p-10">
                    <div aria-hidden="true" className={`${REJILLA} -z-10 [mask-image:linear-gradient(to_left,black,transparent_75%)]`} />
                    <div aria-hidden="true" className="absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
                    <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-14">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-light/80">
                          Desarrollo {contratadas.map((f) => f.clave).join(" + ")}
                        </p>
                        <p className="mt-3 font-display text-5xl font-bold tracking-tight text-white tabular-nums sm:text-7xl">
                          {dinero(total, moneda)}
                        </p>
                        <p className="mt-3 text-sm text-white/60">
                          En {pagos.length} {pagos.length === 1 ? "pago ligado a una entrega concreta" : "pagos ligados a entregas concretas"}.
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        {pagos.map((x, i) => (
                          <div key={x.id} style={{ flexGrow: x.montoCentavos! }} className="min-w-0 basis-0">
                            <div className={`h-2.5 rounded-full ${["bg-primary-light", "bg-primary", "bg-primary-hover"][i % 3]}`} />
                            <p className="mt-3 truncate text-xs text-white/55">{x.nombre}</p>
                            <p className="truncate font-display text-base font-semibold text-white tabular-nums sm:text-xl">
                              {dinero(x.montoCentavos!, moneda)}
                            </p>
                            <p className="truncate text-xs text-white/55">{Math.round((x.montoCentavos! / total) * 100)} %</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cada pago: cuándo, cuánto y contra qué entrega */}
                  <div className={`grid gap-4 ${c.inversion.pagos.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
                    {c.inversion.pagos.map((x, i) => (
                      <div key={x.id} className={`${TARJETA} flex flex-col p-6`}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-dark font-mono text-xs font-bold text-primary-light">
                            {numero(i)}
                          </span>
                          {x.cuando && (
                            <span className="rounded-full bg-primary-light/60 px-3 py-1 text-xs font-medium text-primary-hover ring-1 ring-inset ring-primary/15">
                              {x.cuando}
                            </span>
                          )}
                        </div>
                        <p className="mt-4 text-sm font-semibold text-text-secondary">{x.nombre}</p>
                        {x.montoCentavos != null && (
                          <p className="font-display text-3xl font-bold tracking-tight text-text-primary tabular-nums">
                            {dinero(x.montoCentavos, moneda)}
                          </p>
                        )}
                        {x.contra && (
                          <div className="mt-4 border-t border-border pt-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                              Se paga contra
                            </p>
                            <p className="mt-2 text-pretty text-sm leading-relaxed text-text-secondary [&_strong]:font-semibold [&_strong]:text-text-primary">
                              <EnLinea texto={x.contra} />
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {c.inversion.condiciones.length > 0 && (
                <div className={`${TARJETA} p-6 sm:p-8`}>
                  <h3 className="font-display text-lg font-semibold text-text-primary">Condiciones</h3>
                  <ul className="mt-4 grid gap-x-10 gap-y-4 md:grid-cols-2">
                    {c.inversion.condiciones.map((x) => (
                      <li key={x.id} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span className="text-pretty [&_strong]:font-semibold [&_strong]:text-text-primary">
                          <EnLinea texto={x.texto} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(mensual.montoCentavos != null || mensual.incluye.length > 0) && (
                <div className={`${TARJETA} grid overflow-hidden lg:grid-cols-[0.8fr_1.6fr]`}>
                  <div className="border-b border-border bg-primary-light/40 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      <span className="h-px w-8 bg-primary" />
                      Cada mes
                    </p>
                    <h3 className="mt-4 font-display text-lg font-semibold text-text-primary">Hospedaje y mantenimiento</h3>
                    {mensual.montoCentavos != null && (
                      <p className="mt-2 font-display text-4xl font-bold tracking-tight text-text-primary tabular-nums sm:text-5xl">
                        {dinero(mensual.montoCentavos, moneda)}
                        <span className="text-base font-medium text-text-muted"> /mes</span>
                      </p>
                    )}
                    {mensual.descripcion && (
                      <p className="mt-3 text-pretty text-sm leading-relaxed text-text-secondary">
                        <EnLinea texto={mensual.descripcion} />
                      </p>
                    )}
                  </div>
                  <div className="p-6 sm:p-8">
                    {mensual.incluye.length > 0 && (
                      <>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Incluye</p>
                        <ul className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                          {mensual.incluye.map((x) => (
                            <li key={x.id} className="flex gap-2.5 text-sm leading-snug text-text-secondary">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                              <span>
                                <EnLinea texto={x.texto} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {mensual.noIncluye.length > 0 && (
                      <div className={mensual.incluye.length > 0 ? "mt-6 border-t border-border pt-5" : ""}>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">No incluye</p>
                        <ul className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                          {mensual.noIncluye.map((x) => (
                            <li key={x.id} className="flex gap-2.5 text-sm leading-snug text-text-muted">
                              <span className="mt-2 h-px w-3 shrink-0 bg-text-muted" aria-hidden="true" />
                              <span>
                                <EnLinea texto={x.texto} />
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {c.inversion.terceros.length > 0 && (
                <div className={`${TARJETA} p-6 sm:p-8`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-lg font-semibold text-text-primary">Pagos únicos y costos de terceros</h3>
                    <p className="text-xs text-text-muted">A cargo del cliente</p>
                  </div>
                  <ul className="mt-4 divide-y divide-border">
                    {c.inversion.terceros.map((x) => {
                      // "Navegación _(opcional, fase futura)_" → nombre + etiqueta
                      const marca = /_\(([^)]*)\)_/.exec(x.concepto)
                      return (
                        <li key={x.id} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                          <div>
                            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-semibold text-text-primary">
                              <EnLinea texto={x.concepto.replace(/\s*_\([^)]*\)_/, "")} />
                              {marca && (
                                <span className="rounded-full bg-bg-section px-2.5 py-0.5 text-[11px] font-medium text-text-muted ring-1 ring-inset ring-border first-letter:uppercase">
                                  {marca[1]}
                                </span>
                              )}
                            </p>
                            {x.nota && (
                              <p className="mt-0.5 text-xs text-text-muted">
                                <EnLinea texto={x.nota} />
                              </p>
                            )}
                          </div>
                          <p className="shrink-0 text-sm font-medium text-text-primary sm:max-w-[45%] sm:text-right">
                            <EnLinea texto={x.costo} />
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          </Seccion>
        )}

        {/* Lo que necesitamos de su lado: una tarjeta por tipo */}
        {hayRequisitos && (
          <Seccion
            id="tu-lado"
            indice={num("tu-lado")}
            etiqueta="Tu parte"
            titulo="Lo que necesitamos de tu lado"
            texto="Con esto listo, arrancamos en la fecha acordada."
          >
            <div className={`grid items-start gap-4 ${requisitosPorTipo.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
              {requisitosPorTipo.map(({ tipo, items }) => {
                const { Icono, nota } = TIPO_REQUISITO[tipo]
                return (
                  <div key={tipo} className={`${TARJETA} p-6`}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-sm">
                        <Icono className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-semibold leading-tight text-text-primary">
                          {ETIQUETA_TIPO_REQUISITO[tipo]}
                        </h3>
                        <p className="text-xs text-text-muted">{nota}</p>
                      </div>
                      <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-light px-2 font-mono text-xs font-semibold text-primary">
                        {items.length}
                      </span>
                    </div>
                    <ul className="mt-5 space-y-4 border-t border-border pt-5">
                      {items.map((r) => {
                        // Un "✔" al inicio marca lo que el cliente ya entregó
                        const listo = /^\s*✔/.test(r.que)
                        return (
                          <li key={r.id} className="flex gap-3">
                            {listo ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                            ) : (
                              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                            )}
                            <div className={listo ? "min-w-0" : "min-w-0 pl-[5px]"}>
                              <p className="text-pretty text-sm leading-snug text-text-primary [&_strong]:font-semibold">
                                <EnLinea texto={r.que.replace(/^\s*✔\s*/, "")} />
                              </p>
                              {r.paraQue && (
                                <p className="mt-1 text-pretty text-xs leading-relaxed text-text-muted">
                                  <EnLinea texto={r.paraQue} />
                                </p>
                              )}
                              {listo && <p className="mt-1 text-xs font-medium text-success">Ya lo tenemos</p>}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </Seccion>
        )}

        {/*
          Lo que viene después: las funciones ya mapeadas de cada fase siguiente,
          una fase por pestaña. Va después de la inversión y de lo que le toca
          al cliente, para no mezclar lo contratado con lo que se cotiza aparte.
        */}
        {fasesFuturas.length > 0 && (
          <Seccion
            id="futuras"
            indice={num("futuras")}
            etiqueta="Lo que sigue"
            titulo="Lo que viene después"
            texto="Tu sistema va a seguir creciendo. Estas funciones ya están diseñadas y listas para cuando el negocio las necesite; se cotizan por separado, por función o por fase."
          >
            {fasesFuturas.length > 1 ? (
              <PestanasSistema
                nombre="Fases futuras"
                prefijo="fase"
                pestanas={fasesFuturas.map((f) => ({
                  id: f.id,
                  titulo: nombreFase(f.clave),
                  cuenta: f.entregables.length,
                  icono: <Sparkles className="h-4 w-4" aria-hidden="true" />,
                  panel: <FuncionesFase fase={f} />,
                }))}
              />
            ) : (
              <FuncionesFase fase={fasesFuturas[0]} />
            )}
          </Seccion>
        )}

        {/* Glosario: anexo de consulta, plegado para no alargar el camino a la firma */}
        {c.glosario.length > 0 && (
          <Revelar>
            <details id="glosario" className={`${TARJETA} group scroll-mt-28`}>
              <summary className="flex cursor-pointer list-none items-center gap-4 p-6 sm:px-8 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">
                  <span className="block font-display text-lg font-semibold text-text-primary">Glosario</span>
                  <span className="block text-sm text-text-muted">
                    {c.glosario.length === 1
                      ? "El término que usamos en esta propuesta"
                      : `Los ${c.glosario.length} términos que usamos en esta propuesta`}
                  </span>
                </span>
                <ChevronDown
                  className="ml-auto h-5 w-5 shrink-0 text-text-muted transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <dl className="grid gap-x-10 border-t border-border px-6 pb-4 sm:grid-cols-2 sm:px-8">
                {c.glosario.map((t) => (
                  <div key={t.id} className="border-b border-border py-4">
                    <dt className="text-sm font-semibold text-text-primary">{t.termino}</dt>
                    <dd className="mt-1 text-pretty text-sm leading-relaxed text-text-secondary">
                      <EnLinea texto={t.definicion} />
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
          </Revelar>
        )}

        {/* Aceptar */}
        <Seccion
          id="aceptar"
          indice={num("aceptar")}
          etiqueta="Tu decisión"
          titulo={p.aceptacion ? "¡Arrancamos!" : "¿Empezamos?"}
          texto={
            p.aceptacion
              ? undefined
              : "Si todo está claro, firma la propuesta aquí mismo. Si algo no te convence, escríbenos y lo ajustamos."
          }
        >
          <AceptarPropuesta
            slug={p.slug}
            total={dinero(total, moneda)}
            aceptacion={p.aceptacion}
            sugerido={c.ficha.contactoNombre}
            desarrollador={{
              nombre: EMPRESA.fundador,
              empresa: EMPRESA.nombre,
              fecha: p.publicadoEn ?? p.fechaPropuesta,
              firma: p.firmaDesarrollador,
              puedeFirmar,
            }}
          />
        </Seccion>
      </div>

      <footer className="border-t border-line-dark bg-bg-dark px-4 py-8 text-center text-xs text-white/55">
        {c.fuentes.length > 0 && (
          <details className="mx-auto mb-6 max-w-3xl text-left">
            <summary className="cursor-pointer text-center text-white/60 hover:text-white">
              Fuentes consultadas ({c.fuentes.length})
            </summary>
            <ul className="mt-4 space-y-2">
              {c.fuentes.map((f) => (
                <li key={f.id}>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-start gap-1.5 break-all text-white/60 hover:text-primary-light"
                  >
                    <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    {f.titulo || f.url}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}
        <p>
          Propuesta preparada exclusivamente para {p.cliente.nombre} · {p.folio}
        </p>
        <p className="mt-1 text-white/40">{EMPRESA.nombre} · brtechds.com</p>
      </footer>
    </main>
  )
}
