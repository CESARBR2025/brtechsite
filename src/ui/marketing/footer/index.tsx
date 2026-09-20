import Image from "next/image"
import { Mail, MapPin } from "lucide-react"

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/cesar-ivan-barcenas-rosales-a74a83378/",
  },
  // TODO: Instagram — agregar la URL del perfil cuando esté disponible.
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="inline-flex rounded-xl bg-bg-dark px-4 py-3">
              <Image
                src="/logo.png"
                alt="BR TECH"
                width={566}
                height={191}
                className="h-9 w-auto"
              />
            </div>
            <p className="mt-3 max-w-md text-sm text-text-secondary">
              Diseñamos un software que se adapte a ti, a tu operación, a tu
              entorno.
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-background"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Contacto
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:barcenasrosalescesarivan@gmail.com"
                  className="flex min-w-0 items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="break-all">
                    barcenasrosalescesarivan@gmail.com
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                San Juan del Río, Querétaro
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-text-muted">
            &copy; {new Date().getFullYear()} BR TECH DS
          </p>
        </div>
      </div>
    </footer>
  )
}
