#!/usr/bin/env bash
# Renderiza salida/<nombre>/slide-*.html a PNG 2160x2700 (4:5, a 2x) + una vista general.
# Uso: marketing/redes/render.sh parrilla
set -euo pipefail
AQUI="$(cd "$(dirname "$0")" && pwd)"
NOMBRE="${1:?Uso: render.sh <nombre>}"
DIR="$AQUI/salida/$NOMBRE"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p "$DIR/png"
for html in "$DIR"/slide-*.html; do
  base="$(basename "$html" .html)"
  # perl alarm: el Chrome headless a veces no termina solo
  ( perl -e 'alarm 40; exec @ARGV' "$CH" --headless=new --hide-scrollbars --allow-file-access-from-files \
    --force-device-scale-factor=2 --window-size=1080,1350 --virtual-time-budget=5000 \
    --screenshot="$DIR/png/$base.png" --user-data-dir="$AQUI/salida/.chrome" "file://$html" >/dev/null 2>&1 || true ) 2>/dev/null
  echo "  $base.png"
done
python3 - "$DIR" <<'PY'
import sys, glob
from PIL import Image
d = sys.argv[1]
fs = sorted(glob.glob(f"{d}/png/slide-*.png"), key=lambda f: int(f.split("-")[-1].split(".")[0]))
ims = [Image.open(f).resize((540, 675), Image.LANCZOS) for f in fs]
h = Image.new("RGB", (550 * len(ims) - 10, 675), (40, 40, 40))
for i, im in enumerate(ims):
    h.paste(im, (i * 550, 0))
h.save(f"{d}/vista.png")
print(f"Vista general: {d}/vista.png")
PY
