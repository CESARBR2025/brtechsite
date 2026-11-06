import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { tickets } from "@/src/modules/tickets/infrastructure/contenedor"
import { nombreDePila } from "@/src/ui/formato"
import { simboloSvgTexto } from "@/src/ui/marca/geometria-diafragma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const alt = "Nota de servicio · BR TECH Digital Systems"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ImagenNota({ params }: Props) {
  let nombre = ""
  let subtitulo = "Nota de servicio"

  try {
    const { slug } = await params
    const ticket = await tickets().obtenerTicketPublico.ejecutar(slug)
    if (ticket) {
      const caracteres = Array.from(nombreDePila(ticket.cliente.nombre))
      nombre = caracteres.slice(0, 18).join("") + (caracteres.length > 18 ? "…" : "")
      subtitulo = ticket.pagado
        ? "Tu pago está confirmado"
        : "Tu nota de servicio está lista"
    }
  } catch {
    // La vista previa conserva la marca si la nota no existe o no se puede consultar.
  }

  const fuente = await readFile(join(process.cwd(), "src/fonts/Poppins-SemiBold.ttf"))
  const simbolo = `data:image/svg+xml;base64,${Buffer.from(simboloSvgTexto()).toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: 72,
          gap: 64,
          backgroundColor: "#151127",
          backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(120, 54, 226, 0.35) 0%, rgba(120, 54, 226, 0) 70%)",
          color: "#FFFFFF",
          fontFamily: "Poppins",
          fontWeight: 600,
        }}
      >
        <img src={simbolo} width={240} height={240} alt="Símbolo de BR TECH" />
        <div style={{ display: "flex", flexDirection: "column", width: 752, gap: 24 }}>
          {nombre && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: 14,
                fontSize: Array.from(nombre).length > 13 ? 36 : 52,
                lineHeight: 1.2,
                letterSpacing: -1,
              }}
            >
              <span>Hola,</span>
              <span>{nombre}</span>
            </div>
          )}
          <div style={{ display: "flex", fontSize: nombre ? 28 : 52, lineHeight: 1.3 }}>
            {subtitulo}
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 22, color: "#F1EBFF" }}>
            BR TECH Digital Systems
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Poppins", data: fuente, weight: 600, style: "normal" }],
    },
  )
}
