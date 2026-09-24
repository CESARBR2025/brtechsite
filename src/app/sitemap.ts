import type { MetadataRoute } from "next"
import { SITIO_URL } from "@/src/ui/marketing/datos-contacto"
import { proyectos } from "@/src/ui/marketing/proyectos/datos"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITIO_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITIO_URL}/servicios`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITIO_URL}/contacto`, changeFrequency: "yearly", priority: 0.6 },
    ...proyectos.map((p) => ({
      url: `${SITIO_URL}/proyectos/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
