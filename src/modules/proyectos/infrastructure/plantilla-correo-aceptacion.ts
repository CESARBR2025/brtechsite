import { escaparHtml } from "@/src/modules/contacto/infrastructure/plantilla-correo-contacto"
import type { ContratoParaCliente, PropuestaAceptada } from "../domain/puertos"

/**
 * Correo que recibe BR TECH cuando el cliente acepta la propuesta. Mismo
 * lenguaje que el de las respuestas del diagnóstico: tablas y estilos en
 * línea; todo lo que escribió el cliente se escapa.
 */

const COLOR = {
  marca: "#7836E2",
  marcaProfunda: "#471FA3",
  marcaClara: "#C9B5F5",
  oscuro: "#151127",
  fondo: "#F4F2FA",
  texto: "#111827",
  textoTenue: "#6B7280",
  exito: "#10B981",
  exitoFondo: "#D1FAE5",
}

const FUENTE = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

export interface CorreoAceptacion {
  asunto: string
  html: string
  texto: string
}

function dinero(centavos: number, moneda: string): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: moneda }).format(centavos / 100)
}

function fechaHora(d: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(d)
}

export function plantillaCorreoAceptacion(
  d: PropuestaAceptada,
  urls: { panel: string; propuesta: string },
): CorreoAceptacion {
  const proyecto = d.proyectoNombre ?? d.clienteNombre
  const asunto = `✅ ${d.clienteNombre} aceptó la propuesta · ${d.folio}`
  const total = dinero(d.totalCentavos, d.moneda)
  const cuando = fechaHora(d.aceptadaEn)

  const filas = (
    [
      ["Proyecto", proyecto],
      ["Aceptó", d.aceptadaPor],
      ["Fecha", cuando],
      ["Inversión", d.bonificacion ? `${total} (con ${d.bonificacion.toLowerCase()})` : total],
      ["Su correo", d.correoCliente ?? "No lo dejó"],
      ["Contrato", d.contrato ? "Adjunto en PDF" : "No se pudo generar; descárgalo de la propuesta"],
    ] as const
  )
    .map(
      ([k, v]) => `<tr>
      <td style="padding:10px 0;border-top:1px solid #E5E7EB;font-family:${FUENTE};font-size:13px;color:${COLOR.textoTenue};width:110px;">${k}</td>
      <td style="padding:10px 0;border-top:1px solid #E5E7EB;font-family:${FUENTE};font-size:15px;font-weight:600;color:${COLOR.texto};">${escaparHtml(v)}</td>
    </tr>`,
    )
    .join("\n")

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${escaparHtml(asunto)}</title>
</head>
<body style="margin:0;padding:0;background:${COLOR.fondo};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.fondo}" style="background:${COLOR.fondo};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

  <tr><td bgcolor="${COLOR.oscuro}" style="background:${COLOR.oscuro};border-radius:16px 16px 0 0;padding:26px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-family:${FUENTE};">
        <div style="font-size:20px;font-weight:800;letter-spacing:1px;color:#FFFFFF;">BR TECH</div>
        <div style="font-size:10px;font-weight:600;letter-spacing:3px;color:${COLOR.marcaClara};margin-top:2px;">DIGITAL SYSTEMS</div>
      </td>
      <td align="right" style="font-family:${FUENTE};">
        <span style="display:inline-block;background:${COLOR.marca};color:#FFFFFF;font-size:12px;font-weight:700;padding:7px 14px;border-radius:999px;">${escaparHtml(d.folio)}</span>
      </td>
    </tr></table>
  </td></tr>
  <tr><td height="4" bgcolor="${COLOR.marca}" style="height:4px;line-height:4px;font-size:0;background:${COLOR.marca};background-image:linear-gradient(90deg,${COLOR.marcaProfunda},${COLOR.marca},${COLOR.marcaClara});">&nbsp;</td></tr>

  <tr><td bgcolor="#FFFFFF" style="background:#FFFFFF;padding:32px;font-family:${FUENTE};">
    <span style="display:inline-block;background:${COLOR.exitoFondo};color:${COLOR.exito};font-size:11px;font-weight:700;letter-spacing:2px;padding:6px 12px;border-radius:999px;">PROPUESTA ACEPTADA</span>
    <div style="font-size:24px;font-weight:700;line-height:1.25;color:${COLOR.texto};margin-top:14px;">${escaparHtml(d.clienteNombre)} aceptó la propuesta</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">${filas}</table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;"><tr>
      <td bgcolor="${COLOR.marca}" style="background:${COLOR.marca};border-radius:999px;">
        <a href="${escaparHtml(urls.panel)}" style="display:inline-block;padding:14px 28px;font-family:${FUENTE};font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:999px;">Abrir en el panel &rarr;</a>
      </td>
    </tr></table>
    <div style="font-size:13px;line-height:1.5;color:${COLOR.textoTenue};margin-top:14px;">Propuesta: <a href="${escaparHtml(urls.propuesta)}" style="color:${COLOR.marca};">${escaparHtml(urls.propuesta)}</a></div>
  </td></tr>

  <tr><td bgcolor="${COLOR.oscuro}" style="background:${COLOR.oscuro};border-radius:0 0 16px 16px;padding:18px 32px;font-family:${FUENTE};font-size:12px;color:#9CA3AF;text-align:center;">
    BR TECH Digital Systems &middot; Propuesta de proyecto
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  const texto = [
    `${d.clienteNombre} aceptó la propuesta · ${d.folio}`,
    "",
    `Proyecto: ${proyecto}`,
    `Aceptó: ${d.aceptadaPor}`,
    `Fecha: ${cuando}`,
    `Inversión: ${total}${d.bonificacion ? ` (con ${d.bonificacion.toLowerCase()})` : ""}`,
    `Su correo: ${d.correoCliente ?? "No lo dejó"}`,
    "",
    `Panel: ${urls.panel}`,
    `Propuesta: ${urls.propuesta}`,
  ].join("\n")

  return { asunto, html, texto }
}

/**
 * Correo que recibe el cliente al firmar: las gracias, el resumen de lo que
 * aceptó y su contrato adjunto en PDF.
 */
export function plantillaCorreoContrato(
  d: ContratoParaCliente,
  urls: { propuesta: string; contrato: string },
): CorreoAceptacion {
  const proyecto = d.proyectoNombre ?? d.clienteNombre
  const asunto = `Tu contrato de ${proyecto} · ${d.folio}`
  const total = dinero(d.totalCentavos, d.moneda)

  const filas = (
    [
      ["Proyecto", proyecto],
      ["Firmó", d.firmantes],
      ["Inversión", total],
      ["Folio", d.folio],
    ] as const
  )
    .map(
      ([k, v]) => `<tr>
      <td style="padding:10px 0;border-top:1px solid #E5E7EB;font-family:${FUENTE};font-size:13px;color:${COLOR.textoTenue};width:110px;">${k}</td>
      <td style="padding:10px 0;border-top:1px solid #E5E7EB;font-family:${FUENTE};font-size:15px;font-weight:600;color:${COLOR.texto};">${escaparHtml(v)}</td>
    </tr>`,
    )
    .join("\n")

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${escaparHtml(asunto)}</title>
</head>
<body style="margin:0;padding:0;background:${COLOR.fondo};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.fondo}" style="background:${COLOR.fondo};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

  <tr><td bgcolor="${COLOR.oscuro}" style="background:${COLOR.oscuro};border-radius:16px 16px 0 0;padding:26px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-family:${FUENTE};">
        <div style="font-size:20px;font-weight:800;letter-spacing:1px;color:#FFFFFF;">BR TECH</div>
        <div style="font-size:10px;font-weight:600;letter-spacing:3px;color:${COLOR.marcaClara};margin-top:2px;">DIGITAL SYSTEMS</div>
      </td>
      <td align="right" style="font-family:${FUENTE};">
        <span style="display:inline-block;background:${COLOR.marca};color:#FFFFFF;font-size:12px;font-weight:700;padding:7px 14px;border-radius:999px;">${escaparHtml(d.folio)}</span>
      </td>
    </tr></table>
  </td></tr>
  <tr><td height="4" bgcolor="${COLOR.marca}" style="height:4px;line-height:4px;font-size:0;background:${COLOR.marca};background-image:linear-gradient(90deg,${COLOR.marcaProfunda},${COLOR.marca},${COLOR.marcaClara});">&nbsp;</td></tr>

  <tr><td bgcolor="#FFFFFF" style="background:#FFFFFF;padding:32px;font-family:${FUENTE};">
    <span style="display:inline-block;background:${COLOR.exitoFondo};color:${COLOR.exito};font-size:11px;font-weight:700;letter-spacing:2px;padding:6px 12px;border-radius:999px;">CONTRATO FIRMADO</span>
    <div style="font-size:24px;font-weight:700;line-height:1.25;color:${COLOR.texto};margin-top:14px;">Gracias por tu confianza</div>
    <div style="font-size:15px;line-height:1.6;color:#374151;margin-top:12px;">Recibimos tu firma y ya es oficial: arrancamos <strong>${escaparHtml(proyecto)}</strong> juntos. En este correo va adjunto tu contrato en PDF, con la opción que elegiste y las firmas de ambas partes. Guárdalo: es tu respaldo de lo acordado.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">${filas}</table>
    <div style="font-size:15px;line-height:1.6;color:#374151;margin-top:20px;">El siguiente paso es la semana 0: te escribimos para coordinar el anticipo y la creación de tus cuentas.</div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;"><tr>
      <td bgcolor="${COLOR.marca}" style="background:${COLOR.marca};border-radius:999px;">
        <a href="${escaparHtml(urls.contrato)}" style="display:inline-block;padding:14px 28px;font-family:${FUENTE};font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:999px;">Ver mi contrato &rarr;</a>
      </td>
    </tr></table>
    <div style="font-size:13px;line-height:1.5;color:${COLOR.textoTenue};margin-top:14px;">Tu propuesta: <a href="${escaparHtml(urls.propuesta)}" style="color:${COLOR.marca};">${escaparHtml(urls.propuesta)}</a></div>
  </td></tr>

  <tr><td bgcolor="${COLOR.oscuro}" style="background:${COLOR.oscuro};border-radius:0 0 16px 16px;padding:18px 32px;font-family:${FUENTE};font-size:12px;color:#9CA3AF;text-align:center;">
    BR TECH Digital Systems &middot; brtechds.com
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  const texto = [
    "Gracias por tu confianza",
    "",
    `Recibimos tu firma: arrancamos ${proyecto} juntos. En este correo va adjunto tu contrato en PDF, con la opción que elegiste y las firmas de ambas partes.`,
    "",
    `Proyecto: ${proyecto}`,
    `Firmó: ${d.firmantes}`,
    `Inversión: ${total}`,
    `Folio: ${d.folio}`,
    "",
    "El siguiente paso es la semana 0: te escribimos para coordinar el anticipo y la creación de tus cuentas.",
    "",
    `Contrato: ${urls.contrato}`,
    `Propuesta: ${urls.propuesta}`,
    "",
    "BR TECH Digital Systems",
  ].join("\n")

  return { asunto, html, texto }
}
