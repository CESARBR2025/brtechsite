import {
  BarChart3,
  ChefHat,
  ClipboardList,
  LayoutGrid,
  Layers,
  Receipt,
  Smartphone,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

/** Ícono de un módulo según su nombre. */
export function iconoModulo(titulo: string): LucideIcon {
  if (/mesa/i.test(titulo)) return LayoutGrid
  if (/orden|pedido/i.test(titulo)) return ClipboardList
  if (/cocina|barra/i.test(titulo)) return ChefHat
  if (/caja|ticket|cobro/i.test(titulo)) return Receipt
  if (/tablero|reporte/i.test(titulo)) return BarChart3
  if (/app|móvil/i.test(titulo)) return Smartphone
  return Layers
}
