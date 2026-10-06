import { metadatosPagina } from "@/src/ui/marketing/metadatos"
import { ContactoHero } from "@/src/ui/marketing/contacto/hero"
import { ContactForm } from "@/src/ui/marketing/contacto/form"
import { ContactInfo } from "@/src/ui/marketing/contacto/info"

export const metadata = metadatosPagina({
  titulo: "Contacto | BR TECH Digital Systems",
  descripcion:
    "Cuéntanos sobre tu negocio: asesoría sin costo, respuesta en menos de 24 horas y propuesta en 48 horas.",
  ruta: "/contacto",
})

export default async function ContactoPage({ searchParams }: PageProps<"/contacto">) {
  // ?interes=<id> llega desde "Cotiza este servicio" y preselecciona la opción
  const { interes } = await searchParams

  return (
    <>
      <ContactoHero />
      {/* Tarjeta a dos paneles que se monta sobre el borde del hero (flow-root evita que el margen negativo arrastre la sección) */}
      <section className="relative flow-root bg-bg-section px-4 pb-12 sm:px-6 sm:pb-32 lg:px-8">
        <div className="relative z-10 mx-auto -mt-12 grid max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_40px_80px_-40px_rgba(71,31,163,0.45)] sm:-mt-20 lg:grid-cols-[1.3fr_0.7fr]">
          <ContactForm interesInicial={typeof interes === "string" ? interes : undefined} />
          <ContactInfo />
        </div>
      </section>
    </>
  )
}
