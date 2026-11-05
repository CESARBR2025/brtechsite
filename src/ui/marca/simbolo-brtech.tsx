import { useId } from "react"
import { contenidoSimboloSvg } from "./geometria-diafragma"

export function SimboloBrTech({ className, titulo }: { className?: string; titulo?: string }) {
  const id = useId()
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-104 -104 208 208"
      className={className}
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      dangerouslySetInnerHTML={{ __html: contenidoSimboloSvg(id) }}
    />
  )
}
