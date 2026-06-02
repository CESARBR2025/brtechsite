import { Mail, MapPin, Clock, ArrowRight, ExternalLink } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    label: "Correo",
    value: "barcenasrosalescesarivan@gmail.com",
    href: "mailto:barcenasrosalescesarivan@gmail.com",
    action: "Enviar correo",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "San Juan del Río, Querétaro, MX",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun — Vie, 9:00 — 18:00",
  },
]

const stats = [
  { label: "Proyectos entregados", value: "+50" },
  { label: "Clientes satisfechos", value: "95%" },
  { label: "Respuesta promedio", value: "&lt; 4 h" },
]

const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
]

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <h3 className="text-base font-bold text-text-primary">
          Información de contacto
        </h3>
        <div className="mt-5 space-y-4">
          {contactInfo.map((item) => (
            <div key={item.label} className="group">
              {item.href ? (
                <a
                  href={item.href}
                  className="flex items-center gap-4 rounded-xl bg-bg-section p-4 transition-colors hover:bg-primary-light/50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-text-muted">{item.label}</p>
                    <p className="truncate text-sm font-medium text-text-primary">
                      {item.value}
                    </p>
                  </div>
                  {item.action && (
                    <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      {item.action}
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  )}
                </a>
              ) : (
                <div className="flex items-center gap-4 rounded-xl bg-bg-section p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">{item.label}</p>
                    <p className="text-sm font-medium text-text-primary">
                      {item.value}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <h3 className="text-base font-bold text-text-primary">
          Confianza que respalda
        </h3>
        <div className="mt-5 grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-bold text-primary">{s.value}</p>
              <p className="mt-0.5 text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}
