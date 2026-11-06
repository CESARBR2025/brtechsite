"use client"

import { useSyncExternalStore } from "react"
import { OndasGradiente } from "@/src/ui/primitivos/ondas-gradiente"

function suscribir(notificar: () => void) {
  window.addEventListener("brtech:entrada-fin", notificar)
  return () => window.removeEventListener("brtech:entrada-fin", notificar)
}

const entradaTerminada = () => window.__brtechEntradaFin === true
const duranteServidor = () => false

export function OndasDiferidas() {
  const lista = useSyncExternalStore(suscribir, entradaTerminada, duranteServidor)
  return lista ? <OndasGradiente /> : null
}
