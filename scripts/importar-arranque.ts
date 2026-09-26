/**
 * Crea un proyecto (en borrador) a partir de un documento de arranque en
 * Markdown, usando los mismos casos de uso que el panel.
 *
 *   npx tsx --env-file=.env.local scripts/importar-arranque.ts <arranque.md> \
 *     [--levantamiento BRD-000001] [--publicar]
 *
 * Con --levantamiento, el proyecto queda ligado a él y toma de ahí el
 * contacto, su WhatsApp y la promesa del hero.
 */
import { readFileSync } from "node:fs"
import { Pool } from "pg"
import { CambiarEstadoProyecto } from "@/src/modules/proyectos/application/cambiar-estado-proyecto"
import { CrearProyecto } from "@/src/modules/proyectos/application/crear-proyecto"
import type { FuenteLevantamientos, OrigenLevantamiento } from "@/src/modules/proyectos/domain/puertos"
import { generadorSlugProyectoNanoid } from "@/src/modules/proyectos/infrastructure/generador-slug-nanoid"
import { importarArranque } from "@/src/modules/proyectos/infrastructure/importar-arranque"
import { RepositorioProyectosPostgres } from "@/src/modules/proyectos/infrastructure/repositorio-proyectos-postgres"
import { generadorIdCrypto } from "@/src/modules/shared/infrastructure/generador-id-crypto"
import { relojSistema } from "@/src/modules/shared/infrastructure/reloj-sistema"

const args = process.argv.slice(2)
const ruta = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--levantamiento")
const folioLevantamiento = args.includes("--levantamiento") ? args[args.indexOf("--levantamiento") + 1] : null
const publicar = args.includes("--publicar")

if (!ruta || !process.env.DATABASE_URL) {
  console.error("Uso: DATABASE_URL=… npx tsx scripts/importar-arranque.ts <arranque.md> [--levantamiento BRD-…] [--publicar]")
  process.exit(1)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10_000 })

interface FilaLevantamiento {
  id: string
  folio: string
  public_slug: string
  cliente_nombre: string
  cliente_contacto: string | null
  proyecto_nombre: string | null
  contenido: { contexto?: { contactoNombre?: string; promesa?: string; giro?: string } }
}

/** El script lee el levantamiento directo de la tabla (fuera de Next no hay contenedor). */
async function buscarLevantamiento(folio: string): Promise<OrigenLevantamiento> {
  const { rows } = await pool.query<FilaLevantamiento>(
    `SELECT id, folio, public_slug, cliente_nombre, cliente_contacto, proyecto_nombre, contenido
     FROM levantamiento WHERE folio = $1`,
    [folio],
  )
  if (!rows[0]) throw new Error(`No existe el levantamiento ${folio}`)
  const l = rows[0]
  return {
    id: l.id,
    folio: l.folio,
    slug: l.public_slug,
    clienteNombre: l.cliente_nombre,
    clienteContacto: l.cliente_contacto,
    proyectoNombre: l.proyecto_nombre,
    contactoNombre: l.contenido.contexto?.contactoNombre ?? "",
    giro: l.contenido.contexto?.giro ?? "",
    promesa: l.contenido.contexto?.promesa ?? "",
    objetivo: "",
    problemas: [],
    actores: [],
  }
}

async function main() {
  const importado = importarArranque(readFileSync(ruta!, "utf8"), () => generadorIdCrypto.nuevo().slice(0, 12))
  const origen = folioLevantamiento ? await buscarLevantamiento(folioLevantamiento) : null
  const fuente: FuenteLevantamientos = {
    obtener: async (id) => (origen?.id === id ? origen : null),
    listar: async () => [],
  }

  const contenido = importado.contenido as { ficha: Record<string, unknown> }
  if (origen) {
    contenido.ficha = { ...contenido.ficha, contactoNombre: origen.contactoNombre, promesa: origen.promesa }
  }

  const repo = new RepositorioProyectosPostgres(pool)
  const crear = new CrearProyecto(repo, fuente, generadorIdCrypto, generadorSlugProyectoNanoid, relojSistema)
  const g = importado.generales
  const r = await crear.ejecutar({
    clienteNombre: g.clienteNombre,
    clienteContacto: origen?.clienteContacto ?? null,
    proyectoNombre: g.proyectoNombre,
    fechaPropuesta: g.fechaPropuesta ?? new Date().toISOString().slice(0, 10),
    levantamientoId: origen?.id ?? null,
    contenido,
  })
  if (publicar) await new CambiarEstadoProyecto(repo, relojSistema).publicar(r.id)

  const p = (await repo.obtenerPorId(r.id))!
  const c = p.contenido
  console.log(`✔ ${r.folio} · ${p.cliente.nombre} · ${p.proyectoNombre}`)
  console.log(`  id ${r.id}`)
  console.log(`  /panel/proyectos/${r.id}  ·  /p/${r.slug}${publicar ? " (publicada)" : " (borrador)"}`)
  console.log(
    `  ${c.fases.length} fases · ${c.modulos.length} módulos · ${c.modulos.reduce((n, m) => n + m.requerimientos.length, 0)} requerimientos · ` +
      `${c.decisiones.length} decisiones · ${c.riesgos.length} riesgos · total ${p.totalCentavos / 100} ${c.inversion.moneda}`,
  )
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => pool.end())
