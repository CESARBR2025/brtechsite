import { ServiciosHero } from "@/src/ui/marketing/servicios/hero"
import { ServiceList } from "@/src/ui/marketing/servicios/service-list"
import { ServiciosCTA } from "@/src/ui/marketing/servicios/cta"

export default function ServiciosPage() {
  return (
    <>
      <ServiciosHero />
      <ServiceList />
      <ServiciosCTA />
    </>
  )
}
