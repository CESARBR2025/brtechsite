// Captura secciones del sitio vía Chrome DevTools Protocol (Node 22: fetch + WebSocket nativos).
// Lo lanza capturas.sh (Chrome ya escuchando en :9333). TRABAJOS: [{nombre, ruta, w, h, sel, maxH?}]
// donde `sel` es una expresión JS que devuelve el elemento a recortar.
import { writeFileSync } from "node:fs"
const [, , base, salida] = process.argv
const trabajos = JSON.parse(process.env.TRABAJOS)
const t = await (await fetch("http://127.0.0.1:9333/json/new?about:blank", { method: "PUT" })).json()
const ws = new WebSocket(t.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0; const pend = new Map()
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id) } }
const cmd = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
const evalua = async (expr) => (await cmd("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result.result.value
await cmd("Page.enable"); await cmd("Runtime.enable")
for (const tr of trabajos) {
  await cmd("Emulation.setDeviceMetricsOverride", { width: tr.w, height: tr.h, deviceScaleFactor: 2, mobile: tr.w < 600 })
  await cmd("Page.navigate", { url: base + tr.ruta }); await dormir(3500)
  // Recorre la página para disparar la carga diferida de imágenes
  await evalua(`(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}})()`)
  const rect = await evalua(`(()=>{const el=${tr.sel}; el.scrollIntoView({block:'start'}); const r=el.getBoundingClientRect(); return {x:0,y:r.top+scrollY,w:innerWidth,h:Math.min(r.height, ${tr.maxH ?? 99999})}})()`)
  if (tr.hover) await evalua(tr.hover)
  await dormir(1800)
  const shot = await cmd("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: rect.x, y: rect.y, width: rect.w, height: rect.h, scale: 1 } })
  writeFileSync(`${salida}/${tr.nombre}.png`, Buffer.from(shot.result.data, "base64"))
  console.log(tr.nombre, rect)
}
ws.close(); process.exit(0)
