export type NombreImagen =
  | "aio" | "bateria-vieja" | "bateria" | "fuente-vieja" | "fuente" | "hdd"
  | "laptop" | "nvme" | "pc-vacia" | "pc" | "placa" | "procesador"
  | "ram-vieja" | "ram" | "ssd" | "ventilador-sucio" | "ventilador" | "video"

export type Punto = readonly [number, number]
export type Cuadrilatero = readonly [Punto, Punto, Punto, Punto]
export interface Posicion { x: number; y: number }
export interface Rectangulo extends Posicion { w: number; h: number }
export interface PosicionesTarjetas {
  nuevo: Posicion
  viejo: Posicion
  pastilla: Posicion
}

export const LIENZO = { w: 520, h: 400 } as const
export const LADO_ORIGINAL = 1254
export const RUTA = "/recibo/3d"

/** Caja del objeto dentro de cada imagen: [x0, y0, x1, y1]. */
export const CAJAS: Record<NombreImagen, [number, number, number, number]> = {
  aio: [136, 117, 1108, 1130], "bateria-vieja": [21, 249, 1225, 1015], bateria: [23, 253, 1223, 1014],
  "fuente-vieja": [91, 210, 1168, 1076], fuente: [93, 210, 1164, 1075], hdd: [90, 377, 1173, 936],
  laptop: [52, 143, 1197, 1133], nvme: [67, 401, 1182, 867], "pc-vacia": [100, 311, 1147, 953],
  pc: [100, 311, 1147, 955], placa: [47, 150, 1203, 1113], procesador: [83, 318, 1148, 959],
  "ram-vieja": [57, 228, 1192, 1070], ram: [44, 317, 1218, 979], ssd: [102, 403, 1153, 899],
  "ventilador-sucio": [94, 361, 1164, 938], ventilador: [94, 364, 1162, 936], video: [89, 271, 1177, 956],
}

export const BASES_3D = {
  laptop: { imagen: "laptop", destino: { x: 70, y: 0, w: 366, h: 316 },
    pantalla: [[458, 180], [1170, 254], [1086, 772], [368, 662]],
    zonas: { disco: [880, 1010], ram: [640, 860], bateria: [470, 985], ventilador: [330, 820], placa: [700, 830] },
    nuevo: { x: 380, y: 300 }, viejo: { x: 38, y: 300 }, pastilla: { x: 392, y: 232 },
    izq: { nuevo: { x: 24, y: 300 }, viejo: { x: 362, y: 300 }, pastilla: { x: 24, y: 232 } } },
  pc: { imagen: "pc", vacia: "pc-vacia", destino: { x: 20, y: 10, w: 480, h: 270 },
    pantalla: [[124, 494], [608, 424], [610, 752], [120, 826]],
    zonas: { ram: [912, 545], procesador: [812, 545], placa: [880, 610], video: [810, 680], fuente: [735, 800], disco: [700, 625], ventilador: [695, 505] },
    nuevo: { x: 190, y: 296 }, viejo: { x: 30, y: 296 }, pastilla: { x: 192, y: 366 } },
  todo_en_uno: { imagen: "aio", destino: { x: 110, y: 0, w: 300, h: 300 },
    pantalla: [[198, 152], [1068, 328], [1032, 862], [150, 700]],
    zonas: { disco: [900, 880], ram: [700, 840], placa: [500, 800], ventilador: [980, 885] },
    nuevo: { x: 380, y: 300 }, viejo: { x: 38, y: 300 }, pastilla: { x: 384, y: 264 },
    izq: { nuevo: { x: 24, y: 300 }, viejo: { x: 362, y: 300 }, pastilla: { x: 24, y: 264 } } },
} as const

/** Imágenes de cada pieza: [nuevo, viejo]. */
export const PIEZAS_3D = {
  disco: ["ssd", "hdd"], ram: ["ram", "ram-vieja"], bateria: ["bateria", "bateria-vieja"],
  ventilador: ["ventilador", "ventilador-sucio"], fuente: ["fuente", "fuente-vieja"],
} as const
export const ENSAMBLE_3D = { placa: "placa", procesador: "procesador", ram: "ram", video: "video", disco: "nvme", fuente: "fuente" } as const
export const ORDEN_ENSAMBLE = ["placa", "procesador", "ram", "video", "disco", "fuente"] as const
/** Coordenadas locales de la escena que la capa 3D lleva al cuadrilátero de la pantalla. */
export const PANTALLA_LOCAL = { w: 300, h: 180 } as const

/** Encaja la caja del objeto y convierte píxeles de la imagen original al lienzo. */
export function encajar(imagen: NombreImagen, rect: Rectangulo) {
  const [x0, y0, x1, y1] = CAJAS[imagen]
  const k = Math.min(rect.w / (x1 - x0), rect.h / (y1 - y0))
  const ox = rect.x + (rect.w - (x1 - x0) * k) / 2 - x0 * k
  const oy = rect.y + (rect.h - (y1 - y0) * k) / 2 - y0 * k
  return {
    x: ox, y: oy, w: LADO_ORIGINAL * k, h: LADO_ORIGINAL * k,
    punto: ([px, py]: Punto): [number, number] => [
      +(ox + px * k).toFixed(1), +(oy + py * k).toFixed(1),
    ],
  }
}

export function tarjeta(p: Posicion): Rectangulo {
  return { x: p.x - 12, y: p.y - 12, w: 144, h: 86 }
}

export function ladoDe(base: PosicionesTarjetas & { izq?: PosicionesTarjetas }, punto: Posicion): PosicionesTarjetas {
  return base.izq && punto.x < 240 ? base.izq : base
}

/** Lleva el rectángulo a las esquinas superior izquierda, superior derecha, inferior derecha e inferior izquierda. */
export function homografia(w: number, h: number, [[x0, y0], [x1, y1], [x2, y2], [x3, y3]]: Cuadrilatero): string {
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3, det = dx1 * dy2 - dx2 * dy1
  const g = (sx * dy2 - dx2 * sy) / det, k = (dx1 * sy - sx * dy1) / det
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, d = y1 - y0 + g * y1, e = y3 - y0 + k * y3
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${e / h},0,${k / h},0,0,1,0,${x0},${y0},0,1)`
}

export function rutaImagen(nombre: NombreImagen): string {
  return `${RUTA}/${nombre}.webp`
}
