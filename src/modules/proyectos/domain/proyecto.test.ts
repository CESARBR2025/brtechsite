import { describe, expect, it } from "vitest"
import {
  DatosInvalidos,
  OperacionNoPermitida,
} from "@/src/modules/shared/domain/errors"
import { RelojFijo } from "@/src/testing/dobles"
import {
  normalizarContenido,
  requerimientosContratados,
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

  it("el cliente acepta una sola vez y solo si está publicada", () => {
    const p = nuevo(publicable)
    expect(() => p.aceptar("César", reloj)).toThrow(OperacionNoPermitida)
    p.publicar(reloj)
    expect(() => p.aceptar("   ", reloj)).toThrow(DatosInvalidos)
    p.aceptar("  César Chavero ", reloj)
    expect(p.aceptacion).toEqual({ en: reloj.ahora(), por: "César Chavero" })
    expect(() => p.aceptar("Otro", reloj)).toThrow(/ya fue aceptada/)
    p.retirarAceptacion(reloj)
    expect(p.aceptacion).toBeNull()
    p.aceptar("César", reloj)
    expect(p.aceptacion?.por).toBe("César")
  })

  it("archivado no se edita y deja de ser público", () => {
    const p = nuevo(publicable)
    p.publicar(reloj)
    p.archivar(reloj)
    expect(p.esPublico).toBe(false)
    expect(() => p.reemplazarContenido({}, reloj)).toThrow(OperacionNoPermitida)
  })
})
