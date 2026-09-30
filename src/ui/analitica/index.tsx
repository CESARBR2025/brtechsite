import Script from "next/script"

/*
 * Analítica del sitio público:
 * - Umami Cloud (sin cookies): visitas, fuentes y eventos que importan
 *   comercialmente. `data-domains` limita el conteo al sitio en producción.
 * - Microsoft Clarity: mapas de calor y grabaciones de sesión. No tiene
 *   filtro de dominio propio, así que el snippet solo carga en brtechds.com.
 *   Lo que se escribe en formularios va enmascarado (`data-clarity-mask`).
 * En localhost y en previews no se registra nada.
 *
 * Los eventos se marcan con atributos (`{...evento("whatsapp", { origen: "footer" })}`):
 * Umami escucha los clics y los registra, sin JS extra en cada botón.
 */

const UMAMI_WEBSITE_ID = "ba573bdf-f780-4156-95ef-392432e17744"
const DOMINIOS = "www.brtechds.com,brtechds.com"
const CLARITY_ID = "yq7skmboqk"

// Snippet oficial de Clarity, envuelto en la guarda de dominio
const snippetClarity = `if (${JSON.stringify(DOMINIOS.split(","))}.includes(location.hostname)) {
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", ${JSON.stringify(CLARITY_ID)});
}`

export type NombreEvento =
  | "whatsapp"
  | "agendar-consulta"
  | "cotizar-servicio"
  | "contacto-enviado"

type Propiedades = Record<string, string | number>

/** Atributos `data-umami-event*` para esparcir en un enlace o botón. */
export function evento(nombre: NombreEvento, propiedades: Propiedades = {}): Record<string, string> {
  const atributos: Record<string, string> = { "data-umami-event": nombre }
  for (const [clave, valor] of Object.entries(propiedades)) {
    atributos[`data-umami-event-${clave}`] = String(valor)
  }
  return atributos
}

declare global {
  interface Window {
    umami?: { track: (nombre: string, datos?: Propiedades) => void }
  }
}

/** Registra un evento desde código (p. ej. al enviar un formulario con éxito). */
export function registrarEvento(nombre: NombreEvento, propiedades?: Propiedades) {
  window.umami?.track(nombre, propiedades)
}

export function Analitica() {
  return (
    <>
      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id={UMAMI_WEBSITE_ID}
        data-domains={DOMINIOS}
        strategy="afterInteractive"
      />
      <Script id="clarity" strategy="afterInteractive">
        {snippetClarity}
      </Script>
    </>
  )
}
