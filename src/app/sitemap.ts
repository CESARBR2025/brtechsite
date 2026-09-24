import type { MetadataRoute } from "next"
import { SITIO_URL } from "@/src/ui/marketing/datos-contacto"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITIO_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITIO_URL}/servicios`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITIO_URL}/contacto`, changeFrequency: "yearly", priority: 0.6 },
  ]
}
