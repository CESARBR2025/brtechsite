"use client"

import type {
  ClaveSeccion,
  Contenido,
} from "@/src/modules/levantamientos/domain/contenido"
import {
  Campo,
  CampoUbicacion,
  ChipUnico,
  Chips,
  ListaEditable,
  nuevoId,
  SelectorActor,
} from "./campos"
import { formatearFechaHora } from "./fechas"
import {
  ETIQUETA_DISPOSITIVO,
  ETIQUETA_FORMATO,
  ETIQUETA_MANEJO_DIGITAL,
  ETIQUETA_PRIORIDAD,
  ETIQUETA_RANGO_EDAD,
  ETIQUETA_TIPO_RESULTADO,
} from "./etiquetas"

export interface Generales {
  clienteNombre: string
  clienteContacto: string
  proyectoNombre: string
  fechaReunion: string
}

type Cambiar = (fn: (c: Contenido) => Contenido) => void

const REJILLA = "grid gap-4 sm:grid-cols-2"

/** Cuerpo de captura de una sección del levantamiento. */
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
  // Mezcla campos dentro de un bloque (contexto, problema, …)
  const mezclar = <K extends "contexto" | "problema" | "recursos" | "volumen" | "restricciones">(
    k: K,
    parcial: Partial<Contenido[K]>,
  ) => cambiar((prev) => ({ ...prev, [k]: { ...prev[k], ...parcial } }))

  switch (clave) {
    case "contexto":
      return (
        <div className="space-y-4">
          <div className={REJILLA}>
            <Campo
              etiqueta="Negocio o empresa"
              requerido
              valor={generales.clienteNombre}
              onChange={(v) => cambiarGenerales({ clienteNombre: v })}
            />
            <Campo
              etiqueta="Nombre del contacto"
              placeholder="Con quién es la reunión"
              valor={c.contexto.contactoNombre}
              onChange={(v) => mezclar("contexto", { contactoNombre: v })}
            />
            <Campo
              etiqueta="WhatsApp o correo"
              tipo="tel"
              valor={generales.clienteContacto}
              onChange={(v) => cambiarGenerales({ clienteContacto: v })}
            />
            <Campo
              etiqueta="Nombre de trabajo del proyecto"
              placeholder="Control de inventario, agenda de citas…"
              valor={generales.proyectoNombre}
              onChange={(v) => cambiarGenerales({ proyectoNombre: v })}
            />
            <Campo
              etiqueta="Fecha de la reunión"
              tipo="date"
              requerido
              valor={generales.fechaReunion}
              onChange={(v) => cambiarGenerales({ fechaReunion: v })}
            />
            <Campo
              etiqueta="Giro del negocio"
              placeholder="Refaccionaria, clínica dental, restaurante…"
              valor={c.contexto.giro}
              onChange={(v) => mezclar("contexto", { giro: v })}
            />
            <Campo
              etiqueta="Tamaño"
              placeholder="12 empleados, 2 sucursales"
              valor={c.contexto.tamano}
              onChange={(v) => mezclar("contexto", { tamano: v })}
            />
            <CampoUbicacion
              valor={c.contexto.ubicacion}
              onChange={(v) => mezclar("contexto", { ubicacion: v })}
              coordenadas={c.contexto.coordenadas}
              onCoordenadas={(v) => mezclar("contexto", { coordenadas: v })}
            />
          </div>
          <Campo
            etiqueta="Participantes de la reunión"
            filas={2}
            placeholder="Nombre y rol de quienes estuvieron"
            valor={c.contexto.participantes}
            onChange={(v) => mezclar("contexto", { participantes: v })}
          />
        </div>
      )

    case "problema":
      return (
        <div className="space-y-4">
          <Campo
            etiqueta="Situación actual"
            requerido
            filas={4}
            placeholder="Lo que hoy no funciona, en palabras del cliente"
            valor={c.problema.situacionActual}
            onChange={(v) => mezclar("problema", { situacionActual: v })}
          />
          <Campo
            etiqueta="Cómo lo resuelven hoy"
            filas={3}
            placeholder="Libreta, Excel, grupos de WhatsApp, memoria…"
            valor={c.problema.solucionActual}
            onChange={(v) => mezclar("problema", { solucionActual: v })}
          />
          <Campo
            etiqueta="Qué les cuesta"
            filas={3}
            placeholder="Horas a la semana, errores, dinero perdido, clientes molestos"
            valor={c.problema.impacto}
            onChange={(v) => mezclar("problema", { impacto: v })}
          />
        </div>
      )

    case "objetivos":
      return (
        <ListaEditable
          items={c.objetivos}
          onChange={(v) => fijar("objetivos", v)}
          crear={() => ({ id: nuevoId(), descripcion: "", metrica: "" })}
          agregar="Agregar objetivo"
          titulo={(o) => o.descripcion || "Objetivo"}
        >
          {(o, set) => (
            <>
              <Campo
                etiqueta="Objetivo"
                filas={2}
                valor={o.descripcion}
                onChange={(v) => set({ descripcion: v })}
              />
              <Campo
                etiqueta="Cómo sabremos que se logró"
                placeholder="Cerrar caja en 5 minutos"
                valor={o.metrica}
                onChange={(v) => set({ metrica: v })}
              />
            </>
          )}
        </ListaEditable>
      )

    case "actores":
      return (
        <ListaEditable
          items={c.actores}
          onChange={(v) => fijar("actores", v)}
          crear={() => ({
            id: nuevoId(),
            nombre: "",
            descripcion: "",
            cantidad: "",
            rangosEdad: [],
            manejoDigital: null,
            dispositivos: [],
          })}
          agregar="Agregar actor"
          titulo={(a) => a.nombre || "Actor"}
        >
          {(a, set) => (
            <>
              <div className={REJILLA}>
                <Campo
                  etiqueta="Rol"
                  placeholder="Cajero, gerente, cliente final…"
                  valor={a.nombre}
                  onChange={(v) => set({ nombre: v })}
                />
                <Campo
                  etiqueta="Cuántos son"
                  valor={a.cantidad}
                  onChange={(v) => set({ cantidad: v })}
                />
              </div>
              <Campo
                etiqueta="Qué hace"
                filas={2}
                valor={a.descripcion}
                onChange={(v) => set({ descripcion: v })}
              />
              <Chips
                etiqueta="Rango de edad"
                opciones={ETIQUETA_RANGO_EDAD}
                seleccion={a.rangosEdad}
                onChange={(v) => set({ rangosEdad: v })}
              />
              <ChipUnico
                etiqueta="Manejo digital"
                opciones={ETIQUETA_MANEJO_DIGITAL}
                valor={a.manejoDigital}
                onChange={(v) => set({ manejoDigital: v })}
              />
              <Chips
                etiqueta="Dispositivo que usaría"
                opciones={ETIQUETA_DISPOSITIVO}
                seleccion={a.dispositivos}
                onChange={(v) => set({ dispositivos: v })}
              />
            </>
          )}
        </ListaEditable>
      )

    case "flujos":
      return (
        <ListaEditable
          items={c.flujos}
          onChange={(v) => fijar("flujos", v)}
          crear={() => ({
            id: nuevoId(),
            nombre: "",
            disparador: "",
            resultado: "",
            pasos: [],
          })}
          agregar="Agregar flujo"
          titulo={(f) => f.nombre || "Flujo"}
        >
          {(f, set) => (
            <>
              <Campo
                etiqueta="Nombre del flujo"
                placeholder="Venta en mostrador, alta de paciente…"
                valor={f.nombre}
                onChange={(v) => set({ nombre: v })}
              />
              <div className={REJILLA}>
                <Campo
                  etiqueta="Qué lo inicia"
                  filas={2}
                  valor={f.disparador}
                  onChange={(v) => set({ disparador: v })}
                />
                <Campo
                  etiqueta="Con qué termina"
                  filas={2}
                  valor={f.resultado}
                  onChange={(v) => set({ resultado: v })}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-text-secondary">Pasos</p>
                <ListaEditable
                  items={f.pasos}
                  onChange={(v) => set({ pasos: v })}
                  crear={() => ({ id: nuevoId(), descripcion: "", actorId: null, dolor: "" })}
                  agregar="Agregar paso"
                  titulo={(p) => p.descripcion || "Paso"}
                >
                  {(p, setPaso) => (
                    <>
                      <Campo
                        etiqueta="Qué pasa"
                        filas={2}
                        valor={p.descripcion}
                        onChange={(v) => setPaso({ descripcion: v })}
                      />
                      <SelectorActor
                        etiqueta="Quién lo hace"
                        actores={c.actores}
                        valor={p.actorId}
                        onChange={(v) => setPaso({ actorId: v })}
                      />
                      <Campo
                        etiqueta="Punto de dolor (opcional)"
                        filas={2}
                        placeholder="Qué sale mal o tarda en este paso"
                        valor={p.dolor}
                        onChange={(v) => setPaso({ dolor: v })}
                      />
                    </>
                  )}
                </ListaEditable>
              </div>
            </>
          )}
        </ListaEditable>
      )

    case "documentos":
      return (
        <ListaEditable
          items={c.documentos}
          onChange={(v) => fijar("documentos", v)}
          crear={() => ({
            id: nuevoId(),
            nombre: "",
            formato: null,
            responsableId: null,
            frecuencia: "",
            descripcion: "",
          })}
          agregar="Agregar documento"
          titulo={(d) => d.nombre || "Documento"}
        >
          {(d, set) => (
            <>
              <Campo
                etiqueta="Nombre"
                placeholder="Nota de venta, bitácora, orden de trabajo…"
                valor={d.nombre}
                onChange={(v) => set({ nombre: v })}
              />
              <ChipUnico
                etiqueta="Formato"
                opciones={ETIQUETA_FORMATO}
                valor={d.formato}
                onChange={(v) => set({ formato: v })}
              />
              <div className={REJILLA}>
                <SelectorActor
                  etiqueta="Quién lo genera"
                  actores={c.actores}
                  valor={d.responsableId}
                  onChange={(v) => set({ responsableId: v })}
                />
                <Campo
                  etiqueta="Frecuencia"
                  placeholder="Diario, por venta, mensual…"
                  valor={d.frecuencia}
                  onChange={(v) => set({ frecuencia: v })}
                />
              </div>
              <Campo
                etiqueta="Para qué sirve"
                filas={2}
                valor={d.descripcion}
                onChange={(v) => set({ descripcion: v })}
              />
            </>
          )}
        </ListaEditable>
      )

    case "resultados":
      return (
        <ListaEditable
          items={c.resultados}
          onChange={(v) => fijar("resultados", v)}
          crear={() => ({
            id: nuevoId(),
            tipo: null,
            nombre: "",
            descripcion: "",
            destinatarioId: null,
          })}
          agregar="Agregar resultado"
          titulo={(r) => r.nombre || "Resultado"}
        >
          {(r, set) => (
            <>
              <ChipUnico
                etiqueta="Tipo"
                opciones={ETIQUETA_TIPO_RESULTADO}
                valor={r.tipo}
                onChange={(v) => set({ tipo: v })}
              />
              <Campo
                etiqueta="Nombre"
                placeholder="Ticket de venta, reporte semanal, solicitud de compra…"
                valor={r.nombre}
                onChange={(v) => set({ nombre: v })}
              />
              <SelectorActor
                etiqueta="Para quién"
                actores={c.actores}
                valor={r.destinatarioId}
                onChange={(v) => set({ destinatarioId: v })}
              />
              <Campo
                etiqueta="Qué debe contener"
                filas={2}
                valor={r.descripcion}
                onChange={(v) => set({ descripcion: v })}
              />
            </>
          )}
        </ListaEditable>
      )

    case "recursos":
      return (
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-text-secondary">Equipos</p>
            <ListaEditable
              items={c.recursos.hardware}
              onChange={(v) => mezclar("recursos", { hardware: v })}
              crear={() => ({ id: nuevoId(), nombre: "", cantidad: "", detalle: "" })}
              agregar="Agregar equipo"
              titulo={(h) => h.nombre || "Equipo"}
            >
              {(h, set) => (
                <div className={REJILLA}>
                  <Campo
                    etiqueta="Equipo"
                    placeholder="PC, impresora de tickets, lector…"
                    valor={h.nombre}
                    onChange={(v) => set({ nombre: v })}
                  />
                  <Campo
                    etiqueta="Cantidad"
                    valor={h.cantidad}
                    onChange={(v) => set({ cantidad: v })}
                  />
                  <div className="sm:col-span-2">
                    <Campo
                      etiqueta="Detalle"
                      placeholder="Marca, modelo, estado"
                      valor={h.detalle}
                      onChange={(v) => set({ detalle: v })}
                    />
                  </div>
                </div>
              )}
            </ListaEditable>
          </div>
          <Campo
            etiqueta="Programas que usan hoy"
            filas={2}
            valor={c.recursos.softwareActual}
            onChange={(v) => mezclar("recursos", { softwareActual: v })}
          />
          <Campo
            etiqueta="Conectividad"
            filas={2}
            placeholder="Internet estable, se cae seguido, sin internet en bodega…"
            valor={c.recursos.conectividad}
            onChange={(v) => mezclar("recursos", { conectividad: v })}
          />
        </div>
      )

    case "integraciones":
      return (
        <ListaEditable
          items={c.integraciones}
          onChange={(v) => fijar("integraciones", v)}
          crear={() => ({ id: nuevoId(), nombre: "", proposito: "" })}
          agregar="Agregar integración"
          titulo={(i) => i.nombre || "Integración"}
        >
          {(i, set) => (
            <>
              <Campo
                etiqueta="Con qué"
                placeholder="Facturación CFDI, terminal de pagos, WhatsApp…"
                valor={i.nombre}
                onChange={(v) => set({ nombre: v })}
              />
              <Campo
                etiqueta="Para qué"
                filas={2}
                valor={i.proposito}
                onChange={(v) => set({ proposito: v })}
              />
            </>
          )}
        </ListaEditable>
      )

    case "volumen":
      return (
        <div className="space-y-4">
          <Campo
            etiqueta="Operaciones"
            filas={2}
            placeholder="80 ventas al día, 300 citas al mes…"
            valor={c.volumen.operaciones}
            onChange={(v) => mezclar("volumen", { operaciones: v })}
          />
          <Campo
            etiqueta="Personas usándolo a la vez"
            valor={c.volumen.usuariosSimultaneos}
            onChange={(v) => mezclar("volumen", { usuariosSimultaneos: v })}
          />
          <Campo
            etiqueta="Historial que migrar"
            filas={2}
            placeholder="3 años de ventas en Excel, catálogo de 2,000 productos…"
            valor={c.volumen.datosHistoricos}
            onChange={(v) => mezclar("volumen", { datosHistoricos: v })}
          />
        </div>
      )

    case "restricciones":
      return (
        <div className="space-y-4">
          <Campo
            etiqueta="Plazo"
            filas={2}
            valor={c.restricciones.plazo}
            onChange={(v) => mezclar("restricciones", { plazo: v })}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-text-secondary">Fechas críticas</p>
            <ListaEditable
              items={c.restricciones.fechasCriticas}
              onChange={(v) => mezclar("restricciones", { fechasCriticas: v })}
              crear={() => ({ id: nuevoId(), fecha: "", motivo: "" })}
              agregar="Agregar fecha crítica"
              titulo={(f) => (f.fecha ? formatearFechaHora(f.fecha) : "Fecha crítica")}
            >
              {(f, set) => (
                <>
                  <Campo
                    etiqueta="Fecha y hora"
                    tipo="datetime-local"
                    valor={f.fecha}
                    onChange={(v) => set({ fecha: v })}
                  />
                  <Campo
                    etiqueta="Por qué es crítica"
                    filas={2}
                    placeholder="Arranca la temporada alta, auditoría, inicio de ciclo escolar…"
                    valor={f.motivo}
                    onChange={(v) => set({ motivo: v })}
                  />
                </>
              )}
            </ListaEditable>
          </div>
          <Campo
            etiqueta="Normas o reglas"
            filas={2}
            placeholder="Facturación, datos personales, expedientes clínicos…"
            valor={c.restricciones.normativa}
            onChange={(v) => mezclar("restricciones", { normativa: v })}
          />
          <Campo
            etiqueta="Otras"
            filas={2}
            valor={c.restricciones.otras}
            onChange={(v) => mezclar("restricciones", { otras: v })}
          />
        </div>
      )

    case "prioridades":
      return (
        <ListaEditable
          items={c.prioridades}
          onChange={(v) => fijar("prioridades", v)}
          crear={() => ({ id: nuevoId(), descripcion: "", nivel: "imprescindible" as const })}
          agregar="Agregar prioridad"
          titulo={(p) => p.descripcion || "Prioridad"}
        >
          {(p, set) => (
            <>
              <Campo
                etiqueta="Qué"
                filas={2}
                valor={p.descripcion}
                onChange={(v) => set({ descripcion: v })}
              />
              <ChipUnico
                etiqueta="Nivel"
                opciones={ETIQUETA_PRIORIDAD}
                valor={p.nivel}
                onChange={(v) => set({ nivel: v ?? p.nivel })}
              />
            </>
          )}
        </ListaEditable>
      )

    case "pendientes":
      return (
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-text-secondary">Preguntas al cliente</p>
            <ListaEditable
              items={c.preguntasAbiertas}
              onChange={(v) => fijar("preguntasAbiertas", v)}
              crear={() => ({ id: nuevoId(), grupo: "", texto: "", respuesta: "", respondidaEn: null })}
              agregar="Agregar pregunta"
              titulo={(x) => (x.respuesta ? "✓ " : "") + (x.texto || "Pregunta")}
            >
              {(x, set) => (
                <>
                  <Campo
                    etiqueta="Grupo"
                    placeholder="Críticas, Importantes…"
                    valor={x.grupo}
                    onChange={(v) => set({ grupo: v })}
                  />
                  <Campo
                    etiqueta="Pregunta"
                    filas={2}
                    valor={x.texto}
                    onChange={(v) => set({ texto: v })}
                  />
                  <div className="rounded-xl border border-border bg-bg-section px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      Respuesta del cliente
                      {x.respondidaEn &&
                        ` · ${new Date(x.respondidaEn).toLocaleString("es-MX", {
                          timeZone: "America/Mexico_City",
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}`}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm text-text-primary">
                      {x.respuesta || "Sin responder. La captura el cliente desde su diagnóstico."}
                    </p>
                  </div>
                </>
              )}
            </ListaEditable>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-text-secondary">Próximos pasos</p>
            <ListaEditable
              items={c.proximosPasos}
              onChange={(v) => fijar("proximosPasos", v)}
              crear={() => ({ id: nuevoId(), texto: "" })}
              agregar="Agregar paso"
              titulo={(x) => x.texto || "Paso"}
            >
              {(x, set) => (
                <Campo
                  etiqueta="Paso"
                  filas={2}
                  valor={x.texto}
                  onChange={(v) => set({ texto: v })}
                />
              )}
            </ListaEditable>
          </div>
        </div>
      )

    case "adjuntos":
      return (
        <ListaEditable
          items={c.adjuntos}
          onChange={(v) => fijar("adjuntos", v)}
          crear={() => ({ id: nuevoId(), nombre: "", descripcion: "" })}
          agregar="Agregar archivo"
          titulo={(a) => a.nombre || "Archivo"}
        >
          {(a, set) => (
            <>
              <Campo
                etiqueta="Nombre del archivo"
                placeholder="formato-inventario.xlsx, foto de la nota…"
                valor={a.nombre}
                onChange={(v) => set({ nombre: v })}
              />
              <Campo
                etiqueta="De qué trata"
                filas={2}
                valor={a.descripcion}
                onChange={(v) => set({ descripcion: v })}
              />
            </>
          )}
        </ListaEditable>
      )

    case "notasInternas":
      return (
        <Campo
          etiqueta="Notas"
          filas={6}
          valor={c.notasInternas}
          onChange={(v) => fijar("notasInternas", v)}
        />
      )
  }
}
