import type { MensajeContacto } from "../domain/mensaje-contacto"

/**
 * Correo que recibe BR TECH cuando alguien escribe en el formulario de contacto.
 * HTML de correo: tablas + estilos en línea (Gmail/Outlook ignoran <style> y
 * layouts modernos). Todo lo que escribe el visitante se escapa: sin esto,
 * cualquiera podría inyectar HTML (enlaces, botones falsos) en el correo.
 */

const COLOR = {
  marca: "#7836E2",
  marcaProfunda: "#471FA3",
  marcaClara: "#C9B5F5",
  oscuro: "#151127",
  fondo: "#F4F2FA",
  texto: "#111827",
  textoSecundario: "#374151",
  textoTenue: "#6B7280",
  seccion: "#F9FAFB",
  borde: "#E5E7EB",
}

const FUENTE = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

export function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Una sola línea, sin saltos (evita inyección de cabeceras) y acotada. */
function paraAsunto(texto: string, max = 80): string {
  const limpio = texto.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim()
  return limpio.length > max ? `${limpio.slice(0, max - 1)}…` : limpio
}

function formatearFecha(fecha: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(fecha)
}

export interface CorreoContacto {
  asunto: string
  html: string
  texto: string
}

export function plantillaCorreoContacto(mensaje: MensajeContacto, fecha: Date = new Date()): CorreoContacto {
  const nombre = escaparHtml(mensaje.nombre)
  const email = escaparHtml(mensaje.email)
  const cuerpo = escaparHtml(mensaje.mensaje).replace(/\r?\n/g, "<br />")
  const primerNombre = escaparHtml(mensaje.nombre.split(/\s+/)[0] ?? mensaje.nombre)
  const cuando = escaparHtml(formatearFecha(fecha))
  const vistaPrevia = escaparHtml(paraAsunto(mensaje.mensaje, 110))
  // URL-codificado (seguro dentro del atributo href); la @ se deja legible
  const mailto = `mailto:${encodeURIComponent(mensaje.email).replace(/%40/g, "@")}`
  const responder = `${mailto}?subject=${encodeURIComponent("Re: Tu mensaje a BR TECH Digital Systems")}`

  const asunto = `🟣 Nuevo contacto · ${paraAsunto(mensaje.nombre, 60)}`

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Nuevo contacto · ${nombre}</title>
</head>
<body style="margin:0;padding:0;background:${COLOR.fondo};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${vistaPrevia}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.fondo}" style="background:${COLOR.fondo};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

  <!-- Encabezado de marca -->
  <tr><td bgcolor="${COLOR.oscuro}" style="background:${COLOR.oscuro};border-radius:16px 16px 0 0;padding:26px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-family:${FUENTE};">
        <div style="font-size:20px;font-weight:800;letter-spacing:1px;color:#FFFFFF;">BR TECH</div>
        <div style="font-size:10px;font-weight:600;letter-spacing:3px;color:${COLOR.marcaClara};margin-top:2px;">DIGITAL SYSTEMS</div>
      </td>
      <td align="right" style="font-family:${FUENTE};">
        <span style="display:inline-block;background:${COLOR.marca};color:#FFFFFF;font-size:12px;font-weight:700;padding:7px 14px;border-radius:999px;">Nuevo contacto</span>
      </td>
    </tr></table>
  </td></tr>
  <tr><td height="4" bgcolor="${COLOR.marca}" style="height:4px;line-height:4px;font-size:0;background:${COLOR.marca};background-image:linear-gradient(90deg,${COLOR.marcaProfunda},${COLOR.marca},${COLOR.marcaClara});">&nbsp;</td></tr>

  <!-- Cuerpo -->
  <tr><td bgcolor="#FFFFFF" style="background:#FFFFFF;padding:32px;font-family:${FUENTE};">
    <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:${COLOR.marca};">MENSAJE DESDE EL SITIO WEB</div>
    <div style="font-size:24px;font-weight:700;line-height:1.25;color:${COLOR.texto};margin-top:10px;">${nombre}</div>
    <div style="font-size:14px;color:${COLOR.textoTenue};margin-top:4px;">Escribió el ${cuando}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;border-top:1px solid ${COLOR.borde};border-bottom:1px solid ${COLOR.borde};">
      <tr>
        <td style="padding:14px 0;font-size:13px;color:${COLOR.textoTenue};width:90px;">Nombre</td>
        <td style="padding:14px 0;font-size:15px;color:${COLOR.texto};font-weight:600;">${nombre}</td>
      </tr>
      <tr>
        <td style="padding:14px 0;font-size:13px;color:${COLOR.textoTenue};border-top:1px solid ${COLOR.borde};">Correo</td>
        <td style="padding:14px 0;font-size:15px;border-top:1px solid ${COLOR.borde};"><a href="${mailto}" style="color:${COLOR.marca};text-decoration:none;font-weight:600;">${email}</a></td>
      </tr>
    </table>

    <div style="font-size:13px;color:${COLOR.textoTenue};margin-top:24px;">Mensaje</div>
    <div style="margin-top:8px;background:${COLOR.seccion};border-left:4px solid ${COLOR.marca};border-radius:12px;padding:18px 20px;font-size:15px;line-height:1.65;color:${COLOR.textoSecundario};">${cuerpo}</div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;"><tr>
      <td bgcolor="${COLOR.marca}" style="background:${COLOR.marca};border-radius:999px;">
        <a href="${responder}" style="display:inline-block;padding:14px 28px;font-family:${FUENTE};font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:999px;">Responder a ${primerNombre} &rarr;</a>
      </td>
    </tr></table>
    <div style="font-size:13px;line-height:1.5;color:${COLOR.textoTenue};margin-top:14px;">También puedes contestar este correo directamente: la respuesta le llega a ${email}.</div>
  </td></tr>

  <!-- Pie -->
  <tr><td bgcolor="${COLOR.oscuro}" style="background:${COLOR.oscuro};border-radius:0 0 16px 16px;padding:18px 32px;font-family:${FUENTE};font-size:12px;color:#9CA3AF;text-align:center;">
    BR TECH Digital Systems &middot; Formulario de contacto del sitio web
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  const texto = [
    "NUEVO CONTACTO · BR TECH Digital Systems",
    "",
    `Nombre: ${mensaje.nombre}`,
    `Correo: ${mensaje.email}`,
    `Fecha: ${formatearFecha(fecha)}`,
    "",
    "Mensaje:",
    mensaje.mensaje,
    "",
    "Responde este correo para contestarle directamente.",
  ].join("\n")

  return { asunto, html, texto }
}
