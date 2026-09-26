import { describe, expect, it } from "vitest"
import { normalizarContenido, requerimientosContratados, totalInversion } from "../domain/contenido"
import { importarArranque } from "./importar-arranque"

const MD = `# Demo · Documento de arranque

> **Versión:** 1.0 · **Fecha:** 2026-09-25

## 1. Ficha del proyecto

| Campo | Valor |
|---|---|
| Cliente | Demo SA |
| Producto | Demo Soft |
| Entregables | 1) **App** para campo · 2) **Panel** para oficina |
| Duración del MVP | **2 meses (8 semanas)** |

## 6. Módulos y requerimientos

### 6.1 Transversales

**Autenticación** — \`RF-AUT\`
- \`RF-AUT-01\` **[MVP]** Login.
- \`RF-AUT-02\` **[F2]** Login de clientes.

### 6.2 Portal **[F2]**
- \`RF-POR-01\` Consultar compras.

## 7. Flujo operativo diario (to-be)

\`\`\`
INICIO DE TURNO
 1. Arma la carga   → Carga: Preparada
    · Se imprime
\`\`\`

---

## 11. Alcance del MVP, roadmap y calendario

### 11.1 MVP: la operación base (2 meses)

| Bloque | Qué incluye |
|---|---|
| Base | Login y roles |

### 11.2 Calendario

| Semanas | Entregable | Pago |
|---|---|---|
| 0 | Firma | **$5,000** (anticipo) |
| 4 | Demo | **$5,000** (avance) |

### 11.4 Lo que viene después

#### Fase 2 · Control avanzado
*Reaccionar a tiempo.*

| Función | Qué resuelve | Qué incluye |
|---|---|---|
| **Alertas** | Enterarse | Avisos |

## 12. Inversión

### 12.1 Desarrollo del MVP

| Pago | Monto | Cuándo | Contra qué entrega |
|---|---|---|---|
| **1 · Anticipo** | **$5,000** (50 %) | Semana 0 | Firma |
| **2 · Avance** | **$5,000** (50 %) | Semana 4 | Demo |
| **Total** | **$10,000** | | |
`

describe("importarArranque", () => {
  let n = 0
  const r = importarArranque(MD, () => `i${++n}`)
  const c = normalizarContenido(r.contenido)

  it("toma generales, ficha y entregables", () => {
    expect(r.generales).toEqual({ clienteNombre: "Demo SA", proyectoNombre: "Demo Soft", fechaPropuesta: "2026-09-25" })
    expect(c.ficha.version).toBe("1.0")
    expect(c.ficha.entregables.map((e) => e.nombre)).toEqual(["App", "Panel"])
  })

  it("arma fases y asigna cada requerimiento a la suya (marca del módulo o del grupo)", () => {
    expect(c.fases.map((f) => [f.clave, f.contratada, f.duracion])).toEqual([
      ["MVP", true, "2 meses (8 semanas)"],
      ["F2", false, ""],
    ])
    const fase = new Map(c.fases.map((f) => [f.id, f.clave]))
    const reqs = c.modulos.flatMap((m) => m.requerimientos.map((q) => [q.clave, fase.get(q.faseId!)]))
    expect(reqs).toEqual([
      ["RF-AUT-01", "MVP"],
      ["RF-AUT-02", "F2"],
      ["RF-POR-01", "F2"],
    ])
    expect(requerimientosContratados(c)).toBe(1)
  })

  it("liga cada pago una sola vez al calendario aunque se repita el monto", () => {
    expect(totalInversion(c)).toBe(1_000_000)
    expect(c.calendario.map((h) => h.pagoId)).toEqual(c.inversion.pagos.map((p) => p.id))
  })

  it("lee el flujo desde el bloque de código", () => {
    expect(c.flujo[0]).toMatchObject({
      nombre: "Inicio de turno",
      pasos: [{ texto: "Arma la carga", detalle: "→ Carga: Preparada\n· Se imprime" }],
    })
  })
})
