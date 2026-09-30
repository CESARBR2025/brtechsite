import { DatosInvalidos } from "@/src/modules/shared/domain/errors"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Lo que le interesa al visitante; el formulario lo ofrece como opciones. */
export const INTERESES = {
  restaurantes: "Software para restaurantes",
  inventarios: "Control de inventarios",
  web: "Presencia digital",
  otro: "Otro / aún no sé",
} as const

export type InteresContacto = keyof typeof INTERESES

function esInteres(valor: string): valor is InteresContacto {
  return Object.hasOwn(INTERESES, valor)
}

/** Mensaje enviado desde el formulario de contacto del sitio. */
export class MensajeContacto {
  private constructor(
    readonly nombre: string,
    readonly email: string,
    readonly mensaje: string,
    /** Opcional: servicio que le interesa. */
    readonly interes: InteresContacto | null,
    /** Opcional: solo dígitos (10 a 15), p. ej. "4271234567" o "524271234567". */
    readonly telefono: string | null,
  ) {}

  static crear(datos: {
    nombre: string
    email: string
    mensaje: string
    interes?: string | null
    telefono?: string | null
  }): MensajeContacto {
    const nombre = datos.nombre?.trim() ?? ""
    const email = datos.email?.trim().toLowerCase() ?? ""
    const mensaje = datos.mensaje?.trim() ?? ""
    const interes = datos.interes?.trim() || null
    const telefono = datos.telefono?.replace(/\D/g, "") || null

    if (!nombre) throw new DatosInvalidos("El nombre es obligatorio")
    if (!EMAIL.test(email)) throw new DatosInvalidos("El correo no es válido")
    if (mensaje.length < 5) {
      throw new DatosInvalidos("El mensaje es demasiado corto")
    }
    if (interes !== null && !esInteres(interes)) {
      throw new DatosInvalidos("Elige una opción válida de lo que te interesa")
    }
    if (telefono !== null && (telefono.length < 10 || telefono.length > 15)) {
      throw new DatosInvalidos("El teléfono debe tener 10 dígitos")
    }
    return new MensajeContacto(nombre, email, mensaje, interes, telefono)
  }

  /** Etiqueta legible del interés, o null si no eligió. */
  get interesEtiqueta(): string | null {
    return this.interes ? INTERESES[this.interes] : null
  }
}
