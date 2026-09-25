import { escaparHtml } from "@/src/modules/contacto/infrastructure/plantilla-correo-contacto"
import type { RespuestasCompletas } from "../domain/notificador-respuestas"

/**
 * Correo que recibe BR TECH cuando el cliente termina de responder las
 * "Preguntas al cliente". Mismo lenguaje que el de contacto: tablas y estilos
 * en línea; todo lo que escribió el cliente se escapa.
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

function unaLinea(texto: string, max = 70): string {
  const limpio = texto.replace(/\s+/g, " ").trim()
  return limpio.length > max ? `${limpio.slice(0, max - 1)}…` : limpio
}

const conSaltos = (t: string) => escaparHtml(t).replace(/\r?\n/g, "<br />")

export interface CorreoRespuestas {
  asunto: string
  html: string
  texto: string
}

export function plantillaCorreoRespuestas(
  d: RespuestasCompletas,
  urls: { panel: string; diagnostico: string },
): CorreoRespuestas {
  const quien = d.contactoNombre || d.clienteNombre
  const proyecto = d.proyectoNombre ?? d.clienteNombre
  const accion = d.esActualizacion ? "actualizó sus respuestas" : "respondió todas las preguntas"
  const asunto = `🟣 ${unaLinea(quien, 40)} ${accion} · ${d.folio}`

  // Agrupadas en el orden en que aparecen
  const grupos = new Map<string, RespuestasCompletas["preguntas"]>()
  for (const p of d.preguntas) grupos.set(p.grupo, [...(grupos.get(p.grupo) ?? []), p])

  let n = 0
  const bloques = [...grupos.entries()]
    .map(([grupo, lista]) => {
      const filas = lista
        .map((p) => {
          n++
          return `<tr><td style="padding:16px 0;border-top:1px solid ${COLOR.borde};font-family:${FUENTE};">
      <div style="font-size:14px;font-weight:700;line-height:1.45;color:${COLOR.texto};"><span style="color:${COLOR.marca};">${n}.</span> ${conSaltos(p.texto)}</div>
      <div style="margin-top:8px;background:${COLOR.seccion};border-left:4px solid ${COLOR.marca};border-radius:10px;padding:12px 16px;font-size:15px;line-height:1.6;color:${COLOR.textoSecundario};">${conSaltos(p.respuesta)}</div>
    </td></tr>`
        })
        .join("\n")
      const titulo = grupo
        ? `<div style="margin-top:28px;font-size:11px;font-weight:700;letter-spacing:2px;color:${COLOR.marca};text-transform:uppercase;">${escaparHtml(grupo)}</div>`
        : ""
      return `${titulo}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">${filas}</table>`
    })
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
    <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:${COLOR.marca};">PREGUNTAS AL CLIENTE</div>
    <div style="font-size:24px;font-weight:700;line-height:1.25;color:${COLOR.texto};margin-top:10px;">${escaparHtml(quien)} ${accion}</div>
    <div style="font-size:14px;color:${COLOR.textoTenue};margin-top:4px;">${escaparHtml(d.clienteNombre)} · ${escaparHtml(proyecto)} · ${d.preguntas.length} respuestas</div>

    ${bloques}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;"><tr>
      <td bgcolor="${COLOR.marca}" style="background:${COLOR.marca};border-radius:999px;">
        <a href="${escaparHtml(urls.panel)}" style="display:inline-block;padding:14px 28px;font-family:${FUENTE};font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:999px;">Abrir en el panel &rarr;</a>
      </td>
    </tr></table>
    <div style="font-size:13px;line-height:1.5;color:${COLOR.textoTenue};margin-top:14px;">Diagnóstico del cliente: <a href="${escaparHtml(urls.diagnostico)}" style="color:${COLOR.marca};">${escaparHtml(urls.diagnostico)}</a></div>
  </td></tr>

  <tr><td bgcolor="${COLOR.oscuro}" style="background:${COLOR.oscuro};border-radius:0 0 16px 16px;padding:18px 32px;font-family:${FUENTE};font-size:12px;color:#9CA3AF;text-align:center;">
    BR TECH Digital Systems &middot; Diagnóstico de tu proyecto
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  let m = 0
  const texto = [
    `${quien} ${accion} · ${d.folio}`,
    `${d.clienteNombre} · ${proyecto}`,
    "",
    ...[...grupos.entries()].flatMap(([grupo, lista]) => [
      ...(grupo ? [grupo.toUpperCase(), ""] : []),
      ...lista.flatMap((p) => [`${++m}. ${p.texto}`, `   → ${p.respuesta}`, ""]),
    ]),
    `Panel: ${urls.panel}`,
    `Diagnóstico: ${urls.diagnostico}`,
  ].join("\n")

  return { asunto, html, texto }
}
