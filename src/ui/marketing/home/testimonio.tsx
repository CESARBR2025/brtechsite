import { Quote, Star } from "lucide-react"

/**
 * Testimonio destacado del cliente.
 *
 * Mientras `cita` esté vacío, la sección no se renderiza (no inventamos
 * palabras del cliente). Cuando tengas la cita real de Parrilla Norteña:
 *   1. Llena `cita`, `autor` y `puesto`.
 *   2. Opcional: agrega su foto en `/public/clientes/parrilla-nortena/`
 *      y ponla en `foto` (si no, se muestran las iniciales).
 */
const testimonio = {
  cita: "",
  autor: "",
  puesto: "Sucursal Club Punta Nogal · Parrilla Norteña",
  foto: "",
  estrellas: 5,
}

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
}

export function TestimonioSection() {
  if (!testimonio.cita) return null

  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-card sm:p-12">
          <Quote className="h-10 w-10 text-primary-light" aria-hidden />

          <div className="mt-2 flex gap-1">
            {Array.from({ length: testimonio.estrellas }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-warning text-warning"
                aria-hidden
              />
            ))}
          </div>

          <blockquote className="mt-4 text-lg font-medium leading-relaxed text-text-primary sm:text-xl">
            &ldquo;{testimonio.cita}&rdquo;
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light text-sm font-semibold text-primary">
              {testimonio.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={testimonio.foto}
                  alt={testimonio.autor}
                  className="h-full w-full object-cover"
                />
              ) : (
                iniciales(testimonio.autor)
              )}
            </div>
            <div>
              {testimonio.autor && (
                <p className="text-sm font-semibold text-text-primary">
                  {testimonio.autor}
                </p>
              )}
              <p className="text-xs text-text-muted">{testimonio.puesto}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
