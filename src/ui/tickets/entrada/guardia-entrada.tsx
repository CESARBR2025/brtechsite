import { claveEntrada } from "./decision-entrada"

/** Se coloca antes del contenido para decidir la entrada antes del primer pintado. */
export function GuardiaEntrada({ slug }: { slug: string }) {
  const clave = JSON.stringify(claveEntrada(slug)).replace(/</g, "\\u003c")
  const codigo = `try { if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.localStorage.getItem(${clave}) === null) { document.documentElement.dataset.entrada = "1"; } } catch {}`
  return <script dangerouslySetInnerHTML={{ __html: codigo }} />
}
