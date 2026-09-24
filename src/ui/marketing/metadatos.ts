import type { Metadata } from "next"
import { EMPRESA, REDES, SITIO_URL, WHATSAPP } from "@/src/ui/marketing/datos-contacto"

// Imagen para compartir (src/app/opengraph-image.png). Se declara explícita:
// cuando una página define openGraph, Next descarta la imagen heredada.
const imagen = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${EMPRESA.nombre} — Tu negocio es diferente. Tu software también debería serlo.`,
}

// Metadatos de una página pública: título, canónica y vista previa al compartir.
export function metadatosPagina({
  titulo,
  descripcion,
  ruta,
}: {
  titulo: string
  descripcion: string
  ruta: string
}): Metadata {
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      type: "website",
      locale: "es_MX",
      siteName: EMPRESA.nombre,
      url: ruta,
      title: titulo,
      description: descripcion,
      images: [imagen],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [imagen],
    },
  }
}

// Datos estructurados del negocio (schema.org) para buscadores y mapas.
export const negocioJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITIO_URL}/#negocio`,
  name: EMPRESA.nombre,
  description: EMPRESA.descripcion,
  url: SITIO_URL,
  logo: `${SITIO_URL}/logo.png`,
  image: `${SITIO_URL}/opengraph-image.png`,
  telephone: WHATSAPP.telefono,
  address: {
    "@type": "PostalAddress",
    addressLocality: EMPRESA.ciudad,
    addressRegion: EMPRESA.estado,
    addressCountry: EMPRESA.pais,
  },
  areaServed: { "@type": "Country", name: "México" },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  founder: {
    "@type": "Person",
    name: EMPRESA.fundador,
    jobTitle: "Fundador",
    sameAs: [REDES.instagram, REDES.linkedin],
  },
  hasMap: REDES.google,
  sameAs: [REDES.google, REDES.linkedin, REDES.instagram],
}
