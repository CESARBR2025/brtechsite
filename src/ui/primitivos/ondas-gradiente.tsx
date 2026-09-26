"use client"

/**
 * Fondo "ondas de gradiente", adaptado de React Bits (GradientWaves): un campo
 * de olas en raymarching que se desvanece en bruma hacia el horizonte.
 * Shaders sin cambios. Cambios respecto al original (mismo criterio que VeloOscuro):
 * - Colores de marca por defecto: todo violeta (bruma violeta intenso, olas #9D4DFF, crestas violeta claro).
 * - Resolución interna reducida y ~30 fps: el raymarching es costoso y el
 *   resultado es difuso, no se nota.
 * - Paralaje con el puntero escuchado en la ventana (el texto del hero queda
 *   encima del canvas); en pantallas táctiles no aplica.
 * - `prefers-reduced-motion`: pinta un solo cuadro fijo, sin animar ni paralaje.
 * - Sin WebGL 2 queda el fondo CSS del contenedor.
 * - Se pausa fuera de pantalla y con la pestaña oculta; aparece con fundido.
 */

import { useEffect, useRef } from "react"
import { Mesh, Program, Renderer, Triangle } from "ogl"

export type DetalleOndas = "low" | "medium" | "high"

function hexARgb(hex: string): [number, number, number] {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!r) return [1, 1, 1]
  return [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255]
}

const PASOS: Record<DetalleOndas, number> = { low: 40, medium: 70, high: 110 }
const FPS = 30

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  if (uEnableMouse) {
    float yaw = (uMouse.x - 0.5) * uParallax * 0.4;
    float pitch = (uMouse.y - 0.5) * uParallax * 0.4;
    c = cos(yaw); s = sin(yaw);
    dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
    c = cos(pitch); s = sin(pitch);
    dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  }

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}
`;

export interface OndasGradienteProps {
  /** Bruma lejana en la que se desvanecen las olas. */
  colorHorizonte?: string
  /** Cuerpo de las olas. */
  colorOla?: string
  /** Crestas más cercanas. */
  colorCresta?: string
  velocidad?: number
  amplitud?: number
  escala?: number
  proporcion?: number
  oleaje?: number
  turbulencia?: number
  inclinacion?: number
  zoom?: number
  altura?: number
  profundidadBruma?: number
  detalle?: DetalleOndas
  brillo?: number
  opacidad?: number
  paralaje?: number
  grano?: number
  /** Fracción de la resolución CSS a la que se renderiza. */
  resolutionScale?: number
  className?: string
}

export function OndasGradiente({
  colorHorizonte = "#5B21E6",
  colorOla = "#9D4DFF",
  colorCresta = "#B27BFF",
  velocidad = 0.25,
  amplitud = 2.5,
  escala = 0.6,
  proporcion = 0.9,
  oleaje = 35,
  turbulencia = 20,
  inclinacion = 1.11,
  zoom = 1,
  altura = 5.5,
  profundidadBruma = 15,
  detalle = "medium",
  brillo = 1.15,
  opacidad = 1,
  paralaje = 0.4,
  grano = 0.04,
  resolutionScale = 0.6,
  className = "",
}: OndasGradienteProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const parent = ref.current
    if (!parent) return
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let renderer: Renderer
    try {
      renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: true, antialias: false, dpr: 1 })
    } catch {
      return // sin WebGL 2: queda el fondo CSS
    }
    const gl = renderer.gl
    if (!gl) return
    gl.clearColor(0, 0, 0, 0)
    const canvas = gl.canvas
    canvas.className = "block opacity-0 transition-opacity duration-700 ease-out"
    parent.appendChild(canvas)

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: velocidad },
        uAmplitude: { value: amplitud },
        uWaveScale: { value: escala },
        uWaveRatio: { value: proporcion },
        uSwell: { value: oleaje },
        uTurbulence: { value: turbulencia },
        uTilt: { value: inclinacion },
        uZoom: { value: zoom },
        uHeight: { value: altura },
        uFogDepth: { value: profundidadBruma },
        uSteps: { value: PASOS[detalle] },
        uBrightness: { value: brillo },
        uOpacity: { value: opacidad },
        uGrain: { value: grano > 0 ? 1 : 0 },
        uGrainIntensity: { value: grano },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uParallax: { value: paralaje },
        uEnableMouse: { value: !quieto && paralaje > 0 },
        uHorizonColor: { value: new Float32Array(hexARgb(colorHorizonte)) },
        uWaveColor: { value: new Float32Array(hexARgb(colorOla)) },
        uCrestColor: { value: new Float32Array(hexARgb(colorCresta)) },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const raton = { x: 0.5, y: 0.5, objX: 0.5, objY: 0.5 }
    // Arranca unos segundos adentro para que el primer cuadro ya tenga olas formadas
    let tiempo = 4
    let visible = true
    let raf = 0
    let ultimo = 0
    let mostrado = false

    const pintar = () => {
      program.uniforms.iTime.value = tiempo
      raton.x += 0.05 * (raton.objX - raton.x)
      raton.y += 0.05 * (raton.objY - raton.y)
      const m = program.uniforms.uMouse.value as Float32Array
      m[0] = raton.x
      m[1] = raton.y
      renderer.render({ scene: mesh })
      if (!mostrado) {
        mostrado = true
        canvas.style.opacity = "1"
      }
    }

    const resize = () => {
      const w = Math.max(1, Math.round(parent.clientWidth * resolutionScale))
      const h = Math.max(1, Math.round(parent.clientHeight * resolutionScale))
      renderer.setSize(w, h)
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      const res = program.uniforms.iResolution.value as Float32Array
      res[0] = gl.drawingBufferWidth
      res[1] = gl.drawingBufferHeight
      if (!raf) pintar()
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = now - ultimo
      if (dt < 1000 / FPS - 2) return
      ultimo = now
      tiempo += Math.min(dt, 100) / 1000
      pintar()
    }

    const actualizarLoop = () => {
      const debeCorrer = !quieto && visible && document.visibilityState === "visible"
      if (debeCorrer && !raf) {
        ultimo = performance.now()
        raf = requestAnimationFrame(frame)
      } else if (!debeCorrer && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const alMover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const r = parent.getBoundingClientRect()
      raton.objX = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      raton.objY = Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / r.height))
    }

    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    resize()

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      actualizarLoop()
    })
    io.observe(parent)
    document.addEventListener("visibilitychange", actualizarLoop)
    if (!quieto && paralaje > 0) window.addEventListener("pointermove", alMover, { passive: true })
    actualizarLoop()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", actualizarLoop)
      window.removeEventListener("pointermove", alMover)
      canvas.remove()
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [
    colorHorizonte, colorOla, colorCresta, velocidad, amplitud, escala, proporcion, oleaje,
    turbulencia, inclinacion, zoom, altura, profundidadBruma, detalle, brillo, opacidad,
    paralaje, grano, resolutionScale,
  ])

  return <div ref={ref} aria-hidden="true" className={`relative h-full w-full ${className}`} />
}
