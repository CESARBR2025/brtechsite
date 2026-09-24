import { describe, expect, it } from "vitest"
import {
  DatosInvalidos,
  OperacionNoPermitida,
} from "@/src/modules/shared/domain/errors"
import { RelojFijo } from "@/src/testing/dobles"
import { completitud, normalizarContenido } from "./contenido"
import { Levantamiento } from "./levantamiento"
import { SlugLevantamiento } from "./slug-levantamiento"

const reloj = new RelojFijo(new Date("2026-09-24T10:00:00.000Z"))

function nuevo(): Levantamiento {
  return Levantamiento.crear(
    {
      clienteNombre: "  Refaccionaria El Águila ",
      proyectoNombre: "Control de inventario",
      fechaReunion: new Date("2026-09-24T00:00:00.000Z"),
    },
    {
      id: "lv-1",
      folio: "BRD-000001",
      slug: SlugLevantamiento.desde("abcdefgh1234"),
      reloj,
    },
  )
}

describe("normalizarContenido", () => {
  it("un contenido vacío produce todas las secciones con valores por defecto", () => {
    const c = normalizarContenido({})
    expect(c.problema.situacionActual).toBe("")
    expect(c.actores).toEqual([])
    expect(c.recursos.hardware).toEqual([])
    expect(Object.values(completitud(c)).some(Boolean)).toBe(false)
  })

  it("recorta textos y descarta filas vacías (captura a medias)", () => {
    const c = normalizarContenido({
      actores: [
        { id: "a1", nombre: "  Cajero  " },
        { id: "a2", nombre: "   " },
      ],
      prioridades: [
        { id: "p1", descripcion: "", nivel: "deseable" },
        { id: "p2", descripcion: "Corte de caja", nivel: "imprescindible" },
      ],
      flujos: [{ id: "f1", nombre: "", pasos: [{ id: "s1", descripcion: "" }] }],
    })
    expect(c.actores).toHaveLength(1)
    expect(c.actores[0].nombre).toBe("Cajero")
    expect(c.prioridades.map((p) => p.id)).toEqual(["p2"])
    expect(c.flujos).toHaveLength(0)
  })

  it("suelta referencias a actores que ya no existen", () => {
    const c = normalizarContenido({
      actores: [{ id: "a1", nombre: "Almacenista" }],
      flujos: [
        {
          id: "f1",
          nombre: "Recepción de mercancía",
          pasos: [
            { id: "s1", descripcion: "Cuenta piezas", actorId: "a1" },
            { id: "s2", descripcion: "Firma la remisión", actorId: "borrado" },
          ],
        },
      ],
      documentos: [{ id: "d1", nombre: "Remisión", responsableId: "borrado" }],
    })
    expect(c.flujos[0].pasos.map((p) => p.actorId)).toEqual(["a1", null])
    expect(c.documentos[0].responsableId).toBeNull()
  })

  it("ordena rangos de edad y dispositivos, y rechaza valores fuera del catálogo", () => {
    const c = normalizarContenido({
      actores: [
        {
          id: "a1",
          nombre: "Mesero",
          rangosEdad: ["36-50", "18-25"],
          dispositivos: ["laptop", "celular"],
        },
      ],
    })
    expect(c.actores[0].rangosEdad).toEqual(["18-25", "36-50"])
    expect(c.actores[0].dispositivos).toEqual(["celular", "laptop"])
    expect(() =>
      normalizarContenido({ actores: [{ id: "a1", dispositivos: ["reloj"] }] }),
    ).toThrow(DatosInvalidos)
    expect(() =>
      normalizarContenido({ actores: [{ id: "a1", rangosEdad: ["99"] }] }),
    ).toThrow(DatosInvalidos)
  })

  it("valida las coordenadas y cuentan como información del contexto", () => {
    const c = normalizarContenido({
      contexto: { coordenadas: { lat: 20.3887, lng: -99.9962, precision: 12 } },
    })
    expect(c.contexto.coordenadas).toEqual({ lat: 20.3887, lng: -99.9962, precision: 12 })
    expect(completitud(c).contexto).toBe(true)
    expect(normalizarContenido({}).contexto.coordenadas).toBeNull()
    expect(() =>
      normalizarContenido({ contexto: { coordenadas: { lat: 120, lng: 0 } } }),
    ).toThrow(DatosInvalidos)
  })

  it("fechas críticas: fecha y hora + motivo; el texto previo se conserva", () => {
    const c = normalizarContenido({
      restricciones: {
        fechasCriticas: [
          { id: "f1", fecha: "2026-12-12T09:00", motivo: "Arranca temporada alta" },
          { id: "f2", fecha: "", motivo: "" },
        ],
      },
    })
    expect(c.restricciones.fechasCriticas).toEqual([
      { id: "f1", fecha: "2026-12-12T09:00", motivo: "Arranca temporada alta" },
    ])
    expect(
      normalizarContenido({ restricciones: { fechasCriticas: "Diciembre" } })
        .restricciones.fechasCriticas,
    ).toEqual([{ id: "previa", fecha: "", motivo: "Diciembre" }])
    expect(() =>
      normalizarContenido({
        restricciones: { fechasCriticas: [{ id: "f1", fecha: "12/12/2026" }] },
      }),
    ).toThrow(DatosInvalidos)
  })

  it("completitud marca solo las secciones con información", () => {
    const c = normalizarContenido({
      problema: { situacionActual: "Inventario en libreta" },
      preguntasAbiertas: [{ id: "q1", texto: "¿Cuántas sucursales?" }],
    })
    const k = completitud(c)
    expect(k.problema).toBe(true)
    expect(k.pendientes).toBe(true)
    expect(k.actores).toBe(false)
    expect(k.notasInternas).toBe(false)
  })
})

describe("Levantamiento", () => {
  it("nace en borrador con el cliente recortado y contenido vacío", () => {
    const l = nuevo()
    expect(l.estado).toBe("borrador")
    expect(l.cliente.nombre).toBe("Refaccionaria El Águila")
    expect(l.contenido.actores).toEqual([])
  })

  it("exige el nombre del cliente", () => {
    expect(() =>
      Levantamiento.crear(
        { clienteNombre: " ", fechaReunion: new Date() },
        {
          id: "x",
          folio: "BRD-000002",
          slug: SlugLevantamiento.desde("abcdefgh9999"),
          reloj,
        },
      ),
    ).toThrow(DatosInvalidos)
  })

  it("no se publica sin describir el problema", () => {
    const l = nuevo()
    expect(() => l.publicar(reloj)).toThrow(OperacionNoPermitida)
    l.reemplazarContenido(
      { problema: { situacionActual: "Todo se controla en Excel" } },
      reloj,
    )
    l.publicar(reloj)
    expect(l.esPublico).toBe(true)
    expect(l.publicadoEn).toEqual(reloj.ahora())
  })

  it("archivado: deja de ser público y ya no se edita", () => {
    const l = nuevo()
    l.reemplazarContenido({ problema: { situacionActual: "x" } }, reloj)
    l.publicar(reloj)
    l.archivar(reloj)
    expect(l.esPublico).toBe(false)
    expect(() => l.reemplazarContenido({}, reloj)).toThrow(OperacionNoPermitida)
    expect(() => l.publicar(reloj)).toThrow(OperacionNoPermitida)
  })

  it("confirmar y desconfirmar fija o limpia la fecha", () => {
    const l = nuevo()
    l.marcarConfirmado(true, reloj)
    expect(l.confirmadoEn).toEqual(reloj.ahora())
    l.marcarConfirmado(false, reloj)
    expect(l.confirmadoEn).toBeNull()
  })
})
