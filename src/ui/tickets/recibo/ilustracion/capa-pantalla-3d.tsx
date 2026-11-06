"use client"

import { useEffect, useId, useRef } from "react"
import type { EscenaServicio } from "@/src/modules/tickets/application/escena-servicio"
import { escenaPantalla } from "./escena-pantalla"
import { homografia, LIENZO, PANTALLA_LOCAL, type Cuadrilatero } from "./geometria"

export function CapaPantalla3D({ escena, cuadrilatero, retraso = 0 }: {
  escena: EscenaServicio
  cuadrilatero: Cuadrilatero
  retraso?: number
}) {
  const capa = useRef<HTMLDivElement>(null)
  const lienzo = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    const elemento = capa.current
    if (!elemento) return
    const medir = () => {
      if (lienzo.current) lienzo.current.style.transform = `scale(${elemento.clientWidth / LIENZO.w})`
    }
    const observador = new ResizeObserver(medir)
    observador.observe(elemento)
    medir()
    return () => observador.disconnect()
  }, [])

  return (
    <div ref={capa} className="ilus-capa-3d" aria-hidden="true">
      <div ref={lienzo} className="ilus-lienzo">
        <div className="ilus-pantalla-3d" style={{
          width: PANTALLA_LOCAL.w, height: PANTALLA_LOCAL.h,
          transform: homografia(PANTALLA_LOCAL.w, PANTALLA_LOCAL.h, cuadrilatero),
        }}>
          <svg viewBox={`0 0 ${PANTALLA_LOCAL.w} ${PANTALLA_LOCAL.h}`} preserveAspectRatio="none">
            {escenaPantalla(escena, retraso, id)}
          </svg>
        </div>
      </div>
    </div>
  )
}
