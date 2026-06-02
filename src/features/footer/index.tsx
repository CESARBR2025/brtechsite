"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

const socialLinks = [
  { label: "Facebook", href: "#" },
  { label: "X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "LinkedIn", href: "#" },
]

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "/contacto" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="BR TECH"
                width={40}
                height={40}
                className="h-8 w-auto"
              />

            </div>
            <p className="mt-3 max-w-md text-sm text-text-secondary">
              Transformación digital para PyMEs. Automatización, e-commerce y
              sistemas personalizados que escalan con tu negocio.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-background"
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Contacto
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="mailto:hola@brtech.com"
                  className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  <Mail className="h-4 w-4" />
                  hola@brtech.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+525512345678"
                  className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  <Phone className="h-4 w-4" />
                  +52 55 1234 5678
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                Ciudad de México, MX
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Newsletter
            </h4>
            <p className="mt-4 text-sm text-text-secondary">
              Recibe tips de transformación digital
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-3 flex gap-2"
            >
              <input
                type="email"
                placeholder="tu@email.com"
                className="min-w-0 flex-1 rounded-md border border-border px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:shadow-focus focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                OK
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Finpay | Privacy Policy | Terms |
            Contact
          </p>
        </div>
      </div>
    </footer>
  )
}
