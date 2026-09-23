"use client"

/**
 * Galería en acordeón, adaptada de React Bits (AccordionGallery).
 * Cambios respecto al original:
 * - Sin GSAP: flex-grow, inclinación, gris y desplazamiento son transiciones CSS.
 * - Paneles como <button> con aria-pressed; flechas del teclado para moverse.
 * - Hover solo con mouse (en táctil se activa con toque).
 * - next/image con `fill` y `sizes`.
 * - Móvil (< sm): acordeón vertical, sin inclinación ni desplazamiento.
 * - `prefers-reduced-motion`: cambia de panel sin animar.
 * - `ajuste: "contener"`: la imagen se muestra completa y centrada sobre un
 *   resplandor (p. ej. un mockup de celular con fondo transparente), sin recortar.
 */

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import Image from "next/image"

export interface ElementoGaleria {
  src: string
  alt: string
  etiqueta: string
  ajuste?: "contener"
}

interface Props {
  elementos: ElementoGaleria[]
  inicial?: number
  /** Fracción del ancho total que ocupa el panel activo. */
  proporcion?: number
  /** Alturas del contenedor (móvil vertical / sm+ horizontal). */
  alturas?: string
  className?: string
}

const GAP = 10
const INCLINACION = 8

export function GaleriaAcordeon({
  elementos,
  inicial = 0,
  proporcion = 0.52,
  alturas = "h-[560px] sm:h-[460px]",
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [activo, setActivo] = useState(inicial)
  const n = elementos.length
  const r = Math.min(Math.max(proporcion, 0.2), 0.9)
  const crecer = n > 1 ? (r * (n - 1)) / (1 - r) : 1

  // Tamaño de la imagen = el del panel abierto (+22%), para que no se deforme al animar.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const medir = () => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty("--ag-mw", `${Math.max(140, (rect.width - GAP * (n - 1)) * r * 1.22)}px`)
      el.style.setProperty("--ag-mh", `${Math.max(140, (rect.height - GAP * (n - 1)) * r * 1.22)}px`)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [n, r])

  const alTeclado = (i: number, e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      setActivo((i + 1) % n)
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      setActivo((i - 1 + n) % n)
    }
  }

  const transicion =
    "duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Galería del sistema en operación"
      className={`flex flex-col [perspective:1400px] sm:flex-row ${alturas} ${className}`}
      style={{ gap: GAP }}
    >
      {elementos.map((el, i) => {
        const esActivo = i === activo
        const giro = esActivo ? 0 : i < activo ? INCLINACION : -INCLINACION
        const deriva = Math.max(-1.5, Math.min(1.5, activo - i))
        return (
          <button
            key={el.src}
            type="button"
            aria-pressed={esActivo}
            aria-label={el.etiqueta}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActivo(i)}
            onClick={() => setActivo(i)}
            onFocus={() => setActivo(i)}
            onKeyDown={(e) => alTeclado(i, e)}
            className={`group relative min-h-0 min-w-0 flex-[1_1_0] cursor-pointer overflow-hidden rounded-2xl border border-line-dark bg-bg-deep outline-none transition-[flex-grow,transform,border-color] [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-primary max-sm:![transform:none] ${transicion} ${
              esActivo ? "border-line-dark-strong" : ""
            }`}
            style={
              {
                flexGrow: esActivo ? crecer : 1,
                transform: `rotateY(${giro}deg)`,
              } as CSSProperties
            }
          >
            {el.ajuste === "contener" ? (
              <span
                className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(120,54,226,0.28),transparent_60%)] transition-[filter] ${transicion} ${
                  esActivo ? "grayscale-0" : "grayscale"
                }`}
              >
                <span className="absolute inset-[6%]">
                  <Image
                    src={el.src}
                    alt={el.alt}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="select-none object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.7)]"
                    draggable={false}
                  />
                </span>
              </span>
            ) : (
              <span
                className={`absolute left-1/2 top-1/2 h-full w-[var(--ag-mw)] transition-[translate,filter] [translate:-50%_-50%] sm:[translate:calc(-50%_+_var(--ag-mw)*var(--ag-d))_-50%] max-sm:h-[var(--ag-mh)] max-sm:w-full ${transicion} ${
                  esActivo ? "grayscale-0" : "grayscale"
                }`}
                style={{ "--ag-d": esActivo ? 0 : deriva * 0.03 } as CSSProperties}
              >
                <Image
                  src={el.src}
                  alt={el.alt}
                  fill
                  sizes="(min-width: 640px) 60vw, 100vw"
                  className="select-none object-cover"
                  draggable={false}
                />
              </span>
            )}

            {/* Oscurece los paneles cerrados y da contraste a la etiqueta */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-45% to-bg-deep/80 transition-[background-color] ${transicion} ${
                esActivo ? "bg-transparent" : "bg-bg-deep/35"
              }`}
            />

            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-5 left-5 right-5 flex items-center gap-3 transition-[opacity,translate] ${transicion} ${
                esActivo ? "translate-x-0 opacity-100" : "-translate-x-3.5 opacity-0"
              }`}
            >
              <span className="h-[26px] w-[3px] flex-none rounded-full bg-primary shadow-[0_0_12px_rgba(120,54,226,0.7)]" />
              <span className="truncate text-base font-semibold text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.55)] sm:text-lg">
                {el.etiqueta}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
