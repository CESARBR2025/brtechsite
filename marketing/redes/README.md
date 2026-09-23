# Publicaciones para redes (Instagram / Facebook)

Carruseles y posts con la **misma línea visual del sitio**, hechos como HTML y
renderizados a PNG con el Chrome de la Mac (sin extensión, en modo headless).

## Uso rápido

```bash
# Caso de éxito Parrilla Norteña Soft
python3 marketing/redes/carrusel_parrilla.py && marketing/redes/render.sh parrilla

# "Nuestro sitio se renovó" (necesita capturas del sitio en vivo)
marketing/redes/capturas.sh
python3 marketing/redes/carrusel_sitio.py && marketing/redes/render.sh sitio
```

Resultado en `marketing/redes/salida/<nombre>/png/slide-N.png` (2160×2700, 4:5) y una
vista general en `salida/<nombre>/vista.png`. `salida/` no se versiona.

Requisitos: Google Chrome en `/Applications`, Python 3 con Pillow, Node 22+.

## Nueva publicación

1. Copia `carrusel_parrilla.py` como plantilla y cambia textos/imágenes.
2. Recursos: `preparar(nombre, assets_public=[rutas dentro de public/], assets_propios=["assets/..."])`.
3. Arma cada diapositiva con `pagina(n, total, cuerpo, fondo=..., desliza=...)`.
4. `render.sh <nombre>` y revisa `vista.png`: **nada debe encimarse con el pie** (la
   línea del pie está en y≈1232 de 1350; deja el contenido por encima de ~1190).

## Sistema visual (`sistema.py`)

| Pieza | Cómo |
|---|---|
| Lienzo | 1080×1350 CSS, render a 2x. Fondo `#151127` (bg-dark) + rejilla violeta 64 px |
| Portada | `FONDO_VELO`: imagen fija del velo del hero (`public/fondos/velo-poster.webp`) |
| Cierre | `FONDO_VELO_INVERTIDO`: negro + velo invertido (eco del CTA final del sitio) |
| Encabezado fijo | Logo arriba a la izquierda, contador `01 / 05` en mono violeta a la derecha |
| Pie fijo | Línea violeta + ícono globo **brtechds.com** + ícono Instagram **@cesarbr_dev**; "Desliza →" salvo en la última |
| Títulos | Inter 800, `letter-spacing:-.035em`, 84–112 px; parte final con `.grad` (F1EBFF → 7836E2) |
| Etiquetas | `.eti` (mayúsculas con guion violeta) o `.pill` con `.dot` (violeta) / `.dot.v` (verde = en producción) |
| Capturas/fotos | `.marco` (borde fino, radio 22, resplandor violeta); navegador con `.barra` |
| Logos de marca | `.tarjeta-logo` (blanca). BR TECH sobre blanco = `assets/logo-claro.png` (letras negras) |
| Datos | `dato(valor, texto)`; listas con `lista([...])` (checks violeta, líneas finas) |
| CTA | `.boton` morado degradado + "Cotización gratuita y sin compromiso" |

## Reglas

- **Solo datos reales** ya publicados en el sitio (2 sucursales, en producción 2026…). Nada de cifras inventadas.
- Colores: violeta de marca; verde/ámbar solo como estado. Sin naranjas de clientes como acento.
- Pedir permiso al cliente antes de publicar su logo o fotos.
- La extensión Claude in Chrome suele no estar conectada: por eso todo usa Chrome headless.
  `perl -e 'alarm N; exec ...'` evita que Chrome se quede colgado (macOS no trae `timeout`).
- Capturas del sitio: `capturas.sh` desactiva WebGL (el velo sale con su imagen fija; el WebGL
  por software pinta negro) y usa CDP para bajar a cada sección y esperar sus imágenes.
  Emulación móvil real = 390×844 con `mobile:true` (una ventana headless angosta da falsos desbordes).
