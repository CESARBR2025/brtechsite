"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { Download, Share, SquarePlus, X } from "lucide-react"

/** Registra el service worker del panel (solo en producción). */
export function RegistrarServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return
    navigator.serviceWorker.register("/sw.js", { scope: "/panel/" }).catch(() => {
      /* sin service worker el panel funciona igual, solo sin página offline */
    })
  }, [])
  return null
}

interface EventoInstalar extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

function yaInstalada(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function esIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

/**
 * Botón "Instalar app". En Android/Chrome usa el aviso nativo; en iPhone,
 * donde no existe, explica cómo agregarla desde el menú Compartir.
 * No se muestra si ya se abrió como app instalada.
 */
const sinSuscripcion = () => () => {}

export function InstalarApp({ onNavigate }: { onNavigate?: () => void }) {
  const [evento, setEvento] = useState<EventoInstalar | null>(null)
  const [instalada, setInstalada] = useState(false)
  const [ayudaIOS, setAyudaIOS] = useState(false)
  // En el servidor no hay navegador: se asume "no mostrar" y se corrige al hidratar
  const iosSinInstalar = useSyncExternalStore(
    sinSuscripcion,
    () => esIOS() && !yaInstalada(),
    () => false,
  )
  const modo = instalada ? "oculto" : iosSinInstalar ? "ios" : evento ? "nativo" : "oculto"

  useEffect(() => {
    const alAviso = (e: Event) => {
      e.preventDefault()
      setEvento(e as EventoInstalar)
    }
    const alInstalar = () => setInstalada(true)
    window.addEventListener("beforeinstallprompt", alAviso)
    window.addEventListener("appinstalled", alInstalar)
    return () => {
      window.removeEventListener("beforeinstallprompt", alAviso)
      window.removeEventListener("appinstalled", alInstalar)
    }
  }, [])

  if (modo === "oculto") return null

  async function instalar() {
    if (modo === "ios") {
      setAyudaIOS(true)
      return
    }
    if (!evento) return
    await evento.prompt()
    const { outcome } = await evento.userChoice
    if (outcome === "accepted") setInstalada(true)
    setEvento(null)
    onNavigate?.()
  }

  return (
    <>
      <button
        type="button"
        onClick={instalar}
        className="flex w-full items-center gap-3 rounded-lg border border-primary/40 bg-primary/15 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/30"
      >
        <Download className="h-4 w-4 text-primary-light" />
        Instalar en tu celular
      </button>

      {ayudaIOS && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center" onClick={() => setAyudaIOS(false)}>
          <div
            role="dialog"
            aria-label="Cómo instalar en iPhone"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-modal"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-semibold text-text-primary">Instálala en tu iPhone</h2>
              <button
                type="button"
                onClick={() => setAyudaIOS(false)}
                className="rounded-full p-1 text-text-muted hover:bg-bg-section"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-text-secondary">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <Share className="h-4 w-4" />
                </span>
                Toca <strong className="text-text-primary">Compartir</strong> en la barra de Safari.
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <SquarePlus className="h-4 w-4" />
                </span>
                Elige <strong className="text-text-primary">Agregar a inicio</strong>.
              </li>
            </ol>
            <p className="mt-4 text-xs text-text-muted">
              Aparecerá el ícono de BR TECH en tu pantalla de inicio y se abrirá como app.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
