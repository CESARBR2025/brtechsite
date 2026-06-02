import { HeroSection } from "@/src/features/home/hero"
import { ProblemSection } from "@/src/features/home/problem"
import { AboutSection } from "@/src/features/home/about"
import { ProcessSection } from "@/src/features/home/process"
import { ServicesSection } from "@/src/features/home/services"
import { CasesSection } from "@/src/features/home/cases"
import { StackSection } from "@/src/features/home/stack"
import { CTASection } from "@/src/features/home/cta"
import { FAQSection } from "@/src/features/faq"

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
