import { type Contenido, totalConBonificacion } from "./contenido"
import type { Firma, FirmaDesarrollador } from "./firma"

/**
 * Contrato de desarrollo, licencia y servicio que acompaña a la propuesta.
 * Se arma con lo ya capturado en el proyecto (alcance, calendario, pagos,
 * mensualidad) más las cláusulas fijas de BR TECH. Es un documento neutro
 * (secciones y bloques): quien lo pinta (PDF) es un adaptador.
 *
 * Antes de la aceptación es el contrato «por firmar» que el cliente puede
 * leer; aceptada la propuesta lleva la opción elegida y las firmas.
 */

export const PROVEEDOR = {
  empresa: "BR TECH Digital Systems",
  representante: "César Iván Bárcenas Rosales",
  jurisdiccion: "San Juan del Río, Querétaro",
} as const

/** Precio del código fuente, como fracción del desarrollo contratado. */
export const CODIGO_FUENTE = { copia: 0.5, cesion: 1 } as const
const GARANTIA_DIAS = 60

/** Texto con **negritas**; el resto del Markdown ya viene limpio. */
export type BloqueContrato =
  | { tipo: "parrafo"; texto: string }
  | { tipo: "lista"; items: string[] }
  | { tipo: "tabla"; columnas: string[]; filas: string[][]; anchos: number[] }
  | { tipo: "opciones"; items: { marcada: boolean; texto: string }[] }

export interface SeccionContrato {
  titulo: string
  bloques: BloqueContrato[]
}

export interface FirmaContrato {
  rotulo: string
  nombre: string
  /** Path SVG de la firma dibujada; null si aún no firma. */
  trazo: string | null
  nota: string
}

export interface DocumentoContrato {
  titulo: string
  /** "TioBetoSoft · Propuesta BRP-000001" */
  subtitulo: string
  /** "Firmado el…" o el aviso de que aún no se firma. */
  estado: string
  firmado: boolean
  partes: { rotulo: string; nombre: string; detalle: string }[]
  secciones: SeccionContrato[]
  firmas: FirmaContrato[]
  nombreArchivo: string
}

export interface DatosContrato {
  folio: string
  proyectoNombre: string | null
  clienteNombre: string
  contenido: Contenido
  totalCentavos: number
  aceptacion: { en: Date; firmas: Firma[]; conBonificacion: boolean } | null
  firmaDesarrollador: FirmaDesarrollador | null
}

function dinero(centavos: number, moneda: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: centavos % 100 === 0 ? 0 : 2,
  }).format(centavos / 100)
}

function fecha(d: Date): string {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeZone: "America/Mexico_City" }).format(d)
}

/** Quita el Markdown que el contrato no usa: `código`, _cursivas_, [enlaces](url), ✔ y claves (RF-…). */
function limpio(md: string, conNegritas = true): string {
  const t = md
    .replace(/\(`[^`]*`\)|\((?:D|RF)-[^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/_\(([^)]*)\)_/g, "($1)")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/^\s*✔\s*/, "")
    .replace(/\s{2,}/g, " ")
    .trim()
  return conNegritas ? t : t.replace(/\*\*/g, "")
}

const sinPunto = (t: string) => t.replace(/[.\s]+$/, "")
const minuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1)

/** Arma el contrato del proyecto. Función pura: mismos datos, mismo documento. */
export function construirContrato(d: DatosContrato): DocumentoContrato {
  const c = d.contenido
  const moneda = c.inversion.moneda || "MXN"
  const $ = (centavos: number) => dinero(centavos, moneda)
  const sistema = d.proyectoNombre ?? "el Sistema"
  const proveedor = PROVEEDOR.empresa
  const total = d.totalCentavos
  const pagos = c.inversion.pagos.filter((p) => p.montoCentavos)
  const contratadas = c.fases.filter((f) => f.contratada)
  const futuras = c.fases.filter((f) => !f.contratada).flatMap((f) => f.entregables)
  const mensual = c.inversion.mensualidad
  const plazoMinimo = Number(/plazo m[ií]nimo de (\d+) meses/i.exec(mensual.descripcion)?.[1] ?? 0)
  const bonificacion = c.inversion.bonificacion
  const totalBonificado = totalConBonificacion(c)
  const esCasoDeExito = totalBonificado != null && /caso de éxito|testimonio/i.test(`${bonificacion.nombre} ${bonificacion.condicion}`)
  const firmado = d.aceptacion !== null

  const secciones: SeccionContrato[] = []
  const seccion = (titulo: string, bloques: (BloqueContrato | false | null | undefined)[]) =>
    secciones.push({ titulo, bloques: bloques.filter((b): b is BloqueContrato => Boolean(b)) })
  const p = (texto: string): BloqueContrato => ({ tipo: "parrafo", texto })
  const lista = (items: string[]): BloqueContrato | null => (items.length ? { tipo: "lista", items } : null)

  // --- Objeto ---
  seccion("Objeto del contrato", [
    p(
      `${proveedor} desarrolla para el Cliente **${sistema}**${c.ficha.tipoSistema ? `, ${minuscula(sinPunto(c.ficha.tipoSistema))}` : ""}, lo pone en operación y le otorga una licencia de uso.${
        mensual.montoCentavos ? " A partir de la entrega presta el servicio mensual de hospedaje y mantenimiento." : ""
      } Todo conforme al alcance del Anexo A.`,
    ),
    p(
      `La propuesta ${d.folio}, aceptada por el Cliente, forma parte de este contrato. Si hay diferencia entre ambos, manda este contrato.`,
    ),
  ])

  // --- Alcance (Anexo A) ---
  const grupos = [...c.vistas.reduce((m, v) => m.set(v.grupo, [...(m.get(v.grupo) ?? []), v]), new Map<string, Contenido["vistas"]>())]
  const alcance: (BloqueContrato | null)[] = grupos.length
    ? grupos.flatMap(([grupo, vistas]) => {
        // "Panel de administración · en tu computadora…": título · dónde se usa
        const [nombre, donde] = limpio(grupo, false).split(/\s+·\s+/)
        return [
          p(`**${nombre || "Sistema"}**${donde ? `, ${minuscula(donde)}` : ""}:`),
          lista(vistas.map((v) => `**${limpio(v.nombre, false)}.** ${limpio(v.descripcion, false)}`)),
        ]
      })
    : [
        lista(
          contratadas.flatMap((f) =>
            f.entregables.map((e) => `**${limpio(e.nombre, false)}.** ${limpio(e.incluye, false)}`),
          ),
        ),
      ]
  seccion("Alcance (Anexo A)", [
    ...alcance,
    p("El detalle de cada parte es el de la sección «Lo que contendrá tu sistema» de la propuesta."),
  ])

  // --- Exclusiones (Anexo B) ---
  const terceros = c.inversion.terceros
    .filter((x) => !/opcional/i.test(x.concepto))
    .map((x) => limpio(x.concepto, false))
  seccion("Exclusiones (Anexo B)", [
    p("Lo siguiente no forma parte de este contrato y requiere cotización aparte:"),
    lista([
      ...(futuras.length
        ? [`Las funciones de fases futuras: ${futuras.map((e) => minuscula(limpio(e.nombre, false).replace(/\s*\(opcional\)/i, ""))).join(", ")}.`]
        : []),
      "Equipos, impresoras, consumibles, red, planes de datos e internet.",
      `Cuentas, licencias y consumos de terceros${terceros.length ? ` (${terceros.join(", ")})` : ""}.`,
      "Cualquier función no listada en el Anexo A.",
    ]),
  ])

  // --- Calendario ---
  const etapas = c.calendario.filter((h) => h.titulo && /^\d/.test(h.semanas))
  const semanas = /(\d+)\s*semanas?/i.exec(contratadas.map((f) => f.duracion).join(" "))?.[1]
  if (etapas.length > 0) {
    seccion("Calendario", [
      p(
        `El desarrollo ${semanas ? `dura **${semanas} semanas**` : "sigue las etapas siguientes"}, a partir de la semana 0, que inicia con el pago del anticipo:`,
      ),
      { tipo: "tabla", columnas: ["Semanas", "Etapa"], anchos: [0.2, 0.8], filas: etapas.map((h) => [h.semanas, h.titulo]) },
      p(
        `El calendario depende de que el Cliente entregue a tiempo las cuentas, la información y los equipos de la sección «Lo que necesitamos de tu lado» de la propuesta. Cada día de retraso del Cliente en esas entregas, o en un pago, recorre el calendario los mismos días, sin responsabilidad para ${proveedor}.`,
      ),
    ])
  }

  // --- Precio y forma de pago ---
  const ultimo = pagos.at(-1)
  seccion("Precio y forma de pago", [
    p(
      `Precio del desarrollo: **${$(total)} ${moneda}**, en ${pagos.length === 1 ? "un pago" : `${pagos.length} pagos ligados a entregas`}:`,
    ),
    {
      tipo: "tabla",
      columnas: ["Pago", "Cuándo", "Monto", "Se paga contra"],
      anchos: [0.19, 0.15, 0.14, 0.52],
      filas: pagos.map((x) => [x.nombre, x.cuando, $(x.montoCentavos!), limpio(x.contra, false)]),
    },
    lista([
      `Cada pago vence a los 5 días hábiles de que ${proveedor} avise que la entrega correspondiente está lista.`,
      "El anticipo no es reembolsable: cubre la reserva de agenda y el trabajo de arranque.",
      "Los pagos ya realizados corresponden a trabajo entregado y no se reembolsan.",
    ]),
    totalBonificado != null && ultimo
      ? p(`**${bonificacion.nombre || "Bonificación"} (opcional).** El Cliente elige una opción al firmar:`)
      : null,
    totalBonificado != null && ultimo
      ? {
          tipo: "opciones",
          items: [
            {
              marcada: d.aceptacion?.conBonificacion === true,
              texto: `**Con ${minuscula(bonificacion.nombre || "bonificación")}:** el último pago baja a **${$(ultimo.montoCentavos! - bonificacion.montoCentavos!)}** y el precio total queda en **${$(totalBonificado)}**. Lo que el Cliente da a cambio, según la propuesta: «${sinPunto(limpio(bonificacion.condicion, false))}». Si el Cliente no lo cumple, o revoca su autorización antes de 12 meses, paga los ${$(bonificacion.montoCentavos!)} bonificados.`,
            },
            {
              marcada: d.aceptacion?.conBonificacion === false,
              texto: `**Sin ${minuscula(bonificacion.nombre || "bonificación")}:** el precio total es de **${$(total)}**.`,
            },
          ],
        }
      : null,
  ])

  // --- Servicio mensual ---
  if (mensual.montoCentavos) {
    seccion("Servicio mensual de hospedaje y mantenimiento", [
      p(
        `**${$(mensual.montoCentavos)} ${moneda} al mes**, a partir de la entrega${plazoMinimo ? `, con un plazo mínimo de ${plazoMinimo} meses` : ""}. Se paga por adelantado dentro de los primeros 5 días de cada mes.`,
      ),
      mensual.incluye.length > 0 &&
        p(`**Incluye:** ${mensual.incluye.map((x) => minuscula(sinPunto(limpio(x.texto, false)))).join("; ")}.`),
      mensual.noIncluye.length > 0 &&
        p(`**No incluye:** ${mensual.noIncluye.map((x) => minuscula(sinPunto(limpio(x.texto, false)))).join("; ")}.`),
      lista([
        "Las horas de soporte no usadas no se acumulan. El soporte adicional se cotiza aparte.",
        `Ajuste anual de 8 % cada 1 de enero${plazoMinimo ? `, a partir del mes ${plazoMinimo + 1}` : ""}, notificado con 30 días de anticipación.`,
      ]),
    ])
  }

  // --- Cambios de alcance ---
  seccion("Cambios de alcance", [
    p(
      "Cualquier función adicional o cambio a lo descrito en el Anexo A se cotiza por separado y se agrega mediante un anexo firmado por ambas partes, con su precio y su efecto en el calendario. Ningún cambio se da por acordado de palabra.",
    ),
  ])

  // --- Aceptación ---
  const condiciones = c.inversion.condiciones
    .map((x) => limpio(x.texto))
    .filter((t) => !/^\*\*Vigencia/i.test(t))
  seccion("Aceptación de la entrega y condiciones", [
    lista([
      ...condiciones,
      "Solo son observaciones válidas las diferencias contra el Anexo A. Lo demás es cambio de alcance.",
      "Si el Cliente usa el Sistema en su operación diaria, la entrega se considera aceptada.",
    ]),
  ])

  // --- Obligaciones del Cliente ---
  const requisitos = c.requisitos.grupos.flatMap((g) => g.items.filter((r) => r.tipo).map((r) => sinPunto(limpio(r.que, false))))
  seccion("Obligaciones del Cliente", [
    lista([
      "Nombrar a un responsable del proyecto con facultad para decidir y aprobar entregas.",
      "Crear y pagar sus cuentas con terceros e invitar al Proveedor como administrador.",
      "Entregar a tiempo la información, los equipos y los accesos de la sección «Lo que necesitamos de tu lado» de la propuesta.",
      ...requisitos.map((r) => `${r}.`),
      "Dar el tiempo de su personal para la capacitación y las pruebas.",
    ]),
    p(
      `**Cuentas.** Las cuentas con terceros (tiendas de aplicaciones, servicios en la nube y dominio) son propiedad del Cliente. ${proveedor} opera como administrador invitado mientras dure la relación de desarrollo y mantenimiento, y nunca usa la contraseña del Cliente.`,
    ),
    p(
      `**Costos de terceros.** Los cubre el Cliente directamente. ${proveedor} no responde por cambios de precio, políticas, tiempos de revisión o fallas de esos servicios.`,
    ),
  ])

  // --- Licencia, propiedad y código fuente ---
  seccion("Licencia, propiedad y código fuente", [
    p(
      `El Sistema, su código fuente y su arquitectura son propiedad exclusiva de ${proveedor}. Este contrato otorga al Cliente una **licencia de uso perpetua y no exclusiva** para su propio negocio, condicionada al pago total del desarrollo${
        mensual.montoCentavos ? " y a estar al corriente en el servicio mensual" : ""
      }. La falta de pago suspende el derecho de uso hasta su regularización.`,
    ),
    p(
      `${proveedor} no está obligado a entregar el código fuente y puede reutilizar, adaptar y licenciar el Sistema o sus componentes para otros clientes, sin incluir datos ni información del Cliente.`,
    ),
    p(
      "El Cliente NO puede: copiar, clonar o reproducir el código fuente; modificar o hacer ingeniería inversa del Sistema; compartir credenciales o accesos con terceros; ni redistribuir, vender, alquilar o ceder el software a otros negocios. Otros negocios o dueños requieren su propio contrato y licencia.",
    ),
    p(
      "**Opción de código fuente.** Mientras esté al corriente de sus pagos, el Cliente puede adquirir en cualquier momento una de estas dos opciones, mediante un anexo firmado y un pago único previo a la entrega:",
    ),
    {
      tipo: "tabla",
      columnas: ["Opción", "Qué recibe el Cliente", "Precio"],
      anchos: [0.2, 0.52, 0.28],
      filas: [
        [
          "A. Copia del código con licencia interna",
          `Una copia del código fuente a la fecha de la compra, con derecho a usarlo, hospedarlo y modificarlo solo para su propio negocio. ${proveedor} conserva la propiedad y el derecho de reutilizarlo. El Cliente no puede venderlo ni cederlo.`,
          `${CODIGO_FUENTE.copia * 100} % del precio del desarrollo contratado a esa fecha (hoy ${$(Math.round(total * CODIGO_FUENTE.copia))})`,
        ],
        [
          "B. Cesión total de derechos",
          `La titularidad exclusiva de los derechos patrimoniales del Sistema. ${proveedor} deja de poder licenciarlo a otros clientes, salvo sus componentes genéricos y conocimientos previos.`,
          `${CODIGO_FUENTE.cesion * 100} % del precio del desarrollo contratado a esa fecha (hoy ${$(Math.round(total * CODIGO_FUENTE.cesion))})`,
        ],
      ],
    },
    lista([
      "El porcentaje se calcula sobre el precio de lista de todo el desarrollo contratado, incluidas las fases adicionales y sin bonificaciones.",
      `El código se entrega tal como está a esa fecha, sin credenciales ni cuentas de ${proveedor}.`,
      `La garantía${mensual.montoCentavos ? " y el servicio mensual no cubren" : " no cubre"} las partes modificadas por el Cliente o por terceros.`,
      ...(mensual.montoCentavos
        ? [
            `Con cualquiera de las dos opciones, el servicio mensual deja de ser condición de la licencia${plazoMinimo ? `; el plazo mínimo de ${plazoMinimo} meses ya contratado se mantiene` : ""}.`,
          ]
        : []),
    ]),
  ])

  // --- Garantía ---
  seccion("Garantía", [
    p(
      `${proveedor} corrige sin costo cualquier defecto de las funciones del Anexo A reportado dentro de los **${GARANTIA_DIAS} días naturales** siguientes a la entrega.${
        mensual.montoCentavos ? " Vencido ese plazo, la corrección de errores queda cubierta por el servicio mensual." : ""
      }`,
    ),
    p(
      `La garantía no cubre fallas causadas por los equipos, la red o la señal, por servicios de terceros, por datos capturados de forma incorrecta ni por modificaciones hechas por personas ajenas a ${proveedor}.`,
    ),
  ])

  // --- Caso de éxito ---
  if (esCasoDeExito) {
    seccion("Autorización de uso como caso de éxito", [
      p(`Aplica solo si el Cliente eligió la opción «Con ${minuscula(bonificacion.nombre || "bonificación")}».`),
      p(
        `El Cliente autoriza a ${proveedor} a usar, con fines de promoción comercial, su nombre y logotipo, fotografías, video y capturas del Sistema en operación sin datos sensibles, y un testimonio o cita del Cliente. La autorización es revocable mediante aviso por escrito con 30 días de anticipación, sin efecto retroactivo sobre material ya publicado.`,
      ),
    ])
  }

  // --- Datos, respaldos y confidencialidad ---
  seccion("Datos, respaldos y confidencialidad", [
    lista([
      "Todos los datos operativos que el Cliente capture en el Sistema son propiedad del Cliente.",
      `${proveedor} realiza respaldos automáticos diarios de la base de datos y entrega una exportación completa de los datos al término del contrato, sin costo, si el Cliente está al corriente de pagos.`,
      "Ambas partes mantienen confidencialidad sobre la información técnica, los datos de operación y los términos comerciales durante la vigencia del contrato y 2 años después.",
    ]),
    p(
      `**Datos personales.** El Cliente es el responsable de los datos personales de sus trabajadores y clientes; ${proveedor} los trata solo por encargo del Cliente y para operar el Sistema. Corresponde al Cliente contar con el aviso de privacidad y el consentimiento de sus trabajadores, incluido el rastreo de ubicación durante la jornada cuando el Sistema lo use, validados por su abogado. ${proveedor} no responde por reclamaciones laborales o de privacidad derivadas del uso que el Cliente dé al Sistema.`,
    ),
  ])

  // --- Límite de responsabilidad ---
  seccion("Límite de responsabilidad", [
    p(
      `El Sistema es una herramienta de control y registro. ${proveedor} no responde por mermas, faltantes, robos, pérdidas de venta ni por decisiones de negocio del Cliente, ni por daños indirectos o lucro cesante. En cualquier caso, su responsabilidad total se limita a lo pagado por el Cliente en los 12 meses anteriores al hecho que la origine.`,
    ),
  ])

  // --- Suspensión y terminación ---
  seccion("Suspensión y terminación", [
    p("**Durante el desarrollo:**"),
    lista([
      `Un atraso de más de 5 días hábiles en un pago recorre el calendario y faculta a ${proveedor} a pausar el trabajo.`,
      `Un atraso de más de 30 días naturales faculta a ${proveedor} a terminar el contrato, conservando los pagos recibidos.`,
      "Si el Cliente termina el contrato antes de la entrega, paga las etapas concluidas y la parte proporcional de la etapa en curso.",
    ]),
    ...(mensual.montoCentavos
      ? [
          p("**Durante el servicio mensual:**"),
          lista([
            `Un atraso de más de 5 días en la mensualidad faculta a ${proveedor} a suspender el acceso al Sistema hasta su regularización, sin liberar al Cliente de lo adeudado.`,
            `${plazoMinimo ? `Cumplido el plazo mínimo de ${plazoMinimo} meses, cualquiera` : "Cualquiera"} de las partes puede terminar el servicio con 30 días de aviso por escrito.`,
            ...(plazoMinimo
              ? ["Si el Cliente termina antes de cumplir el plazo mínimo, liquida las mensualidades restantes de ese plazo."]
              : []),
          ]),
        ]
      : []),
    p("El incumplimiento grave no subsanado en 15 días faculta a la otra parte a la terminación inmediata."),
  ])

  // --- Vigencia, firma y jurisdicción ---
  seccion("Vigencia, firma y jurisdicción", [
    p(
      `Este contrato entra en vigor a la fecha de firma y permanece vigente de forma indefinida, sujeto a las causas de terminación anteriores. Se rige por las leyes de los Estados Unidos Mexicanos; las partes se someten a los tribunales de ${PROVEEDOR.jurisdiccion}.`,
    ),
    p(
      "Las partes firman este contrato por medios electrónicos, con su firma autógrafa trazada en la página de la propuesta, y reconocen esa firma como propia. No constituye firma electrónica avanzada (e.firma). Cualquiera de las partes puede pedir que además se firme un ejemplar impreso.",
    ),
  ])

  const contacto = c.ficha.contactoNombre
  const firmas: FirmaContrato[] = [
    {
      rotulo: `Por ${proveedor}`,
      nombre: PROVEEDOR.representante,
      trazo: d.firmaDesarrollador?.trazo ?? null,
      nota: d.firmaDesarrollador ? `Firmó el ${fecha(d.firmaDesarrollador.en)}` : "",
    },
    ...(d.aceptacion && d.aceptacion.firmas.length > 0
      ? d.aceptacion.firmas.map((f) => ({
          rotulo: `Por ${d.clienteNombre}`,
          nombre: f.nombre,
          trazo: f.trazo,
          nota: `Firmó el ${fecha(d.aceptacion!.en)}`,
        }))
      : [{ rotulo: `Por ${d.clienteNombre}`, nombre: contacto || d.clienteNombre, trazo: null, nota: "Sin firmar" }]),
  ]

  const archivo = (d.proyectoNombre ?? d.clienteNombre)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

  return {
    titulo: "Contrato de Desarrollo, Licencia y Servicio",
    subtitulo: `${d.proyectoNombre ? `${d.proyectoNombre} · ` : ""}Propuesta ${d.folio}`,
    estado: d.aceptacion
      ? `Firmado el ${fecha(d.aceptacion.en)}`
      : "Ejemplar para lectura: aún sin firmar",
    firmado,
    partes: [
      { rotulo: "Proveedor", nombre: proveedor, detalle: `Representado por ${PROVEEDOR.representante}` },
      {
        rotulo: "Cliente",
        nombre: d.clienteNombre,
        detalle: contacto ? `Representado por ${contacto}` : "",
      },
    ],
    secciones: secciones.map((s, i) => ({ ...s, titulo: `${i + 1}. ${s.titulo}` })),
    firmas,
    nombreArchivo: `Contrato-${archivo || "proyecto"}-${d.folio}.pdf`,
  }
}
