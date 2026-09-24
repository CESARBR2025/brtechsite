import type { MetadataRoute } from "next"
import { SITIO_URL } from "@/src/ui/marketing/datos-contacto"

// Solo el sitio de marketing es público; panel, tickets y propuestas no se indexan.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel", "/t/", "/propuesta/"],
    },
    sitemap: `${SITIO_URL}/sitemap.xml`,
  }
}
