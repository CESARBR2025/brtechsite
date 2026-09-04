import { Suspense } from "react"
import Image from "next/image"
import { Sparkles } from "lucide-react"
import { FormularioLogin } from "./formulario-login"

export default function PaginaLogin() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-dark px-4 py-16">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.07)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="BR TECH"
            width={120}
            height={120}
            className="h-16 w-auto"
            priority
          />
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-white/5 to-primary/10 px-4 py-1.5 text-xs font-medium text-text-muted shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Acceso interno
          </div>

          <h1 className="mt-4 text-2xl font-bold text-white">
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
