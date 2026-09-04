import { ContactoHero } from "@/src/ui/marketing/contacto/hero"
import { ContactForm } from "@/src/ui/marketing/contacto/form"
import { ContactInfo } from "@/src/ui/marketing/contacto/info"

export default function ContactoPage() {
  return (
    <>
      <ContactoHero />
      <section className="bg-bg-section py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="lg:flex-[3]">
              <ContactForm />
            </div>
            <div className="lg:flex-[2]">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
