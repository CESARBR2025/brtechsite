"use client"

/**
 * Superficie "liquid glass" adaptada de React Bits (GlassSurface).
 * - Chrome/Edge: refracción real con filtro SVG (feDisplacementMap) y
 *   aberración cromática en los bordes.
 * - Safari/Firefox: no soportan filtros SVG en backdrop-filter; caen a un
 *   vidrio esmerilado (blur + saturate).
 * Cambios respecto al original: sin detección de modo oscuro (tinte fijo por
 * prop), detección de soporte con useSyncExternalStore (sin desajuste de
 * hidratación) e id de filtro saneado para usarse dentro de url(#…).
 */

import { useCallback, useEffect, useId, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react"

type Canal = "R" | "G" | "B"
type Soporte = "svg" | "blur" | "ninguno"

export interface GlassSurfaceProps {
  children?: ReactNode
  className?: string
  contentClassName?: string
  style?: CSSProperties
  borderRadius?: number
  /** Color del tinte como canales RGB separados por espacio, p. ej. "21 17 39". */
  tint?: string
  /** Opacidad del tinte (0–1). */
  tintOpacity?: number
  borderWidth?: number
  brightness?: number
  opacity?: number
  blur?: number
  displace?: number
  saturation?: number
  distortionScale?: number
  redOffset?: number
  greenOffset?: number
  blueOffset?: number
  xChannel?: Canal
  yChannel?: Canal
  mixBlendMode?: CSSProperties["mixBlendMode"]
}

let soporteCache: Soporte | null = null

function detectarSoporte(): Soporte {
  if (soporteCache) return soporteCache
  soporteCache = calcularSoporte()
  return soporteCache
}

function calcularSoporte(): Soporte {
  const ua = navigator.userAgent
  const esWebkit = /Safari/.test(ua) && !/Chrome/.test(ua)
  const esFirefox = /Firefox/.test(ua)
  if (!esWebkit && !esFirefox) {
    const div = document.createElement("div")
    div.style.backdropFilter = "url(#glass-probe)"
    if (div.style.backdropFilter !== "") return "svg"
  }
  const blurOk = CSS.supports("backdrop-filter", "blur(10px)") || CSS.supports("-webkit-backdrop-filter", "blur(10px)")
  return blurOk ? "blur" : "ninguno"
}

const sinSuscripcion = () => () => {}

export function GlassSurface({
  children,
  className = "",
  contentClassName = "",
  style,
  borderRadius = 20,
  tint = "255 255 255",
  tintOpacity = 0,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
}: GlassSurfaceProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const filterId = `glass-filter-${uid}`
  const redGradId = `red-grad-${uid}`
  const blueGradId = `blue-grad-${uid}`

  // En servidor (y en la hidratación) se usa "ninguno"; luego el valor real del navegador.
  const soporte = useSyncExternalStore(sinSuscripcion, detectarSoporte, () => "ninguno" as const)

  const containerRef = useRef<HTMLDivElement>(null)
  const feImageRef = useRef<SVGFEImageElement>(null)
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null)
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null)
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null)
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null)

  const actualizarMapa = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    const w = rect?.width || 400
    const h = rect?.height || 200
    const edge = Math.min(w, h) * (borderWidth * 0.5)
    const rx = Math.min(borderRadius, h / 2, w / 2)

    const svg = `
      <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${w}" height="${h}" fill="black"></rect>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edge}" y="${edge}" width="${w - edge * 2}" height="${h - edge * 2}" rx="${rx}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `
    feImageRef.current?.setAttribute("href", `data:image/svg+xml,${encodeURIComponent(svg)}`)
  }, [borderWidth, borderRadius, redGradId, blueGradId, mixBlendMode, brightness, opacity, blur])

  useEffect(() => {
    actualizarMapa()
    for (const [ref, offset] of [
      [redChannelRef, redOffset],
      [greenChannelRef, greenOffset],
      [blueChannelRef, blueOffset],
    ] as const) {
      ref.current?.setAttribute("scale", String(distortionScale + offset))
      ref.current?.setAttribute("xChannelSelector", xChannel)
      ref.current?.setAttribute("yChannelSelector", yChannel)
    }
    gaussianBlurRef.current?.setAttribute("stdDeviation", String(displace))
  }, [actualizarMapa, distortionScale, redOffset, greenOffset, blueOffset, xChannel, yChannel, displace])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => actualizarMapa())
    ro.observe(el)
    return () => ro.disconnect()
  }, [actualizarMapa])

  const fondo = `rgb(${tint} / ${tintOpacity})`
  const base: CSSProperties = { ...style, borderRadius, backgroundColor: fondo }

  let estilos: CSSProperties
  if (soporte === "svg") {
    estilos = {
      ...base,
      backdropFilter: `url(#${filterId}) saturate(${saturation})`,
      boxShadow: `0 0 2px 1px color-mix(in oklch, white, transparent 75%) inset,
                  0 0 10px 4px color-mix(in oklch, white, transparent 90%) inset,
                  0 4px 16px rgba(17, 17, 26, 0.08),
                  0 16px 48px rgba(17, 17, 26, 0.12)`,
    }
  } else if (soporte === "blur") {
    const filtro = `blur(16px) saturate(${Math.max(saturation, 1.6)})`
    estilos = {
      ...base,
      backdropFilter: filtro,
      WebkitBackdropFilter: filtro,
      boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.12),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.18),
                  0 4px 16px rgba(17, 17, 26, 0.08),
                  0 16px 48px rgba(17, 17, 26, 0.12)`,
    }
  } else {
    // Sin soporte (o antes de hidratar): tinte casi opaco para asegurar legibilidad.
    estilos = {
      ...base,
      backgroundColor: `rgb(${tint} / ${Math.max(tintOpacity, 0.85)})`,
      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.12)",
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative isolate overflow-hidden transition-[background-color,box-shadow] duration-300 ease-out ${className}`}
      style={estilos}
    >
      <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-0" aria-hidden="true">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" result="dispRed" />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
            <feDisplacementMap ref={greenChannelRef} in="SourceGraphic" in2="map" result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      <div className={`relative z-10 rounded-[inherit] ${contentClassName}`}>{children}</div>
    </div>
  )
}
