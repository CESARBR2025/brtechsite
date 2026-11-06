import type { EscenaServicio } from "@/src/modules/tickets/application/escena-servicio"
import { SimboloBrTech } from "@/src/ui/marca/simbolo-brtech"
import { PANTALLA_LOCAL } from "./geometria"

/** Porta escenaPantalla de la maqueta a las coordenadas locales de la pantalla 3D. */
export function escenaPantalla(escena: EscenaServicio, base: number, id: string) {
  const { w, h } = PANTALLA_LOCAL
  const cx = w / 2, cy = h / 2, k = Math.min(1, h / 178)
  const modo = escena.pantalla
  const tarjetas = (y: number, retraso: number) => escena.programas.slice(0, 3).map((programa, i, programas) => {
    const anchoTarjeta = Math.min(86, (w - 40) / 3 - 8), espacio = 10
    const ancho = programas.length * anchoTarjeta + (programas.length - 1) * espacio
    const x = cx - ancho / 2 + i * (anchoTarjeta + espacio)
    return (
      <g key={i} className="ilus-app" style={{ animationDelay: `${retraso + i * .35}s` }}>
        <rect x={x} y={y} width={anchoTarjeta} height={52 * k} rx="8" fill="rgba(255,255,255,.07)" stroke="rgba(178,123,255,.55)" />
        <circle cx={x + 16} cy={y + 16 * k} r={8 * k} fill="#7836E2" />
        <text x={x + 16} y={y + 16 * k + 3.5} fontSize="9" fontWeight="600" fill="#fff" textAnchor="middle">{programa.charAt(0).toUpperCase()}</text>
        <text x={x + 10} y={y + 40 * k} fontSize={9.5 * Math.max(.85, k)} fill="rgba(255,255,255,.85)">{programa}</text>
      </g>
    )
  })
  const fin = base + 4
  const yListo = modo === "sistema_y_programas" ? h * .26 : cy - 8
  const tam = 64 * k

  return <>
    <defs>
      <radialGradient id={`${id}-pantalla`} cx="50%" cy="45%" r="65%">
        <stop offset="0" stopColor="#7836E2" stopOpacity=".55" />
        <stop offset="1" stopColor="#151127" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect className="ilus-luz" style={{ animationDelay: `${base + 1.4}s` }} x="0" y="0" width={w} height={h} rx="5" fill={`url(#${id}-pantalla)`} />
    {modo === "logo" ? <>
      <g className="ilus-luz" style={{ animationDelay: `${base + 1.5}s` }} opacity=".9">
        <svg x={cx - tam / 2} y={cy - tam / 2 - 10 * k} width={tam} height={tam} viewBox="0 0 208 208"><SimboloBrTech className="h-full w-full" /></svg>
      </g>
      <g className="ilus-luz" style={{ animationDelay: `${base + 1.6}s` }}>
        <rect x={cx - 44} y={cy + tam / 2 + 2} width="88" height="4" rx="2" fill="#B27BFF" />
      </g>
    </> : modo === "sistema" || modo === "sistema_y_programas" ? <>
      <g className="ilus-transitoria" style={{ animation: `ilus-fundido .6s ease ${base + 1.4}s backwards, ilus-salir .5s ease ${fin}s forwards` }}>
        <text x={cx} y={cy - 6} fontSize="11.5" textAnchor="middle" fill="rgba(255,255,255,.75)">Instalando {escena.sistema}</text>
        <rect x={cx - 70} y={cy + 6} width="140" height="5" rx="2.5" fill="rgba(241,235,255,.14)" />
        <rect className="ilus-progreso" style={{ animationDelay: `${base + 1.7}s` }} x={cx - 70} y={cy + 6} width="140" height="5" rx="2.5" fill="#B27BFF" />
      </g>
      <g className="ilus-etq" style={{ animationDelay: `${fin + .3}s` }}>
        <circle cx={cx - 52} cy={yListo - 4} r="9" fill="#10B981" />
        <path d={`M${cx - 56} ${yListo - 4} l3 3 l6 -6`} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x={cx - 36} y={yListo} fontSize="12.5" fontWeight="600" fill="#fff">{escena.sistema} listo</text>
      </g>
      {modo === "sistema" ? <g className="ilus-etq" style={{ animationDelay: `${fin + .6}s` }}>
        {[0, 1, 2].map(i => <rect key={i} x={cx - 60 + i * 42} y={cy + 12} width="36" height="26" rx="4" fill="rgba(255,255,255,.06)" stroke="rgba(241,235,255,.25)" />)}
      </g> : tarjetas(h * .42, fin + .7)}
    </> : <>
      <g className="ilus-etq" style={{ animationDelay: `${base + 1.5}s` }}>
        <text x={cx} y={h * .3} fontSize="12" fontWeight="500" textAnchor="middle" fill="rgba(255,255,255,.8)">Programas instalados</text>
      </g>
      {tarjetas(h * .4, base + 1.9)}
    </>}
  </>
}
