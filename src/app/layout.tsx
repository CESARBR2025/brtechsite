import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import localFont from "next/font/local"
import "@/src/styles/globals.css"
import { EMPRESA, SITIO_URL } from "@/src/ui/marketing/datos-contacto"

// Texto y títulos: Poppins (no es variable: se cargan los pesos que se usan)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

// Título de los heros (font-hero). Clash Display de Fontshare, autoalojada:
// licencia ITF Free Font License en src/fonts/ClashDisplay-LICENSE.txt
const clashDisplay = localFont({
  src: "../fonts/ClashDisplay-Semibold.woff2",
  weight: "600",
  variable: "--font-clash-display",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
  title: EMPRESA.nombre,
  description: EMPRESA.descripcion,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${poppins.variable} ${clashDisplay.variable}`}>
      {/* Extensiones del navegador (p. ej. ColorZilla) agregan atributos al body
          antes de hidratar; solo se ignoran las diferencias de atributos del body. */}
      <body
        className="min-h-screen bg-background font-sans antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
