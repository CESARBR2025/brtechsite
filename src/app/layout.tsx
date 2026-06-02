import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/src/styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "BR TECH - Transformación Digital para PyMEs",
  description:
    "Automatización de procesos, e-commerce y sistemas personalizados que escalan con tu negocio.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden" style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
