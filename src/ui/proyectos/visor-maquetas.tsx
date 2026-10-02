"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Maximize2, X } from "lucide-react"

/*
 * Una maqueta de la propuesta: se ve como miniatura y, al tocarla, se abre
 * ampliada en un diálogo nativo (Esc o clic fuera para cerrar).
 */
export function VisorImagen({
  src,
  titulo,
  descripcion,
  ancho,
  alto,
  sizes,
}: {
  src: string
  titulo: string
  descripcion: string
  ancho: number
  alto: number
  sizes: string
}) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const alt = [titulo, descripcion].filter(Boolean).join(": ") || "Maqueta del sistema"

  return (
    <>
      <button
        type="button"
        onClick={() => dialogo.current?.showModal()}
        aria-label={`Ampliar: ${alt}`}
        className="group relative block w-full cursor-zoom-in rounded-2xl outline-none transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:-translate-y-1"
      >
        <Image src={src} alt={alt} width={ancho} height={alto} sizes={sizes} className="h-auto w-full" />
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-bg-dark/80 text-white opacity-0 shadow-card backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      <dialog
        ref={dialogo}
        aria-label={alt}
        onClick={(e) => {
          // Un clic en el fondo (no en la imagen) cierra
          if (e.target === dialogo.current) dialogo.current?.close()
        }}
        className="m-auto max-h-[96vh] max-w-[96vw] overflow-visible bg-transparent p-0 backdrop:bg-bg-deep/85 backdrop:backdrop-blur-sm"
      >
        <div className="relative">
          <Image
            src={src}
            alt={alt}
            width={ancho}
            height={alto}
            sizes="96vw"
            className="h-auto max-h-[92vh] w-auto max-w-[96vw] object-contain"
          />
          <button
            type="button"
            onClick={() => dialogo.current?.close()}
            aria-label="Cerrar"
            className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-bg-dark text-white shadow-card outline-none transition-colors hover:bg-primary focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </dialog>
    </>
  )
}

export interface ItemMaqueta {
  id: string
  titulo: string
  descripcion: string
  imagen: string
}

/** Proporciones de las imágenes exportadas: teléfono (vertical) y navegador (horizontal). */
const DIMENSIONES = {
  movil: { ancho: 1004, alto: 1968, sizes: "(min-width: 1024px) 320px, 300px" },
  web: { ancho: 2720, alto: 1780, sizes: "(min-width: 1024px) 960px, 100vw" },
} as const

/**
 * Recorrido por las pantallas de un dispositivo: la imagen grande (ampliable)
 * y, al lado o debajo, la lista de pantallas para cambiar de una a otra.
 */
export function RecorridoMaquetas({
  items,
  formato,
}: {
  items: ItemMaqueta[]
  formato: "movil" | "web"
}) {
  const [i, setI] = useState(0)
  const actual = items[i] ?? items[0]
  const movil = formato === "movil"
  const dim = DIMENSIONES[formato]

  const imagen = (
    // La key reinicia la animación de entrada al cambiar de pantalla
    <div key={actual.id} className={`motion-safe:animate-aparecer ${movil ? "mx-auto w-full max-w-[300px]" : "w-full"}`}>
      <VisorImagen
        src={actual.imagen}
        titulo={actual.titulo}
        descripcion={actual.descripcion}
        ancho={dim.ancho}
        alto={dim.alto}
        sizes={dim.sizes}
      />
    </div>
  )

  const lista = (
    <div className={movil ? "flex flex-col gap-3" : "grid gap-3 sm:grid-cols-3"}>
      {items.map((x, n) => {
        const activa = n === i
        return (
          <button
            key={x.id}
            type="button"
            onClick={() => setI(n)}
            aria-pressed={activa}
            className={`flex items-start gap-4 rounded-2xl border p-4 text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary ${
              activa
                ? "border-primary/40 bg-surface shadow-hover ring-1 ring-primary/20"
                : "border-border bg-surface/60 hover:border-primary/30 hover:bg-surface"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-semibold tabular-nums ${
                activa ? "bg-primary text-white" : "bg-primary-light text-primary"
              }`}
            >
              {String(n + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold leading-snug text-text-primary">{x.titulo}</span>
              {x.descripcion && (
                <span className="mt-0.5 block text-pretty text-sm leading-snug text-text-secondary">{x.descripcion}</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )

  return movil ? (
    <div className="grid items-center gap-8 lg:grid-cols-[320px_1fr] lg:gap-14">
      {imagen}
      {lista}
    </div>
  ) : (
    <div className="space-y-6">
      {imagen}
      {lista}
    </div>
  )
}
