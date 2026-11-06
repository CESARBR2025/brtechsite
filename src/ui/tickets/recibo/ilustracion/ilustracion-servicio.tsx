import type { EscenaServicio } from "@/src/modules/tickets/application/escena-servicio"
import { CapaPantalla3D } from "./capa-pantalla-3d"
import {
  FIN_ENSAMBLE, escenaDiagnostico, escenaEnsamble, escenaGenerica,
  escenaMantenimiento, escenaPieza, imagen3d, pastilla, textoSinInterior,
} from "./escenas"
import { BASES_3D, encajar, LIENZO, type Cuadrilatero } from "./geometria"

/** Composición sin hooks, compartida por la portada pública y la vista previa del panel. */
export function IlustracionServicio({ escena, activa = true }: { escena: EscenaServicio; activa?: boolean }) {
  const base = escena.categoria === "otro" ? null : BASES_3D[escena.categoria]
  const ajuste = base ? encajar(base.imagen, base.destino) : null
  const cuadrilatero: Cuadrilatero | null = base && ajuste ? [
    ajuste.punto(base.pantalla[0]), ajuste.punto(base.pantalla[1]),
    ajuste.punto(base.pantalla[2]), ajuste.punto(base.pantalla[3]),
  ] : null
  const ensamble = escena.interior === "ensamble" && escena.categoria === "pc"

  return <div className="ilus ilus-contenedor" data-activa={activa ? "" : undefined}
    data-interior={escena.interior ?? "ninguno"} data-pantalla={escena.pantalla} aria-hidden="true">
    <svg className="ilus-svg" viewBox={`0 0 ${LIENZO.w} ${LIENZO.h}`}>
      {base ? <>
        {imagen3d(ensamble ? BASES_3D.pc.vacia : base.imagen, base.destino, .1, undefined, ajuste!)}
        {escena.interior === "pieza" && escenaPieza(escena, base)}
        {escena.interior === "mantenimiento" && escenaMantenimiento(base)}
        {escena.interior === "diagnostico" && escenaDiagnostico(escena, base)}
        {ensamble && escenaEnsamble(escena)}
        {!escena.interior && pastilla(textoSinInterior(escena), base.pastilla, escena.pantalla === "logo" ? 2.2 : 5.2, "verde")}
      </> : escenaGenerica(escena)}
    </svg>
    {cuadrilatero && <CapaPantalla3D escena={escena} cuadrilatero={cuadrilatero} retraso={ensamble ? FIN_ENSAMBLE : 0} />}
    <noscript><style>{".ilus * { animation: none !important; } .ilus .ilus-transitoria { display: none; }"}</style></noscript>
  </div>
}
