import {
  DatosInvalidos,
  OperacionNoPermitida,
} from "@/src/modules/shared/domain/errors"
import type { Reloj } from "@/src/modules/shared/domain/reloj"
import {
  completitud,
  type ClaveSeccion,
  type Contenido,
  contenidoVacio,
  normalizarContenido,
  totalInversion,
} from "./contenido"
import type { EstadoProyecto } from "./estado-proyecto"
import type { SlugProyecto } from "./slug-proyecto"

export interface DatosGenerales {
  clienteNombre: string
  clienteContacto?: string | null
  proyectoNombre?: string | null
  fechaPropuesta: Date
}

export interface PropsProyecto {
  id: string
  folio: string
  slug: SlugProyecto
  estado: EstadoProyecto
  /** Levantamiento del que nació (si nació de uno). */
  levantamientoId: string | null
  clienteNombre: string
  clienteContacto: string | null
  proyectoNombre: string | null
  fechaPropuesta: Date
  contenido: Contenido
  creadoEn: Date
  actualizadoEn: Date
  publicadoEn: Date | null
  aceptadoEn: Date | null
  /** Nombre que escribió el cliente al aceptar. */
  aceptadoPor: string | null
}

function textoOpcional(valor: string | null | undefined): string | null {
  const t = valor?.trim()
  return t ? t : null
}

function textoRequerido(valor: string, campo: string): string {
  const t = valor.trim()
  if (!t) throw new DatosInvalidos(`El campo "${campo}" es obligatorio`)
  return t
}

/**
 * Raíz de agregado. El proyecto que se propone a un cliente: fases, módulos,
 * calendario e inversión. Publicado, su página pública es la propuesta que el
 * cliente puede aceptar; las notas internas nunca salen de aquí.
 */
export class Proyecto {
  private constructor(private props: PropsProyecto) {}

  static crear(
    datos: DatosGenerales & { levantamientoId?: string | null; contenido?: unknown },
    deps: { id: string; folio: string; slug: SlugProyecto; reloj: Reloj },
  ): Proyecto {
    const ahora = deps.reloj.ahora()
    return new Proyecto({
      id: deps.id,
      folio: deps.folio,
      slug: deps.slug,
      estado: "borrador",
      levantamientoId: textoOpcional(datos.levantamientoId),
      clienteNombre: textoRequerido(datos.clienteNombre, "nombre del cliente"),
      clienteContacto: textoOpcional(datos.clienteContacto),
      proyectoNombre: textoOpcional(datos.proyectoNombre),
      fechaPropuesta: datos.fechaPropuesta,
      contenido: datos.contenido ? normalizarContenido(datos.contenido) : contenidoVacio(),
      creadoEn: ahora,
      actualizadoEn: ahora,
      publicadoEn: null,
      aceptadoEn: null,
      aceptadoPor: null,
    })
  }

  /** Rehidrata desde persistencia (el contenido se vuelve a normalizar). */
  static desdePersistencia(
    props: Omit<PropsProyecto, "contenido"> & { contenido: unknown },
  ): Proyecto {
    return new Proyecto({ ...props, contenido: normalizarContenido(props.contenido) })
  }

  // --- Lectura ---

  get id(): string {
    return this.props.id
  }
  get folio(): string {
    return this.props.folio
  }
  get slug(): SlugProyecto {
    return this.props.slug
  }
  get estado(): EstadoProyecto {
    return this.props.estado
  }
  get levantamientoId(): string | null {
    return this.props.levantamientoId
  }
  get cliente(): { nombre: string; contacto: string | null } {
    return { nombre: this.props.clienteNombre, contacto: this.props.clienteContacto }
  }
  get proyectoNombre(): string | null {
    return this.props.proyectoNombre
  }
  get fechaPropuesta(): Date {
    return this.props.fechaPropuesta
  }
  get contenido(): Contenido {
    return this.props.contenido
  }
  get creadoEn(): Date {
    return this.props.creadoEn
  }
  get actualizadoEn(): Date {
    return this.props.actualizadoEn
  }
  get publicadoEn(): Date | null {
    return this.props.publicadoEn
  }
  get aceptacion(): { en: Date; por: string } | null {
    return this.props.aceptadoEn
      ? { en: this.props.aceptadoEn, por: this.props.aceptadoPor ?? "" }
      : null
  }
  get esPublico(): boolean {
    return this.props.estado === "publicado"
  }
  get totalCentavos(): number {
    return totalInversion(this.props.contenido)
  }
  get completitud(): Record<ClaveSeccion, boolean> {
    return completitud(this.props.contenido)
  }

  // --- Comportamiento ---

  private garantizarEditable(): void {
    if (this.props.estado === "archivado") {
      throw new OperacionNoPermitida("Un proyecto archivado no se puede modificar")
    }
  }

  private tocar(reloj: Reloj): void {
    this.props.actualizadoEn = reloj.ahora()
  }

  actualizarGenerales(datos: DatosGenerales, reloj: Reloj): void {
    this.garantizarEditable()
    this.props.clienteNombre = textoRequerido(datos.clienteNombre, "nombre del cliente")
    this.props.clienteContacto = textoOpcional(datos.clienteContacto)
    this.props.proyectoNombre = textoOpcional(datos.proyectoNombre)
    this.props.fechaPropuesta = datos.fechaPropuesta
    this.tocar(reloj)
  }

  /** Sustituye el contenido completo (el panel siempre manda todo). */
  reemplazarContenido(crudo: unknown, reloj: Reloj): void {
    this.garantizarEditable()
    this.props.contenido = normalizarContenido(crudo)
    this.tocar(reloj)
  }

  publicar(reloj: Reloj): void {
    if (this.props.estado === "publicado") return
    if (this.props.estado === "archivado") {
      throw new OperacionNoPermitida("No se puede publicar un proyecto archivado")
    }
    const c = this.props.contenido
    if (!c.fases.some((f) => f.contratada)) {
      throw new OperacionNoPermitida(
        "Marca al menos una fase como contratada antes de publicar la propuesta",
      )
    }
    if (this.totalCentavos === 0) {
      throw new OperacionNoPermitida(
        "Captura el monto de al menos un pago antes de publicar la propuesta",
      )
    }
    this.props.estado = "publicado"
    this.props.publicadoEn = reloj.ahora()
    this.tocar(reloj)
  }

  despublicar(reloj: Reloj): void {
    if (this.props.estado !== "publicado") return
    this.props.estado = "borrador"
    this.props.publicadoEn = null
    this.tocar(reloj)
  }

  archivar(reloj: Reloj): void {
    this.props.estado = "archivado"
    this.props.publicadoEn = null
    this.tocar(reloj)
  }

  /**
   * El cliente acepta la propuesta desde su página publicada, escribiendo su
   * nombre. Solo se acepta una vez; para volver a pedirla, el panel la retira.
   */
  aceptar(nombre: string, reloj: Reloj): void {
    if (!this.esPublico) {
      throw new OperacionNoPermitida("Solo se puede aceptar una propuesta publicada")
    }
    if (this.props.aceptadoEn) {
      throw new OperacionNoPermitida("Esta propuesta ya fue aceptada")
    }
    const quien = textoRequerido(nombre, "nombre de quien acepta")
    if (quien.length > 120) throw new DatosInvalidos("El nombre es demasiado largo")
    this.props.aceptadoEn = reloj.ahora()
    this.props.aceptadoPor = quien
    this.tocar(reloj)
  }

  /** El panel retira la aceptación (p. ej. porque cambió el alcance). */
  retirarAceptacion(reloj: Reloj): void {
    this.garantizarEditable()
    if (!this.props.aceptadoEn) return
    this.props.aceptadoEn = null
    this.props.aceptadoPor = null
    this.tocar(reloj)
  }

  /** Snapshot plano para el repositorio. No se usa desde presentación. */
  instantanea(): PropsProyecto {
    return { ...this.props }
  }
}
