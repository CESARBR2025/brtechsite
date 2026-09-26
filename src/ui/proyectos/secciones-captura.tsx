"use client"

import type { ClaveSeccion, Contenido } from "@/src/modules/proyectos/domain/contenido"
import { NIVELES_IMPACTO } from "@/src/modules/proyectos/domain/contenido"
import { Campo, ChipUnico, ListaEditable, nuevoId } from "@/src/ui/levantamientos/campos"
import { formatearDinero } from "@/src/ui/formato"
import { CampoDinero, CampoTabla, Casilla, Selector } from "./campos"
import { ETIQUETA_ICONO, ETIQUETA_IMPACTO } from "./etiquetas"

export interface Generales {
  clienteNombre: string
  clienteContacto: string
  proyectoNombre: string
  fechaPropuesta: string
}

type Cambiar = (fn: (c: Contenido) => Contenido) => void
type Renglon = { id: string; texto: string }

const REJILLA = "grid gap-4 sm:grid-cols-2"
const SUBTITULO = "mb-2 text-sm font-medium text-text-secondary"

const ETIQUETAS_IMPACTO = Object.fromEntries(
  NIVELES_IMPACTO.map((n) => [n, ETIQUETA_IMPACTO[n]]),
) as typeof ETIQUETA_IMPACTO

/** Lista de renglones de texto libre (problemas, condiciones, criterios…). */
function Renglones({
  items,
  onChange,
  agregar,
  etiqueta,
  filas = 2,
}: {
  items: Renglon[]
  onChange: (v: Renglon[]) => void
  agregar: string
  etiqueta: string
  filas?: number
}) {
  return (
    <ListaEditable
      items={items}
      onChange={onChange}
      crear={() => ({ id: nuevoId(), texto: "" })}
      agregar={agregar}
      titulo={(x) => x.texto.slice(0, 60) || etiqueta}
    >
      {(x, set) => (
        <Campo etiqueta={etiqueta} filas={filas} valor={x.texto} onChange={(v) => set({ texto: v })} />
      )}
    </ListaEditable>
  )
}

/** Cuerpo de captura de una sección del proyecto. */
export function CuerpoSeccion({
  clave,
  c,
  cambiar,
  generales,
  cambiarGenerales,
}: {
  clave: ClaveSeccion
  c: Contenido
  cambiar: Cambiar
  generales: Generales
  cambiarGenerales: (parcial: Partial<Generales>) => void
}) {
  // Reemplaza una clave de primer nivel del contenido
  const fijar = <K extends keyof Contenido>(k: K, v: Contenido[K]) =>
    cambiar((prev) => ({ ...prev, [k]: v }))
  // Mezcla campos dentro de un bloque
  const mezclar = <
    K extends "ficha" | "alcance" | "arquitectura" | "inversion" | "requisitos" | "validacion",
  >(
    k: K,
    parcial: Partial<Contenido[K]>,
  ) => cambiar((prev) => ({ ...prev, [k]: { ...prev[k], ...parcial } }))

  const opcionesFase = c.fases.map((f) => ({
    id: f.id,
    texto: [f.clave, f.nombre].filter(Boolean).join(" · ") || "Fase",
  }))

  switch (clave) {
    case "ficha":
      return (
        <div className="space-y-4">
          <div className={REJILLA}>
            <Campo
              etiqueta="Cliente"
              requerido
              valor={generales.clienteNombre}
              onChange={(v) => cambiarGenerales({ clienteNombre: v })}
            />
            <Campo
              etiqueta="Nombre del contacto"
              placeholder="A quien se saluda en la propuesta"
              valor={c.ficha.contactoNombre}
              onChange={(v) => mezclar("ficha", { contactoNombre: v })}
            />
            <Campo
              etiqueta="WhatsApp o correo"
              tipo="tel"
              valor={generales.clienteContacto}
              onChange={(v) => cambiarGenerales({ clienteContacto: v })}
            />
            <Campo
              etiqueta="Nombre del producto"
              placeholder="Tostadas Tio Beto Soft"
              valor={generales.proyectoNombre}
              onChange={(v) => cambiarGenerales({ proyectoNombre: v })}
            />
            <Campo
              etiqueta="Fecha de la propuesta"
              tipo="date"
              requerido
              valor={generales.fechaPropuesta}
              onChange={(v) => cambiarGenerales({ fechaPropuesta: v })}
            />
            <Campo
              etiqueta="Versión"
              placeholder="1.0"
              valor={c.ficha.version}
              onChange={(v) => mezclar("ficha", { version: v })}
            />
            <Campo
              etiqueta="Giro del cliente"
              valor={c.ficha.giro}
              onChange={(v) => mezclar("ficha", { giro: v })}
            />
            <Campo
              etiqueta="Tipo de sistema"
              placeholder="Sistema de distribución y venta en ruta"
              valor={c.ficha.tipoSistema}
              onChange={(v) => mezclar("ficha", { tipoSistema: v })}
            />
          </div>
          <Campo
            etiqueta="Promesa (hero de la propuesta)"
            filas={2}
            placeholder="Cada caja, cada parada y cada peso: bajo control."
            valor={c.ficha.promesa}
            onChange={(v) => mezclar("ficha", { promesa: v })}
          />
          <Campo
            etiqueta="Objetivo"
            filas={3}
            valor={c.ficha.objetivo}
            onChange={(v) => mezclar("ficha", { objetivo: v })}
          />
          <div>
            <p className={SUBTITULO}>Entregables</p>
            <ListaEditable
              items={c.ficha.entregables}
              onChange={(v) => mezclar("ficha", { entregables: v })}
              crear={() => ({ id: nuevoId(), nombre: "", descripcion: "" })}
              agregar="Agregar entregable"
              titulo={(x) => x.nombre || "Entregable"}
            >
              {(x, set) => (
                <>
                  <Campo etiqueta="Entregable" placeholder="App Android nativa" valor={x.nombre} onChange={(v) => set({ nombre: v })} />
                  <Campo etiqueta="Para qué / para quién" filas={2} valor={x.descripcion} onChange={(v) => set({ descripcion: v })} />
                </>
              )}
            </ListaEditable>
          </div>
          <div>
            <p className={SUBTITULO}>Datos de la ficha</p>
            <ListaEditable
              items={c.ficha.datos}
              onChange={(v) => mezclar("ficha", { datos: v })}
              crear={() => ({ id: nuevoId(), etiqueta: "", valor: "" })}
              agregar="Agregar dato"
              titulo={(x) => x.etiqueta || "Dato"}
            >
              {(x, set) => (
                <div className={REJILLA}>
                  <Campo etiqueta="Dato" placeholder="Flota" valor={x.etiqueta} onChange={(v) => set({ etiqueta: v })} />
                  <Campo etiqueta="Valor" placeholder="5 camionetas" valor={x.valor} onChange={(v) => set({ valor: v })} />
                </div>
              )}
            </ListaEditable>
          </div>
        </div>
      )

    case "alcance":
      return (
        <div className="space-y-5">
          <div>
            <p className={SUBTITULO}>Problemas que resuelve</p>
            <Renglones
              items={c.alcance.problemas}
              onChange={(v) => mezclar("alcance", { problemas: v })}
              agregar="Agregar problema"
              etiqueta="Problema"
            />
          </div>
          <div>
            <p className={SUBTITULO}>Grandes áreas del sistema</p>
            <ListaEditable
              items={c.alcance.areas}
              onChange={(v) => mezclar("alcance", { areas: v })}
              crear={() => ({ id: nuevoId(), nombre: "", descripcion: "" })}
              agregar="Agregar área"
              titulo={(x) => x.nombre || "Área"}
            >
              {(x, set) => (
                <>
                  <Campo etiqueta="Área" placeholder="Inventario" valor={x.nombre} onChange={(v) => set({ nombre: v })} />
                  <Campo etiqueta="Qué cubre" filas={2} valor={x.descripcion} onChange={(v) => set({ descripcion: v })} />
                </>
              )}
            </ListaEditable>
          </div>
          <Campo
            etiqueta="Valor central"
            filas={5}
            placeholder="Lo que de verdad resuelve el problema (fórmula, conciliación…)"
            valor={c.alcance.valorCentral}
            onChange={(v) => mezclar("alcance", { valorCentral: v })}
          />
        </div>
      )

    case "vistas":
      return (
        <ListaEditable
          items={c.vistas}
          onChange={(v) => fijar("vistas", v)}
          crear={() => ({
            id: nuevoId(),
            grupo: c.vistas.at(-1)?.grupo ?? "",
            nombre: "",
            icono: null,
            descripcion: "",
            puntos: [],
          })}
          agregar="Agregar pantalla"
          titulo={(x) => x.nombre || "Pantalla"}
        >
          {(x, set) => (
            <>
              <Campo
                etiqueta="Dónde se usa"
                placeholder="Panel de administración · web, iPhone y Android"
                valor={x.grupo}
                onChange={(v) => set({ grupo: v })}
              />
              <Campo etiqueta="Nombre" placeholder="Tus camionetas en tiempo real" valor={x.nombre} onChange={(v) => set({ nombre: v })} />
              <ChipUnico etiqueta="Ícono" opciones={ETIQUETA_ICONO} valor={x.icono} onChange={(v) => set({ icono: v })} />
              <Campo etiqueta="Qué verás" filas={2} valor={x.descripcion} onChange={(v) => set({ descripcion: v })} />
              <div>
                <p className={SUBTITULO}>Qué podrás hacer</p>
                <Renglones items={x.puntos} onChange={(v) => set({ puntos: v })} agregar="Agregar" etiqueta="Punto" filas={1} />
              </div>
            </>
          )}
        </ListaEditable>
      )

    case "roles":
      return (
        <ListaEditable
          items={c.roles}
          onChange={(v) => fijar("roles", v)}
          crear={() => ({ id: nuevoId(), nombre: "", quien: "", dispositivo: "", responsabilidades: "" })}
          agregar="Agregar rol"
          titulo={(x) => x.nombre || "Rol"}
        >
          {(x, set) => (
            <>
              <div className={REJILLA}>
                <Campo etiqueta="Rol" valor={x.nombre} onChange={(v) => set({ nombre: v })} />
                <Campo etiqueta="Quién es" valor={x.quien} onChange={(v) => set({ quien: v })} />
              </div>
              <Campo etiqueta="Dispositivo" valor={x.dispositivo} onChange={(v) => set({ dispositivo: v })} />
              <Campo
                etiqueta="Responsabilidades"
                filas={2}
                valor={x.responsabilidades}
                onChange={(v) => set({ responsabilidades: v })}
              />
            </>
          )}
        </ListaEditable>
      )

    case "permisos": {
      const roles = c.roles.filter((r) => r.nombre)
      if (roles.length === 0) {
        return <p className="text-sm text-text-muted">Primero registra los roles.</p>
      }
      return (
        <ListaEditable
          items={c.permisos}
          onChange={(v) => fijar("permisos", v)}
          crear={() => ({ id: nuevoId(), modulo: "", accesos: {} as Record<string, string> })}
          agregar="Agregar módulo a la matriz"
          titulo={(x) => x.modulo || "Módulo"}
        >
          {(x, set) => (
            <>
              <Campo etiqueta="Módulo" valor={x.modulo} onChange={(v) => set({ modulo: v })} />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {roles.map((r) => (
                  <Campo
                    key={r.id}
                    etiqueta={r.nombre}
                    placeholder="–"
                    valor={x.accesos[r.id] ?? ""}
                    onChange={(v) => set({ accesos: { ...x.accesos, [r.id]: v } })}
                  />
                ))}
              </div>
            </>
          )}
        </ListaEditable>
      )
    }

    case "fases":
      return (
        <ListaEditable
          items={c.fases}
          onChange={(v) => fijar("fases", v)}
          crear={() => ({
            id: nuevoId(),
            clave: "",
            nombre: "",
            lema: "",
            contratada: false,
            duracion: "",
            entregables: [],
            notas: "",
          })}
          agregar="Agregar fase"
          titulo={(x) => [x.clave, x.nombre].filter(Boolean).join(" · ") || "Fase"}
        >
          {(x, set) => (
            <>
              <div className="grid grid-cols-[6rem_1fr] gap-3">
                <Campo etiqueta="Clave" placeholder="MVP" valor={x.clave} onChange={(v) => set({ clave: v })} />
                <Campo etiqueta="Nombre" placeholder="Operación base diaria" valor={x.nombre} onChange={(v) => set({ nombre: v })} />
              </div>
              <div className={REJILLA}>
                <Campo etiqueta="Lema" valor={x.lema} onChange={(v) => set({ lema: v })} />
                <Campo etiqueta="Duración" placeholder="15 semanas" valor={x.duracion} onChange={(v) => set({ duracion: v })} />
              </div>
              <Casilla
                etiqueta="Contratada en esta propuesta"
                valor={x.contratada}
                onChange={(v) => set({ contratada: v })}
              />
              <div>
                <p className={SUBTITULO}>Qué incluye</p>
                <ListaEditable
                  items={x.entregables}
                  onChange={(v) => set({ entregables: v })}
                  crear={() => ({ id: nuevoId(), nombre: "", resuelve: "", incluye: "" })}
                  agregar="Agregar bloque o función"
                  titulo={(e) => e.nombre || "Bloque"}
                >
                  {(e, setE) => (
                    <>
                      <Campo etiqueta="Nombre" valor={e.nombre} onChange={(v) => setE({ nombre: v })} />
                      <Campo etiqueta="Qué resuelve para el negocio" filas={2} valor={e.resuelve} onChange={(v) => setE({ resuelve: v })} />
                      <Campo etiqueta="Qué incluye" filas={2} valor={e.incluye} onChange={(v) => setE({ incluye: v })} />
                    </>
                  )}
                </ListaEditable>
              </div>
              <Campo etiqueta="Notas de alcance" filas={3} valor={x.notas} onChange={(v) => set({ notas: v })} />
            </>
          )}
        </ListaEditable>
      )

    case "modulos":
      return (
        <ListaEditable
          items={c.modulos}
          onChange={(v) => fijar("modulos", v)}
          crear={() => ({ id: nuevoId(), clave: "", nombre: "", grupo: "", descripcion: "", requerimientos: [] })}
          agregar="Agregar módulo"
          titulo={(m) => [m.clave, m.nombre].filter(Boolean).join(" · ") || "Módulo"}
        >
          {(m, set) => (
            <>
              <div className="grid grid-cols-[7rem_1fr] gap-3">
                <Campo etiqueta="Clave" placeholder="RF-AUT" valor={m.clave} onChange={(v) => set({ clave: v })} />
                <Campo etiqueta="Nombre" valor={m.nombre} onChange={(v) => set({ nombre: v })} />
              </div>
              <Campo etiqueta="Grupo" placeholder="Catálogos, App del repartidor…" valor={m.grupo} onChange={(v) => set({ grupo: v })} />
              <Campo etiqueta="Descripción o nota" filas={2} valor={m.descripcion} onChange={(v) => set({ descripcion: v })} />
              <div>
                <p className={SUBTITULO}>Requerimientos</p>
                <ListaEditable
                  items={m.requerimientos}
                  onChange={(v) => set({ requerimientos: v })}
                  crear={() => ({
                    id: nuevoId(),
                    clave: m.clave ? `${m.clave}-${String(m.requerimientos.length + 1).padStart(2, "0")}` : "",
                    texto: "",
                    faseId: m.requerimientos.at(-1)?.faseId ?? null,
                  })}
                  agregar="Agregar requerimiento"
                  titulo={(q) => q.clave || q.texto.slice(0, 50) || "Requerimiento"}
                >
                  {(q, setQ) => (
                    <>
                      <div className="grid grid-cols-[9rem_1fr] gap-3">
                        <Campo etiqueta="Clave" valor={q.clave} onChange={(v) => setQ({ clave: v })} />
                        <Selector
                          etiqueta="Fase"
                          opciones={opcionesFase}
                          valor={q.faseId}
                          onChange={(v) => setQ({ faseId: v })}
                        />
                      </div>
                      <Campo etiqueta="Requerimiento" filas={2} valor={q.texto} onChange={(v) => setQ({ texto: v })} />
                    </>
                  )}
                </ListaEditable>
              </div>
            </>
          )}
        </ListaEditable>
      )

    case "flujo":
      return (
        <ListaEditable
          items={c.flujo}
          onChange={(v) => fijar("flujo", v)}
          crear={() => ({ id: nuevoId(), nombre: "", pasos: [] })}
          agregar="Agregar etapa"
          titulo={(e) => e.nombre || "Etapa"}
        >
          {(e, set) => (
            <>
              <Campo etiqueta="Etapa" placeholder="Inicio de turno" valor={e.nombre} onChange={(v) => set({ nombre: v })} />
              <ListaEditable
                items={e.pasos}
                onChange={(v) => set({ pasos: v })}
                crear={() => ({ id: nuevoId(), texto: "", detalle: "" })}
                agregar="Agregar paso"
                titulo={(p) => p.texto.slice(0, 60) || "Paso"}
              >
                {(p, setP) => (
                  <>
                    <Campo etiqueta="Paso" filas={2} valor={p.texto} onChange={(v) => setP({ texto: v })} />
                    <Campo etiqueta="Detalle o resultado" filas={2} valor={p.detalle} onChange={(v) => setP({ detalle: v })} />
                  </>
                )}
              </ListaEditable>
            </>
          )}
        </ListaEditable>
      )

    case "calendario": {
      const opcionesPago = c.inversion.pagos.map((p) => ({
        id: p.id,
        texto: [p.nombre || "Pago", p.montoCentavos != null ? formatearDinero(p.montoCentavos / 100, c.inversion.moneda) : ""]
          .filter(Boolean)
          .join(" · "),
      }))
      return (
        <ListaEditable
          items={c.calendario}
          onChange={(v) => fijar("calendario", v)}
          crear={() => ({ id: nuevoId(), semanas: "", entregable: "", pagoId: null })}
          agregar="Agregar hito"
          titulo={(h) => (h.semanas ? `Semanas ${h.semanas}` : "Hito")}
        >
          {(h, set) => (
            <>
              <div className={REJILLA}>
                <Campo etiqueta="Semanas" placeholder="1-2" valor={h.semanas} onChange={(v) => set({ semanas: v })} />
                <Selector
                  etiqueta="Pago ligado"
                  opciones={opcionesPago}
                  valor={h.pagoId}
                  onChange={(v) => set({ pagoId: v })}
                  vacio={opcionesPago.length ? "Sin pago" : "Primero captura los pagos"}
                />
              </div>
              <Campo etiqueta="Entregable" filas={2} valor={h.entregable} onChange={(v) => set({ entregable: v })} />
            </>
          )}
        </ListaEditable>
      )
    }

    case "inversion": {
      const inv = c.inversion
      const total = inv.pagos.reduce((s, p) => s + (p.montoCentavos ?? 0), 0)
      const mezclarMensualidad = (parcial: Partial<Contenido["inversion"]["mensualidad"]>) =>
        mezclar("inversion", { mensualidad: { ...inv.mensualidad, ...parcial } })
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-[6rem_1fr] items-end gap-3">
            <Campo etiqueta="Moneda" valor={inv.moneda} onChange={(v) => mezclar("inversion", { moneda: v.toUpperCase().slice(0, 3) })} />
            <p className="pb-3 text-sm text-text-secondary">
              Total del desarrollo:{" "}
              <span className="font-semibold tabular-nums text-text-primary">
                {formatearDinero(total / 100, inv.moneda || "MXN")}
              </span>
            </p>
          </div>
          <div>
            <p className={SUBTITULO}>Pagos</p>
            <ListaEditable
              items={inv.pagos}
              onChange={(v) => mezclar("inversion", { pagos: v })}
              crear={() => ({ id: nuevoId(), nombre: "", montoCentavos: null, cuando: "", contra: "" })}
              agregar="Agregar pago"
              titulo={(p) => p.nombre || "Pago"}
            >
              {(p, set) => (
                <>
                  <div className={REJILLA}>
                    <Campo etiqueta="Pago" placeholder="Anticipo" valor={p.nombre} onChange={(v) => set({ nombre: v })} />
                    <CampoDinero etiqueta="Monto" centavos={p.montoCentavos} onChange={(v) => set({ montoCentavos: v })} />
                  </div>
                  <Campo etiqueta="Cuándo" placeholder="Semana 0" valor={p.cuando} onChange={(v) => set({ cuando: v })} />
                  <Campo etiqueta="Contra qué entrega" filas={2} valor={p.contra} onChange={(v) => set({ contra: v })} />
                </>
              )}
            </ListaEditable>
          </div>
          <div>
            <p className={SUBTITULO}>Condiciones</p>
            <Renglones
              items={inv.condiciones}
              onChange={(v) => mezclar("inversion", { condiciones: v })}
              agregar="Agregar condición"
              etiqueta="Condición"
            />
          </div>
          <div className="space-y-4 rounded-xl border border-border p-4">
            <p className="text-sm font-semibold text-text-primary">Mensualidad</p>
            <CampoDinero
              etiqueta="Monto mensual"
              centavos={inv.mensualidad.montoCentavos}
              onChange={(v) => mezclarMensualidad({ montoCentavos: v })}
            />
            <Campo
              etiqueta="Desde cuándo y plazo"
              filas={2}
              valor={inv.mensualidad.descripcion}
              onChange={(v) => mezclarMensualidad({ descripcion: v })}
            />
            <div className={REJILLA}>
              <div>
                <p className={SUBTITULO}>Incluye</p>
                <Renglones items={inv.mensualidad.incluye} onChange={(v) => mezclarMensualidad({ incluye: v })} agregar="Agregar" etiqueta="Incluye" filas={1} />
              </div>
              <div>
                <p className={SUBTITULO}>No incluye</p>
                <Renglones items={inv.mensualidad.noIncluye} onChange={(v) => mezclarMensualidad({ noIncluye: v })} agregar="Agregar" etiqueta="No incluye" filas={1} />
              </div>
            </div>
          </div>
          <div>
            <p className={SUBTITULO}>Costos de terceros (a cargo del cliente)</p>
            <ListaEditable
              items={inv.terceros}
              onChange={(v) => mezclar("inversion", { terceros: v })}
              crear={() => ({ id: nuevoId(), concepto: "", costo: "", nota: "" })}
              agregar="Agregar costo"
              titulo={(x) => x.concepto || "Costo"}
            >
              {(x, set) => (
                <>
                  <div className={REJILLA}>
                    <Campo etiqueta="Concepto" valor={x.concepto} onChange={(v) => set({ concepto: v })} />
                    <Campo etiqueta="Costo" placeholder="~$300-500 MXN al año" valor={x.costo} onChange={(v) => set({ costo: v })} />
                  </div>
                  <Campo etiqueta="Nota" valor={x.nota} onChange={(v) => set({ nota: v })} />
                </>
              )}
            </ListaEditable>
          </div>
        </div>
      )
    }

    case "requisitos":
      return (
        <div className="space-y-5">
          <Campo
            etiqueta="Introducción"
            filas={3}
            valor={c.requisitos.intro}
            onChange={(v) => mezclar("requisitos", { intro: v })}
          />
          <ListaEditable
            items={c.requisitos.grupos}
            onChange={(v) => mezclar("requisitos", { grupos: v })}
            crear={() => ({ id: nuevoId(), nombre: "", cuando: "", nota: "", items: [] })}
            agregar="Agregar grupo"
            titulo={(g) => g.nombre || "Grupo"}
          >
            {(g, set) => (
              <>
                <div className={REJILLA}>
                  <Campo etiqueta="Grupo" placeholder="Cuentas y accesos" valor={g.nombre} onChange={(v) => set({ nombre: v })} />
                  <Campo etiqueta="Para cuándo" placeholder="Semana 0" valor={g.cuando} onChange={(v) => set({ cuando: v })} />
                </div>
                <Campo etiqueta="Nota" filas={2} valor={g.nota} onChange={(v) => set({ nota: v })} />
                <ListaEditable
                  items={g.items}
                  onChange={(v) => set({ items: v })}
                  crear={() => ({
                    id: nuevoId(),
                    clave: "",
                    que: "",
                    paraQue: "",
                    formato: "",
                    bloquea: "",
                  })}
                  agregar="Agregar requisito"
                  titulo={(r) => [r.clave, r.que.slice(0, 50)].filter(Boolean).join(" · ") || "Requisito"}
                >
                  {(r, setR) => (
                    <>
                      <div className="grid grid-cols-[6rem_1fr] gap-3">
                        <Campo etiqueta="Clave" placeholder="R-01" valor={r.clave} onChange={(v) => setR({ clave: v })} />
                        <Campo etiqueta="Qué se necesita" valor={r.que} onChange={(v) => setR({ que: v })} />
                      </div>
                      <Campo etiqueta="Para qué" filas={2} valor={r.paraQue} onChange={(v) => setR({ paraQue: v })} />
                      <div className={REJILLA}>
                        <Campo etiqueta="Formato" valor={r.formato} onChange={(v) => setR({ formato: v })} />
                        <Campo etiqueta="Bloquea" valor={r.bloquea} onChange={(v) => setR({ bloquea: v })} />
                      </div>
                    </>
                  )}
                </ListaEditable>
              </>
            )}
          </ListaEditable>
          <div>
            <p className={SUBTITULO}>Lo que hacemos nosotros en paralelo</p>
            <Renglones
              items={c.requisitos.nuestroLado}
              onChange={(v) => mezclar("requisitos", { nuestroLado: v })}
              agregar="Agregar"
              etiqueta="Actividad"
            />
          </div>
        </div>
      )

    case "arquitectura":
      return (
        <div className="space-y-5">
          <Campo
            etiqueta="Visión general"
            filas={3}
            valor={c.arquitectura.resumen}
            onChange={(v) => mezclar("arquitectura", { resumen: v })}
          />
          <label className="block">
            <span className="block text-sm font-medium text-text-secondary">Diagrama (texto)</span>
            <textarea
              className="mt-1.5 w-full resize-y rounded-lg border border-border bg-surface px-3 py-2.5 font-mono text-xs leading-snug text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
              rows={8}
              value={c.arquitectura.diagrama}
              onChange={(e) => mezclar("arquitectura", { diagrama: e.target.value })}
            />
          </label>
          <div>
            <p className={SUBTITULO}>Stack</p>
            <ListaEditable
              items={c.arquitectura.stack}
              onChange={(v) => mezclar("arquitectura", { stack: v })}
              crear={() => ({ id: nuevoId(), capa: "", tecnologia: "" })}
              agregar="Agregar capa"
              titulo={(x) => x.capa || "Capa"}
            >
              {(x, set) => (
                <div className={REJILLA}>
                  <Campo etiqueta="Capa" valor={x.capa} onChange={(v) => set({ capa: v })} />
                  <Campo etiqueta="Tecnología" valor={x.tecnologia} onChange={(v) => set({ tecnologia: v })} />
                </div>
              )}
            </ListaEditable>
          </div>
          <div>
            <p className={SUBTITULO}>Notas técnicas</p>
            <ListaEditable
              items={c.arquitectura.notas}
              onChange={(v) => mezclar("arquitectura", { notas: v })}
              crear={() => ({ id: nuevoId(), titulo: "", texto: "" })}
              agregar="Agregar nota"
              titulo={(x) => x.titulo || "Nota"}
            >
              {(x, set) => (
                <>
                  <Campo etiqueta="Título" valor={x.titulo} onChange={(v) => set({ titulo: v })} />
                  <Campo etiqueta="Texto" filas={4} valor={x.texto} onChange={(v) => set({ texto: v })} />
                </>
              )}
            </ListaEditable>
          </div>
        </div>
      )

    case "decisiones":
      return (
        <ListaEditable
          items={c.decisiones}
          onChange={(v) => fijar("decisiones", v)}
          crear={() => ({
            id: nuevoId(),
            clave: `D-${String(c.decisiones.length + 1).padStart(2, "0")}`,
            decision: "",
            motivo: "",
            descartadas: "",
          })}
          agregar="Agregar decisión"
          titulo={(d) => [d.clave, d.decision.slice(0, 50)].filter(Boolean).join(" · ") || "Decisión"}
        >
          {(d, set) => (
            <>
              <div className="grid grid-cols-[6rem_1fr] gap-3">
                <Campo etiqueta="Clave" valor={d.clave} onChange={(v) => set({ clave: v })} />
                <Campo etiqueta="Decisión" valor={d.decision} onChange={(v) => set({ decision: v })} />
              </div>
              <Campo etiqueta="Motivo" filas={2} valor={d.motivo} onChange={(v) => set({ motivo: v })} />
              <Campo etiqueta="Alternativas descartadas" filas={2} valor={d.descartadas} onChange={(v) => set({ descartadas: v })} />
            </>
          )}
        </ListaEditable>
      )

    case "riesgos":
      return (
        <ListaEditable
          items={c.riesgos}
          onChange={(v) => fijar("riesgos", v)}
          crear={() => ({ id: nuevoId(), riesgo: "", impacto: null, mitigacion: "" })}
          agregar="Agregar riesgo"
          titulo={(r) => r.riesgo.slice(0, 60) || "Riesgo"}
        >
          {(r, set) => (
            <>
              <Campo etiqueta="Riesgo" filas={2} valor={r.riesgo} onChange={(v) => set({ riesgo: v })} />
              <ChipUnico
                etiqueta="Impacto"
                opciones={ETIQUETAS_IMPACTO}
                valor={r.impacto}
                onChange={(v) => set({ impacto: v })}
              />
              <Campo etiqueta="Mitigación" filas={2} valor={r.mitigacion} onChange={(v) => set({ mitigacion: v })} />
            </>
          )}
        </ListaEditable>
      )

    case "validacion":
      return (
        <div className="space-y-5">
          <Campo
            etiqueta="Objetivo"
            filas={2}
            valor={c.validacion.objetivo}
            onChange={(v) => mezclar("validacion", { objetivo: v })}
          />
          <div>
            <p className={SUBTITULO}>Qué se prueba</p>
            <Renglones
              items={c.validacion.alcance}
              onChange={(v) => mezclar("validacion", { alcance: v })}
              agregar="Agregar prueba"
              etiqueta="Prueba"
            />
          </div>
          <div>
            <p className={SUBTITULO}>Criterios de aceptación</p>
            <Renglones
              items={c.validacion.criterios}
              onChange={(v) => mezclar("validacion", { criterios: v })}
              agregar="Agregar criterio"
              etiqueta="Criterio"
            />
          </div>
          <Campo
            etiqueta="Qué se necesita del cliente"
            filas={2}
            valor={c.validacion.necesita}
            onChange={(v) => mezclar("validacion", { necesita: v })}
          />
        </div>
      )

    case "glosario":
      return (
        <ListaEditable
          items={c.glosario}
          onChange={(v) => fijar("glosario", v)}
          crear={() => ({ id: nuevoId(), termino: "", definicion: "" })}
          agregar="Agregar término"
          titulo={(t) => t.termino || "Término"}
        >
          {(t, set) => (
            <>
              <Campo etiqueta="Término" valor={t.termino} onChange={(v) => set({ termino: v })} />
              <Campo etiqueta="Definición" filas={2} valor={t.definicion} onChange={(v) => set({ definicion: v })} />
            </>
          )}
        </ListaEditable>
      )

    case "anexos":
      return (
        <ListaEditable
          items={c.anexos}
          onChange={(v) => fijar("anexos", v)}
          crear={() => ({ id: nuevoId(), titulo: "", texto: "", tabla: null })}
          agregar="Agregar anexo"
          titulo={(a) => a.titulo || "Anexo"}
        >
          {(a, set) => (
            <>
              <Campo etiqueta="Título" valor={a.titulo} onChange={(v) => set({ titulo: v })} />
              <Campo etiqueta="Texto" filas={6} valor={a.texto} onChange={(v) => set({ texto: v })} />
              <CampoTabla tabla={a.tabla} onChange={(t) => set({ tabla: t })} />
            </>
          )}
        </ListaEditable>
      )

    case "fuentes":
      return (
        <ListaEditable
          items={c.fuentes}
          onChange={(v) => fijar("fuentes", v)}
          crear={() => ({ id: nuevoId(), titulo: "", url: "" })}
          agregar="Agregar fuente"
          titulo={(f) => f.titulo || "Fuente"}
        >
          {(f, set) => (
            <>
              <Campo etiqueta="Título" valor={f.titulo} onChange={(v) => set({ titulo: v })} />
              <Campo etiqueta="URL" valor={f.url} onChange={(v) => set({ url: v })} />
            </>
          )}
        </ListaEditable>
      )

    case "notasInternas":
      return (
        <Campo
          etiqueta="Notas internas"
          filas={8}
          valor={c.notasInternas}
          onChange={(v) => fijar("notasInternas", v)}
        />
      )
  }
}
