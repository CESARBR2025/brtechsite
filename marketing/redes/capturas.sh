#!/usr/bin/env bash
# Toma capturas del sitio en producción (o de BASE) a 2x -> salida/capturas/
# Usa el protocolo de depuración de Chrome (capturar.mjs) para bajar a cada sección
# y esperar sus imágenes. WebGL desactivado: el velo sale con su imagen fija.
set -euo pipefail
AQUI="$(cd "$(dirname "$0")" && pwd)"
BASE="${BASE:-https://www.brtechds.com}"
OUT="$AQUI/salida/capturas"; mkdir -p "$OUT"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-webgl --disable-3d-apis --hide-scrollbars --remote-debugging-port=9333 \
  --user-data-dir="$AQUI/salida/.chrome-cdp" about:blank >/dev/null 2>&1 &
CPID=$!; trap 'kill $CPID 2>/dev/null' EXIT; sleep 3
sec() { echo "[...document.querySelectorAll(\\\"section\\\")].find(s=>s.textContent.includes(\\\"$1\\\"))"; }
TRABAJOS="[
 {\"nombre\":\"inicio\",\"ruta\":\"/\",\"w\":1440,\"h\":900,\"sel\":\"document.body\",\"maxH\":900},
 {\"nombre\":\"movil\",\"ruta\":\"/\",\"w\":390,\"h\":844,\"sel\":\"document.body\",\"maxH\":844},
 {\"nombre\":\"sec-problemas\",\"ruta\":\"/\",\"w\":1440,\"h\":900,\"sel\":\"$(sec 'Problemas que cuestan dinero')\"},
 {\"nombre\":\"sec-servicios\",\"ruta\":\"/\",\"w\":1440,\"h\":900,\"sel\":\"$(sec 'Lo que construimos para tu negocio')\"},
 {\"nombre\":\"sec-proyectos\",\"ruta\":\"/\",\"w\":1440,\"h\":900,\"sel\":\"document.getElementById(\\\"proyectos\\\")\"},
 {\"nombre\":\"sec-proceso\",\"ruta\":\"/\",\"w\":1440,\"h\":900,\"sel\":\"$(sec 'Así construimos tu sistema')\"}
]"
TRABAJOS="$TRABAJOS" perl -e 'alarm 180; exec @ARGV' node "$AQUI/capturar.mjs" "$BASE" "$OUT"
