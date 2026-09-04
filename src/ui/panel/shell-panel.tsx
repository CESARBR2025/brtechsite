"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  ExternalLink,
  FilePlus2,
  LogOut,
  Menu,
  ReceiptText,
  X,
} from "lucide-react"
import { cerrarSesion } from "@/src/app/(panel)/panel/acciones"

const NAV = [
  { href: "/panel", label: "Tickets", icon: ReceiptText, exact: true },
  { href: "/panel/nuevo", label: "Nuevo ticket", icon: FilePlus2, exact: false },
]

/**
 * Panel de un solo operador: identidad fija. Si algún día hay usuarios reales,
 * esto vendría de un caso de uso de sesión.
 */
const USUARIO = { nombre: "BR TECH", rol: "Administrador", iniciales: "BR" }

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const activo = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              activo
                ? "bg-primary-light text-primary"
                : "text-text-muted hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-white/10 hover:text-white"
      >
        <ExternalLink className="h-4 w-4" />
        Ver sitio
      </a>
    </nav>
  )
}

function ContenidoBarra({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link href="/panel" className="flex items-center gap-2 px-2">
        <Image
          src="/logo.png"
          alt="BR TECH"
          width={100}
          height={100}
          className="h-11 w-auto"
        />
      </Link>
      <div className="mt-6 flex-1">{children}</div>
      <p className="px-3 text-[11px] text-text-muted/70">BR TECH DS · Tickets</p>
    </>
  )
}

function PildoraUsuario() {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex items-center gap-2.5 rounded-full border border-border bg-surface py-1 pl-1 pr-2.5 transition-colors hover:bg-bg-section"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-xs font-bold text-white shadow-sm">
          {USUARIO.iniciales}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-xs font-semibold leading-tight text-text-primary">
            {USUARIO.nombre}
          </span>
          <span className="block text-[11px] leading-tight text-text-muted">
            {USUARIO.rol}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-text-muted transition-transform ${
            abierto ? "rotate-180" : ""
          }`}
        />
      </button>

      {abierto && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setAbierto(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-elevated">
            <div className="border-b border-border px-3 py-2 sm:hidden">
              <p className="text-xs font-semibold text-text-primary">
                {USUARIO.nombre}
              </p>
              <p className="text-[11px] text-text-muted">{USUARIO.rol}</p>
            </div>
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-section"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export function ShellPanel({ children }: { children: React.ReactNode }) {
  const [drawer, setDrawer] = useState(false)

  return (
    <div className="min-h-screen bg-bg-section">
      {/* Sidebar fijo — escritorio */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-bg-dark p-4 lg:flex">
        <ContenidoBarra>
          <NavLinks />
        </ContenidoBarra>
      </aside>

      {/* Drawer — móvil */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawer(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-bg-dark p-4">
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="absolute right-3 top-3 rounded-md p-1.5 text-text-muted hover:bg-white/10 hover:text-white"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
            <ContenidoBarra>
              <NavLinks onNavigate={() => setDrawer(false)} />
            </ContenidoBarra>
          </aside>
        </div>
      )}

      {/* Columna de contenido */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="rounded-md p-2 text-text-secondary hover:bg-bg-section lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-text-primary">
              Panel de tickets
            </span>
          </div>
          <PildoraUsuario />
        </header>

        <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
