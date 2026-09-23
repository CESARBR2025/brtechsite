import type { Metadata } from "next"
import { ServiciosHero } from "@/src/ui/marketing/servicios/hero"
import { ServiceList } from "@/src/ui/marketing/servicios/service-list"
import { ServiciosProceso } from "@/src/ui/marketing/servicios/proceso"
import { CTAFinal } from "@/src/ui/marketing/cta-final"

export const metadata: Metadata = {
  title: "Servicios | BR TECH Digital Systems",
  description:
    "Software multisucursal para restaurantes, control de inventarios y páginas web, hechos a la medida de tu operación.",
}

export default function ServiciosPage() {
  return (
    <>
      <ServiciosHero />
      <ServiceList />
      <ServiciosProceso />
      <CTAFinal
        etiqueta="Asesoría sin costo"
        titulo="¿No sabes cuál elegir?"
        texto="Te asesoramos sin costo. En 30 minutos identificamos qué necesita tu negocio y te damos una cotización clara."
        boton="Agendar asesoría gratuita"
      />
    </>
  )
}
