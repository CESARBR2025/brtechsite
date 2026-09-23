"""
Sistema visual de las publicaciones de BR TECH (Instagram/Facebook).

Cada publicación es un script (p. ej. carrusel_sitio.py) que arma diapositivas
HTML con estas piezas; `render.sh <nombre>` las convierte a PNG 2160x2700 (4:5).
Misma línea visual que el sitio: fondo bg-dark con rejilla violeta, velo del
hero, Inter 800 con interletrado cerrado, degradado F1EBFF -> 7836E2, pastillas
con punto, etiqueta con guion, marcos oscuros con resplandor y pie con íconos.
"""

import os
import shutil

AQUI = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.normpath(os.path.join(AQUI, "..", "..", "public"))

GLOBO = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2c-3.5 3.5-3.5 16.5 0 20M12 2c3.5 3.5 3.5 16.5 0 20M2 12h20"/></svg>'
INSTA = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg>'
CHECK = '<b style="color:#C9B5F5;margin-right:14px">✓</b>'

CSS = """
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=block");
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;overflow:hidden;background:#151127;font-family:Inter,sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
.s{position:relative;width:1080px;height:1350px;overflow:hidden;background:#151127}
.rejilla{position:absolute;inset:0;background-image:linear-gradient(rgba(120,54,226,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(120,54,226,.08) 1px,transparent 1px);background-size:64px 64px}
.blob{position:absolute;border-radius:50%;background:rgba(120,54,226,.22);filter:blur(90px)}
.top{position:absolute;top:56px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:center;z-index:5}
.top img{height:54px}
.num{font-family:"JetBrains Mono",monospace;font-size:24px;color:rgba(201,181,245,.75);letter-spacing:1px}
.eti{display:flex;align-items:center;gap:16px;font-size:22px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.6)}
.eti:before{content:"";width:48px;height:2px;background:#7836E2}
.pill{display:inline-flex;align-items:center;gap:14px;padding:12px 26px;border-radius:999px;border:1.5px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);font-size:24px;color:rgba(255,255,255,.88)}
.dot{width:12px;height:12px;border-radius:50%;background:#7836E2;box-shadow:0 0 14px 4px rgba(120,54,226,.7)}
.dot.v{background:#10B981;box-shadow:0 0 12px 3px rgba(16,185,129,.55)}
h1,h2{font-weight:800;letter-spacing:-.035em;line-height:1.02}
.grad{background:linear-gradient(135deg,#F1EBFF 30%,#7836E2);-webkit-background-clip:text;background-clip:text;color:transparent}
.p{font-size:32px;line-height:1.45;color:rgba(255,255,255,.72)}
.pie{position:absolute;left:0;right:0;bottom:56px;display:flex;justify-content:center;align-items:center;gap:48px;font-size:26px;font-weight:700;color:#C9C3D9;z-index:5}
.pie span{display:inline-flex;align-items:center;gap:12px}
.linea{position:absolute;left:390px;width:300px;height:2px;bottom:118px;background:linear-gradient(90deg,transparent,#7836E2,transparent);z-index:5}
.desliza{position:absolute;right:72px;bottom:60px;font-size:24px;font-weight:600;color:rgba(255,255,255,.55);z-index:6}
.marco{border-radius:22px;border:1.5px solid rgba(255,255,255,.12);overflow:hidden;box-shadow:0 0 120px -30px rgba(120,54,226,.7),0 40px 80px -30px rgba(0,0,0,.8);background:#0b0914}
.barra{height:44px;display:flex;align-items:center;gap:10px;padding:0 20px;border-bottom:1px solid rgba(255,255,255,.08);background:#110e1f}
.barra i{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.18)}
.barra b{margin-left:14px;font-weight:500;font-size:18px;color:rgba(255,255,255,.5);background:rgba(255,255,255,.06);padding:5px 16px;border-radius:999px}
.marco img{display:block;width:100%}
.tarjeta-logo{width:380px;height:250px;border-radius:32px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 30px 80px -30px rgba(0,0,0,.8)}
.boton{display:inline-flex;align-items:center;gap:16px;padding:30px 56px;border-radius:999px;background:linear-gradient(90deg,#7836E2,#471FA3);font-size:36px;font-weight:700;box-shadow:0 20px 60px -15px rgba(120,54,226,.9),inset 0 1px 0 rgba(255,255,255,.25)}
"""

# Fondos listos para `pagina(fondo=...)`
FONDO_REJILLA = '<div class="rejilla"></div>'
FONDO_VELO = ('<img src="velo-poster.webp" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"/>'
              '<div style="position:absolute;inset:0;background:linear-gradient(transparent 50%,#151127 88%)"></div>')
# Cierre: velo invertido sobre negro (eco del CTA final del sitio)
FONDO_VELO_INVERTIDO = ('<div style="position:absolute;inset:0;background:#000"></div>'
                        '<img src="velo-poster.webp" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scaleY(-1) translateY(-12%)"/>')

# Recursos que toda publicación necesita (se copian junto a las diapositivas)
ASSETS_BASE = ["logo.png", "fondos/velo-poster.webp"]


def preparar(nombre, assets_public=(), assets_propios=()):
    """Crea salida/<nombre>/ y copia ahí los recursos (de public/ y de assets/)."""
    destino = os.path.join(AQUI, "salida", nombre)
    os.makedirs(destino, exist_ok=True)
    for ruta in [*ASSETS_BASE, *assets_public]:
        shutil.copy(os.path.join(PUBLIC, ruta), destino)
    for ruta in assets_propios:
        shutil.copy(os.path.join(AQUI, ruta), destino)
    return destino


def pie(desliza=True):
    extra = '<div class="desliza">Desliza →</div>' if desliza else ""
    return (f'<div class="linea"></div><div class="pie"><span>{GLOBO}brtechds.com</span>'
            f'<span>{INSTA}@cesarbr_dev</span></div>{extra}')


def pagina(n, total, cuerpo, fondo=FONDO_REJILLA, desliza=True):
    top = (f'<div class="top"><img src="logo.png"/>'
           f'<span class="num">{n:02d} / {total:02d}</span></div>')
    return (f'<!doctype html><html lang="es"><head><meta charset="utf-8"><style>{CSS}</style></head>'
            f'<body><div class="s">{fondo}{top}{cuerpo}{pie(desliza)}</div></body></html>')


def lista(items, size=28):
    filas = "".join(
        f'<div style="display:flex;align-items:flex-start;padding:18px 0;border-top:1px solid rgba(255,255,255,.1);'
        f'font-size:{size}px;line-height:1.35;color:rgba(255,255,255,.85)">{CHECK}<span>{t}</span></div>'
        for t in items)
    return filas + '<div style="border-top:1px solid rgba(255,255,255,.1)"></div>'


def dato(valor, texto):
    return ('<div style="flex:1;border-radius:28px;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);padding:34px 30px">'
            f'<div style="font-size:88px;font-weight:800;letter-spacing:-.04em;line-height:1">{valor}</div>'
            f'<div style="margin-top:14px;font-size:24px;color:rgba(255,255,255,.6)">{texto}</div></div>')


def escribir(destino, slides):
    for n, html in slides.items():
        with open(os.path.join(destino, f"slide-{n}.html"), "w") as f:
            f.write(html)
    print(f"{len(slides)} diapositivas en {destino}")
