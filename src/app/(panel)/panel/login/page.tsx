import { Suspense } from "react"
import { FormularioLogin } from "./formulario-login"

export default function PaginaLogin() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-card">
        <h1 className="text-xl font-bold text-text-primary">Panel BR TECH</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Ingresa la contraseña para continuar.
        </p>
        <Suspense>
          <FormularioLogin />
        </Suspense>
      </div>
    </main>
  )
}
