import type { Metadata } from "next"
import { ContactoHero } from "@/src/ui/marketing/contacto/hero"
import { ContactForm } from "@/src/ui/marketing/contacto/form"
import { ContactInfo } from "@/src/ui/marketing/contacto/info"

export const metadata: Metadata = {
  title: "Contacto | BR TECH Digital Systems",
  description:
    "Cuéntanos sobre tu negocio: asesoría sin costo, respuesta en menos de 24 horas y propuesta en 48 horas.",
}

export default function ContactoPage() {
  return (
    <>
      <ContactoHero />
      <section className="relative bg-bg-dark pb-24 sm:pb-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16 lg:px-8">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
    </>
  )
}
