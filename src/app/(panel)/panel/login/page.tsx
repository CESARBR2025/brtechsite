import { Suspense } from "react"
import Image from "next/image"
import { FormularioLogin } from "./formulario-login"

export default function PaginaLogin() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-dark px-4 py-16">
      {/* Rejilla de fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.07)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Punto de luz — esquina superior izquierda */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-primary/50 blur-2xl" />
      <div className="pointer-events-none absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_28px_10px_rgba(124,58,237,0.6)]" />

      {/* Punto de luz — esquina inferior derecha */}
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary/45 blur-2xl" />
      <div className="pointer-events-none absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_28px_10px_rgba(124,58,237,0.55)]" />

      <div className="relative w-full max-w-sm">
        <div className="relative mt-12 rounded-2xl border border-white/10 bg-white/5 px-8 pb-8 pt-16 shadow-2xl backdrop-blur-sm">
          {/* Filo superior iluminado */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          {/* Logo montado sobre el borde superior, centrado */}
          <Image
            src="/logo.png"
            alt="BR TECH"
            width={411}
            height={147}
            priority
            className="absolute left-1/2 top-0 h-16 w-auto -translate-x-1/2 -translate-y-1/2"
          />

          <h1 className="text-2xl font-bold text-white">
            Panel{" "}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              BR TECH
            </span>
          </h1>
          <p className="mt-1.5 text-sm text-text-muted">
            Ingresa la contraseña para generar y administrar tickets de servicio.
          </p>

          <Suspense>
            <FormularioLogin />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-text-muted">
          BR TECH DS · Sistema de tickets
        </p>
      </div>
    </main>
  )
}
