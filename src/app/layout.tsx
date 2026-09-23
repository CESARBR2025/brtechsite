import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/src/styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "BR TECH Digital Systems",
  description:
    "Software a la medida para empresas: sistemas multisucursal para restaurantes, control de inventarios y páginas web.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
