import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const columnas = [
  {
    titulo: "Navegación",
    enlaces: [
      { label: "Inicio", href: "/" },
      { label: "Servicios", href: "/servicios" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    titulo: "Servicios",
    enlaces: [
      { label: "Sistema POS para restaurantes", href: "/servicios#sistema-pos-para-restaurantes" },
      { label: "Control de inventarios", href: "/servicios#control-de-inventarios" },
      { label: "Páginas web", href: "/servicios#tu-negocio-digital" },
    ],
  },
]

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/cesar-ivan-barcenas-rosales-a74a83378/",
    // Marca oficial (lucide-react ya no incluye íconos de marca)
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/cesarbr_dev/",
    // Glifo relleno (evenodd): marco redondeado, lente y punto
    path: "M8 2h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6zM8 4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H8zM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10zM12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6zM17.5 5.25a1.25 1.25 0 1 1 0 2.5a1.25 1.25 0 0 1 0-2.5z",
  },
]

const enlace =
  "rounded-sm text-sm text-white/65 transition-colors hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-primary"

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-bg-deep">
      {/* Filo de luz superior + resplandor */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="absolute left-1/2 top-0 h-48 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/logo.png"
              alt="BR TECH Digital Systems"
              width={566}
              height={191}
              className="h-10 w-auto"
            />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              Diseñamos software que se adapta a ti, a tu operación y a tu
              entorno.
            </p>
            <Link
              href="/contacto"
              className="group mt-6 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-white outline-none transition-colors hover:text-primary-light focus-visible:ring-2 focus-visible:ring-primary"
            >
              Agendar consulta
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {columnas.map((col) => (
            <nav key={col.titulo} aria-label={col.titulo}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/55">
                {col.titulo}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.enlaces.map((e) => (
                  <li key={e.href}>
                    <Link href={e.href} className={enlace}>
                      {e.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/55">
              Contacto
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              <li>
                <Link href="/contacto" className={enlace}>
                  Escríbenos
                </Link>
              </li>
              <li>San Juan del Río, Querétaro</li>
              <li>Lun — Vie, 9:00 — 18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-center justify-between gap-4 border-t border-line-dark py-6 sm:flex-row">
          <p className="text-xs text-white/55">
            &copy; {new Date().getFullYear()} BR TECH Digital Systems
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line-dark text-white/65 outline-none transition-colors hover:border-line-dark-strong hover:bg-surface-dark-hover hover:text-white focus-visible:ring-2 focus-visible:ring-primary"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d={s.path} fillRule="evenodd" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
