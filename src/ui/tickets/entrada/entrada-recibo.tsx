"use client"

import { useEffect, useId, useRef } from "react"
import {
  aspa, clamp, CODIGO, entradaCubica, ESTRELLA, gradientesSvgTexto,
  hex, pol, R, RI, salidaAtras, salidaCubica, TONOS, tramo,
} from "@/src/ui/marca/geometria-diafragma"
import { claveEntrada, debeReproducirEntrada } from "./decision-entrada"

declare global {
  interface Window {
    __brtechEntradaFin?: boolean
  }
}

const LLEGA = 900, SALE = 2200, FIN = 2900
const f = (n: number): string => n.toFixed(2)

function anunciarFin() {
  window.__brtechEntradaFin = true
  window.dispatchEvent(new Event("brtech:entrada-fin"))
}

export function EntradaRecibo({ slug, objetivoId }: { slug: string; objetivoId: string }) {
  const entradaRef = useRef<HTMLDivElement>(null)
  const escenaRef = useRef<SVGSVGElement>(null)
  const palabraRef = useRef<HTMLDivElement>(null)
  const botonRef = useRef<HTMLButtonElement>(null)
  const focoAnteriorRef = useRef<HTMLElement | null>(null)
  const saltarRef = useRef<(() => void) | null>(null)
  const ejecucionRef = useRef(0)
  const id = useId()

  useEffect(() => {
    const ejecucion = ++ejecucionRef.current
    const esEjecucionActual = () => ejecucionRef.current === ejecucion
    const entrada = entradaRef.current, escena = escenaRef.current, palabra = palabraRef.current
    const raiz = document.documentElement
    const pagina = document.getElementById(objetivoId)
    const movimiento = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (!debeReproducirEntrada({ reducido: movimiento.matches, visto: !raiz.dataset.entrada })) {
      delete raiz.dataset.entrada
      anunciarFin()
      return
    }
    if (!entrada || !escena || !palabra || !pagina) {
      delete raiz.dataset.entrada
      anunciarFin()
      return
    }

    entrada.style.animation = "none"
    // El bloqueo va aquí y no en CSS: si nunca hidrata, la página debe poder desplazarse.
    raiz.style.overflow = "hidden"
    window.__brtechEntradaFin = false
    try { window.localStorage.setItem(claveEntrada(slug), "1") } catch { /* Sin almacenamiento, sigue la entrada autorizada. */ }

    if (document.activeElement !== botonRef.current) {
      focoAnteriorRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    }
    const origenAnterior = pagina.style.transformOrigin
    pagina.style.transformOrigin = "50% 22%"
    escena.replaceChildren()

    function mk<K extends keyof SVGElementTagNameMap>(
      nombre: K,
      atributos: Record<string, string | number>,
      padre: SVGElement,
    ): SVGElementTagNameMap[K] {
      const elemento = document.createElementNS("http://www.w3.org/2000/svg", nombre)
      for (const [clave, valor] of Object.entries(atributos)) elemento.setAttribute(clave, String(valor))
      padre.appendChild(elemento)
      return elemento
    }

    const defs = mk("defs", {}, escena)
    defs.innerHTML = gradientesSvgTexto(id)
    const gf = mk("radialGradient", { id: `${id}-fondo`, gradientUnits: "userSpaceOnUse" }, defs)
    mk("stop", { offset: "0", "stop-color": "#34187A" }, gf)
    mk("stop", { offset: ".55", "stop-color": "#1C1438" }, gf)
    mk("stop", { offset: "1", "stop-color": "#151127" }, gf)

    const plano = mk("path", { fill: `url(#${id}-fondo)`, "fill-rule": "evenodd" }, escena)
    const mundo = mk("g", {}, escena)
    const blanco = mk("path", { fill: "#fff" }, mundo)
    const codigoG = mk("g", { fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, mundo)
    const codigo = CODIGO.map(d => mk("path", {
      d, stroke: "#8C5BE0", "stroke-width": "8", pathLength: "1", "stroke-dasharray": "1 1",
    }, codigoG))
    const piezas = TONOS.map((_, i) => {
      const g = mk("g", {}, mundo)
      return {
        g,
        c: mk("path", { fill: `url(#${id}-t${i})` }, g),
        b: mk("path", { fill: `url(#${id}-gb)` }, g),
        s: mk("path", { fill: `url(#${id}-gc)` }, g),
      }
    })
    const efectos = mk("g", {}, escena)
    const onda = mk("path", { fill: "none", stroke: "#D9C2FF", "stroke-width": "3" }, efectos)
    const estrellas = Array.from({ length: 6 }, () => mk("path", { d: ESTRELLA, fill: "#fff" }, efectos))
    const chispas = Array.from({ length: 14 }, (_, i) => ({
      e: mk("circle", { r: i % 3 ? 1.6 : 2.6, fill: i % 2 ? "#E9D9FF" : "#B27BFF" }, efectos),
      a: i * 25.7 + 11,
      v: 118 + ((i * 37) % 70),
    }))
    const guino = mk("path", { d: ESTRELLA, fill: "#fff" }, efectos)

    let w = 0, h = 0, k = 1, cx = 0, cy = 0, maxS = 9
    let t0 = performance.now(), cuadro = 0, terminada = false

    function medir() {
      if (!entrada || !palabra || terminada) return
      w = entrada.clientWidth || innerWidth
      h = entrada.clientHeight || innerHeight
      k = Math.min(w, h) / 330
      cx = w / 2
      cy = h / 2 - 24
      maxS = Math.hypot(w / 2, h / 2 + 24) * 1.12 / (0.866 * 74 * k)
      gf.setAttribute("cx", String(cx))
      gf.setAttribute("cy", String(cy))
      gf.setAttribute("r", String(Math.max(w, h) * .62))
      palabra.style.top = (cy + R * k + 22) + "px"
    }

    /** Misma coreografía de PROTO; solo escribe atributos, sin renders por cuadro. */
    function pintar(ms: number) {
      if (!palabra || !pagina) return
      const abre = tramo(ms, 980, 1480), sale = tramo(ms, SALE, FIN), se = entradaCubica(sale)
      const r0 = 8 + (RI - 8) * salidaAtras(abre, 1.2), r = r0 + (74 - RI) * se
      const phi = -70 * (1 - salidaCubica(abre))
      let s = 1
      if (ms > LLEGA && ms < SALE) {
        const t = (ms - LLEGA) / 1000
        s = 1 + .13 * Math.exp(-7 * t) * Math.cos(26 * t)
      }
      s *= Math.exp(Math.log(maxS) * se)
      const giro = 34 * se
      mundo.setAttribute("transform", `translate(${f(cx)} ${f(cy)}) scale(${(k * s).toFixed(4)}) rotate(${f(giro)})`)
      plano.setAttribute("d", `M0 0H${w}V${h}H0Z` + hex(r * .985, phi + giro, cx, cy, k * s))
      const a = aspa(r, phi)
      piezas.forEach((p, i) => {
        p.c.setAttribute("d", a.cuerpo)
        p.b.setAttribute("d", a.brillo)
        p.s.setAttribute("d", a.sombra)
        const q = tramo(ms, i * 62, i * 62 + 560), e = salidaAtras(q, 1.5)
        const dist = (1 - e) * 300, spin = (1 - e) * 170, esc = .35 + .65 * e
        p.g.setAttribute("transform", `rotate(${60 * i}) translate(0 ${f(-dist)}) rotate(${f(spin)}) scale(${esc.toFixed(3)})`)
        p.g.setAttribute("opacity", f(clamp(q * 4)))
      })
      blanco.setAttribute("d", hex(r, phi))
      blanco.setAttribute("opacity", f(1 - tramo(sale, .12, .5)))
      const dib = [tramo(ms, 1330, 1560), tramo(ms, 1430, 1660), tramo(ms, 1530, 1760)]
      codigo.forEach((c, i) => {
        c.setAttribute("stroke-dashoffset", f(1 - salidaCubica(dib[i])))
        c.setAttribute("opacity", dib[i] > 0 ? "1" : "0")
      })
      codigoG.setAttribute("opacity", f(1 - tramo(sale, .05, .3)))
      efectos.setAttribute("transform", `translate(${f(cx)} ${f(cy)}) scale(${k.toFixed(4)})`)
      const on = tramo(ms, LLEGA, LLEGA + 520), oe = salidaCubica(on)
      onda.setAttribute("d", hex(R * (1 + .75 * oe), 30))
      onda.setAttribute("opacity", on > 0 && on < 1 ? f(.9 * (1 - on)) : "0")
      estrellas.forEach((st, i) => {
        const q = tramo(ms, LLEGA + i * 24, LLEGA + i * 24 + 460), p = pol(R * 1.12 + oe * 16, -90 + 60 * i)
        const e = q < .3 ? salidaAtras(q / .3, 2.2) : 1 - entradaCubica((q - .3) / .7)
        st.setAttribute("transform", `translate(${f(p[0])} ${f(p[1])}) scale(${f(q > 0 && q < 1 ? e * (i % 2 ? .75 : 1.15) : 0)})`)
      })
      chispas.forEach(c => {
        const q = tramo(ms, LLEGA, LLEGA + 700), p = pol(R * .9 + c.v * salidaCubica(q), c.a)
        c.e.setAttribute("cx", f(p[0]))
        c.e.setAttribute("cy", f(p[1]))
        c.e.setAttribute("opacity", q > 0 && q < 1 ? f(1 - q) : "0")
      })
      const gq = tramo(ms, 1820, 2170), ge = gq < .35 ? salidaAtras(gq / .35, 2) : 1 - entradaCubica((gq - .35) / .65)
      const gp = pol(R * .86, -30)
      guino.setAttribute("transform", `translate(${f(gp[0])} ${f(gp[1])}) rotate(${f(gq * 70)}) scale(${f(gq > 0 && gq < 1 ? ge * 1.5 : 0)})`)
      const pq = salidaCubica(tramo(ms, 1400, 1720))
      palabra.style.opacity = f(pq * (1 - tramo(sale, 0, .16)))
      palabra.style.transform = `translateY(${f((1 - pq) * 14)}px)`
      pagina.style.transform = `scale(${(1.07 - .07 * salidaCubica(tramo(sale, .35, 1))).toFixed(4)})`
    }

    function terminar() {
      if (terminada) return
      terminada = true
      cancelAnimationFrame(cuadro)
      delete raiz.dataset.entrada
      raiz.style.overflow = ""
      if (pagina) {
        pagina.style.transform = ""
        pagina.style.transformOrigin = origenAnterior
      }
      if (entrada) entrada.style.display = "none"
      if (document.activeElement === botonRef.current) focoAnteriorRef.current?.focus({ preventScroll: true })
      anunciarFin()
    }

    function bucle(ahora: number) {
      if (terminada) return
      const ms = ahora - t0
      if (ms >= FIN) return terminar()
      pintar(ms)
      cuadro = requestAnimationFrame(bucle)
    }

    const alCambiarMovimiento = () => { if (movimiento.matches) terminar() }
    const observador = new ResizeObserver(medir)
    observador.observe(entrada)
    movimiento.addEventListener("change", alCambiarMovimiento)
    window.addEventListener("beforeprint", terminar)
    saltarRef.current = () => {
      const ahora = performance.now()
      if (ahora - t0 < SALE) t0 = ahora - SALE
    }

    medir()
    pintar(0)
    // El plano SVG cubre el lienzo y abre el hueco; un fondo CSS opaco lo taparía.
    entrada.style.backgroundColor = "transparent"
    entrada.style.display = "block"
    t0 = performance.now()
    cuadro = requestAnimationFrame(bucle)

    return () => {
      cancelAnimationFrame(cuadro)
      observador.disconnect()
      movimiento.removeEventListener("change", alCambiarMovimiento)
      window.removeEventListener("beforeprint", terminar)
      saltarRef.current = null
      pagina.style.transform = ""
      pagina.style.transformOrigin = origenAnterior
      // React puede montar el efecto de nuevo en modo estricto antes de esta microtarea.
      queueMicrotask(() => { if (esEjecucionActual()) terminar() })
    }
  }, [slug, objetivoId, id])

  return (
    <div id="entrada-recibo" ref={entradaRef} className="fixed inset-0 z-[100] hidden h-dvh overflow-hidden bg-bg-dark">
      <div aria-hidden="true">
        <svg ref={escenaRef} className="absolute inset-0 block h-full w-full" role="presentation" />
        <div ref={palabraRef} className="pointer-events-none absolute inset-x-0 text-center font-hero text-white" style={{ opacity: 0 }}>
          <strong className="block text-[26px] font-semibold tracking-[.14em]">BR TECH</strong>
          <small className="mt-1.5 block font-sans text-[10px] tracking-[.42em] opacity-[.72]">DIGITAL SYSTEMS</small>
        </div>
      </div>
      <button
        ref={botonRef}
        type="button"
        onClick={() => saltarRef.current?.()}
        className="absolute top-[calc(12px+env(safe-area-inset-top,0px))] right-[max(12px,env(safe-area-inset-right,0px))] min-h-11 min-w-11 cursor-pointer rounded-full bg-white/10 px-4 py-2.5 text-[13px] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Saltar
      </button>
    </div>
  )
}
