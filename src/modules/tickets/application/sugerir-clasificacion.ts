import type { ClaseConcepto, TipoPieza } from "../domain/clasificacion"

const REGLAS: readonly [RegExp, ClaseConcepto, TipoPieza | null][] = [
  [/mantenimiento|limpieza|pasta termica/, "mantenimiento", null],
  [/armado|ensambl/, "ensamble", null],
  [/diagnostic|revision/, "diagnostico", null],
  [/mano de obra|instalacion de la pieza|instalacion de pieza|domicilio/, "mano_de_obra", null],
  [/windows|sistema operativo|\bso\b|formate|linux|macos/, "sistema", null],
  [/ssd|disco|hdd|nvme|m\.2/, "pieza", "disco"],
  [/\bram\b|memoria/, "pieza", "ram"],
  [/bateria/, "pieza", "bateria"],
  [/ventilador|disipador|\bfan\b/, "pieza", "ventilador"],
  [/fuente|\bpsu\b/, "pieza", "fuente"],
  [/tarjeta madre|motherboard|placa base/, "pieza", "placa"],
  [/procesador|\bcpu\b|ryzen|core i[3579]/, "pieza", "procesador"],
  [/tarjeta de video|\bgpu\b|rtx|gtx|radeon/, "pieza", "video"],
  [/gabinete/, "pieza", "gabinete"],
  [/office|antivirus|programa|software|licencia|adobe|autocad|zoom|instalacion de/, "programa", null],
]

export function sugerirClasificacion(concepto: string, detalle?: string | null): { clase: ClaseConcepto; pieza: TipoPieza | null } {
  const texto = `${concepto} ${detalle ?? ""}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  for (const [patron, clase, pieza] of REGLAS) {
    if (patron.test(texto)) return { clase, pieza }
  }
  return { clase: "otro", pieza: null }
}
