/*
 * Service worker del panel (scope /panel/). Deliberadamente mínimo:
 * - No guarda páginas del panel en caché (son privadas y cambian siempre).
 * - Si una navegación falla por falta de red, muestra la página sin conexión.
 * Al cambiar este archivo, sube VERSION para renovar la caché.
 */
const VERSION = "panel-v1"
const OFFLINE = "/panel-sin-conexion.html"
const PRECARGA = [OFFLINE, "/pwa/icono-192.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECARGA)))
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return
  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE)))
})
