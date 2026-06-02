import { ServiciosHero } from "@/src/features/servicios/hero"
import { ServiceList } from "@/src/features/servicios/service-list"
import { ServiciosCTA } from "@/src/features/servicios/cta"

export default function ServiciosPage() {
  return (
    <>
      <ServiciosHero />
      <ServiceList />
      <ServiciosCTA />
    </>
  )
}
