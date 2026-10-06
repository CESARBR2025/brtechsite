"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { WHATSAPP } from "@/src/ui/marketing/datos-contacto"
import { evento } from "@/src/ui/analitica"

/*
 * Barra de acción inferior, solo en celular (< sm): "Agendar consulta" + WhatsApp,
 * como la pestaña de acción de una app. Aparece al salir del hero, se esconde
 * cuando el footer entra en pantalla (para no tapar los enlaces) y no se muestra
 * en /contacto, donde ya está el formulario. Respeta el área segura del iPhone.
 */
export function BarraMovil() {
  const pathname = usePathname()
  const [pasoElHero, setPasoElHero] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    const alScroll = () => setPasoElHero(window.scrollY > window.innerHeight * 0.7)
    alScroll()
    window.addEventListener("scroll", alScroll, { passive: true })
    return () => window.removeEventListener("scroll", alScroll)
  }, [])

  useEffect(() => {
    const footer = document.querySelector("footer")
    if (!footer) return
    const obs = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting), { threshold: 0.05 })
    obs.observe(footer)
    return () => obs.disconnect()
  }, [pathname])

  const visible = pasoElHero && !footerVisible && pathname !== "/contacto"

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-300 ease-out sm:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 rounded-[1.75rem] border border-white/10 bg-bg-dark/90 p-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <Link
          href="/contacto"
          {...evento("agendar-consulta", { origen: "barra-movil" })}
          className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-hover text-sm font-semibold text-white shadow-lg shadow-primary/30 outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary-light active:scale-[0.98]"
        >
          Agendar consulta
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <a
          href={WHATSAPP.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
          {...evento("whatsapp", { origen: "barra-movil" })}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary-light active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d={WHATSAPP.path} />
          </svg>
        </a>
      </div>
    </div>
  )
}
