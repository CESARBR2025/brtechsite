"use client"

/**
 * Botón/enlace con reflejo especular en el borde, adaptado de React Bits
 * (SpecularButton). Un shader WebGL (ogl) dibuja un destello que gira hacia
 * el puntero y se enciende al acercarse.
 * Cambios respecto al original:
 * - Renderiza un <Link> si recibe `href`; el estilo (fondo, padding, radio) lo
 *   pone quien lo usa vía `className`.
 * - `ogl` se carga con import dinámico (chunk aparte).
 * - El loop de render solo corre en pantalla y mientras el destello está vivo.
 * - Dispositivos táctiles: barrido automático. `prefers-reduced-motion`:
 *   destello estático, sin animación.
 */

import { useEffect, useRef, type MouseEventHandler, type ReactNode, type Ref } from "react"
import Link from "next/link"

const PAD = 20

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = sdRoundedRect(p, uHalfSize, uRadius);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  // Trazo base oscuro pegado al borde (sensación de grosor)
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  // Destello simétrico: los bordes hacia/contra la luz lo reciben. La ventana
  // angular usa una normal elíptica para variar suave en los tramos rectos.
  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`

interface PropsShader {
  radius: number
  lineColor: string
  baseColor: string
  intensity: number
  shineSize: number
  shineFade: number
  thickness: number
  speed: number
  proximity: number
}

export interface BotonEspecularProps extends Partial<PropsShader> {
  children: ReactNode
  /** Si viene, se renderiza como enlace de Next. */
  href?: string
  className?: string
  onClick?: MouseEventHandler<HTMLElement>
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export function BotonEspecular({
  children,
  href,
  className = "",
  onClick,
  type = "button",
  disabled,
  radius = 9999,
  lineColor = "#ffffff",
  baseColor = "#471FA3",
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  proximity = 250,
}: BotonEspecularProps) {
  const elRef = useRef<HTMLElement>(null)
  const fxRef = useRef<HTMLSpanElement>(null)
  const propsRef = useRef<PropsShader>({} as PropsShader)

  useEffect(() => {
    propsRef.current = { radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, proximity }
  })

  useEffect(() => {
    const el = elRef.current
    const fx = fxRef.current
    if (!el || !fx) return

    let cancelado = false
    let limpiar = () => {}

    import("ogl").then(({ Renderer, Program, Mesh, Triangle, Color }) => {
      if (cancelado) return

      const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const tactil = window.matchMedia("(hover: none)").matches
      const autoAnimar = tactil && !reducido

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      let renderer: InstanceType<typeof Renderer>
      try {
        renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr })
      } catch {
        return // sin WebGL: el botón queda normal
      }
      const gl = renderer.gl
      gl.clearColor(0, 0, 0, 0)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      const geometry = new Triangle(gl)
      if (geometry.attributes.uv) delete geometry.attributes.uv

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uCenter: { value: [0, 0] },
          uHalfSize: { value: [1, 1] },
          uRadius: { value: 0 },
          uAngle: { value: 2.4 },
          uPx: { value: dpr },
          uLineColor: { value: [1, 1, 1] },
          uBaseColor: { value: [0.28, 0.12, 0.64] },
          uIntensity: { value: 1 },
          uShineSize: { value: 0.17 },
          uShineFade: { value: 0.7 },
          uThickness: { value: 1 },
          uBaseWidth: { value: dpr },
        },
      })
      const mesh = new Mesh(gl, { geometry, program })
      fx.appendChild(gl.canvas)

      const tam = { w: 1, h: 1 }
      const lineC = new Color()
      const baseC = new Color()

      let angle = 2.4
      let idleAngle = 2.4
      let bright = reducido ? 0.6 : 0
      let pointerAngle: number | null = null
      let proximityT = 0
      let visible = true
      let raf = 0
      let last = 0

      const pintar = () => {
        const p = propsRef.current
        lineC.set(p.lineColor)
        baseC.set(p.baseColor)
        program.uniforms.uAngle.value = angle
        program.uniforms.uRadius.value = Math.min(p.radius, Math.min(tam.w, tam.h) / 2) * dpr
        program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b]
        program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b]
        program.uniforms.uIntensity.value = p.intensity * bright
        program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180
        program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180
        program.uniforms.uThickness.value = p.thickness * dpr
        renderer.render({ scene: mesh })
      }

      const resize = () => {
        // Tamaño fraccional + centro explícito: el SDF queda pegado al borde CSS.
        const rect = el.getBoundingClientRect()
        tam.w = rect.width
        tam.h = rect.height
        renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2)
        program.uniforms.uCenter.value = [(PAD + rect.width / 2) * dpr, (PAD + rect.height / 2) * dpr]
        program.uniforms.uHalfSize.value = [(rect.width / 2) * dpr, (rect.height / 2) * dpr]
        if (!raf) pintar()
      }

      const frame = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05)
        last = now
        const p = propsRef.current

        idleAngle += p.speed * dt
        const target = !autoAnimar && pointerAngle != null ? pointerAngle : idleAngle
        const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
        angle += diff * (1 - Math.exp(-dt * 7))

        const brightTarget = autoAnimar ? 1 : proximityT
        bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8))

        pintar()

        // Se detiene cuando sale de pantalla o el destello ya se apagó.
        const apagado = !autoAnimar && proximityT === 0 && bright < 0.002
        if (!visible || apagado) {
          if (apagado) {
            bright = 0
            pintar()
          }
          raf = 0
          return
        }
        raf = requestAnimationFrame(frame)
      }

      const arrancar = () => {
        if (reducido || raf || !visible) return
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }

      const onPointerMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right)
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom)
        const dist = Math.hypot(dx, dy)
        if (dist === 0) {
          // Sobre el botón la luz se asienta en la diagonal y se mece con el cursor.
          const nx = (e.clientX - cx) / (rect.width / 2)
          const ny = (cy - e.clientY) / (rect.height / 2)
          pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15
        } else {
          pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx)
        }
        const t = Math.max(0, 1 - dist / Math.max(propsRef.current.proximity, 1))
        proximityT = t * t * (3 - 2 * t)
        if (proximityT > 0 || bright > 0.002) arrancar()
      }

      const ro = new ResizeObserver(resize)
      ro.observe(el)
      resize()

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible && autoAnimar) arrancar()
      })
      io.observe(el)

      if (!reducido && !autoAnimar) window.addEventListener("pointermove", onPointerMove, { passive: true })
      if (autoAnimar) arrancar()

      limpiar = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        io.disconnect()
        window.removeEventListener("pointermove", onPointerMove)
        if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas)
        gl.getExtension("WEBGL_lose_context")?.loseContext()
      }
    })

    return () => {
      cancelado = true
      limpiar()
    }
  }, [])

  const clases = `relative isolate ${className}`
  const contenido = (
    <>
      <span
        ref={fxRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 z-[1] [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
      />
      <span className="relative z-[2] inline-flex items-center gap-[inherit]">{children}</span>
    </>
  )

  if (href) {
    return (
      <Link
        ref={elRef as Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        className={clases}
      >
        {contenido}
      </Link>
    )
  }

  return (
    <button
      ref={elRef as Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clases}
    >
      {contenido}
    </button>
  )
}
