import type { Viewport } from "next"
import { Navbar } from "@/src/ui/marketing/navbar"
import { Footer } from "@/src/ui/marketing/footer"
import { BotonWhatsApp } from "@/src/ui/marketing/boton-whatsapp"
import { BarraMovil } from "@/src/ui/marketing/barra-movil"
import { Analitica } from "@/src/ui/analitica"

// El color de la barra de estado del celular acompaña al hero oscuro
export const viewport: Viewport = { themeColor: "#000000" }

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BotonWhatsApp />
      <BarraMovil />
      <Analitica />
    </>
  )
}
