import { ContactoHero } from "@/src/features/contacto/hero"
import { ContactForm } from "@/src/features/contacto/form"
import { ContactInfo } from "@/src/features/contacto/info"

export default function ContactoPage() {
  return (
    <>
      <ContactoHero />
      <section className="bg-bg-section py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
