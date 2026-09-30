import Image from "next/image"
import type { Servicio } from "@/src/ui/marketing/servicios/datos"

/** Foto del servicio con una etiqueta de vidrio flotante (el toque de producto). */
export function FotoServicio({ foto, prioridad = false }: { foto: Servicio["foto"]; prioridad?: boolean }) {
  return (
    <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-bg-dark shadow-[0_24px_50px_-24px_rgba(21,17,39,0.6)]">
      <Image
        src={foto.src}
        alt={foto.alt}
        fill
        sizes="(min-width: 1024px) 600px, 100vw"
        className="object-cover"
        priority={prioridad}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg-deep/50 via-transparent to-transparent" />
      <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-bg-dark/60 px-3.5 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md sm:bottom-5 sm:left-5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
        </span>
        {foto.etiqueta}
      </span>
    </div>
  )
}
