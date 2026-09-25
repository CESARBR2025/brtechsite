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
} from "./contenido"
import type { EstadoLevantamiento } from "./estado-levantamiento"
import type { SlugLevantamiento } from "./slug-levantamiento"

export interface DatosGenerales {
  clienteNombre: string
  clienteContacto?: string | null
  proyectoNombre?: string | null
  fechaReunion: Date
}

export interface PropsLevantamiento {
  id: string
  folio: string
  slug: SlugLevantamiento
  estado: EstadoLevantamiento
  clienteNombre: string
  clienteContacto: string | null
  proyectoNombre: string | null
  fechaReunion: Date
  contenido: Contenido
  creadoEn: Date
  actualizadoEn: Date
  publicadoEn: Date | null
  confirmadoEn: Date | null
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
 * Raíz de agregado. El levantamiento de requisitos de un cliente nuevo:
 * datos generales + contenido estructurado. Publicado, su página pública es
 * el "Diagnóstico de tu proyecto"; las notas internas nunca salen de aquí.
 */
export class Levantamiento {
  private constructor(private props: PropsLevantamiento) {}

  /** Alta en la reunión: basta con el cliente, el resto se captura después. */
  static crear(
    datos: DatosGenerales,
    deps: { id: string; folio: string; slug: SlugLevantamiento; reloj: Reloj },
  ): Levantamiento {
    const ahora = deps.reloj.ahora()
    return new Levantamiento({
      id: deps.id,
      folio: deps.folio,
      slug: deps.slug,
      estado: "borrador",
      clienteNombre: textoRequerido(datos.clienteNombre, "nombre del cliente"),
      clienteContacto: textoOpcional(datos.clienteContacto),
      proyectoNombre: textoOpcional(datos.proyectoNombre),
      fechaReunion: datos.fechaReunion,
      contenido: contenidoVacio(),
      creadoEn: ahora,
      actualizadoEn: ahora,
      publicadoEn: null,
      confirmadoEn: null,
    })
  }

  /** Rehidrata desde persistencia (el contenido se vuelve a normalizar). */
  static desdePersistencia(
    props: Omit<PropsLevantamiento, "contenido"> & { contenido: unknown },
  ): Levantamiento {
    return new Levantamiento({
      ...props,
      contenido: normalizarContenido(props.contenido),
    })
  }

  // --- Lectura ---

  get id(): string {
    return this.props.id
  }
  get folio(): string {
    return this.props.folio
  }
  get slug(): SlugLevantamiento {
    return this.props.slug
  }
  get estado(): EstadoLevantamiento {
    return this.props.estado
  }
  get cliente(): { nombre: string; contacto: string | null } {
    return {
      nombre: this.props.clienteNombre,
      contacto: this.props.clienteContacto,
    }
  }
  get proyectoNombre(): string | null {
    return this.props.proyectoNombre
  }
  get fechaReunion(): Date {
    return this.props.fechaReunion
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
  get confirmadoEn(): Date | null {
    return this.props.confirmadoEn
  }
  get esPublico(): boolean {
    return this.props.estado === "publicado"
  }
  /** Todas las preguntas al cliente tienen respuesta (sin preguntas, cuenta como completo). */
  get preguntasCompletas(): boolean {
    return this.props.contenido.preguntasAbiertas.every((p) => p.respuesta.length > 0)
  }
  get preguntasPendientes(): number {
    return this.props.contenido.preguntasAbiertas.filter((p) => !p.respuesta).length
  }
  get completitud(): Record<ClaveSeccion, boolean> {
    return completitud(this.props.contenido)
  }

  // --- Comportamiento ---

  private garantizarEditable(): void {
    if (this.props.estado === "archivado") {
      throw new OperacionNoPermitida(
        "Un levantamiento archivado no se puede modificar",
      )
    }
  }

  private tocar(reloj: Reloj): void {
    this.props.actualizadoEn = reloj.ahora()
  }

  actualizarGenerales(datos: DatosGenerales, reloj: Reloj): void {
    this.garantizarEditable()
    this.props.clienteNombre = textoRequerido(
      datos.clienteNombre,
      "nombre del cliente",
    )
    this.props.clienteContacto = textoOpcional(datos.clienteContacto)
    this.props.proyectoNombre = textoOpcional(datos.proyectoNombre)
    this.props.fechaReunion = datos.fechaReunion
    this.tocar(reloj)
  }

  /**
   * Sustituye el contenido completo (el panel siempre manda todo). Las
   * respuestas a las preguntas son del cliente: se conservan las guardadas,
   * aunque el panel mande una copia vieja.
   */
  reemplazarContenido(crudo: unknown, reloj: Reloj): void {
    this.garantizarEditable()
    const previas = new Map(
      this.props.contenido.preguntasAbiertas.map((p) => [p.id, p]),
    )
    const nuevo = normalizarContenido(crudo)
    this.props.contenido = {
      ...nuevo,
      preguntasAbiertas: nuevo.preguntasAbiertas.map((p) => ({
        ...p,
        respuesta: previas.get(p.id)?.respuesta ?? "",
        respondidaEn: previas.get(p.id)?.respondidaEn ?? null,
      })),
    }
    this.tocar(reloj)
  }

  /**
   * El cliente responde las preguntas desde su diagnóstico publicado. Solo se
   * tocan las preguntas que existen y cuya respuesta cambió. Devuelve si hubo cambios.
   */
  responderPreguntas(
    respuestas: { id: string; respuesta: string }[],
    reloj: Reloj,
  ): boolean {
    if (!this.esPublico) {
      throw new OperacionNoPermitida(
        "Solo se pueden responder preguntas de un diagnóstico publicado",
      )
    }
    const nuevas = new Map(respuestas.map((r) => [r.id, r.respuesta.trim()]))
    const ahora = reloj.ahora().toISOString()
    let cambio = false
    const preguntas = this.props.contenido.preguntasAbiertas.map((p) => {
      const respuesta = nuevas.get(p.id)
      if (respuesta === undefined || respuesta === p.respuesta) return p
      if (respuesta.length > 5000) {
        throw new DatosInvalidos("La respuesta es demasiado larga")
      }
      cambio = true
      return { ...p, respuesta, respondidaEn: respuesta ? ahora : null }
    })
    if (!cambio) return false
    this.props.contenido = { ...this.props.contenido, preguntasAbiertas: preguntas }
    this.tocar(reloj)
    return true
  }

  publicar(reloj: Reloj): void {
    if (this.props.estado === "publicado") return
    if (this.props.estado === "archivado") {
      throw new OperacionNoPermitida(
        "No se puede publicar un levantamiento archivado",
      )
    }
    if (!this.props.contenido.problema.situacionActual) {
      throw new OperacionNoPermitida(
        "Describe el problema (situación actual) antes de publicar el diagnóstico",
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

  /** El cliente confirmó que el diagnóstico refleja su operación. */
  marcarConfirmado(confirmado: boolean, reloj: Reloj): void {
    this.garantizarEditable()
    this.props.confirmadoEn = confirmado ? reloj.ahora() : null
    this.tocar(reloj)
  }

  /** Snapshot plano para el repositorio. No se usa desde presentación. */
  instantanea(): PropsLevantamiento {
    return { ...this.props }
  }
}
