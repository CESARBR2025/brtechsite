/**
 * Entrada "blur text", inspirada en React Bits (BlurText) pero solo con CSS:
 * cada palabra aparece desenfocándose, una tras otra, una sola vez.
 * Server component: el texto completo viene en el HTML (lectores y SEO lo
 * leen normal); con movimiento reducido no hay animación.
 */
export function TextoDesenfocado({
  texto,
  retrasoMs = 0,
  pasoMs = 110,
}: {
  texto: string
  retrasoMs?: number
  /** Separación entre palabras. */
  pasoMs?: number
}) {
  const palabras = texto.split(/\s+/).filter(Boolean)
  return (
    <>
      {palabras.map((p, i) => (
        <span key={i}>
          <span
            className="inline-block motion-safe:animate-desenfoque"
            style={{ animationDelay: `${retrasoMs + i * pasoMs}ms` }}
          >
            {p}
          </span>
          {i < palabras.length - 1 && " "}
        </span>
      ))}
    </>
  )
}
