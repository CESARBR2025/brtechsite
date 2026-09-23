import { HeroSection } from "@/src/ui/marketing/home/hero"
import { ProblemSection } from "@/src/ui/marketing/home/problem"
import { ServicesSection } from "@/src/ui/marketing/home/services"
import { ProyectosRecientesSection } from "@/src/ui/marketing/home/proyectos-recientes"
import { TestimonioSection } from "@/src/ui/marketing/home/testimonio"
import { ProcessSection } from "@/src/ui/marketing/home/process"
import { CTASection } from "@/src/ui/marketing/home/cta"
import { FAQSection } from "@/src/ui/marketing/faq"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <ProyectosRecientesSection />
      <TestimonioSection />
      <ProcessSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
