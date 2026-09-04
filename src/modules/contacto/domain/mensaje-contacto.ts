import { DatosInvalidos } from "@/src/modules/shared/domain/errors"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Mensaje enviado desde el formulario de contacto del sitio. */
export class MensajeContacto {
  private constructor(
    readonly nombre: string,
    readonly email: string,
    readonly mensaje: string,
  ) {}

  static crear(datos: {
    nombre: string
    email: string
    mensaje: string
  }): MensajeContacto {
    const nombre = datos.nombre?.trim() ?? ""
    const email = datos.email?.trim().toLowerCase() ?? ""
    const mensaje = datos.mensaje?.trim() ?? ""

    if (!nombre) throw new DatosInvalidos("El nombre es obligatorio")
    if (!EMAIL.test(email)) throw new DatosInvalidos("El correo no es válido")
    if (mensaje.length < 5) {
      throw new DatosInvalidos("El mensaje es demasiado corto")
    }
    return new MensajeContacto(nombre, email, mensaje)
  }
}
