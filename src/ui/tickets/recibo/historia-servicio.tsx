"use client"

import { useEffect, useRef } from "react"
import { Check, ClipboardList, Stethoscope, Wrench } from "lucide-react"
import type { TicketPublicoDTO } from "@/src/modules/tickets/application/dtos"
import { ETIQUETA_PIEZA } from "@/src/modules/tickets/domain/clasificacion"
import { textosRecibo } from "./textos-recibo"

const ICONOS = [ClipboardList, Stethoscope, Wrench]
const GESTOS = ["golpe", "latido", "giro"]

export function HistoriaServicio({ ticket }: { ticket: TicketPublicoDTO }) {
  const raiz = useRef<HTMLDivElement>(null)
  const { pasos } = textosRecibo(ticket)
  useEffect(() => {
    const historia = raiz.current
    if (!historia) return
    const movimiento = window.matchMedia("(prefers-reduced-motion: reduce)")
    let cuadro = 0
    function actualizar() {
      cuadro = 0
      if (!historia) return
      const r = historia.getBoundingClientRect(), meta = window.innerHeight * .62
      historia.dataset.animada = ""
      historia.style.setProperty("--p", String(movimiento.matches ? 1 : Math.min(1, Math.max(0, (meta - r.top - 26) / Math.max(1, r.height - 52)))))
      historia.querySelectorAll<HTMLElement>(".exp-paso").forEach((paso) => {
        if (movimiento.matches || paso.getBoundingClientRect().top + 26 < meta) paso.dataset.activo = ""
      })
    }
    const programar = () => { if (!cuadro) cuadro = requestAnimationFrame(actualizar) }
    actualizar()
    window.addEventListener("scroll", programar, { passive: true })
    window.addEventListener("resize", programar)
    window.addEventListener("brtech:entrada-fin", programar)
    movimiento.addEventListener("change", programar)
    return () => {
      cancelAnimationFrame(cuadro)
      window.removeEventListener("scroll", programar)
      window.removeEventListener("resize", programar)
      window.removeEventListener("brtech:entrada-fin", programar)
      movimiento.removeEventListener("change", programar)
    }
  }, [ticket])
  if (!pasos.length) return null
  return <div ref={raiz} className="exp-historia">
    {pasos.length > 1 && <div aria-hidden="true" className="exp-riel"><div className="exp-llenado" /></div>}
    {pasos.map(({ indice, titulo, texto }) => {
      const Icono = ICONOS[indice]
      return <div className={`exp-paso exp-${GESTOS[indice]}`} key={indice}>
        <div className="exp-nodo"><Icono aria-hidden="true" /></div>
        <div className="exp-texto min-w-0">
          <h3>{titulo}</h3><p className="whitespace-pre-wrap break-words">{texto}</p>
          {indice === 1 && ticket.escena.falla && <div className="exp-chips"><span className="exp-chip exp-chip-ambar">Falla en {ETIQUETA_PIEZA[ticket.escena.falla].toLocaleLowerCase("es")}</span></div>}
          {indice === 2 && ticket.escena.chips.length > 0 && <div className="exp-chips">{ticket.escena.chips.map((chip) => <span key={chip} className="exp-chip exp-chip-violeta"><Check aria-hidden="true" />{chip}</span>)}</div>}
        </div>
      </div>
    })}
  </div>
}
