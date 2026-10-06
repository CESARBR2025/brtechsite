import { WHATSAPP } from "@/src/ui/marketing/datos-contacto"
import { evento } from "@/src/ui/analitica"

// Botón flotante de WhatsApp: el canal más directo para agendar una consulta.
// Usa el degradado de marca en lugar del verde de WhatsApp (DESIGNS.md manda).
// Solo desde sm: en celular lo reemplaza la barra inferior (barra-movil.tsx), que no tapa texto.
export function BotonWhatsApp() {
  return (
    <a
      href={WHATSAPP.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      {...evento("whatsapp", { origen: "flotante" })}
      className="group fixed bottom-5 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-white shadow-lg shadow-primary/30 ring-1 ring-white/15 outline-none transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40 focus-visible:ring-2 focus-visible:ring-primary-light active:scale-95 motion-safe:animate-aparecer sm:bottom-6 sm:right-6 sm:flex"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d={WHATSAPP.path} />
      </svg>
    </a>
  )
}
