import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/src/styles/globals.css"
import { EMPRESA, SITIO_URL } from "@/src/ui/marketing/datos-contacto"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="es" className={inter.variable}>
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
