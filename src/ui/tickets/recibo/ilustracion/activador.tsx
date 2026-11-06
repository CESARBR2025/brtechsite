"use client"

import { useSyncExternalStore, type ReactNode } from "react"

function suscribir(notificar: () => void) {
  window.addEventListener("brtech:entrada-fin", notificar)
  return () => window.removeEventListener("brtech:entrada-fin", notificar)
}

const entradaTerminada = () => window.__brtechEntradaFin === true
const duranteServidor = () => false

export function Activador({ children, siempre = false }: { children?: ReactNode; siempre?: boolean }) {
  const lista = useSyncExternalStore(suscribir, entradaTerminada, duranteServidor)
  return <div className="ilus" data-activa={siempre || lista ? "" : undefined}>{children}</div>
}
