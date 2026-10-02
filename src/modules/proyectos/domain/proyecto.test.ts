import { describe, expect, it } from "vitest"
import {
  DatosInvalidos,
  OperacionNoPermitida,
} from "@/src/modules/shared/domain/errors"
import { RelojFijo } from "@/src/testing/dobles"
import {
  normalizarContenido,
  requerimientosContratados,
  totalConBonificacion,
  totalInversion,
} from "./contenido"
import { Proyecto } from "./proyecto"
import { SlugProyecto } from "./slug-proyecto"

const reloj = new RelojFijo(new Date("2026-09-25T12:00:00.000Z"))

function nuevo(contenido?: unknown) {
  return Proyecto.crear(
    { clienteNombre: "Tostadas Tio Beto", fechaPropuesta: new Date("2026-09-25"), contenido },
    { id: "p1", folio: "BRP-000001", slug: SlugProyecto.desde("proptest0001"), reloj },
  )
}

/** Aceptación con el correo que siempre se pide al firmar. */
const con = (firmas: { nombre: string; trazo: string }[]) => ({ firmas, correo: "cesar@tiobeto.mx" })

const publicable = {
  fases: [{ id: "mvp", clave: "MVP", nombre: "Operación base", contratada: true }],
  inversion: { pagos: [{ id: "a", nombre: "Anticipo", montoCentavos: 1_050_000 }] },
}

describe("Contenido del proyecto", () => {
  it("descarta filas vacías y suelta referencias a fases, roles y pagos que ya no existen", () => {
    const c = normalizarContenido({
      roles: [{ id: "r1", nombre: "Admin" }, { id: "r2" }],
      permisos: [{ id: "x", modulo: "Usuarios", accesos: { r1: "CRUD", r2: "Lectura", fantasma: "✔" } }],
      fases: [{ id: "f1", clave: "MVP" }, { id: "f2", contratada: true }],
      modulos: [
        {
          id: "m1",
          nombre: "Autenticación",
          requerimientos: [
            { id: "q1", texto: "Login", faseId: "f1" },
            { id: "q2", texto: "PIN", faseId: "f2" },
            { id: "q3" },
          ],
        },
      ],
      calendario: [{ id: "h1", semanas: "0", pagoId: "no-existe" }],
    })
    expect(c.roles).toHaveLength(1)
    expect(c.permisos[0].accesos).toEqual({ r1: "CRUD" })
    // Una fase solo con "contratada" marcada no cuenta
    expect(c.fases.map((f) => f.id)).toEqual(["f1"])
    expect(c.modulos[0].requerimientos.map((q) => [q.id, q.faseId])).toEqual([
      ["q1", "f1"],
      ["q2", null],
    ])
    expect(c.calendario[0].pagoId).toBeNull()
    expect(c.inversion.moneda).toBe("MXN")
  })

  it("rechaza montos que no son centavos enteros", () => {
    expect(() =>
      normalizarContenido({ inversion: { pagos: [{ id: "a", montoCentavos: 10.5 }] } }),
    ).toThrow(DatosInvalidos)
  })

  it("suma la inversión y cuenta los requerimientos de las fases contratadas", () => {
    const c = normalizarContenido({
      ...publicable,
      fases: [...publicable.fases, { id: "f2", clave: "F2", contratada: false }],
      inversion: {
        pagos: [
          { id: "a", montoCentavos: 1_050_000 },
          { id: "b", montoCentavos: 1_400_000 },
        ],
      },
      modulos: [
        {
          id: "m",
          nombre: "Rutas",
          requerimientos: [
            { id: "1", texto: "a", faseId: "mvp" },
            { id: "2", texto: "b", faseId: "f2" },
          ],
        },
      ],
    })
    expect(totalInversion(c)).toBe(2_450_000)
    expect(requerimientosContratados(c)).toBe(1)
  })

  it("la bonificación baja el último pago sin cambiar el total", () => {
    const pagos = [
      { id: "a", montoCentavos: 600_000 },
      { id: "b", montoCentavos: 1_050_000 },
    ]
    const con = (montoCentavos: number | null) =>
      normalizarContenido({ inversion: { pagos, bonificacion: { nombre: "Caso de éxito", montoCentavos } } })

    expect(totalInversion(con(250_000))).toBe(1_650_000)
    expect(totalConBonificacion(con(250_000))).toBe(1_400_000)
    // Sin bonificación, o si no cabe en el último pago, no hay total alterno
    expect(totalConBonificacion(con(null))).toBeNull()
    expect(totalConBonificacion(con(1_050_000))).toBeNull()
    expect(totalConBonificacion(normalizarContenido({}))).toBeNull()
  })
})

describe("Proyecto", () => {
  it("no se publica sin fase contratada ni monto", () => {
    const p = nuevo()
    expect(() => p.publicar(reloj)).toThrow(OperacionNoPermitida)
    const conFase = nuevo({ fases: publicable.fases })
    expect(() => conFase.publicar(reloj)).toThrow(/monto/)
    const listo = nuevo(publicable)
    listo.publicar(reloj)
    expect(listo.esPublico).toBe(true)
  })

  it("el desarrollador firma y puede volver a firmar", () => {
    const p = nuevo(publicable)
    expect(p.firmaDesarrollador).toBeNull()
    expect(() => p.firmarComoDesarrollador("M10 10", reloj)).toThrow(DatosInvalidos)
    const trazo = "M10 10L20 20L30 10L40 20L50 10L60 20"
    p.firmarComoDesarrollador(trazo, reloj)
    expect(p.firmaDesarrollador).toEqual({ trazo, en: reloj.ahora() })
    p.firmarComoDesarrollador(`${trazo}L70 10`, reloj)
    expect(p.firmaDesarrollador?.trazo).toBe(`${trazo}L70 10`)
  })

  it("el cliente acepta una sola vez, con firma, y solo si está publicada", () => {
    const trazo = "M10 10L20 20L30 10L40 20L50 10L60 20"
    const cesar = { nombre: "  César Chavero ", trazo }
    const p = nuevo(publicable)
    expect(() => p.aceptar(con([cesar]), reloj)).toThrow(OperacionNoPermitida)
    p.publicar(reloj)
    expect(() => p.aceptar(con([]), reloj)).toThrow(DatosInvalidos)
    expect(() => p.aceptar(con([{ nombre: "   ", trazo }]), reloj)).toThrow(DatosInvalidos)
    expect(() => p.aceptar(con([{ nombre: "César", trazo: "M10 10" }]), reloj)).toThrow(/firma/)
    expect(() => p.aceptar(con([{ nombre: "César", trazo: "<script>" }]), reloj)).toThrow(/firma/)
    expect(() => p.aceptar(con([cesar, cesar, cesar, cesar]), reloj)).toThrow(/hasta 3/)
    p.aceptar(con([cesar, { nombre: "Ana Ruiz", trazo }]), reloj)
    expect(p.aceptacion).toEqual({
      en: reloj.ahora(),
      por: "César Chavero, Ana Ruiz",
      firmas: [
        { nombre: "César Chavero", trazo },
        { nombre: "Ana Ruiz", trazo },
      ],
      correo: "cesar@tiobeto.mx",
      conBonificacion: false,
    })
    expect(() => p.aceptar(con([cesar]), reloj)).toThrow(/ya fue aceptada/)
    p.retirarAceptacion(reloj)
    expect(p.aceptacion).toBeNull()
    p.aceptar(con([{ nombre: "César", trazo }]), reloj)
    expect(p.aceptacion?.por).toBe("César")
  })

  it("al aceptar se pide un correo válido para enviar el contrato", () => {
    const p = nuevo(publicable)
    p.publicar(reloj)
    const firmas = [{ nombre: "César", trazo: "M10 10L20 20L30 10L40 20L50 10L60 20" }]
    expect(() => p.aceptar({ firmas, correo: "  " }, reloj)).toThrow(/correo/)
    expect(() => p.aceptar({ firmas, correo: "cesar@tiobeto" }, reloj)).toThrow(/correo no es válido/)
    p.aceptar({ firmas, correo: "  Cesar@TioBeto.mx " }, reloj)
    expect(p.aceptacion?.correo).toBe("cesar@tiobeto.mx")
    p.retirarAceptacion(reloj)
    expect(p.aceptacion).toBeNull()
  })

  it("con bonificación, el cliente elige al firmar y eso fija el total acordado", () => {
    const firmas = [{ nombre: "César", trazo: "M10 10L20 20L30 10L40 20L50 10L60 20" }]
    const correo = "cesar@tiobeto.mx"
    const conBono = {
      ...publicable,
      inversion: {
        pagos: [
          { id: "a", nombre: "Anticipo", montoCentavos: 600_000 },
          { id: "b", nombre: "Entrega", montoCentavos: 1_050_000 },
        ],
        bonificacion: { nombre: "Caso de éxito", montoCentavos: 250_000 },
      },
    }
    const p = nuevo(conBono)
    p.publicar(reloj)
    expect(() => p.aceptar({ firmas, correo }, reloj)).toThrow(/opción de inversión/)
    p.aceptar({ firmas, correo, conBonificacion: true }, reloj)
    expect(p.aceptacion?.conBonificacion).toBe(true)
    expect(p.totalCentavos).toBe(1_650_000)
    expect(p.totalAcordadoCentavos).toBe(1_400_000)

    p.retirarAceptacion(reloj)
    p.aceptar({ firmas, correo, conBonificacion: false }, reloj)
    expect(p.totalAcordadoCentavos).toBe(1_650_000)

    // Sin bonificación en la propuesta, la opción se ignora
    const sin = nuevo(publicable)
    sin.publicar(reloj)
    sin.aceptar({ firmas, correo, conBonificacion: true }, reloj)
    expect(sin.aceptacion?.conBonificacion).toBe(false)
    expect(sin.totalAcordadoCentavos).toBe(sin.totalCentavos)
  })

  it("archivado no se edita y deja de ser público", () => {
    const p = nuevo(publicable)
    p.publicar(reloj)
    p.archivar(reloj)
    expect(p.esPublico).toBe(false)
    expect(() => p.reemplazarContenido({}, reloj)).toThrow(OperacionNoPermitida)
  })
})
