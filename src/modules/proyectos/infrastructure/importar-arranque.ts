/**
 * Adaptador de entrada: convierte un "documento de arranque" en Markdown (la
 * plantilla con la que se redactan las propuestas: ficha, alcance, glosario,
 * roles, módulos RF-XXX, flujo, decisiones, arquitectura, calendario,
 * inversión…) en el contenido crudo de un proyecto. Las secciones se
 * reconocen por su número; lo que no encaja en un campo estructurado se
 * conserva como Markdown en anexos y notas.
 *
 * Solo arma datos: el dominio los valida al crear el proyecto.
 */

interface Nodo {
  nivel: number
  titulo: string
  lineas: string[]
  hijos: Nodo[]
}

export interface ArranqueImportado {
  generales: { clienteNombre: string; proyectoNombre: string | null; fechaPropuesta: string | null }
  contenido: Record<string, unknown>
}

// --- Árbol de encabezados ---

function arbol(md: string): Nodo {
  const raiz: Nodo = { nivel: 0, titulo: "", lineas: [], hijos: [] }
  const pila = [raiz]
  let enCodigo = false
  for (const linea of md.split(/\r?\n/)) {
    if (linea.trim().startsWith("```")) enCodigo = !enCodigo
    const h = enCodigo ? null : /^(#{1,4})\s+(.*)$/.exec(linea)
    if (!h) {
      pila.at(-1)!.lineas.push(linea)
      continue
    }
    const nodo: Nodo = { nivel: h[1].length, titulo: h[2].trim(), lineas: [], hijos: [] }
    while (pila.at(-1)!.nivel >= nodo.nivel) pila.pop()
    pila.at(-1)!.hijos.push(nodo)
    pila.push(nodo)
  }
  return raiz
}

/** Busca por número de sección ("6", "6.3") en todo el árbol. */
function seccion(n: Nodo, numero: string): Nodo | null {
  for (const h of n.hijos) {
    if (new RegExp(`^${numero.replace(".", "\\.")}[.\\s]`).test(h.titulo)) return h
    const x = seccion(h, numero)
    if (x) return x
  }
  return null
}

/** Título sin numeración ni marcas de fase: "6.6 Unidades **[F3]**" → "Unidades". */
function tituloLimpio(t: string): string {
  return t
    .replace(/^\d+(\.\d+)*\.?\s+/, "")
    .replace(/\*\*\[[^\]]+\]\*\*/g, "")
    .replace(/\*\([^)]*\)\*/g, "")
    .trim()
}

/** Re-emite el Markdown de un nodo (sus líneas y sus subsecciones). */
function crudo(n: Nodo, conTitulo = false): string {
  const partes = conTitulo ? [`### ${tituloLimpio(n.titulo)}`] : []
  partes.push(...n.lineas)
  for (const h of n.hijos) partes.push(crudo(h, true))
  return partes
    .join("\n")
    .replace(/^---\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

// --- Piezas de Markdown ---

const sinMd = (t: string) => t.replace(/\*\*/g, "").replace(/`/g, "").trim()
const mayuscula = (t: string) => t.replace(/^\p{Ll}/u, (c) => c.toUpperCase())

function celdas(linea: string): string[] {
  return linea.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((x) => x.trim())
}

/** Todas las tablas de un bloque de líneas: encabezados y filas. */
function tablas(lineas: string[]): { columnas: string[]; filas: string[][] }[] {
  const res: { columnas: string[]; filas: string[][] }[] = []
  let actual: string[][] | null = null
  for (const l of [...lineas, ""]) {
    if (l.trim().startsWith("|")) {
      const f = celdas(l)
      if (f.every((x) => /^:?-+:?$/.test(x))) continue
      ;(actual ??= []).push(f)
    } else if (actual) {
      const [columnas, ...filas] = actual
      res.push({ columnas, filas })
      actual = null
    }
  }
  return res
}

/** Índice de columna cuyo encabezado contiene alguno de los textos. */
function columna(columnas: string[], ...textos: string[]): number {
  return columnas.findIndex((c) => textos.some((t) => c.toLowerCase().includes(t.toLowerCase())))
}

/** Elementos de lista de primer nivel ("- x", "1. x"); las líneas sangradas se unen al anterior. */
function elementos(lineas: string[], numerados = false): string[] {
  const patron = numerados ? /^\d+[.)]\s+(.*)$/ : /^[-*]\s+(?:\[[ xX]\]\s+)?(.*)$/
  const res: string[] = []
  for (const l of lineas) {
    const m = patron.exec(l)
    if (m && !/^\s/.test(l)) res.push(m[1].trim())
    else if (res.length && /^\s+\S/.test(l)) res[res.length - 1] += ` · ${l.trim().replace(/^[-*·]\s+|^\d+[.)]\s+/, "")}`
  }
  return res
}

function parrafos(lineas: string[]): string {
  return lineas
    .filter((l) => l.trim() && !/^[|>]/.test(l.trim()) && !/^[-*]\s|^\d+[.)]\s/.test(l.trim()))
    .map((l) => l.trim())
    .join("\n")
}

/** "$10,500" → 1_050_000 centavos. */
function centavos(texto: string): number | null {
  const m = /\$\s*([\d,]+(?:\.\d{1,2})?)/.exec(texto)
  return m ? Math.round(Number(m[1].replace(/,/g, "")) * 100) : null
}

/** Líneas entre un rótulo en negritas ("**Condiciones:**") y el siguiente rótulo. */
function bajoRotulo(lineas: string[], rotulo: RegExp): string[] {
  const i = lineas.findIndex((l) => rotulo.test(l))
  if (i < 0) return []
  const fin = lineas.findIndex((l, k) => k > i && /^\*\*[^*]+:\*\*/.test(l.trim()))
  return lineas.slice(i + 1, fin < 0 ? undefined : fin)
}

// --- Conversión ---

export function importarArranque(md: string, nuevoId: () => string): ArranqueImportado {
  const doc = arbol(md)
  const todo = doc.hijos[0] ?? doc
  const s = (n: string) => seccion(todo, n)
  const id = nuevoId

  // Encabezado: versión y fecha
  const cabecera = todo.lineas.join("\n")
  const version = /\*\*Versión:\*\*\s*([\w.]+)/.exec(cabecera)?.[1] ?? ""
  const fecha = /\*\*Fecha:\*\*\s*(\d{4}-\d{2}-\d{2})/.exec(cabecera)?.[1] ?? null

  // 1. Ficha
  const ficha = new Map<string, string>()
  for (const f of tablas(s("1")?.lineas ?? [])[0]?.filas ?? []) ficha.set(sinMd(f[0]), f[1] ?? "")
  const tomar = (k: string) => {
    const v = ficha.get(k) ?? ""
    ficha.delete(k)
    return v
  }
  const clienteNombre = sinMd(tomar("Cliente"))
  const proyectoNombre = sinMd(tomar("Producto")) || null
  const giro = tomar("Giro del cliente")
  const tipoSistema = sinMd(tomar("Tipo de sistema"))
  const entregables = tomar("Entregables")
    .split(/(?:^|\s·\s)\d+\)\s*/)
    .filter((x) => x.trim())
    .map((x) => {
      const m = /^\*\*(.+?)\*\*\s*(.*)$/.exec(x.trim())
      return { id: id(), nombre: m ? m[1] : sinMd(x), descripcion: m ? m[2] : "" }
    })
  const duracionMvp = sinMd(ficha.get("Duración del MVP") ?? "")
  const datos = [...ficha.entries()].map(([etiqueta, valor]) => ({ id: id(), etiqueta, valor }))

  // 2. Problema, objetivo y alcance
  const areas = elementos(s("2.3")?.lineas ?? [], true).map((x) => {
    const m = /^\*\*(.+?)\*\*:?\s*(.*)$/.exec(x)
    return { id: id(), nombre: m ? m[1] : x, descripcion: m ? mayuscula(m[2]) : "" }
  })

  // 4 y 5. Glosario, roles y permisos
  const glosario = (tablas(s("4")?.lineas ?? [])[0]?.filas ?? []).map((f) => ({
    id: id(),
    termino: sinMd(f[0]),
    definicion: f[1] ?? "",
  }))
  const tablaRoles = tablas(s("5")?.lineas ?? [])[0]
  const roles = (tablaRoles?.filas ?? []).map((f) => ({
    id: id(),
    nombre: sinMd(f[0]),
    quien: f[1] ?? "",
    dispositivo: f[2] ?? "",
    responsabilidades: f[3] ?? "",
  }))
  const matriz = s("5")?.hijos.find((h) => /permisos/i.test(h.titulo))
  const permisos = (tablas(matriz?.lineas ?? [])[0]?.filas ?? []).map((f) => ({
    id: id(),
    modulo: sinMd(f[0]),
    accesos: Object.fromEntries(roles.map((r, i) => [r.id, f[i + 1] ?? ""]).filter(([, v]) => v)),
  }))

  // 11. Fases (se necesitan antes que los módulos para asignar requerimientos)
  const s111 = s("11.1")
  const tablaMvp = tablas(s111?.lineas ?? [])[0]
  const notasMvp = (s111?.lineas ?? []).filter((l) => !l.trim().startsWith("|"))
  const fases = [
    {
      id: id(),
      clave: "MVP",
      nombre: tituloLimpio(s111?.titulo ?? "MVP").replace(/^MVP:\s*/i, "").replace(/\s*\([^)]*\)$/, "").replace(/^\p{Ll}/u, (c) => c.toUpperCase()),
      lema: "",
      contratada: true,
      duracion: duracionMvp,
      entregables: (tablaMvp?.filas ?? []).map((f) => ({ id: id(), nombre: sinMd(f[0]), resuelve: "", incluye: f[1] ?? "" })),
      notas: notasMvp.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
    },
    ...(s("11.4")?.hijos ?? [])
      .filter((h) => /^Fase\s+\d/i.test(h.titulo))
      .map((h) => {
        const m = /^Fase\s+(\d+)\s*·\s*(.*)$/i.exec(h.titulo)
        const t = tablas(h.lineas)[0]
        const [iF, iR, iI] = t ? [0, columna(t.columnas, "resuelve"), columna(t.columnas, "incluye")] : [0, -1, -1]
        return {
          id: id(),
          clave: m ? `F${m[1]}` : h.titulo,
          nombre: m ? m[2] : h.titulo,
          lema: sinMd(h.lineas.find((l) => /^\*[^*].*\*$/.test(l.trim()))?.trim().slice(1, -1) ?? ""),
          contratada: false,
          duracion: "",
          entregables: (t?.filas ?? []).map((f) => ({
            id: id(),
            nombre: f[iF] ?? "",
            resuelve: iR >= 0 ? f[iR] ?? "" : "",
            incluye: iI >= 0 ? f[iI] ?? "" : "",
          })),
          notas: "",
        }
      }),
  ]
  const faseDe = (tag: string | undefined | null) =>
    tag ? fases.find((f) => f.clave === tag.split(",")[0].trim())?.id ?? null : null

  // 6. Módulos y requerimientos
  type Mod = { id: string; clave: string; nombre: string; grupo: string; descripcion: string[]; requerimientos: { id: string; clave: string; texto: string; faseId: string | null }[]; fase: string | null }
  const modulos: Mod[] = []
  for (const sub of s("6")?.hijos ?? []) {
    const grupo = tituloLimpio(sub.titulo)
    const faseGrupo = /\*\*\[([^\]]+)\]\*\*/.exec(sub.titulo)?.[1] ?? null
    const notaGrupo = /\*\(([^)]*)\)\*/.exec(sub.titulo)?.[1] ?? ""
    let mod: Mod | null = null
    let ultimo: { texto: string } | null = null
    let enTabla = false
    const nuevo = (m: Omit<Mod, "id" | "requerimientos" | "descripcion"> & { descripcion?: string[] }) => {
      mod = { id: id(), requerimientos: [], descripcion: [], ...m }
      modulos.push(mod)
      ultimo = null
      return mod
    }
    for (const l of sub.lineas) {
      const t = l.trim()
      const cab = /^\*\*(.+?)\*\*\s+—\s+`([A-Z][A-Z0-9-]+)`(.*)$/.exec(t)
      if (cab) {
        const extra = cab[3]
        nuevo({
          clave: cab[2],
          nombre: cab[1],
          grupo,
          fase: /\*\*\[([^\]]+)\]\*\*/.exec(extra)?.[1] ?? faseGrupo,
          descripcion: [/\*\(([^)]*)\)\*/.exec(extra)?.[1] ?? ""].filter(Boolean).map((x) => mayuscula(x) + "."),
        })
        enTabla = false
        continue
      }
      const rf = /^[-*]\s+`(RF-[A-Z0-9-]+)`\s*(?:\*\*\[([^\]]+)\]\*\*)?\s*(.*)$/.exec(t)
      if (rf && !/^\s/.test(l)) {
        const m: Mod =
          mod ??
          nuevo({
            clave: rf[1].replace(/-\d+$/, ""),
            nombre: grupo,
            grupo,
            fase: faseGrupo,
            descripcion: notaGrupo ? [mayuscula(notaGrupo) + "."] : [],
          })
        const tag = rf[2] ?? m.fase
        const opcional = rf[2] && /opcional/i.test(rf[2]) ? " *(opcional)*" : ""
        const req = { id: id(), clave: rf[1], texto: rf[3] + opcional, faseId: faseDe(tag) }
        m.requerimientos.push(req)
        ultimo = req
        continue
      }
      const conTag = /^[-*]\s+\*\*\[([^\]]+)\]\s*(.+?)\*\*(.*)$/.exec(t)
      if (conTag && mod && !/^\s/.test(l)) {
        const m: Mod = mod
        const req = {
          id: id(),
          clave: `${m.clave}-${String(m.requerimientos.length + 1).padStart(2, "0")}`,
          texto: (conTag[2] + conTag[3]).replace(/:$/, "").trim(),
          faseId: faseDe(conTag[1]),
        }
        m.requerimientos.push(req)
        ultimo = null
        m.descripcion.push(`**${conTag[1]}** · ${sinMd(conTag[2]).replace(/:$/, "")}`)
        continue
      }
      if (!mod || t.startsWith(">")) continue
      const m: Mod = mod
      // Continuación sangrada de un requerimiento: se une en la misma línea
      if (ultimo && /^\s+\S/.test(l) && !t.startsWith("|")) {
        const u: { texto: string } = ultimo
        u.texto += ` · ${t.replace(/^[-*·]\s+|^\d+[.)]\s+/, "")}`
        continue
      }
      // Todo lo demás (notas, listas, tablas) queda como descripción del módulo
      if (t.startsWith("|")) enTabla = true
      else if (enTabla && !t) enTabla = false
      if (t || m.descripcion.length) m.descripcion.push(/^\s+\S/.test(l) && !t.startsWith("|") ? `  ${t}` : t)
      ultimo = null
    }
  }

  // 7. Flujo operativo (bloque de código con etapas en mayúsculas)
  const flujo: { id: string; nombre: string; pasos: { id: string; texto: string; detalle: string }[] }[] = []
  for (const l of s("7")?.lineas ?? []) {
    const t = l.trim()
    if (!t || t.startsWith("```") || /^-{3,}$/.test(t)) continue
    if (/^[A-ZÁÉÍÓÚÑ ]{4,}(\s*\(.*\))?$/.test(t)) {
      const [, mayus, resto] = /^([^(]+?)\s*(\(.*\))?$/.exec(t)!
      flujo.push({ id: id(), nombre: [mayus.charAt(0) + mayus.slice(1).toLowerCase(), resto].filter(Boolean).join(" "), pasos: [] })
      continue
    }
    const etapa = flujo.at(-1)
    if (!etapa) continue
    const paso = /^\d+\.\s+(.*?)(?:\s+→\s*(.*))?$/.exec(t)
    if (paso) etapa.pasos.push({ id: id(), texto: paso[1].trim(), detalle: paso[2] ? `→ ${paso[2].trim()}` : "" })
    else if (etapa.pasos.length) {
      const p = etapa.pasos.at(-1)!
      p.detalle = [p.detalle, t].filter(Boolean).join("\n")
    }
  }

  // 8. Decisiones
  const tDec = tablas(s("8")?.lineas ?? [])[0]
  const decisiones = (tDec?.filas ?? []).map((f) => ({
    id: id(),
    clave: f[0],
    decision: f[1] ?? "",
    motivo: f[2] ?? "",
    descartadas: f[3] ?? "",
  }))

  // 9. Arquitectura
  const s91 = s("9.1")?.lineas ?? []
  const iniCodigo = s91.findIndex((l) => l.trim().startsWith("```"))
  const finCodigo = s91.findIndex((l, i) => i > iniCodigo && l.trim().startsWith("```"))
  const diagrama = iniCodigo >= 0 ? s91.slice(iniCodigo + 1, finCodigo).join("\n") : ""
  const resumen = parrafos(iniCodigo >= 0 ? [...s91.slice(0, iniCodigo), ...s91.slice(finCodigo + 1)] : s91)
  const stack = (tablas(s("9.2")?.lineas ?? [])[0]?.filas ?? []).map((f) => ({ id: id(), capa: f[0], tecnologia: f[1] ?? "" }))
  const notasArq = (s("9")?.hijos ?? [])
    .filter((h) => !/^9\.[12]\s/.test(h.titulo))
    .map((h) => ({ id: id(), titulo: tituloLimpio(h.titulo), texto: crudo(h) }))

  // 11.2 Calendario (y los pagos de 12.1, para ligarlos)
  const tPagos = tablas(s("12.1")?.lineas ?? [])[0]
  const pagos = (tPagos?.filas ?? [])
    .filter((f) => !/total/i.test(f[0]))
    .map((f) => ({
      id: id(),
      nombre: sinMd(f[0]).replace(/^\d+\s*·\s*/, ""),
      montoCentavos: centavos(f[1] ?? ""),
      cuando: f[2] ?? "",
      contra: f[3] ?? "",
    }))
  const tCal = tablas(s("11.2")?.lineas ?? [])[0]
  // Cada pago se liga una sola vez, en orden (puede haber dos del mismo monto)
  const ligados = new Set<string>()
  const calendario = (tCal?.filas ?? []).map((f) => {
    const monto = centavos(f[2] ?? "")
    const pago =
      monto != null && !/mes/i.test(f[2])
        ? pagos.find((p) => p.montoCentavos === monto && !ligados.has(p.id))
        : null
    if (pago) ligados.add(pago.id)
    return {
      id: id(),
      semanas: f[0],
      entregable: pago || !f[2] ? f[1] : `${f[1]} · ${f[2]}`,
      pagoId: pago?.id ?? null,
    }
  })

  // 12. Inversión
  const s122 = s("12.2")?.lineas ?? []
  const lineaMensual = s122.find((l) => /^\*\*\$/.test(l.trim())) ?? ""
  const tMensual = tablas(s122)[0]
  const columnaLista = (i: number) =>
    (tMensual?.filas ?? []).map((f) => f[i] ?? "").filter(Boolean).map((texto) => ({ id: id(), texto }))
  const inversion = {
    moneda: /\(([A-Z]{3})\)/.exec(s("12")?.lineas.join(" ") ?? "")?.[1] ?? "MXN",
    pagos,
    condiciones: elementos(bajoRotulo(s("12.1")?.lineas ?? [], /\*\*Condiciones:\*\*/)).map((texto) => ({ id: id(), texto })),
    mensualidad: {
      montoCentavos: centavos(lineaMensual),
      descripcion: mayuscula(lineaMensual.replace(/^\*\*[^*]+\*\*[,.]?\s*/, "")),
      incluye: columnaLista(columna(tMensual?.columnas ?? [], "Incluye")),
      noIncluye: columnaLista(columna(tMensual?.columnas ?? [], "No incluye")),
    },
    terceros: (tablas(s("12.3")?.lineas ?? [])[0]?.filas ?? []).map((f) => ({
      id: id(),
      concepto: sinMd(f[0]),
      costo: f[1] ?? "",
      nota: f[2] ?? "",
    })),
  }

  // 14. Validación técnica
  const s14 = s("14")?.lineas ?? []
  const rotulo = (r: RegExp) => mayuscula(s14.find((l) => r.test(l))?.replace(/^\*\*[^*]+\*\*\s*/, "").trim() ?? "")
  const validacion = {
    objetivo: rotulo(/^\*\*Objetivo:\*\*/),
    alcance: elementos(bajoRotulo(s14, /^\*\*Alcance/), true).map((texto) => ({ id: id(), texto })),
    criterios: elementos(bajoRotulo(s14, /^\*\*Criterios/)).map((texto) => ({ id: id(), texto })),
    necesita: rotulo(/^\*\*Se necesita/),
  }

  // 16. Riesgos
  const riesgos = (tablas(s("16")?.lineas ?? [])[0]?.filas ?? []).map((f) => {
    const impacto = sinMd(f[1] ?? "").toLowerCase()
    return {
      id: id(),
      riesgo: f[0],
      impacto: ["bajo", "medio", "alto"].includes(impacto) ? impacto : null,
      mitigacion: f[2] ?? "",
    }
  })

  // 18. Lo que necesitamos del cliente
  const s18 = s("18")
  const grupos = (s18?.hijos ?? [])
    .filter((h) => tablas(h.lineas).length > 0)
    .map((h) => {
      const [nombre, cuando = ""] = tituloLimpio(h.titulo).split(/\s+·\s+/)
      const t = tablas(h.lineas)[0]
      const c = (...textos: string[]) => columna(t.columnas, ...textos)
      const [iId, iQue, iPara, iFmt, iBlq] = [c("ID"), c("Qué se necesita", "Qué hay que definir"), c("Para qué", "Datos"), c("Formato"), c("Bloquea")]
      const celda = (f: string[], i: number) => (i >= 0 ? f[i] ?? "" : "")
      return {
        id: id(),
        nombre,
        cuando,
        nota: parrafos(h.lineas),
        items: t.filas.map((f) => ({
          id: id(),
          clave: celda(f, iId),
          que: celda(f, iQue),
          paraQue: celda(f, iPara),
          formato: celda(f, iFmt),
          bloquea: celda(f, iBlq),
        })),
      }
    })
  const intro = parrafos(s18?.lineas ?? [])
  const nuestroLado = elementos(
    (s18?.hijos ?? []).find((h) => /nosotros/i.test(h.titulo))?.lineas ?? [],
    true,
  ).map((texto) => ({ id: id(), texto }))

  // Anexos: lo que no tiene un campo propio se conserva como Markdown
  const anexo = (n: Nodo | null | undefined) =>
    n ? [{ id: id(), titulo: tituloLimpio(n.titulo), texto: crudo(n), tabla: null }] : []
  const ideas = (s("11.4")?.hijos ?? []).find((h) => /ideas/i.test(h.titulo))
  const anexos = [
    ...anexo(s("3")),
    ...anexo(s("10")),
    ...anexo(s("13")),
    ...anexo(s("17")),
    ...anexo(s("11.5")),
    ...anexo(ideas),
  ]

  // 19. Fuentes
  const fuentes = (s("19")?.lineas ?? [])
    .map((l) => /^[-*]\s+\[([^\]]+)\]\(([^)]+)\)/.exec(l.trim()))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => ({ id: id(), titulo: m[1], url: m[2] }))

  return {
    generales: { clienteNombre, proyectoNombre, fechaPropuesta: fecha },
    contenido: {
      ficha: {
        version,
        giro,
        tipoSistema,
        objetivo: parrafos(s("2.2")?.lineas ?? []),
        entregables,
        datos,
      },
      alcance: {
        problemas: elementos(s("2.1")?.lineas ?? []).map((texto) => ({ id: id(), texto })),
        areas,
        valorCentral: crudo(s("2.5") ?? { nivel: 0, titulo: "", lineas: [], hijos: [] }),
      },
      glosario,
      roles,
      permisos,
      modulos: modulos.map((m) => ({
        id: m.id,
        clave: m.clave,
        nombre: m.nombre,
        grupo: m.grupo,
        descripcion: m.descripcion.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
        requerimientos: m.requerimientos,
      })),
      flujo,
      decisiones,
      arquitectura: { resumen, diagrama, stack, notas: notasArq },
      fases,
      calendario,
      inversion,
      requisitos: { intro, grupos, nuestroLado },
      riesgos,
      validacion,
      anexos,
      fuentes,
    },
  }
}
