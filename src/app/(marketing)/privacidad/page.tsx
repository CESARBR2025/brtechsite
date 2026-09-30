import { metadatosPagina } from "@/src/ui/marketing/metadatos"
import { AvisoPrivacidad } from "@/src/ui/marketing/privacidad"

export const metadata = metadatosPagina({
  titulo: "Aviso de privacidad | BR TECH Digital Systems",
  descripcion:
    "Qué datos personales recabamos en el sitio, para qué los usamos, con quién los compartimos y cómo ejercer tus derechos.",
  ruta: "/privacidad",
})

export default function PrivacidadPage() {
  return <AvisoPrivacidad />
}
