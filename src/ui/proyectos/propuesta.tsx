import {
  ArrowDown,
  BarChart3,
  Bell,
  MapPinned,
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
import type { PropuestaPublicaDTO } from "@/src/modules/proyectos/application/dtos"
import {
  type IconoVista,
  type NivelImpacto,
  type Tabla,
} from "@/src/modules/proyectos/domain/contenido"
import { formatearFecha, nombreDePila } from "@/src/ui/formato"
import { BarraLectura, Revelar } from "@/src/ui/levantamientos/efectos-diagnostico"
import { CTAFinal } from "@/src/ui/marketing/cta-final"
import { EMPRESA, WHATSAPP } from "@/src/ui/marketing/datos-contacto"
import { OndasGradiente } from "@/src/ui/primitivos/ondas-gradiente"
import { TextoDesenfocado } from "@/src/ui/primitivos/texto-desenfocado"
import { AceptarPropuesta } from "./aceptar-propuesta"
import { NavbarDocumento } from "@/src/ui/primitivos/navbar-documento"
import { ETIQUETA_IMPACTO } from "./etiquetas"

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

const COLOR_IMPACTO: Record<NivelImpacto, string> = {
  alto: "bg-primary text-white ring-primary",
  medio: "bg-primary-light text-primary ring-primary/20",
  bajo: "bg-bg-section text-text-muted ring-border",
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

/** Tarjeta plegable (fases futuras, requisitos, anexos). */
function Plegable({
  titulo,
  subtitulo,
  extra,
  children,
}: {
  titulo: React.ReactNode
  subtitulo?: React.ReactNode
  extra?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <details className={`${TARJETA} group overflow-hidden transition-colors open:border-primary/30`}>
      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <div className="text-base font-semibold text-text-primary">{titulo}</div>
          {subtitulo && <div className="mt-0.5 text-xs text-text-muted">{subtitulo}</div>}
        </div>
        {extra}
        <ChevronDown className="h-5 w-5 shrink-0 text-text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-border px-5 py-5 sm:px-6">{children}</div>
    </details>
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

/** Ícono de un área del sistema según su nombre. */
function iconoArea(nombre: string): LucideIcon {
  if (/inventario|almac/i.test(nombre)) return Warehouse
  if (/tráfico|ruta|unidad|reparto/i.test(nombre)) return Truck
  if (/venta|finanza|cobr/i.test(nombre)) return BarChart3
  return Sparkles
}

/**
 * El valor central, legible para el cliente: texto de entrada, fórmulas del
 * bloque de código como ecuaciones visuales ("A = B + C") y la conclusión
 * destacada. Si no trae fórmulas, se muestra como texto.
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
          .map((m) => {
            // "Vendido + Devuelto − Faltante" → ["Vendido", "+", "Devuelto", "−", "Faltante"]
            const partes = m[2].split(/\s+([+−-])\s+/)
            const piezas: { op: string | null; texto: string }[] = []
            for (let k = 0; k < partes.length; k += 2) {
              piezas.push({ op: k === 0 ? null : partes[k - 1], texto: partes[k].trim() })
            }
            return { resultado: m[1].trim(), piezas }
          })
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

  // "Σ tickets (ya con descuentos aplicados)" → texto principal + nota
  const pieza = (t: string) => {
    const m = /^(.*?)\s*\(([^)]+)\)$/.exec(t)
    return m ? { principal: m[1], nota: m[2] } : { principal: t, nota: "" }
  }

  return (
    <div className={`${TARJETA} overflow-hidden`}>
      <div className="h-1 bg-gradient-to-r from-primary-hover via-primary to-primary-light" />
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.4fr] lg:gap-10">
        <div>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            El valor central
          </p>
          {entrada && (
            <p className="mt-4 text-pretty font-display text-xl font-semibold leading-snug tracking-tight text-text-primary sm:text-2xl">
              <EnLinea texto={entrada} />
            </p>
          )}
        </div>
        <ol className="space-y-3">
          {formulas.map((f, k) => (
            <li
              key={k}
              className="flex flex-wrap items-center gap-x-2.5 gap-y-2 rounded-2xl border border-border bg-bg-section/60 p-4"
            >
              <span className="rounded-xl bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-primary/20">
                {f.resultado}
              </span>
              <span className="font-display text-lg font-semibold text-text-muted" aria-label="es igual a">
                =
              </span>
              {f.piezas.map((x, n) => {
                const { principal, nota } = pieza(x.texto)
                return (
                  <span key={n} className="flex items-center gap-2.5">
                    {x.op && (
                      <span className="font-display text-lg font-semibold text-primary/60" aria-hidden="true">
                        {x.op === "-" ? "−" : x.op}
                      </span>
                    )}
                    <span className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary">
                      {principal}
                      {nota && <span className="ml-1.5 text-xs font-normal text-text-muted">{nota}</span>}
                    </span>
                  </span>
                )
              })}
            </li>
          ))}
        </ol>
      </div>
      {cierre && (
        <div className="flex gap-3 border-t border-border bg-primary-light/40 px-6 py-5 sm:px-8">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-pretty text-sm leading-relaxed text-text-secondary sm:text-base [&_strong]:text-text-primary">
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

function iconoFuncion(nombre: string): LucideIcon {
  return ICONOS_FUNCION.find(([r]) => r.test(nombre))?.[1] ?? Sparkles
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
export function Propuesta({ p }: { p: PropuestaPublicaDTO }) {
  const c: C = p.contenido
  const moneda = c.inversion.moneda || "MXN"
  const titulo = p.proyectoNombre ?? "Tu proyecto"
  const saludo = c.ficha.contactoNombre ? nombreDePila(c.ficha.contactoNombre) : p.cliente.nombre

  const contratadas = c.fases.filter((f) => f.contratada)
  const futuras = c.fases.filter((f) => !f.contratada)
  // Pantallas agrupadas por dónde se usan, en el orden en que se capturaron
  const gruposVistas = [...c.vistas.reduce((m, v) => m.set(v.grupo, [...(m.get(v.grupo) ?? []), v]), new Map<string, C["vistas"]>())]
  const etapasIncluidas = contratadas.flatMap((f) =>
    f.entregables.map((e) => ({ ...e, fase: f.clave })),
  )
  const pago = new Map(c.inversion.pagos.map((x) => [x.id, x]))
  const total = p.totalCentavos
  const mensual = c.inversion.mensualidad


  const roles = c.roles.filter((r) => r.nombre)
  const hayAlcance = Boolean(
    c.alcance.problemas.length || c.alcance.areas.length || c.alcance.valorCentral,
  )
  const hayInversion = total > 0 || mensual.montoCentavos != null || c.inversion.terceros.length > 0
  const hayValidacion = Boolean(c.validacion.objetivo || c.validacion.alcance.length || c.validacion.criterios.length)
  const hayRequisitos = c.requisitos.grupos.length > 0

  const indice = [
    { id: "reto", titulo: "El reto", mostrar: hayAlcance },
    { id: "personas", titulo: "Personas", mostrar: roles.length > 0 },
    { id: "tu-sistema", titulo: "Tu sistema", mostrar: c.vistas.length > 0 || etapasIncluidas.length > 0 },
    { id: "futuras", titulo: "Features futuras", mostrar: futuras.some((f) => f.entregables.length > 0) },
    { id: "operacion", titulo: "Un día con el sistema", mostrar: c.flujo.length > 0 },
    { id: "calendario", titulo: "Calendario", mostrar: c.calendario.length > 0 },
    { id: "inversion", titulo: "Inversión", mostrar: hayInversion },
    { id: "tu-lado", titulo: "Lo que necesitamos", mostrar: hayRequisitos },
    { id: "riesgos", titulo: "Riesgos", mostrar: c.riesgos.length > 0 },
    { id: "validacion", titulo: "Validación técnica", mostrar: hayValidacion },
    { id: "glosario", titulo: "Glosario", mostrar: c.glosario.length > 0 },
    { id: "anexos", titulo: "Anexos", mostrar: c.anexos.length > 0 },
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

  const ficha = [
    ["Cliente", p.cliente.nombre],
    ["Contacto", c.ficha.contactoNombre],
    ["Giro", c.ficha.giro],
    ["Fecha", formatearFecha(p.fechaPropuesta)],
    ...c.ficha.datos.map((d) => [d.etiqueta, d.valor]),
  ].filter(([, v]) => v)

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
        Hero tipo portada: reflector de luz, rótulo del documento, nombre del
        sistema y una línea de apoyo. Los datos del documento van al pie.
      */}
      <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-bg-deep">
        {/* Resplandor base (también es el respaldo sin WebGL) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(120,54,226,0.32),transparent_70%)]"
        />
        <div className="absolute inset-0 -z-10">
          <OndasGradiente />
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/5 bg-gradient-to-b from-transparent to-bg-deep/80" />

        {/* pt deja libre el espacio del encabezado de vidrio (fijo) */}
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-10 pt-28 text-center sm:px-6 sm:pt-32">
          <div style={retraso(0)} className="flex flex-col items-center gap-3 motion-safe:animate-aparecer">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70 sm:gap-4 sm:text-xs">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary-light/70 sm:w-14" aria-hidden="true" />
              Propuesta de desarrollo
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary-light/70 sm:w-14" aria-hidden="true" />
            </p>
            {p.aceptacion && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Aceptada
              </span>
            )}
          </div>

          <h1 className="mt-7 text-balance pb-1 font-hero text-[48px] font-semibold leading-[1.02] tracking-[-0.02em] text-white [text-shadow:0_0_60px_rgba(120,54,226,0.35)] sm:text-7xl lg:text-8xl">
            <TextoDesenfocado texto={titulo} retrasoMs={200} />
          </h1>

          <p
            style={retraso(650)}
            className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-white/65 sm:text-xl motion-safe:animate-aparecer"
          >
            Hola, <span className="font-medium text-white">{saludo}</span>.{" "}
            {c.ficha.promesa || "Esto es lo que vamos a construir juntos."}
          </p>
        </div>

        {/* Pie de portada: los datos del documento, fuera del centro */}
        <div style={retraso(850)} className="relative mx-auto w-full max-w-5xl px-5 pb-6 motion-safe:animate-aparecer sm:px-6 sm:pb-8 lg:px-8">
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
        {/* Resumen */}
        <div
          id="resumen"
          className="relative mt-12 scroll-mt-28 overflow-hidden rounded-3xl border border-border bg-surface shadow-modal sm:mt-16"
        >
          <div className="h-1 bg-gradient-to-r from-primary-hover via-primary to-primary-light" />
          <div className="grid lg:grid-cols-[1.35fr_1fr]">
            <div className="relative overflow-hidden p-6 sm:p-10">
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary-light blur-3xl" aria-hidden="true" />
              <p className="relative flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="h-px w-8 bg-primary" />
                La propuesta
              </p>
              {c.ficha.tipoSistema && (
                <p className="relative mt-5 font-display text-pretty text-xl font-semibold leading-snug tracking-tight text-text-primary sm:text-2xl">
                  {c.ficha.tipoSistema}
                </p>
              )}
              {c.ficha.objetivo && (
                <TextoRico texto={c.ficha.objetivo} className="relative mt-4" />
              )}
              {c.ficha.entregables.length > 0 && (
                <ul className="relative mt-6 space-y-3">
                  {c.ficha.entregables.map((e) => (
                    <li key={e.id} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      </span>
                      <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                        <span className="font-semibold text-text-primary">{e.nombre}</span>
                        {e.descripcion && <> · {e.descripcion}</>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <dl className="grid grid-cols-2 content-start border-t border-border bg-bg-section/70 lg:border-l lg:border-t-0">
              {ficha.map(([etiqueta, valor]) => (
                <div key={etiqueta} className="border-b border-border p-5 odd:border-r">
                  <dt className="text-[11px] font-medium uppercase tracking-wider text-text-muted">{etiqueta}</dt>
                  <dd className="mt-1 text-pretty text-sm font-semibold text-text-primary">
                    <EnLinea texto={valor} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* El reto */}
        {hayAlcance && (
          <Seccion id="reto" indice={num("reto")} etiqueta="El reto" titulo="Qué resolvemos y hasta dónde llega">
            <div className="space-y-4">
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
                    {c.alcance.problemas.map((x) => {
                      const { titulo, detalle } = partesProblema(x.texto)
                      const Icono = iconoProblema(x.texto)
                      return (
                        <li key={x.id} className={`${TARJETA} flex gap-4 p-5`}>
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-section text-text-secondary">
                            <Icono className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-display text-base font-semibold leading-snug text-text-primary">{titulo}</p>
                            {detalle && (
                              <p className="mt-1 text-pretty text-sm leading-relaxed text-text-secondary">
                                <EnLinea texto={detalle} />
                              </p>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
              {c.alcance.areas.length > 0 && (
                <div className="pt-6">
                  <h3 className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                    <span className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-primary-hover" aria-hidden="true" />
                    Tu control empieza aquí
                  </h3>
                  <div className="relative mt-5 grid gap-4 sm:grid-cols-3">
                    {/* Hilo que une los pilares (solo en escritorio) */}
                    <span
                      aria-hidden="true"
                      className="absolute left-[16%] right-[16%] top-[3.25rem] hidden h-px bg-gradient-to-r from-primary/0 via-primary/35 to-primary/0 sm:block"
                    />
                    {c.alcance.areas.map((a, i) => {
                      const Icono = iconoArea(a.nombre)
                      return (
                        <div
                          key={a.id}
                          className={`${TARJETA} relative flex flex-col items-center p-6 text-center transition-all hover:border-primary/30 hover:shadow-hover sm:p-7`}
                        >
                          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-primary shadow-sm">
                            <Icono className="h-6 w-6" aria-hidden="true" />
                            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 font-mono text-[10px] font-bold tabular-nums text-white">
                              {numero(i)}
                            </span>
                          </span>
                          <h4 className="mt-5 font-display text-lg font-semibold text-text-primary">{a.nombre}</h4>
                          {a.descripcion && (
                            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-text-secondary">
                              <EnLinea texto={a.descripcion} />
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {c.alcance.valorCentral && <ValorCentral texto={c.alcance.valorCentral} />}
            </div>
          </Seccion>
        )}

        {/* Personas */}
        {roles.length > 0 && (
          <Seccion
            id="personas"
            indice={num("personas")}
            etiqueta="Las personas"
            titulo="Quién usa el sistema"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((r) => (
                <div key={r.id} className={`${TARJETA} flex flex-col p-6 transition-all hover:border-primary/30 hover:shadow-hover`}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-sm">
                    <User className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">{r.nombre}</h3>
                  {r.quien && <p className="text-sm text-text-muted">{r.quien}</p>}
                  {r.responsabilidades && (
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-text-secondary">
                      <EnLinea texto={r.responsabilidades} />
                    </p>
                  )}
                  {r.dispositivo && (
                    <div className="mt-auto pt-4">
                      <p className="border-t border-border pt-3 text-xs font-medium text-text-primary">
                        <span className="text-text-muted">Desde · </span>
                        <EnLinea texto={r.dispositivo} />
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Seccion>
        )}

        {/* Tu sistema: lo que el cliente verá y usará (o, si no se capturó, las etapas) */}
        {(c.vistas.length > 0 || etapasIncluidas.length > 0) && (
          <Seccion
            id="tu-sistema"
            indice={num("tu-sistema")}
            etiqueta="Tu sistema"
            titulo="Lo que vas a ver en tu sistema"
            texto={
              contratadas[0]
                ? `Esto es lo que tendrás funcionando al terminar ${contratadas[0].clave === "MVP" ? "la primera etapa" : contratadas[0].nombre.toLowerCase()}${contratadas[0].duracion ? `, en ${contratadas[0].duracion}` : ""}.`
                : undefined
            }
          >
            {c.vistas.length > 0 ? (
              <div className="space-y-12">
                {gruposVistas.map(([grupo, vistas]) => {
                  const [tituloGrupo, subtitulo] = grupo.split(/\s+·\s+/)
                  return (
                    <div key={grupo || "sin-grupo"}>
                      {tituloGrupo && (
                        <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                            <span className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-primary-hover" aria-hidden="true" />
                            {tituloGrupo}
                          </h3>
                          {subtitulo && <p className="text-sm text-text-muted">{subtitulo}</p>}
                        </div>
                      )}
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {vistas.map((v) => {
                          const Icono = ICONO_VISTA[v.icono ?? "celular"]
                          return (
                            <div
                              key={v.id}
                              className={`${TARJETA} group relative flex flex-col overflow-hidden p-6 transition-all hover:border-primary/30 hover:shadow-hover`}
                            >
                                                            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-sm">
                                <Icono className="h-5 w-5" aria-hidden="true" />
                              </span>
                              <h4 className="relative mt-4 text-lg font-semibold leading-snug text-text-primary">{v.nombre}</h4>
                              {v.descripcion && (
                                <p className="relative mt-1.5 text-pretty text-sm leading-relaxed text-text-secondary">
                                  <EnLinea texto={v.descripcion} />
                                </p>
                              )}
                              {v.puntos.length > 0 && (
                                <ul className="relative mt-4 space-y-2.5 border-t border-border pt-4">
                                  {v.puntos.map((x) => (
                                    <li key={x.id} className="flex gap-2.5 text-sm leading-snug text-text-secondary">
                                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                                      <span>
                                        <EnLinea texto={x.texto} />
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
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

        {/* Features futuras: las funciones ya mapeadas de cada fase siguiente */}
        {futuras.some((f) => f.entregables.length > 0) && (
          <Seccion
            id="futuras"
            indice={num("futuras")}
            etiqueta="Features futuras"
            titulo="Lo que puede venir después"
            texto="Ya diseñadas y listas para cuando el negocio las necesite. Se cotizan por separado, por función o por fase."
          >
            <div className="space-y-12">
              {futuras
                .filter((f) => f.entregables.length > 0)
                .map((f) => (
                  <div key={f.id}>
                    <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                        <span className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-primary-hover" aria-hidden="true" />
                        <ChipFase clave={f.clave} contratada={false} />
                        {f.nombre}
                      </h3>
                      {f.lema && <p className="text-sm text-text-muted">{f.lema}</p>}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {f.entregables.map((e) => {
                        const nombre = nombreFuncion(e.nombre)
                        const Icono = iconoFuncion(nombre)
                        const opcional = /opcional/i.test(e.nombre)
                        return (
                          <div
                            key={e.id}
                            className={`${TARJETA} group relative flex flex-col overflow-hidden p-6 transition-all hover:border-primary/30 hover:shadow-hover`}
                          >
                                                        <div className="relative flex items-start justify-between gap-3">
                              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-sm">
                                <Icono className="h-5 w-5" aria-hidden="true" />
                              </span>
                              {opcional && (
                                <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-text-muted ring-1 ring-inset ring-border">
                                  Opcional
                                </span>
                              )}
                            </div>
                            <h4 className="relative mt-4 text-lg font-semibold leading-snug text-text-primary">{nombre}</h4>
                            {e.resuelve && (
                              <p className="relative mt-1.5 text-pretty text-sm leading-relaxed text-text-secondary">
                                <EnLinea texto={e.resuelve} />
                              </p>
                            )}
                            {e.incluye && (
                              <ul className="relative mt-4 space-y-2.5 border-t border-border pt-4">
                                {partesIncluye(e.incluye).map((x) => (
                                  <li key={x} className="flex gap-2.5 text-sm leading-snug text-text-secondary">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-text-primary/35" aria-hidden="true" />
                                    <span>
                                      <EnLinea texto={x} />
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </Seccion>
        )}

        {/* Flujo operativo */}
        {c.flujo.length > 0 && (
          <Seccion
            id="operacion"
            indice={num("operacion")}
            etiqueta="La operación"
            titulo="Un día con el sistema"
          >
            <div className="grid gap-5 lg:grid-cols-3">
              {c.flujo.map((etapa, ei) => (
                <div key={etapa.id} className={`${TARJETA} overflow-hidden`}>
                  <div className="relative overflow-hidden bg-bg-dark px-6 py-5">
                    <div className={REJILLA} />
                    <span className="relative font-mono text-xs tabular-nums text-primary-light">Etapa {numero(ei)}</span>
                    <h3 className="relative mt-1 text-lg font-bold text-white">{etapa.nombre}</h3>
                  </div>
                  <ol className="relative p-6">
                    <LineaTiempo />
                    {etapa.pasos.map((paso, i) => (
                      <li key={paso.id} className="group relative grid grid-cols-[2.5rem_1fr] gap-x-4 pb-5 last:pb-0">
                        <Nodo i={i} />
                        <div className="pt-2">
                          <p className="text-pretty text-sm font-medium text-text-primary">
                            <EnLinea texto={paso.texto} />
                          </p>
                          {paso.detalle && (
                            <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-text-muted">{paso.detalle}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Seccion>
        )}

        {/* Calendario */}
        {c.calendario.length > 0 && (
          <Seccion
            id="calendario"
            indice={num("calendario")}
            etiqueta="El calendario"
            titulo="Semana a semana, con pagos amarrados a entregas"
          >
            <div className={`${TARJETA} p-6 sm:p-8`}>
              <ol className="relative">
                <LineaTiempo />
                {c.calendario.map((h, i) => {
                  const x = h.pagoId ? pago.get(h.pagoId) : null
                  return (
                    <li key={h.id} className="group relative grid grid-cols-[2.5rem_1fr] gap-x-4 pb-7 last:pb-0">
                      <Nodo i={i} />
                      <div className="flex flex-col gap-2 pt-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                            {/^\d/.test(h.semanas) ? `Semana${/[-–,]/.test(h.semanas) ? "s" : ""} ${h.semanas}` : h.semanas}
                          </p>
                          <p className="mt-1 text-pretty text-base font-medium text-text-primary">
                            <EnLinea texto={h.entregable} />
                          </p>
                        </div>
                        {x && x.montoCentavos != null && (
                          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-primary-light px-3 py-1 text-sm font-semibold tabular-nums text-primary">
                            <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
                            {dinero(x.montoCentavos, moneda)}
                            <span className="font-normal text-primary/70">· {x.nombre}</span>
                          </span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </Seccion>
        )}

        {/* Inversión */}
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
                <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
                  <div className="relative flex flex-col overflow-hidden rounded-3xl bg-bg-dark p-6 shadow-glow sm:p-8">
                    <div className={REJILLA} />
                    <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
                    <p className="relative text-xs font-semibold uppercase tracking-wider text-primary-light">
                      Desarrollo {contratadas.map((f) => f.clave).join(" + ")}
                    </p>
                    <p className="relative mt-3 font-display text-5xl font-bold tracking-tight text-white tabular-nums sm:text-6xl">
                      {dinero(total, moneda)}
                    </p>
                    <p className="relative mt-3 text-sm text-white/60">
                      En {c.inversion.pagos.length} {c.inversion.pagos.length === 1 ? "pago" : "pagos"} ligados a entregas concretas.
                    </p>
                    <div className="relative mt-10 lg:mt-auto lg:pt-10">
                      <div className="flex h-2 gap-1 overflow-hidden rounded-full">
                        {c.inversion.pagos
                          .filter((x) => x.montoCentavos)
                          .map((x, i) => (
                            <span
                              key={x.id}
                              className={`h-full rounded-full ${["bg-primary-light", "bg-primary", "bg-primary-hover"][i % 3]}`}
                              style={{ flexGrow: x.montoCentavos! }}
                            />
                          ))}
                      </div>
                      <div className="mt-3 flex gap-1 text-[11px] text-white/55">
                        {c.inversion.pagos
                          .filter((x) => x.montoCentavos)
                          .map((x) => (
                            <span key={x.id} className="truncate" style={{ flexGrow: x.montoCentavos! }}>
                              {x.nombre}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {c.inversion.pagos.map((x, i) => {
                      const pct = total > 0 && x.montoCentavos ? Math.round((x.montoCentavos / total) * 100) : null
                      return (
                        <div key={x.id} className={`${TARJETA} flex gap-4 p-5`}>
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light font-mono text-xs font-bold text-primary">
                            {numero(i)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                              <p className="font-semibold text-text-primary">
                                {x.nombre}
                                {x.cuando && <span className="font-normal text-text-muted"> · {x.cuando}</span>}
                              </p>
                              {x.montoCentavos != null && (
                                <p className="font-semibold tabular-nums text-text-primary">
                                  {dinero(x.montoCentavos, moneda)}
                                  {pct != null && <span className="ml-1.5 text-xs font-normal text-text-muted">{pct} %</span>}
                                </p>
                              )}
                            </div>
                            {x.contra && (
                              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                                <EnLinea texto={x.contra} />
                              </p>
                            )}
                            {pct != null && (
                              <div className="mt-3 h-1 overflow-hidden rounded-full bg-bg-section">
                                <div className="h-full rounded-full bg-gradient-to-r from-primary-hover to-primary" style={{ width: `${pct}%` }} />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {c.inversion.condiciones.length > 0 && (
                <div className={`${TARJETA} p-6 sm:p-8`}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Condiciones</h3>
                  <ul className="mt-4 space-y-3">
                    {c.inversion.condiciones.map((x) => (
                      <li key={x.id} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>
                          <EnLinea texto={x.texto} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(mensual.montoCentavos != null || mensual.incluye.length > 0) && (
                <div className={`${TARJETA} overflow-hidden`}>
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border p-6 sm:p-8">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Hospedaje y mantenimiento</h3>
                      {mensual.descripcion && (
                        <p className="mt-2 max-w-lg text-sm leading-relaxed text-text-secondary">
                          <EnLinea texto={mensual.descripcion} />
                        </p>
                      )}
                    </div>
                    {mensual.montoCentavos != null && (
                      <p className="text-3xl font-bold tracking-tight text-text-primary tabular-nums">
                        {dinero(mensual.montoCentavos, moneda)}
                        <span className="text-base font-medium text-text-muted"> /mes</span>
                      </p>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2">
                    {(
                      [
                        ["Incluye", mensual.incluye, true],
                        ["No incluye", mensual.noIncluye, false],
                      ] as const
                    )
                      .filter(([, items]) => items.length > 0)
                      .map(([etiqueta, items, si]) => (
                        <div key={etiqueta} className="p-6 sm:p-8 sm:[&+&]:border-l sm:[&+&]:border-border max-sm:[&+&]:border-t max-sm:[&+&]:border-border">
                          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{etiqueta}</p>
                          <ul className="mt-3 space-y-2.5">
                            {items.map((x) => (
                              <li key={x.id} className="flex gap-2.5 text-sm text-text-secondary">
                                {si ? (
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-text-primary/35" aria-hidden="true" />
                                ) : (
                                  <span className="mt-2 h-px w-3 shrink-0 bg-text-muted" aria-hidden="true" />
                                )}
                                <EnLinea texto={x.texto} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {c.inversion.terceros.length > 0 && (
                <div className={`${TARJETA} p-6 sm:p-8`}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Pagos únicos y costos de terceros · a cargo del cliente
                  </h3>
                  <ul className="mt-4 divide-y divide-border">
                    {c.inversion.terceros.map((x) => (
                      <li key={x.id} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            <EnLinea texto={x.concepto} />
                          </p>
                          {x.nota && <p className="mt-0.5 text-xs text-text-muted"><EnLinea texto={x.nota} /></p>}
                        </div>
                        <p className="shrink-0 text-sm font-medium text-text-primary sm:text-right">
                          <EnLinea texto={x.costo} />
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Seccion>
        )}

        {/* Lo que necesitamos de su lado */}
        {hayRequisitos && (
          <Seccion
            id="tu-lado"
            indice={num("tu-lado")}
            etiqueta="Tu parte"
            titulo="¡Listo, empecemos!"
            texto={c.requisitos.intro || undefined}
          >
            <div className="space-y-4">
              {c.requisitos.grupos.map((g) => (
                <Plegable
                  key={g.id}
                  titulo={g.nombre}
                  subtitulo={g.cuando}
                  extra={
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-light px-2 font-mono text-xs font-semibold text-primary">
                      {g.items.length}
                    </span>
                  }
                >
                  {g.nota && <TextoRico texto={g.nota} className="mb-4 sm:text-sm" />}
                  <ul className="divide-y divide-border">
                    {g.items.map((r) => (
                      <li key={r.id} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[4rem_1fr]">
                        <span className="font-mono text-xs font-semibold text-primary">{r.clave}</span>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            <EnLinea texto={r.que} />
                          </p>
                          {r.paraQue && (
                            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                              <EnLinea texto={r.paraQue} />
                            </p>
                          )}
                          {(r.formato || r.bloquea) && (
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                              {r.formato && (
                                <span className="rounded-full bg-bg-section px-2.5 py-0.5 text-text-secondary ring-1 ring-inset ring-border">
                                  {r.formato}
                                </span>
                              )}
                              {r.bloquea && (
                                <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-primary-hover ring-1 ring-inset ring-primary/15">
                                  Si falta, se detiene: {r.bloquea}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Plegable>
              ))}
              {c.requisitos.nuestroLado.length > 0 && (
                <div className="relative overflow-hidden rounded-2xl bg-bg-dark p-6 shadow-glow sm:p-8">
                  <div className={REJILLA} />
                  <p className="relative text-xs font-semibold uppercase tracking-wider text-primary-light">
                    Mientras tanto, de nuestro lado
                  </p>
                  <ol className="relative mt-4 space-y-3">
                    {c.requisitos.nuestroLado.map((x, i) => (
                      <li key={x.id} className="flex gap-3 text-sm leading-relaxed text-white/80">
                        <span className="font-mono text-xs text-primary-light">{numero(i)}</span>
                        <span className="[&_strong]:text-white">
                          <EnLinea texto={x.texto} />
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </Seccion>
        )}

        {/* Riesgos */}
        {c.riesgos.length > 0 && (
          <Seccion id="riesgos" indice={num("riesgos")} etiqueta="Los riesgos" titulo="Lo que puede salir mal y cómo lo evitamos">
            <div className="grid gap-3 md:grid-cols-2">
              {c.riesgos.map((r) => (
                <div key={r.id} className={`${TARJETA} p-5`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold leading-snug text-text-primary">
                      <EnLinea texto={r.riesgo} />
                    </p>
                    {r.impacto && (
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${COLOR_IMPACTO[r.impacto]}`}>
                        {ETIQUETA_IMPACTO[r.impacto]}
                      </span>
                    )}
                  </div>
                  {r.mitigacion && (
                    <p className="mt-2 flex gap-2 text-sm leading-relaxed text-text-secondary">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-text-primary/35" aria-hidden="true" />
                      <span>
                        <EnLinea texto={r.mitigacion} />
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Seccion>
        )}

        {/* Validación técnica */}
        {hayValidacion && (
          <Seccion
            id="validacion"
            indice={num("validacion")}
            etiqueta="Validación técnica"
            titulo="Lo probamos en campo antes de construir"
            texto={c.validacion.objetivo || undefined}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {c.validacion.alcance.length > 0 && (
                <div className={`${TARJETA} p-6`}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Qué se prueba</h3>
                  <ol className="mt-4 space-y-3">
                    {c.validacion.alcance.map((x, i) => (
                      <li key={x.id} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                        <span className="font-mono text-xs font-semibold text-primary">{numero(i)}</span>
                        <span>
                          <EnLinea texto={x.texto} />
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {c.validacion.criterios.length > 0 && (
                <div className={`${TARJETA} p-6`}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Se da por buena si…</h3>
                  <ul className="mt-4 space-y-3">
                    {c.validacion.criterios.map((x) => (
                      <li key={x.id} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-text-primary/35" aria-hidden="true" />
                        <span>
                          <EnLinea texto={x.texto} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {c.validacion.necesita && (
              <p className="mt-4 rounded-2xl border border-primary/20 bg-primary-light/60 px-5 py-4 text-sm leading-relaxed text-text-secondary">
                <span className="font-semibold text-primary">Necesitamos de ti: </span>
                <EnLinea texto={c.validacion.necesita} />
              </p>
            )}
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

        {/* Anexos */}
        {c.anexos.length > 0 && (
          <Seccion id="anexos" indice={num("anexos")} etiqueta="Anexos" titulo="Los detalles, por si quieres profundizar">
            <div className="space-y-3">
              {c.anexos.map((a) => (
                <Plegable key={a.id} titulo={a.titulo}>
                  {a.texto && <TextoRico texto={a.texto} className="sm:text-sm" />}
                  {a.tabla && (
                    <div className={a.texto ? "mt-5" : ""}>
                      <TablaSimple tabla={a.tabla} />
                    </div>
                  )}
                </Plegable>
              ))}
            </div>
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
              : "Si todo está claro, acepta la propuesta aquí mismo. Si algo no te convence, escríbenos y lo ajustamos."
          }
        >
          <AceptarPropuesta
            slug={p.slug}
            total={dinero(total, moneda)}
            aceptacion={p.aceptacion}
            sugerido={c.ficha.contactoNombre}
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
