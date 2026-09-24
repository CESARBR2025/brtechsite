"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowRight } from "lucide-react"
import { GlassSurface } from "@/src/ui/primitivos/glass-surface"
import { BotonEspecular } from "@/src/ui/primitivos/boton-especular"

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Contacto", href: "/contacto" },
]

// bg-dark (#151127) en canales RGB para el tinte del vidrio
const TINTE_BG_DARK = "21 17 39"

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mobileOpen])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const tabClass = (href: string) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${focusRing} ${
      isActive(href)
        ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
        : "text-white/65 hover:bg-white/5 hover:text-white"
    }`

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <div
        className={`mx-auto transition-[max-width] duration-500 ease-out ${
          scrolled ? "max-w-4xl" : "max-w-5xl"
        }`}
      >
        <GlassSurface
          borderRadius={28}
          tint={TINTE_BG_DARK}
          tintOpacity={scrolled || mobileOpen ? 0.72 : 0.4}
          saturation={1.5}
          brightness={50}
          opacity={0.93}
          blur={11}
          distortionScale={-160}
        >
          <div className="flex h-14 items-center justify-between gap-4 pl-5 pr-2">
            <Link href="/" className={`flex shrink-0 items-center rounded-full ${focusRing}`}>
              <Image
                src="/logo.png"
                alt="BR TECH"
                width={566}
                height={191}
                priority
                className="h-8 w-auto"
              />
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={tabClass(item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <BotonEspecular
              href="/contacto"
              className={`group hidden items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(120,54,226,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] transition-colors hover:bg-primary-hover md:inline-flex ${focusRing}`}
            >
              Agendar consulta
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </BotonEspecular>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white md:hidden ${focusRing}`}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
              aria-controls="menu-movil"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Menú móvil: se despliega dentro del mismo vidrio */}
          <div
            id="menu-movil"
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
              mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
            inert={!mobileOpen}
          >
            <div className="overflow-hidden">
              <div className="border-t border-white/10 px-3 pb-3 pt-2">
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={tabClass(item.href)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <Link
                  href="/contacto"
                  onClick={() => setMobileOpen(false)}
                  className={`group mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(120,54,226,0.8)] transition-colors hover:bg-primary-hover ${focusRing}`}
                >
                  Agendar consulta
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </GlassSurface>
      </div>
    </header>
  )
}
