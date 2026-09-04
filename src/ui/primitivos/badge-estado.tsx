import type { EstadoTicket } from "@/src/modules/tickets/domain/estado-ticket"

const BASE =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"

const ESTILOS: Record<EstadoTicket, string> = {
  publicado: "bg-success-light text-success",
  borrador: "bg-bg-section text-text-muted",
  archivado: "bg-warning/15 text-warning",
}

const ETIQUETAS: Record<EstadoTicket, string> = {
  publicado: "Publicado",
  borrador: "Borrador",
  archivado: "Archivado",
}

export function BadgeEstado({ estado }: { estado: EstadoTicket }) {
  return <span className={`${BASE} ${ESTILOS[estado]}`}>{ETIQUETAS[estado]}</span>
}

export function BadgePago({ pagado }: { pagado: boolean }) {
  return (
    <span
      className={`${BASE} ${
        pagado ? "bg-success-light text-success" : "bg-warning/15 text-warning"
      }`}
    >
      {pagado ? "Pagado" : "Pendiente de pago"}
    </span>
  )
}
