import Link from "next/link"
import { OndasGradiente } from "@/src/ui/primitivos/ondas-gradiente"
import { EMPRESA, WHATSAPP } from "@/src/ui/marketing/datos-contacto"

/*
 * Aviso de privacidad integral del sitio (LFPDPPP). Texto base redactado para
 * revisión del responsable: cualquier cambio de proveedores (correo,
 * analítica, alojamiento) debe reflejarse aquí y actualizar la fecha.
 */

const ACTUALIZACION = "29 de septiembre de 2026"

const enlace = "font-medium text-primary underline-offset-4 hover:underline"

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-10 first:border-t-0 first:pt-0">
      <h2 className="font-display text-xl font-bold tracking-tight text-text-primary sm:text-2xl">{titulo}</h2>
      <div className="mt-4 space-y-4 text-pretty text-base leading-relaxed text-text-secondary">{children}</div>
    </section>
  )
}

function Lista({ elementos }: { elementos: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {elementos.map((x, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  )
}

export function AvisoPrivacidad() {
  return (
    <>
      <section className="relative overflow-hidden bg-bg-dark">
        <div className="absolute inset-0">
          <OndasGradiente />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-bg-dark/90 via-bg-dark/60 to-bg-dark/30" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-36 sm:px-6 sm:pb-20 sm:pt-44 lg:px-8">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75 sm:gap-4 sm:text-xs">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary-light/70 sm:w-14" aria-hidden="true" />
            Legal
          </p>
          <h1 className="mt-6 font-hero text-[38px] font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl">
            Aviso de privacidad
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            Cómo cuidamos los datos que nos compartes a través de este sitio.
          </p>
          <p className="mt-6 text-xs text-white/50">Última actualización: {ACTUALIZACION}</p>
        </div>
      </section>

      <div className="bg-surface py-16 sm:py-24">
        <article className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
          <Seccion titulo="Responsable de tus datos">
            <p>
              <strong className="font-semibold text-text-primary">{EMPRESA.nombre}</strong>, a cargo de{" "}
              {EMPRESA.fundador}, con domicilio en {EMPRESA.ciudad}, {EMPRESA.estado}, México, es responsable del
              tratamiento de los datos personales que nos proporcionas a través de este sitio, conforme a la Ley
              Federal de Protección de Datos Personales en Posesión de los Particulares.
            </p>
          </Seccion>

          <Seccion titulo="Qué datos recabamos">
            <p>Cuando nos escribes por el formulario de contacto:</p>
            <Lista
              elementos={[
                "Nombre y correo electrónico.",
                "Número de WhatsApp, si decides compartirlo.",
                "El servicio que te interesa y el mensaje que nos escribes sobre tu negocio.",
              ]}
            />
            <p>
              Cuando nos escribes por WhatsApp, recibimos tu nombre de perfil, tu número y la conversación.
            </p>
            <p>
              Al navegar el sitio se registran datos técnicos de uso, como páginas visitadas, tipo de dispositivo,
              navegador, ciudad o país aproximados y los botones en los que das clic. No recabamos datos sensibles ni
              financieros.
            </p>
          </Seccion>

          <Seccion titulo="Para qué los usamos">
            <p>Usamos tus datos únicamente para:</p>
            <Lista
              elementos={[
                "Responder tu mensaje y darle seguimiento.",
                "Entender tu negocio para preparar un diagnóstico y una propuesta o cotización.",
                "Mantener comunicación contigo sobre el proyecto que nos solicites.",
                "Conocer cómo se usa el sitio para mejorarlo (con datos de uso, no con tus datos de contacto).",
              ]}
            />
            <p>
              No usamos tus datos para enviarte publicidad ni los vendemos, rentamos o cedemos a terceros.
            </p>
          </Seccion>

          <Seccion titulo="Con quién los compartimos">
            <p>
              No transferimos tus datos a terceros para sus propios fines. Para operar el sitio nos apoyamos en
              proveedores que los tratan por nuestra cuenta y solo para prestarnos su servicio:
            </p>
            <Lista
              elementos={[
                <>
                  <strong className="font-semibold text-text-primary">Resend</strong>: entrega a nuestro correo los
                  mensajes del formulario de contacto.
                </>,
                <>
                  <strong className="font-semibold text-text-primary">Umami</strong>: estadísticas de visitas sin
                  cookies y sin identificarte personalmente.
                </>,
                <>
                  <strong className="font-semibold text-text-primary">Microsoft Clarity</strong>: mapas de calor y
                  grabaciones de la navegación para detectar problemas de uso. Lo que escribes en el formulario se
                  oculta en esas grabaciones.
                </>,
                <>
                  <strong className="font-semibold text-text-primary">Proveedor de alojamiento</strong>: los
                  servidores donde se ejecuta el sitio.
                </>,
              ]}
            />
            <p>
              Algunos de estos proveedores pueden almacenar la información fuera de México. Solo compartiremos tus
              datos con una autoridad cuando la ley nos lo exija.
            </p>
          </Seccion>

          <Seccion titulo="Cookies y tecnologías similares">
            <p>
              Microsoft Clarity utiliza cookies para reconocer una misma visita y armar los mapas de calor y las
              grabaciones. Umami no usa cookies. Puedes bloquear o borrar las cookies desde la configuración de tu
              navegador; el sitio seguirá funcionando con normalidad.
            </p>
          </Seccion>

          <Seccion titulo="Cuánto tiempo los conservamos">
            <p>
              Conservamos tus datos de contacto mientras sean necesarios para atender tu solicitud y dar seguimiento
              a la relación comercial. Después los eliminamos, salvo lo que debamos conservar por obligaciones
              legales o fiscales.
            </p>
          </Seccion>

          <Seccion titulo="Tus derechos">
            <p>
              Puedes acceder a tus datos, pedir que los corrijamos, que los eliminemos u oponerte a su uso (derechos
              ARCO), así como revocar tu consentimiento. Para hacerlo, escríbenos por{" "}
              <a href={WHATSAPP.url} target="_blank" rel="noopener noreferrer" className={enlace}>
                WhatsApp al {WHATSAPP.visible}
              </a>{" "}
              o desde el{" "}
              <Link href="/contacto" className={enlace}>
                formulario de contacto
              </Link>
              , indicando tu nombre, el dato o la acción que solicitas y un medio para responderte.
            </p>
            <p>
              Te responderemos en un plazo máximo de 20 días hábiles y, si procede, atenderemos tu solicitud dentro
              de los 15 días hábiles siguientes.
            </p>
          </Seccion>

          <Seccion titulo="Cambios a este aviso">
            <p>
              Si modificamos este aviso, publicaremos la versión vigente en esta misma página con su fecha de
              actualización.
            </p>
          </Seccion>
        </article>
      </div>
    </>
  )
}
