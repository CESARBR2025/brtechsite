import { Archive, CheckCircle2, Clock, PencilLine } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { EstadoTicket } from "@/src/modules/tickets/domain/estado-ticket"

const BASE =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"

const ESTADO: Record<
  EstadoTicket,
  { clase: string; texto: string; Icono: LucideIcon }
> = {
  publicado: {
    clase: "bg-success-light text-success",
    texto: "Publicado",
    Icono: CheckCircle2,
  },
  borrador: {
    clase: "bg-bg-section text-text-muted ring-1 ring-inset ring-border",
    texto: "Borrador",
    Icono: PencilLine,
  },
  archivado: {
    clase: "bg-warning/15 text-warning",
    texto: "Archivado",
    Icono: Archive,
  },
}

export function BadgeEstado({ estado }: { estado: EstadoTicket }) {
  const { clase, texto, Icono } = ESTADO[estado]
  return (
    <span className={`${BASE} ${clase}`}>
      <Icono className="h-3 w-3" />
      {texto}
    </span>
  )
}

export function BadgePago({ pagado }: { pagado: boolean }) {
  return (
    <span
      className={`${BASE} ${
        pagado ? "bg-success-light text-success" : "bg-warning/15 text-warning"
      }`}
    >
      {pagado ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      {pagado ? "Pagado" : "Pendiente de pago"}
    </span>
  )
}
