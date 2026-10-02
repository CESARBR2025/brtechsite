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
  type Tabla,
} from "@/src/modules/proyectos/domain/contenido"
import { formatearFecha, nombreDePila } from "@/src/ui/formato"
import { BarraLectura, Revelar } from "@/src/ui/levantamientos/efectos-diagnostico"
import { CTAFinal } from "@/src/ui/marketing/cta-final"
import { EMPRESA, WHATSAPP } from "@/src/ui/marketing/datos-contacto"
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
        <div className="relative pr-20 sm:pr-40">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-3 right-0 select-none font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(120,54,226,0.22)] text-[72px] sm:-top-6 sm:text-[140px]"
          >
            {numero(indice)}
          </span>
          <p className="relative flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            {etiqueta}
          </p>
          <h2 className="relative mt-4 max-w-2xl font-display text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-text-primary sm:text-[44px]">
            {titulo}
          </h2>
          {texto && (
            <p className="relative mt-4 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
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

/** Celdas de una fila de tabla Markdown ("| a | b |"). */
function celdas(linea: string): string[] {
  return linea.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((x) => x.trim())
}

/**
 * Texto con un subconjunto de Markdown: párrafos, subtítulos ("### "),
 * viñetas ("- "), listas numeradas, casillas ("- [ ]"), citas ("> "),
 * tablas, bloques de código, **negritas** y `código`.
 */
function TextoRico({ texto, className = "" }: { texto: string; className?: string }) {
  const bloques: React.ReactNode[] = []
  const lineas = texto.split("\n")
  let lista: { tipo: "ul" | "ol"; items: string[] } | null = null
  const cerrar = () => {
    if (!lista) return
    const { tipo, items } = lista
    const Tag = tipo
    bloques.push(
      <Tag
        key={bloques.length}
        className={`space-y-1.5 pl-5 ${tipo === "ul" ? "list-disc marker:text-primary" : "list-decimal marker:font-mono marker:text-xs marker:text-primary"}`}
      >
        {items.map((it, i) => (
          <li key={i} className="pl-1">
            <EnLinea texto={it} />
          </li>
        ))}
      </Tag>,
    )
    lista = null
  }
  for (let i = 0; i < lineas.length; i++) {
    const t = lineas[i].trim()

    if (t.startsWith("```")) {
      cerrar()
      const codigo: string[] = []
      while (++i < lineas.length && !lineas[i].trim().startsWith("```")) codigo.push(lineas[i])
      bloques.push(
        <pre key={bloques.length} className="overflow-x-auto rounded-xl bg-bg-dark p-4 ring-1 ring-inset ring-white/10 font-mono text-[11px] leading-snug text-white/80 sm:text-xs">
          {codigo.join("\n")}
        </pre>,
      )
      continue
    }
    if (t.startsWith("|")) {
      cerrar()
      const filas: string[][] = []
      for (; i < lineas.length && lineas[i].trim().startsWith("|"); i++) {
        const f = celdas(lineas[i])
        if (!f.every((x) => /^:?-+:?$/.test(x))) filas.push(f)
      }
      i--
      const [columnas = [], ...resto] = filas
      bloques.push(<TablaSimple key={bloques.length} tabla={{ columnas, filas: resto }} />)
      continue
    }

    const casilla = /^[-*]\s+\[[ xX]\]\s+(.*)$/.exec(t)
    const vineta = casilla ?? /^[-*·]\s+(.*)$/.exec(t)
    const num = /^\d+[.)]\s+(.*)$/.exec(t)
    if (vineta || num) {
      const tipo = vineta ? "ul" : "ol"
      if (lista && lista.tipo !== tipo) cerrar()
      lista ??= { tipo, items: [] }
      lista.items.push((vineta ?? num)![1])
      continue
    }
    cerrar()
    if (!t) continue
    const titulo = /^#{2,6}\s+(.*)$/.exec(t)
    if (titulo) {
      bloques.push(
        <h4 key={bloques.length} className="pt-2 text-sm font-bold text-text-primary">
          <EnLinea texto={titulo[1]} />
        </h4>,
      )
    } else if (t.startsWith(">")) {
      bloques.push(
        <blockquote key={bloques.length} className="border-l-2 border-primary pl-4 italic text-text-secondary">
          <EnLinea texto={t.replace(/^>\s*/, "")} />
        </blockquote>,
      )
    } else {
      bloques.push(
        <p key={bloques.length}>
          <EnLinea texto={t} />
        </p>,
      )
    }
  }
  cerrar()
  return <div className={`space-y-3 text-pretty text-sm leading-relaxed text-text-secondary sm:text-base ${className}`}>{bloques}</div>
}

function TablaSimple({ tabla }: { tabla: Tabla }) {
  return (
    <div className="-mx-5 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        {tabla.columnas.length > 0 && (
          <thead>
            <tr className="border-b border-border">
              {tabla.columnas.map((c, i) => (
                <th key={i} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted sm:px-4 sm:first:pl-0">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-border">
          {tabla.filas.map((f, i) => (
            <tr key={i}>
              {f.map((celda, j) => (
                <td
                  key={j}
                  className={`px-5 py-3 align-top sm:px-4 sm:first:pl-0 ${j === 0 ? "font-medium text-text-primary" : "text-text-secondary"}`}
                >
                  <EnLinea texto={celda} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

/**
 * El valor central, la pieza protagonista del reto: tarjeta oscura con el
 * texto de entrada como titular, las fórmulas del bloque de código como
 * renglones "resultado = expresión" y la conclusión al pie. Si no trae
 * fórmulas, se muestra como texto.
 */
function ValorCentral({ texto }: { texto: string }) {
  const lineas = texto.split("\n")
  const ini = lineas.findIndex((l) => l.trim().startsWith("```"))
  const fin = ini >= 0 ? lineas.findIndex((l, k) => k > ini && l.trim().startsWith("```")) : -1
  const formulas =
    ini >= 0 && fin > ini
      ? lineas
          .slice(ini + 1, fin)
          .map((l) => /^\s*(.+?)\s*=\s*(.+)$/.exec(l))
          .filter((m): m is RegExpExecArray => m !== null)
          .map((m) => ({ resultado: m[1].trim(), expresion: m[2].trim() }))
      : []
  const entrada = (ini >= 0 ? lineas.slice(0, ini) : lineas).join("\n").trim().replace(/:$/, ".")
  const cierre = fin > ini ? lineas.slice(fin + 1).join("\n").trim() : ""

  if (formulas.length === 0) {
    return (
      <div className={`${TARJETA} p-6 sm:p-8`}>
        <TextoRico texto={texto} />
      </div>
    )
  }

  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-bg-dark shadow-glow ring-1 ring-inset ring-white/10">
      <div aria-hidden="true" className={`${REJILLA} -z-10 [mask-image:linear-gradient(to_right,black,transparent_70%)]`} />
      <div aria-hidden="true" className="absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.85fr_1.3fr] lg:items-center lg:gap-12">
        <div>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-light/80">
            <span className="h-px w-8 bg-primary-light/60" />
            El valor central
          </p>
          {entrada && (
            <p className="mt-5 text-pretty font-display text-2xl font-bold leading-[1.15] tracking-tight text-white sm:text-[32px] [&_strong]:text-primary-light">
              <EnLinea texto={entrada} />
            </p>
          )}
        </div>
        <dl className="divide-y divide-line-dark rounded-2xl border border-line-dark-strong bg-white/[0.04] backdrop-blur-md">
          {formulas.map((f, k) => (
            <div key={k} className="grid gap-x-5 gap-y-1 px-5 py-4 sm:grid-cols-[11rem_1fr] sm:items-baseline">
              <dt className="text-sm font-semibold text-primary-light">{f.resultado}</dt>
              <dd className="flex gap-2.5 text-sm leading-relaxed text-white/85">
                <span className="font-semibold text-white/40" aria-label="es igual a">
                  =
                </span>
                <span className="text-pretty">
                  {/* Los operadores sueltos (entre espacios) se resaltan; el resto va tal cual */}
                  {f.expresion.split(/(\s[+−×-]\s)/).map((x, n) =>
                    n % 2 ? (
                      <span key={n} className="font-semibold text-primary-light">
                        {x.replace("-", "−")}
                      </span>
                    ) : (
                      x
                    ),
                  )}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {cierre && (
        <div className="flex gap-3 border-t border-line-dark bg-white/[0.03] px-6 py-5 sm:px-10">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" aria-hidden="true" />
          <p className="text-pretty text-sm leading-relaxed text-white/70 sm:text-base [&_strong]:font-semibold [&_strong]:text-white">
            <EnLinea texto={cierre} />
          </p>
        </div>
      )}
    </div>
  )
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
        <div className="flex items-center gap-4 rounded-2xl bg-bg-dark p-5 shadow-glow sm:p-6">
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
      <div className="flex items-center gap-4 rounded-2xl bg-bg-dark p-5 shadow-glow sm:p-6">
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
  const titulo = p.proyectoNombre ?? "Tu proyecto"
  const saludo = c.ficha.contactoNombre ? nombreDePila(c.ficha.contactoNombre) : p.cliente.nombre

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
  const hayAlcance = Boolean(c.alcance.problemas.length || c.alcance.valorCentral)
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
    { id: "futuras", titulo: "Lo que sigue", mostrar: fasesFuturas.length > 0 },
    { id: "calendario", titulo: "Calendario", mostrar: c.calendario.length > 0 },
    { id: "inversion", titulo: "Inversión", mostrar: hayInversion },
    { id: "tu-lado", titulo: "Lo que necesitamos", mostrar: hayRequisitos },
    { id: "glosario", titulo: "Glosario", mostrar: c.glosario.length > 0 },
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

  // Para quién es, a qué se dedica y cuánto dura el desarrollo
  const ficha = [
    ["Empresa cliente", p.cliente.nombre],
    ["Giro", c.ficha.giro],
    ["Duración del desarrollo", contratadas.map((f) => f.duracion).filter(Boolean).join(" + ")],
  ].filter(([, v]) => v)

  const local = (ruta: string) => (/^\/[^/]/.test(ruta) ? ruta : null)
  const imagen = local(c.ficha.imagen)
  const imagenHero = local(c.ficha.imagenHero)
  // Cifras del proyecto: se calculan de lo ya capturado, no se escriben a mano
  const semanas = /(\d+)\s*semanas?/i.exec(contratadas.map((f) => f.duracion).join(" "))
  const pagos = c.inversion.pagos.filter((x) => x.montoCentavos)
  const plural = (n: number, uno: string, varios: string) => (n === 1 ? uno : varios)
  const cifras = [
    { n: semanas ? Number(semanas[1]) : 0, etiqueta: plural(semanas ? Number(semanas[1]) : 0, "semana de desarrollo", "semanas de desarrollo") },
    { n: c.ficha.entregables.length, etiqueta: plural(c.ficha.entregables.length, "aplicación a la medida", "aplicaciones a la medida") },
    { n: c.vistas.length, etiqueta: plural(c.vistas.length, "pantalla para tu operación", "pantallas para tu operación") },
    { n: pagos.length, etiqueta: plural(pagos.length, "pago, ligado a una entrega", "pagos, ligados a entregas") },
  ]
    .filter((x) => x.n > 0)
    .map((x) => ({ valor: String(x.n), etiqueta: x.etiqueta }))

  const mensajeWhatsApp = `Hola, revisé la propuesta ${p.folio} de ${titulo}. `
  const enlaceWhatsApp = `https://wa.me/${WHATSAPP.telefono.replace("+", "")}?text=${encodeURIComponent(mensajeWhatsApp)}`

  return (
    <main className="min-h-screen bg-bg-section">
      <BarraLectura />

      <NavbarDocumento
        enlaces={atajos}
        accion={{ texto: "Aceptar propuesta", href: "#aceptar" }}
        cumplido={p.aceptacion ? "Aceptada" : null}
      />

      {/*
        Hero tipo portada: rótulo del documento, nombre del sistema y una línea
        de apoyo; los datos del documento van al pie. Con foto, sigue al hero
        del inicio: texto a la izquierda y la foto fundida a la derecha (arriba
        en celular). Sin foto, todo va centrado sobre las ondas.
      */}
      <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-bg-deep">
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
            <div className="absolute inset-x-0 top-0 -z-10 h-[58%] [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[74%] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_38%)]">
              <Image
                src={imagenHero}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 74vw, 100vw"
                className="object-cover object-[78%_center] lg:object-center"
              />
            </div>
            {/* Contraste para el texto: velo lateral en escritorio */}
            <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-bg-deep/70 via-bg-deep/20 to-transparent lg:block" />
          </>
        )}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/4 bg-gradient-to-b from-transparent to-bg-deep/80" />

        {/* pt deja libre el espacio del encabezado de vidrio (fijo) */}
        <div
          className={
            imagenHero
              ? "flex w-full flex-1 flex-col justify-end px-5 pb-10 pt-28 sm:px-8 sm:pt-32 lg:justify-center lg:pl-16 xl:pl-24"
              : "mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-10 pt-28 text-center sm:px-6 sm:pt-32"
          }
        >
          <div
            style={retraso(0)}
            className={`flex gap-3 motion-safe:animate-aparecer ${imagenHero ? "flex-wrap items-center" : "flex-col items-center"}`}
          >
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70 sm:gap-4 sm:text-xs">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary-light/70 sm:w-14" aria-hidden="true" />
              Propuesta de desarrollo
              {!imagenHero && (
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary-light/70 sm:w-14" aria-hidden="true" />
              )}
            </p>
            {p.aceptacion && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Aceptada
              </span>
            )}
          </div>

          <h1
            className={`mt-7 text-balance pb-1 font-hero font-semibold leading-[1.02] tracking-[-0.02em] text-white ${
              imagenHero
                ? "max-w-3xl text-[44px] [text-shadow:0_2px_40px_rgba(0,0,0,0.45)] sm:text-7xl lg:text-[84px]"
                : "text-[48px] [text-shadow:0_0_60px_rgba(120,54,226,0.35)] sm:text-7xl lg:text-8xl"
            }`}
          >
            <TextoDesenfocado texto={titulo} retrasoMs={200} />
          </h1>

          {imagenHero && (
            <span
              style={retraso(600)}
              aria-hidden="true"
              className="mt-7 block h-px w-16 bg-gradient-to-r from-primary-light/80 to-transparent motion-safe:animate-aparecer"
            />
          )}

          <p
            style={retraso(650)}
            className={`mt-6 text-base leading-relaxed motion-safe:animate-aparecer ${
              imagenHero ? "max-w-md text-pretty text-white/75 sm:text-lg" : "max-w-2xl text-balance text-white/65 sm:text-xl"
            }`}
          >
            Hola, <span className="font-medium text-white">{saludo}</span>.{" "}
            {c.ficha.promesa || "Esto es lo que vamos a construir juntos."}
          </p>
        </div>

        {/* Pie de portada: los datos del documento, fuera del centro */}
        <div
          style={retraso(850)}
          className={`relative w-full px-5 pb-6 motion-safe:animate-aparecer sm:px-8 sm:pb-8 ${
            imagenHero ? "lg:px-16 xl:px-24" : "mx-auto max-w-5xl sm:px-6 lg:px-8"
          }`}
        >
          <div className="grid items-center gap-4 border-t border-white/10 pt-5 text-xs text-white/50 sm:grid-cols-3 sm:text-sm">
            <p className="text-center sm:text-left">
              Empresa cliente: <span className="font-medium text-white/85">{p.cliente.nombre}</span>
            </p>
            <a
              href="#resumen"
              className="group mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-primary/60 hover:bg-primary/20 active:scale-[0.98]"
            >
              Ver la propuesta
              <ArrowDown className="h-4 w-4 text-primary-light transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
            <p className="text-center tabular-nums sm:text-right">{formatearFecha(p.fechaPropuesta)}</p>
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/*
          La propuesta: tarjeta oscura con la foto del sistema fundida a la
          derecha, el beneficio como titular y las cifras del proyecto al pie.
        */}
        <div
          id="resumen"
          className="relative isolate mt-12 scroll-mt-28 overflow-hidden rounded-3xl bg-bg-dark shadow-glow ring-1 ring-inset ring-white/10 sm:mt-16"
        >
          {imagen ? (
            <div className="absolute inset-x-0 top-0 -z-10 h-64 [mask-image:linear-gradient(to_bottom,black_45%,transparent)] sm:h-80 lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[64%] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_48%)]">
              <Image
                src={imagen}
                alt=""
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover object-[70%_center]"
              />
            </div>
          ) : (
            <>
              <div aria-hidden="true" className={`${REJILLA} -z-10 [mask-image:linear-gradient(to_right,transparent_30%,black)]`} />
              <div
                aria-hidden="true"
                className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-primary/30 blur-3xl"
              />
            </>
          )}

          <div className={`p-6 sm:p-10 lg:max-w-[58%] lg:py-14 ${imagen ? "pt-52 sm:pt-64 lg:pt-14" : ""}`}>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-light/80">
              <span className="h-px w-8 bg-primary-light/60" />
              La propuesta
            </p>
            <h2 className="mt-5 text-balance font-display text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-[40px]">
              {c.ficha.titular || c.ficha.tipoSistema || titulo}
            </h2>
            {c.ficha.titular && c.ficha.tipoSistema && (
              <p className="mt-3 text-sm font-medium text-primary-light/80">{c.ficha.tipoSistema}</p>
            )}
            {c.ficha.objetivo && (
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/65 [&_strong]:font-semibold [&_strong]:text-white">
                <EnLinea texto={c.ficha.objetivo} />
              </p>
            )}
            {c.ficha.entregables.length > 0 && (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {c.ficha.entregables.map((e) => {
                  return (
                    <li
                      key={e.id}
                      className="flex gap-3 rounded-2xl border border-line-dark-strong bg-white/[0.06] p-4 backdrop-blur-md"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/25 ring-1 ring-inset ring-primary-light/20">
                        <IconoEntregable nombre={e.nombre} className="h-5 w-5 text-primary-light" />
                      </span>
                      <span className="text-sm leading-snug">
                        <span className="block font-semibold text-white">{e.nombre}</span>
                        {e.descripcion && <span className="mt-0.5 block text-white/60">{e.descripcion}</span>}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {cifras.length > 0 && (
            <dl className="grid grid-cols-2 border-t border-line-dark bg-bg-dark/60 backdrop-blur-md lg:grid-cols-4">
              {cifras.map((x) => (
                <div
                  key={x.etiqueta}
                  className="flex flex-col-reverse justify-end gap-1 border-line-dark p-5 odd:border-r sm:p-6 lg:border-r lg:last:border-r-0 max-lg:[&:nth-child(n+3)]:border-t"
                >
                  <dt className="text-xs leading-snug text-white/55 sm:text-sm">{x.etiqueta}</dt>
                  <dd className="font-display text-4xl font-bold tracking-tight text-white tabular-nums sm:text-5xl">
                    {x.valor}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* La ficha, en discreto: el contexto del proyecto sin competir con la tarjeta */}
        {ficha.length > 0 && (
          <dl className="mt-8 grid gap-x-10 gap-y-5 px-2 sm:grid-cols-3 sm:px-4">
            {ficha.map(([etiqueta, valor]) => (
              <div key={etiqueta} className="border-t border-border pt-4">
                <dt className="text-[11px] font-medium uppercase tracking-wider text-text-muted">{etiqueta}</dt>
                <dd className="mt-1 text-pretty text-sm leading-relaxed text-text-secondary [&_strong]:font-semibold [&_strong]:text-text-primary">
                  <EnLinea texto={valor} />
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* El reto */}
        {hayAlcance && (
          <Seccion id="reto" indice={num("reto")} etiqueta="El reto" titulo="Qué resolvemos y hasta dónde llega">
            <div className="space-y-8">
              {c.alcance.problemas.length > 0 && (
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                      <span className="h-6 w-1 rounded-full bg-text-primary/25" aria-hidden="true" />
                      Lo que hoy duele
                    </h3>
                    <p className="text-sm text-text-muted">
                      {c.alcance.problemas.length === 1
                        ? "Un problema que el sistema resuelve"
                        : `${c.alcance.problemas.length} problemas que el sistema resuelve`}
                    </p>
                  </div>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {c.alcance.problemas.map((x, i) => {
                      const { titulo, detalle } = partesProblema(x.texto)
                      const Icono = iconoProblema(x.texto)
                      return (
                        <li
                          key={x.id}
                          className={`${TARJETA} p-6 transition-all hover:border-primary/30 hover:shadow-hover`}
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
              {c.alcance.valorCentral && <ValorCentral texto={c.alcance.valorCentral} />}
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
                // Las tarjetas de la última fila se reparten el ancho: nunca queda un hueco
                const sobran = roles.length % 3
                const ultimaFila = i >= roles.length - sobran
                const ancho = !ultimaFila ? "lg:col-span-2" : sobran === 1 ? "lg:col-span-6" : "lg:col-span-3"
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

        {/* Lo que viene después: las funciones ya mapeadas de cada fase siguiente, una fase por pestaña */}
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

        {/* Calendario: el reparto de las semanas, los módulos de cada etapa y el pago que le toca */}
        {c.calendario.length > 0 && (
          <Seccion
            id="calendario"
            indice={num("calendario")}
            etiqueta="El calendario"
            titulo="Semana a semana, con pagos amarrados a entregas"
          >
            {/* Barra del proyecto: cada tramo mide lo que dura su etapa */}
            {tramos.length > 1 && (
              <div className="mb-6 rounded-2xl bg-bg-dark p-5 shadow-glow sm:p-6">
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
                                <Boxes className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
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
            titulo="¡Listo, empecemos!"
            texto="Esto es lo que necesitamos de tu lado para arrancar."
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

        {/* Glosario */}
        {c.glosario.length > 0 && (
          <Seccion id="glosario" indice={num("glosario")} etiqueta="Glosario" titulo="Hablemos el mismo idioma">
            <dl className="grid gap-3 sm:grid-cols-2">
              {c.glosario.map((t) => (
                <div key={t.id} className={`${TARJETA} p-5`}>
                  <dt className="font-semibold text-text-primary">{t.termino}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-text-secondary">
                    <EnLinea texto={t.definicion} />
                  </dd>
                </div>
              ))}
            </dl>
          </Seccion>
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

      <div className="mt-8">
        <CTAFinal
          etiqueta={p.aceptacion ? "Siguiente paso" : "¿Dudas?"}
          titulo={p.aceptacion ? "Preparemos el arranque" : "Platiquemos la propuesta"}
          texto={
            p.aceptacion
              ? "Escríbenos para agendar la firma del contrato y la sesión de cuentas de la semana 0."
              : "Cualquier pregunta sobre el alcance, el calendario o la inversión, la resolvemos por WhatsApp."
          }
          boton="Escribir por WhatsApp"
          href={enlaceWhatsApp}
          nota={`Horario de atención: ${EMPRESA.horario}`}
        />
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
