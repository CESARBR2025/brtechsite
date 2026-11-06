import { WHATSAPP } from "@/src/ui/marketing/datos-contacto"

export function AyudaWhatsApp() {
  return <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-[22px] py-3 text-sm text-text-secondary shadow-card">¿Dudas con tu servicio?<a className="inline-flex min-h-11 items-center font-semibold text-primary hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-primary" href={`https://wa.me/${WHATSAPP.telefono.replace("+", "")}`} target="_blank" rel="noopener noreferrer">Escríbenos</a></div>
}
