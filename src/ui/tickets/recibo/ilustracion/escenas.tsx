import type { CSSProperties } from "react"
import type { EscenaServicio } from "@/src/modules/tickets/application/escena-servicio"
import { ETIQUETA_PIEZA, type TipoPieza } from "@/src/modules/tickets/domain/clasificacion"
import { SimboloBrTech } from "@/src/ui/marca/simbolo-brtech"
import {
  BASES_3D, ENSAMBLE_3D, ORDEN_ENSAMBLE, PIEZAS_3D,
  encajar, ladoDe, rutaImagen, tarjeta,
  type NombreImagen, type Posicion, type Punto, type Rectangulo,
} from "./geometria"

type Base = (typeof BASES_3D)[keyof typeof BASES_3D]
export const FIN_ENSAMBLE = 1 + ORDEN_ENSAMBLE.length * .45 + .4

export function imagen3d(imagen: NombreImagen, rectangulo: Rectangulo, retraso: number, estilo?: CSSProperties, ajuste = encajar(imagen, rectangulo)) {
  return <image className="ilus-img3d" style={{ animationDelay: `${retraso}s`, ...estilo }} href={rutaImagen(imagen)}
    x={ajuste.x.toFixed(1)} y={ajuste.y.toFixed(1)} width={ajuste.w.toFixed(1)} height={ajuste.h.toFixed(1)} />
}

export function pastilla(texto: string, { x, y }: Posicion, retraso: number, tono: "violeta" | "verde" | "ambar" = "violeta") {
  const ancho = Math.round(texto.length * 6.6 + 26)
  const colores = {
    violeta: ["rgba(120,54,226,.28)", "rgba(178,123,255,.65)"],
    verde: ["rgba(16,185,129,.22)", "rgba(52,211,153,.6)"],
    ambar: ["rgba(245,158,11,.2)", "rgba(252,211,77,.65)"],
  }[tono]
  return <g className="ilus-etq" style={{ animationDelay: `${retraso}s` }}>
    <rect x={x} y={y} width={ancho} height="26" rx="13" fill={colores[0]} stroke={colores[1]} />
    <text x={x + ancho / 2} y={y + 17} fontSize="11.5" fontWeight="500" textAnchor="middle" fill="#fff">{texto}</text>
  </g>
}

function zona(base: Base, tipo: TipoPieza): Punto | null {
  const punto = (base.zonas as Partial<Record<TipoPieza, Punto>>)[tipo]
  return punto ? encajar(base.imagen, base.destino).punto(punto) : null
}

export function marcaZona([x, y]: Punto, retraso: number, color = "#B27BFF", radio = 9) {
  return <>
    <circle className={radio === 10 ? "ilus-marca-falla" : "ilus-marca-zona"} style={{ animationDelay: `${retraso}s,${retraso}s` }} cx={x} cy={y} r={radio} fill="none" stroke={color} strokeWidth="1.5" />
    <circle className="ilus-etq" style={{ animationDelay: `${retraso}s` }} cx={x} cy={y} r="3.5" fill={color === "#B27BFF" ? "#E9D9FF" : color} />
  </>
}

export function guia([ax, ay]: Punto, [zx, zy]: Punto, retraso: number) {
  return <path className="ilus-trazo ilus-fino" pathLength="1" style={{ animationDelay: `${retraso}s` }} d={`M${ax} ${ay} C ${ax} ${ay - 26}, ${zx + (ax > zx ? 20 : -20)} ${zy + 18}, ${zx} ${zy}`} />
}

export function particulas(cx: number, cy: number, retraso: number, cantidad = 12) {
  return Array.from({ length: cantidad }, (_, i) => {
    // Reparte de forma determinista los mismos rangos de la maqueta.
    const fraccion = (i * 7 % cantidad) / cantidad
    const angulo = i / cantidad * Math.PI * 2 + fraccion * .4
    const distancia = 40 + fraccion * 40
    return <circle key={i} className="ilus-polvo" cx={cx} cy={cy} r={1.2 + fraccion * 1.6} fill="rgba(241,235,255,.7)" style={{
      "--dx": `${(Math.cos(angulo) * distancia).toFixed(1)}px`, "--dy": `${(Math.sin(angulo) * distancia).toFixed(1)}px`,
      animationDelay: `${(retraso + fraccion * .6).toFixed(2)}s`,
    } as CSSProperties} />
  })
}

export function destello(x: number, y: number, retraso: number, tam = 10) {
  return <path className="ilus-destello" style={{ animationDelay: `${retraso}s` }} fill="#fff" d={`M${x} ${y - tam} l${tam * .22} ${tam * .78} l${tam * .78} ${tam * .22} l-${tam * .78} ${tam * .22} l-${tam * .22} ${tam * .78} l-${tam * .22} -${tam * .78} l-${tam * .78} -${tam * .22} l${tam * .78} -${tam * .22} z`} />
}

export function escenaPieza(escena: EscenaServicio, base: Base) {
  const pieza = escena.pieza
  if (!pieza || !(pieza.tipo in PIEZAS_3D)) return null
  const imagenes = PIEZAS_3D[pieza.tipo as keyof typeof PIEZAS_3D]
  const punto = zona(base, pieza.tipo)
  if (!punto) return null
  const lado = ladoDe(base, { x: punto[0], y: punto[1] })
  return <>
    {imagen3d(imagenes[1], tarjeta(lado.viejo), .3)}
    <g className="ilus-etq" style={{ animationDelay: "1.9s" }}>
      <text x={lado.viejo.x} y={lado.viejo.y + 90} fontSize="12" fill="rgba(241,235,255,.55)">Antes: {pieza.anterior}</text>
    </g>
    {marcaZona(punto, 1.2)}
    {guia([lado.nuevo.x + 60, lado.nuevo.y], punto, 1.5)}
    <g className="ilus-flota">{imagen3d(imagenes[0], tarjeta(lado.nuevo), 1.3)}</g>
    {pastilla(`Nuevo: ${pieza.nuevo}`, lado.pastilla, 2.1)}
  </>
}

export function escenaMantenimiento(base: Base) {
  const punto = zona(base, "ventilador")!
  const lado = ladoDe(base, { x: punto[0], y: punto[1] })
  const cx = lado.nuevo.x + 60, cy = lado.nuevo.y + 31
  return <>
    {imagen3d(PIEZAS_3D.ventilador[1], tarjeta(lado.viejo), .3)}
    <g className="ilus-etq" style={{ animationDelay: "1.9s" }}>
      <text x={lado.viejo.x} y={lado.viejo.y + 90} fontSize="12" fill="rgba(241,235,255,.55)">Antes: polvo acumulado</text>
    </g>
    {marcaZona(punto, 1.2)}
    {guia([cx, lado.nuevo.y], punto, 1.5)}
    <g className="ilus-flota">{imagen3d(PIEZAS_3D.ventilador[0], tarjeta(lado.nuevo), 1.3)}</g>
    {particulas(cx, cy, 2)}
    {destello(lado.nuevo.x + 100, lado.nuevo.y + 4, 4.2)}
    {destello(lado.nuevo.x + 22, lado.nuevo.y + 58, 4.5, 7)}
    {pastilla("Limpieza interna", lado.pastilla, 2.1)}
  </>
}

export function escenaDiagnostico(escena: EscenaServicio, base: Base) {
  const punto = zona(base, escena.falla ?? "placa") ?? zona(base, "placa")!
  const { x, y, w, h } = base.destino
  const id = `ilus-escaneo-${escena.categoria}`
  return <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#B27BFF" stopOpacity="0" />
        <stop offset=".85" stopColor="#B27BFF" stopOpacity=".35" />
        <stop offset="1" stopColor="#E9D9FF" stopOpacity=".9" />
      </linearGradient>
    </defs>
    <rect className="ilus-escaneo" style={{ "--h": `${h - 20}px`, animationDelay: ".9s" } as CSSProperties} x={x} y={y} width={w} height="20" fill={`url(#${id})`} />
    {marcaZona(punto, 3.8, "#FCD34D", 10)}
    {pastilla(`Falla: ${ETIQUETA_PIEZA[escena.falla ?? "placa"].toLowerCase()}`, base.pastilla, 4.1, "ambar")}
  </>
}

export function escenaEnsamble(escena: EscenaServicio) {
  const base = BASES_3D.pc
  return <>
    {ORDEN_ENSAMBLE.map((pieza, i) => {
      const [x, y] = zona(base, pieza)!
      const retraso = 1 + i * .45
      return <g key={pieza}>
        <g className="ilus-transitoria" style={{
          "--dx": "-190px", "--dy": `${(i % 2 ? 1 : -1) * 30}px`,
          animation: `ilus-encaja 1s cubic-bezier(.2,.9,.3,1.1) ${retraso}s backwards, ilus-salir .5s ease ${FIN_ENSAMBLE}s forwards`,
        } as CSSProperties}>
          {imagen3d(ENSAMBLE_3D[pieza], { x: x - 34, y: y - 22, w: 68, h: 44 }, 0, { animation: "none" })}
        </g>
        {destello(x, y, retraso + .85, 9)}
      </g>
    })}
    {imagen3d(base.imagen, base.destino, 0, { animation: `ilus-fundido .9s ease ${FIN_ENSAMBLE}s backwards` })}
    {pastilla(`${escena.piezasEnsamble} piezas armadas`, base.pastilla, FIN_ENSAMBLE + .2)}
  </>
}

export function textoSinInterior(escena: EscenaServicio) {
  return escena.pantalla === "sistema" ? `${escena.sistema} instalado`
    : escena.pantalla === "programas" ? `${escena.totalProgramas} programas instalados`
    : escena.pantalla === "sistema_y_programas" ? "Sistema y programas listos" : "Servicio completado"
}

export function escenaGenerica(escena: EscenaServicio) {
  const texto = textoSinInterior(escena)
  return <>
    <ellipse className="ilus-luz" cx="260" cy="180" rx="110" ry="80" fill="rgba(233,226,255,.13)" style={{ filter: "blur(30px)" }} />
    <svg className="ilus-luz" x="200" y="120" width="120" height="120" viewBox="0 0 208 208"><SimboloBrTech className="h-full w-full" /></svg>
    {pastilla(texto, { x: 260 - Math.round(texto.length * 6.6 + 26) / 2, y: 286 }, 2.2, "verde")}
  </>
}
