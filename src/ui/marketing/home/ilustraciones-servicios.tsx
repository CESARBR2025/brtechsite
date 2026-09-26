import { ArrowUpRight } from "lucide-react"

/**
 * Mini interfaces ilustrativas para las tarjetas de Servicios. Solo CSS: se
 * animan con el hover de la tarjeta (`group` de TarjetaFoco) y con
 * reduced-motion quedan fijas. Datos genéricos, no de clientes reales.
 * Color: violeta de marca + verde/ámbar solo como estado (en línea, reabastecer).
 */

// Pantalla oscura dentro de una tarjeta clara: se lee como una captura del producto
const marco =
  "relative h-40 overflow-hidden rounded-xl border border-bg-dark bg-bg-dark p-4 shadow-[0_12px_28px_-14px_rgba(21,17,39,0.55)]"

const barra = "motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out"

export function IlustracionMultisucursal() {
  const sucursales = [
    { nombre: "Sucursal Centro", avance: "w-[82%]" },
    { nombre: "Sucursal Norte", avance: "w-[64%]" },
    { nombre: "Sucursal Sur", avance: "w-[71%]" },
  ]
  return (
    <div className={marco} aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-white/55">Operación en vivo</span>
        <span className="flex items-center gap-1.5 text-[11px] text-white/55">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:group-hover:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          3 en línea
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {sucursales.map((s, i) => (
          <li key={s.nombre} className="grid grid-cols-[6.5rem_1fr] items-center gap-3">
            <span className="flex items-center gap-2 text-xs text-white/75">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {s.nombre}
            </span>
            <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <span
                className={`block h-full origin-left scale-x-[0.8] rounded-full bg-gradient-to-r from-primary-hover to-primary ${s.avance} ${barra} group-hover:scale-x-100`}
                style={{ transitionDelay: `${i * 80}ms` }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function IlustracionInventario() {
  const productos = [
    { alto: "h-[70%]" },
    { alto: "h-[88%]" },
    { alto: "h-[18%]", bajo: true },
    { alto: "h-[62%]" },
    { alto: "h-[80%]" },
    { alto: "h-[54%]" },
  ]
  return (
    <div className={marco} aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-white/55">Existencias</span>
        <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-warning">
          1 por reabastecer
        </span>
      </div>
      <div className="mt-3 flex h-[5.5rem] items-end gap-2.5">
        {productos.map((p, i) => (
          <span key={i} className="relative flex h-full flex-1 items-end">
            <span
              className={`block w-full origin-bottom scale-y-[0.85] rounded-t-md ${p.alto} ${barra} group-hover:scale-y-100 ${
                p.bajo ? "bg-warning/80" : "bg-gradient-to-t from-primary-hover to-primary"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            />
            {p.bajo && (
              <span className="absolute -top-1 left-1/2 flex h-2 w-2 -translate-x-1/2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-warning opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

export function IlustracionWeb() {
  return (
    <div className={marco} aria-hidden="true">
      <div className="-mx-4 -mt-4 flex items-center gap-1.5 border-b border-line-dark px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[10px] text-white/55">
          tunegocio.mx
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <span className="block h-2.5 w-3/5 rounded-full bg-white/20" />
        <span className="block h-2 w-4/5 rounded-full bg-white/[0.08]" />
        <span className="block h-2 w-2/3 rounded-full bg-white/[0.08]" />
      </div>
      <span className="mt-4 inline-flex rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(120,54,226,0.9)]">
        Reservar
      </span>
      <span
        className={`absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success ${barra} group-hover:-translate-y-1`}
      >
        <ArrowUpRight className="h-3 w-3" />
        Conversiones
      </span>
    </div>
  )
}
