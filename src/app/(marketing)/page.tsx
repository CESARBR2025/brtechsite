import { HeroSection } from "@/src/ui/marketing/home/hero"
import { ProblemSection } from "@/src/ui/marketing/home/problem"
import { AboutSection } from "@/src/ui/marketing/home/about"
import { ProcessSection } from "@/src/ui/marketing/home/process"
import { ServicesSection } from "@/src/ui/marketing/home/services"
import { CasesSection } from "@/src/ui/marketing/home/cases"
import { StackSection } from "@/src/ui/marketing/home/stack"
import { CTASection } from "@/src/ui/marketing/home/cta"
import { FAQSection } from "@/src/ui/marketing/faq"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <AboutSection />
      <ProcessSection />
      <ServicesSection />

      <StackSection />
      <CTASection />
      <FAQSection />
    </>
  )
}
