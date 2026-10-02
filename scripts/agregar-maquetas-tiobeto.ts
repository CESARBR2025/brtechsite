/**
 * Agrega a la propuesta de Tío Beto las 8 maquetas de pantallas (sección "Así
 * podría verse"). Respalda el contenido actual en respaldos/ y guarda con los
 * mismos casos de uso que el panel. Por omisión solo muestra qué haría.
 *
 *   npx tsx --env-file=.env.local scripts/agregar-maquetas-tiobeto.ts [BRP-000001] [--aplicar]
 *
 * OJO: .env.local apunta a la BD de producción por el túnel. Las imágenes
 * (public/propuestas/tio-beto-*.webp) deben estar desplegadas antes de aplicar.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { Pool } from "pg"
import { GuardarProyecto } from "@/src/modules/proyectos/application/guardar-proyecto"
import type { Contenido } from "@/src/modules/proyectos/domain/contenido"
import { RepositorioProyectosPostgres } from "@/src/modules/proyectos/infrastructure/repositorio-proyectos-postgres"
import { relojSistema } from "@/src/modules/shared/infrastructure/reloj-sistema"

type Maqueta = Contenido["maquetas"][number]

const m = (n: number, dispositivo: Maqueta["dispositivo"], titulo: string, descripcion: string, archivo: string): Maqueta => ({
  id: `maq-${n}`,
  dispositivo,
  titulo,
  descripcion,
  imagen: `/propuestas/tio-beto-${archivo}.webp`,
})

const MAQUETAS_TIOBETO: Maqueta[] = [
  m(1, "movil", "Ruta del día", "Paradas en orden, avance de la jornada y botón hacia Google Maps", "app-ruta"),
  m(2, "movil", "Llegada al comercio", "Escaneas el sticker QR y se valida tu ubicación", "app-llegada"),
  m(3, "movil", "Venta", "Productos, cantidades y retiro de caducados en una pantalla", "app-venta"),
  m(4, "movil", "Ticket y sin internet", "Impresión por Bluetooth; si no hay señal, se sincroniza después", "app-ticket"),
  m(5, "movil", "Comercio nuevo", "Alta en el camino con ubicación y foto", "app-comercio"),
  m(6, "web", "Camionetas en tiempo real", "Dónde va cada unidad, su avance y sus ventas", "web-camionetas"),
  m(7, "web", "Cierre del día", "Lo que salió, se vendió y regresó, y si el efectivo cuadra", "web-cierre"),
  m(8, "web", "Ventas y finanzas", "Venta por día y por unidad, caducados y cumplimiento de ruta", "web-ventas"),
]

const args = process.argv.slice(2)
const folio = args.find((a) => /^BRP-\d+$/.test(a)) ?? "BRP-000001"
const aplicar = args.includes("--aplicar")

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL (usa --env-file=.env.local)")
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10_000 })
  try {
    const { rows } = await pool.query<{ id: string }>("SELECT id FROM proyecto WHERE folio = $1", [folio])
    if (!rows[0]) throw new Error(`No existe el proyecto ${folio}`)
    const repo = new RepositorioProyectosPostgres(pool)
    const p = await repo.obtenerPorId(rows[0].id)
    if (!p) throw new Error(`No existe el proyecto ${folio}`)

    console.log(`${folio} · ${p.cliente.nombre} · ${p.proyectoNombre ?? "—"}`)
    console.log(`Maquetas actuales: ${p.contenido.maquetas.length} → nuevas: ${MAQUETAS_TIOBETO.length}`)
    if (!aplicar) {
      console.log("Solo revisión. Agrega --aplicar para guardar (antes respalda en respaldos/).")
      return
    }

    mkdirSync("respaldos", { recursive: true })
    const archivo = `respaldos/proyecto-${folio}-antes-maquetas-${new Date().toISOString().replace(/[:.]/g, "-")}.json`
    writeFileSync(archivo, JSON.stringify(p.contenido, null, 2))
    console.log(`Respaldo: ${archivo}`)

    await new GuardarProyecto(repo, relojSistema).ejecutar(p.id, {
      generales: {
        clienteNombre: p.cliente.nombre,
        clienteContacto: p.cliente.contacto,
        proyectoNombre: p.proyectoNombre,
        fechaPropuesta: p.fechaPropuesta.toISOString().slice(0, 10),
      },
      contenido: { ...p.contenido, maquetas: MAQUETAS_TIOBETO },
    })
    console.log(`✔ Guardado: ${MAQUETAS_TIOBETO.length} maquetas en ${folio}`)
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
