import { HeroSection } from "@/src/ui/marketing/home/hero"
import { ProblemSection } from "@/src/ui/marketing/home/problem"
import { ServicesSection } from "@/src/ui/marketing/home/services"
import { ProyectosRecientesSection } from "@/src/ui/marketing/home/proyectos-recientes"
import { TestimonioSection } from "@/src/ui/marketing/home/testimonio"
import { ProcessSection } from "@/src/ui/marketing/home/process"
import { CTAFinal } from "@/src/ui/marketing/cta-final"
import { FAQSection } from "@/src/ui/marketing/faq"
import { EMPRESA } from "@/src/ui/marketing/datos-contacto"
import { metadatosPagina, negocioJsonLd } from "@/src/ui/marketing/metadatos"

export const metadata = metadatosPagina({
  titulo: EMPRESA.nombre,
  descripcion: EMPRESA.descripcion,
  ruta: "/",
})

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(negocioJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <ProyectosRecientesSection />
      <TestimonioSection />
      <ProcessSection />
      <FAQSection />
      <CTAFinal />
    </>
  )
}
