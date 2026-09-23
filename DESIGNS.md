# DESIGNS.md — Sistema de Diseño BR TECH

Guía única de estilos para el sitio. **Toda feature nueva se construye con estos tokens y recetas.**
No inventes colores, radios ni sombras fuera de esta tabla; si algo falta, se agrega aquí primero.

Base: `src/styles/globals.css` (`@theme` de Tailwind v4) + spec FinPay Dashboard de `AGENTS.md`.
Fuente: **Inter** (cargada en `src/app/layout.tsx` vía `next/font`, expuesta como `--font-inter`).
`--font-sans` apunta a esa variable en `globals.css`, así que `font-sans` usa Inter con su fallback
métrico (`Inter Fallback`, evita saltos de layout). No declares `font-family` a mano.

---

## 1. Tokens

### Color (clases Tailwind ya generadas desde `@theme`)

| Token | HEX | Clase | Uso |
|---|---|---|---|
| `primary` | `#7836E2` | `bg-primary` `text-primary` `border-primary` | Marca, CTA primario, elementos activos, íconos destacados |
| `primary-hover` | `#471FA3` | `hover:bg-primary-hover` | Hover de botones, extremo profundo de degradados |
| `primary-light` | `#F1EBFF` | `bg-primary-light` `text-primary` | Fondos suaves, badges de marca, "eyebrow" labels, botón secundario |
| `success` | `#10B981` | `bg-success` `text-success` | Estado OK, "Publicado", "Pagado", indicadores positivos |
| `success-light` | `#D1FAE5` | `bg-success-light` | Fondo de pills de estado positivo |
| `warning` | `#F59E0B` | `bg-warning` `text-warning` | "Pendiente", alertas, ratings |
| `bg-dark` | `#151127` | `bg-bg-dark` | **Fondo de todas las secciones oscuras** (con rejilla + resplandor), footer, heros de páginas internas, tinte del navbar de vidrio, bloque "Conoce más" |
| `bg-deep` | `#000000` | `bg-bg-deep` | **Solo donde vive el velo:** hero de Inicio y el panel del CTA final (su eco). Negro puro para maximizar el contraste del violeta; el hero funde a `bg-dark` |
| `surface-dark` | `white / 3%` | `bg-surface-dark` | Tarjetas y paneles sobre fondo oscuro |
| `surface-dark-hover` | `white / 6%` | `hover:bg-surface-dark-hover` | Hover de tarjeta o botón-ícono sobre oscuro |
| `line-dark` | `white / 8%` | `border-line-dark` `divide-line-dark` | Bordes finos y divisores sobre oscuro |
| `line-dark-strong` | `white / 16%` | `hover:border-line-dark-strong` | Borde en hover/foco sobre oscuro |
| `text-primary` | `#111827` | `text-text-primary` | Títulos, montos grandes |
| `text-secondary` | `#374151` | `text-text-secondary` | Párrafos, labels de formulario |
| `text-muted` | `#6B7280` | `text-text-muted` | Texto atenuado, placeholders, metadatos |
| `border` | `#E5E7EB` | `border-border` | Bordes de cards, divisores de tabla |
| `bg-section` | `#F9FAFB` | `bg-bg-section` | Fondo de sección alterna, hover de filas |
| `background` | `#F9FAFB` | — | Fondo del `body` |
| `surface` | `#FFFFFF` | `bg-surface` | Cards, modales, inputs, panel |

**Rojo de error** (no está en `@theme`, se usa Tailwind base): `text-red-500`, `bg-red-500/10`, `border-red-500/20`.

**Excepción — paleta por propuesta:** las páginas `/propuesta/[cliente]` usan un acento por cliente
(`prop-primary #E1430E` / `prop-primary-light #FDF2EE`, o colores inline). Esto es **solo** para
esas landings de venta personalizadas. Ninguna otra feature usa acento distinto a `primary`.

### Radio

| Token | Valor | Uso |
|---|---|---|
| `rounded-md` (`--radius-md` 8px) | inputs pequeños, chips |
| `rounded-lg` (`--radius-lg` 12px) | **botones**, inputs de formulario, celdas |
| `rounded-xl` / `rounded-2xl` (16px) | **cards**, paneles, contenedores destacados |
| `rounded-full` | pills, badges, avatares, botones-ícono |

### Sombra

| Clase | Uso |
|---|---|
| `shadow-card` | reposo de una card |
| `shadow-hover` | hover de card interactiva (tinte violeta) |
| `shadow-elevated` | popovers, dropdowns |
| `shadow-modal` | modales / diálogos |
| `shadow-lg shadow-primary/25` | botón primario (glow de marca) |
| `shadow-lg shadow-success/25` | confirmaciones en verde |
| `shadow-glow` | resplandor violeta difuso de una tarjeta destacada sobre oscuro |

### Tipografía

| Elemento | Clases |
|---|---|
| H1 (hero de Inicio / display) | `text-[40px] sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-[-0.035em] text-white` |
| H1 (hero oscuro interno) | `text-[28px] sm:text-4xl md:text-5xl font-bold leading-tight text-white` |
| H1 (página clara) | `text-[28px] sm:text-4xl font-bold text-text-primary` |
| H2 (sección) | `text-[22px] sm:text-3xl font-bold text-text-primary` |
| H3 (card) | `text-lg font-semibold text-text-primary` |
| Eyebrow / label | `text-xs font-semibold uppercase tracking-wider text-primary` |
| Párrafo | `text-sm sm:text-base leading-relaxed text-text-secondary` |
| Metadato / caption | `text-xs text-text-muted` |
| Monto grande | `text-lg font-bold text-text-primary` (o `text-2xl`/`text-3xl` para el total) |

Móvil primero: se fija el tamaño chico y se escala con `sm:` / `md:`.

---

## 2. Layout

> **Dirección (sept 2026): Inicio es un lienzo oscuro continuo.** El hero es negro total (`bg-deep`);
> todo lo demás, footer incluido, va sobre `bg-dark` con rejilla desvanecida + un resplandor. El ritmo
> entre secciones lo dan la tipografía, el espacio y las superficies `surface-dark`, no el cambio de
> color de fondo. Nada de secciones blancas, grises o moradas planas en Inicio.
> **Servicios** ya está en el mismo sistema (hero + un bloque por servicio + "Cómo trabajamos" + `CTAFinal`).
> Contacto se migrará; mientras tanto conserva sus secciones claras.
> **Sin montos en el sitio de marketing:** la inversión se cotiza. En Servicios solo se listan los
> factores que definen la inversión (sin precios); el contenido vive en `servicios/datos.ts`.

```tsx
// Sección estándar
<section className="relative overflow-hidden py-16 sm:py-24">
  {/* variantes de fondo: (nada) | bg-bg-section | bg-bg-dark  (bg-bg-deep solo en hero de Inicio) */}
  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* contenido */}
  </div>
</section>
```

- **Contenedor:** `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` (usa `max-w-6xl` / `max-w-3xl` para texto centrado o documentos angostos como un ticket).
- **Ritmo vertical de sección:** `py-16 sm:py-24`.
- **Grid de cards:** `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`.
- **Encabezado de sección:** bloque centrado `mx-auto max-w-2xl text-center` con eyebrow pill + H2.
- **Navbar flotante:** el header es `fixed` (no ocupa espacio en el flujo). Todo hero bajo el layout de
  marketing arranca con `pt-36 sm:pt-44` (o `sm:pt-40`) para no quedar debajo de la píldora.

---

## 3. Recetas de componentes

### Botón primario
```tsx
<button className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70">
  Texto <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
</button>
```
Variante énfasis: `bg-gradient-to-r from-primary to-primary-hover shadow-primary/30`.
CTA principal sobre fondo oscuro → usar **Botón especular** (abajo) con estas mismas clases.

### Botón secundario
- Sobre claro: `rounded-full bg-primary-light px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white`
- Sobre oscuro: `rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-medium text-white/85 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10 hover:text-white`
  (no `text-text-muted` sobre oscuro: no alcanza contraste 4.5:1).

### Íconos en botones
Un solo ícono **direccional al final** que dice qué va a pasar; el botón lleva `group`.
- Navega a otra página → `<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />`
- Baja dentro de la misma página (ancla) → `<ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />`
- Nada de íconos al inicio + al final en el mismo botón, ni chevrons (`ChevronRight`), ni íconos decorativos.

### Card
```tsx
<div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card transition-all hover:border-primary/30 hover:shadow-hover">
```
Card estática (sin hover): quita `group`, `transition-all` y los `hover:*`.

### Eyebrow pill
```tsx
<div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-1.5 text-xs font-medium text-primary">
  Etiqueta
</div>
```

### Badge de estado
| Estado | Clases |
|---|---|
| Positivo (Publicado, Pagado, Exitoso) | `inline-flex items-center gap-1.5 rounded-full bg-success-light px-2.5 py-0.5 text-xs font-semibold text-success` |
| Pendiente / alerta | `... bg-warning/15 text-warning` |
| Neutro / borrador | `... bg-bg-section text-text-muted` |

### Icon tile
- Chico: `flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary/10 text-primary shadow-sm` — ícono `h-6 w-6`.
- Grande (timeline/paso): `flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover shadow-lg shadow-primary/20` — ícono `h-7 w-7 text-white`.

### Input de formulario
```tsx
<div className="relative">
  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
    <User className="h-4 w-4 text-text-muted" />
  </div>
  <input
    name="campo"
    className="w-full rounded-lg border border-border py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder-text-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
  />
</div>
```
Error de campo/formulario: `rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-500`.

### Lista con check
```tsx
<li className="flex items-center gap-1.5 text-xs text-text-secondary">
  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success-light">
    <Check className="h-2.5 w-2.5 text-success" />
  </span>
  Texto
</li>
```

### Estado de éxito (post-envío)
```tsx
<div className="flex flex-col items-center rounded-2xl border border-success/20 bg-gradient-to-br from-surface to-success-light/30 px-6 py-12 text-center shadow-card">
  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success text-white shadow-lg shadow-success/25">
    <CheckCircle className="h-10 w-10" />
  </div>
  {/* H3 + párrafo */}
</div>
```

### Tarjeta sobre oscuro
```tsx
<div className="rounded-2xl border border-line-dark bg-surface-dark p-6 transition-colors hover:border-line-dark-strong hover:bg-surface-dark-hover">
```
Sin `shadow-card` (las sombras no se ven sobre negro); para destacar una, `shadow-glow`.
Títulos `text-white`, cuerpo `text-white/65`, etiquetas `text-xs uppercase tracking-wider text-white/55`.

### Encabezado de sección sobre oscuro
Alineado a la izquierda, sin pill: etiqueta con guion violeta + H2 grande + párrafo.
```tsx
<p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/55">
  <span className="h-px w-8 bg-primary" /> Etiqueta
</p>
<h2 className="mt-5 text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl">…</h2>
<p className="mt-5 text-pretty text-base leading-relaxed text-white/65 sm:text-lg">…</p>
```
Ritmo de sección oscura: `relative overflow-hidden bg-bg-dark py-24 sm:py-32` + la rejilla sutil de
"Decoración" con `[mask-image:radial-gradient(ellipse_at_X%_Y%,black_5%,transparent_60%)]` (varía X/Y por
sección para que no se repita) + un blob `bg-primary/10 blur-3xl`. Si la sección tiene un bloque `sticky`, usa
`overflow-clip` en lugar de `overflow-hidden` (hidden crea un contenedor de scroll y rompe el sticky). Listas: `divide-y divide-line-dark border-y border-line-dark`
con numeración `font-mono text-primary-light/60` (`01`, `02`…).

### Tarjeta foco (`src/ui/primitivos/tarjeta-foco.tsx`)
Tarjeta sobre oscuro con un foco violeta que sigue al puntero (solo CSS). Jerarquía dentro de la
tarjeta: mini ilustración de interfaz (o ícono) → número `01` → **nombre de lo que ofreces** (lo más
grande) → descripción → lista → enlace. Nada de lemas en mayúsculas por encima del título. Íconos y checks en `text-primary-light`
(el verde queda para estados). Para ofertas del mismo peso, tarjetas iguales en fila (`md:grid-cols-3`).
Enlace de la tarjeta = **píldora**: botón secundario sobre oscuro que se tiñe con el hover de la tarjeta
(`group-hover:border-primary/50 group-hover:bg-primary/15`) y se llena al pasar sobre ella
(`hover:!bg-primary hover:!border-primary`); usa `group/enlace` para animar su propia flecha.

### Mini ilustraciones de interfaz (`src/ui/marketing/home/ilustraciones-servicios.tsx`)
Para que una tarjeta **muestre** lo que ofrece en lugar de solo decirlo: una mini UI en un marco
`h-40 rounded-xl border border-line-dark bg-bg-deep/40`, con barras en degradado `primary-hover → primary`.
El color extra entra **solo como estado** (verde = en línea, ámbar = reabastecer); nunca colores por
industria. Se animan con `group-hover` de la tarjeta, siempre bajo `motion-safe:`, y llevan `aria-hidden`.
Datos genéricos, nunca de clientes reales.

### Galería en acordeón (`src/ui/primitivos/galeria-acordeon.tsx`)
Adaptada de React Bits `AccordionGallery`, **sin GSAP** (transiciones CSS). Paneles de fotos que se
abren con hover (mouse), toque o flechas del teclado; los cerrados van en gris y oscurecidos, así las
fotos de clientes con colores propios (naranjas, rojos) no compiten con la paleta hasta que se abren.
Uso: casos de éxito con 3–5 fotos reales. Fotos en `public/clientes/<cliente>/` como WebP sin metadatos.
Mockups de apps móviles (PNG/WebP con el teléfono y fondo transparente): `ajuste: "contener"` — se
muestran completos y centrados sobre un resplandor violeta, sin recortar.

### Pasos / línea de tiempo sobre oscuro (`home/process.tsx`)
`<ol>` en `lg:grid-cols-5` (vertical en móvil) con una línea que une nodos redondos
(`h-12 w-12 rounded-full border-line-dark-strong bg-bg-dark text-primary-light`; en hover se llenan de
`primary`). Debajo: número `01` en mono, título y descripción. Nada de tarjetas por paso.

### Acordeón de preguntas sobre oscuro (`faq/index.tsx`)
Título fijo a la izquierda (`lg:sticky`, sección con `overflow-clip`) y preguntas a la derecha en
`divide-y divide-line-dark border-y`, sin tarjetas. Botón con `aria-expanded`/`aria-controls`; ícono `+`
en círculo que rota 45° a `×` y se llena de `primary` al abrir. Respuesta con transición
`grid-rows-[0fr] → [1fr]` e `inert` mientras está cerrada. La primera pregunta abre por defecto.

### CTA final (`src/ui/marketing/cta-final.tsx`, `<CTAFinal />` con textos por página)
El sitio cierra como abrió: panel `rounded-2xl border-line-dark bg-bg-deep` dentro de la sección
`bg-dark`, con la imagen fija del velo **invertida** (`-scale-y-100`, bajada `translate-y-[15%]` para que
la luz nazca bajo el botón), filo de luz violeta arriba, etiqueta centrada con guiones, H2 de 60 px,
botón especular morado y una línea de confianza (`text-white/55`). Un solo CTA.

### Footer (`src/ui/marketing/footer/index.tsx`)
Oscuro (`bg-dark`) en todas las páginas: filo de luz violeta arriba, logo + promesa + enlace
"Agendar consulta", columnas Navegación / Servicios / Contacto, barra inferior con © "BR TECH
Digital Systems" y redes como botón-ícono redondo. Sin marca de agua.
**No exponer correos personales**: el contacto va siempre al formulario (`/contacto`).

### Superficie de vidrio (`src/ui/primitivos/glass-surface.tsx`)
"Liquid glass" adaptado de React Bits. Refracción SVG en Chrome/Edge; vidrio esmerilado en Safari/Firefox.
```tsx
<GlassSurface borderRadius={28} tint="21 17 39" tintOpacity={0.4} saturation={1.5}>…</GlassSurface>
```
- `tint` = canales RGB de un token (hoy solo `bg-dark` → `"21 17 39"`). Texto encima siempre blanco.
- Uso actual: **solo el navbar**. Necesita contenido detrás para lucir; no lo pongas sobre fondos lisos.

### Botón especular (`src/ui/primitivos/boton-especular.tsx`)
Reflejo WebGL en el borde que sigue al puntero (React Bits `SpecularButton`). Acepta `href` (→ `<Link>`).
```tsx
<BotonEspecular href="/contacto" className="…clases de botón primario…">Agendar</BotonEspecular>
```
- **Solo CTA principales sobre fondo oscuro o morado**, máximo 3 por página (cada uno es un contexto WebGL).
- Sobre botón blanco pasar `baseColor="#F1EBFF"` (`primary-light`).

### Velo oscuro (`src/ui/primitivos/velo-oscuro.tsx`)
Fondo animado WebGL (React Bits `DarkVeil`) con colores originales (`hueShift={0}`), sobre `bg-bg-deep`.
```tsx
<section className="relative overflow-hidden bg-bg-deep">
  <div className="absolute inset-0"><VeloOscuro hueShift={0} /></div>
  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg-deep" />
  <div className="relative …">contenido</div>
</section>
```
- **Exclusivo del hero de Inicio.** Heros internos usan `bg-bg-dark` + grid sutil.

### Entrada escalonada
`motion-safe:animate-aparecer` (keyframe en `globals.css`) + `style={{ animationDelay: "120ms" }}` en pasos
de 120 ms: badge → H1 → párrafo → botones. Solo en heros.

### Decoración (opcional, no abusar)
- Blob: `absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl`
- Grid sutil sobre fondo oscuro:
  `absolute inset-0 bg-[linear-gradient(rgba(120,54,226,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,54,226,0.07)_1px,transparent_1px)] bg-[size:64px_64px]`
- Siempre dentro de un contenedor `relative overflow-hidden`; el contenido va en un hijo `relative`.

---

## 4. Iconografía

- Librería única: **`lucide-react`**.
- Tamaños: `h-3.5 w-3.5` (dentro de pills), `h-4 w-4` (inline con texto / botones), `h-5 w-5` (acciones), `h-6 w-6` (icon tile chico), `h-7 w-7` (icon tile grande).
- Color: hereda con `text-*`. Ícono decorativo → `aria-hidden`; ícono con significado → dale `aria-label` al contenedor.

---

## 5. Aplicación a features nuevas

### Ticket público de servicio (`/t/[slug]`)
- Documento angosto: contenedor `mx-auto max-w-3xl px-4 py-10`.
- Encabezado: logo + folio (`text-xs uppercase tracking-wider text-text-muted`) + fecha. Estado con **Badge de estado** (`published`→positivo, `is_paid`→positivo / si no, `warning` "Pendiente de pago").
- Datos de cliente / equipo: grid `sm:grid-cols-2 gap-4`, cada dato como `text-xs text-text-muted` (label) + `text-sm text-text-primary` (valor).
- Tabla de conceptos: filas separadas por `divide-y divide-border`; concepto a la izquierda, importe alineado a la derecha con `tabular-nums`.
- Totales: bloque a la derecha, subtotal/impuesto en `text-text-secondary`, **Total** en `text-2xl font-bold text-text-primary`.
- Bloque "Conoce más": sección `bg-bg-dark` con blob violeta, H2 en blanco, botón secundario sobre oscuro → enlaza a `/` con `?ref=ticket`.
- Moneda: formatear con `Intl.NumberFormat("es-MX", { style: "currency", currency })`.

### Panel de captura (`/panel/...`)
- Fondo `bg-bg-section`, contenido en cards `bg-surface`.
- Filas de ítems dinámicas usando la **receta de Input**; total en vivo con la tipografía de "Monto grande".
- Acciones: "Guardar borrador" = botón secundario; "Publicar" = botón primario.

### Impresión / PDF
```css
@media print {
  /* ocultar nav, footer, botones y bloque "Conoce más" */
  .no-print { display: none !important; }
  /* forzar colores planos y quitar sombras */
}
```
Marca los elementos no imprimibles con `className="no-print"`.

---

## 6. Reglas

1. Un solo acento: `primary`. El verde/ámbar son **solo** semánticos (estado), no decorativos.
2. Cards siempre `bg-surface` + `border-border`; nunca cards sin borde sobre fondo blanco.
3. Radios: botón y pill `rounded-full`, input `rounded-lg`, contenedor `rounded-2xl`. Nada intermedio.
4. Texto: jerarquía `text-primary` → `text-secondary` → `text-muted`. No usar negro puro ni grises de Tailwind sueltos.
   Sobre oscuro: `text-white`, `text-white/85`, `text-white/75`, `text-white/55` (metadatos). El negro puro
   solo existe como fondo (`bg-deep`), nunca como color de texto.
5. Interacciones simples: `transition-all` (o `transition-colors`) con la duración por defecto. Duraciones
   propias solo en los primitivos de movimiento (vidrio, velo, navbar al hacer scroll, menú móvil).
6. Móvil primero: clase base = móvil, `sm:`/`md:`/`lg:` para escalar.
7. Copys en español, tono formal-cercano. Montos con separador de miles y símbolo `$` + `MXN` cuando haya ambigüedad.
8. Movimiento: todo efecto animado respeta `prefers-reduced-motion` (`motion-safe:` en CSS; los primitivos
   WebGL ya lo detectan). Los efectos WebGL se pausan fuera de pantalla.
