# DESIGNS.md — Sistema de Diseño BR TECH

Guía única de estilos para el sitio. **Toda feature nueva se construye con estos tokens y recetas.**
No inventes colores, radios ni sombras fuera de esta tabla; si algo falta, se agrega aquí primero.

Base: `src/styles/globals.css` (`@theme` de Tailwind v4) + spec FinPay Dashboard de `AGENTS.md`.
Fuente: **Inter** (cargada en `src/app/layout.tsx` vía `next/font`), fallback `"Plus Jakarta Sans", sans-serif`.

---

## 1. Tokens

### Color (clases Tailwind ya generadas desde `@theme`)

| Token | HEX | Clase | Uso |
|---|---|---|---|
| `primary` | `#7C3AED` | `bg-primary` `text-primary` `border-primary` | Marca, CTA primario, elementos activos, íconos destacados |
| `primary-hover` | `#5B21B6` | `hover:bg-primary-hover` | Hover de botones, extremo profundo de degradados |
| `primary-light` | `#EDE9FE` | `bg-primary-light` `text-primary` | Fondos suaves, badges de marca, "eyebrow" labels, botón secundario |
| `success` | `#10B981` | `bg-success` `text-success` | Estado OK, "Publicado", "Pagado", indicadores positivos |
| `success-light` | `#D1FAE5` | `bg-success-light` | Fondo de pills de estado positivo |
| `warning` | `#F59E0B` | `bg-warning` `text-warning` | "Pendiente", alertas, ratings |
| `bg-dark` | `#1E1B2E` | `bg-bg-dark` | Navbar, footer, secciones hero oscuras, bloque "Conoce más" |
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

### Tipografía

| Elemento | Clases |
|---|---|
| H1 (hero oscuro) | `text-[28px] sm:text-4xl md:text-5xl font-bold leading-tight text-white` |
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

```tsx
// Sección estándar
<section className="relative overflow-hidden py-16 sm:py-24">
  {/* variantes de fondo: (nada) | bg-bg-section | bg-bg-dark */}
  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* contenido */}
  </div>
</section>
```

- **Contenedor:** `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` (usa `max-w-6xl` / `max-w-3xl` para texto centrado o documentos angostos como un ticket).
- **Ritmo vertical de sección:** `py-16 sm:py-24`.
- **Grid de cards:** `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`.
- **Encabezado de sección:** bloque centrado `mx-auto max-w-2xl text-center` con eyebrow pill + H2.

---

## 3. Recetas de componentes

### Botón primario
```tsx
<button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-xl active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70">
  Texto <ArrowRight className="h-4 w-4" />
</button>
```
Variante énfasis: `bg-gradient-to-r from-primary to-primary-hover shadow-primary/30`.

### Botón secundario
- Sobre claro: `rounded-lg bg-primary-light px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-white`
- Sobre oscuro: `rounded-lg border border-white/20 bg-white/5 px-7 py-3 text-sm font-medium text-text-muted backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white`

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

### Decoración (opcional, no abusar)
- Blob: `absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl`
- Grid sutil sobre fondo oscuro:
  `absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.07)_1px,transparent_1px)] bg-[size:64px_64px]`
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
3. Radios: botón/imput `rounded-lg`, contenedor `rounded-2xl`, pill `rounded-full`. Nada intermedio.
4. Texto: jerarquía `text-primary` → `text-secondary` → `text-muted`. No usar negro puro ni grises de Tailwind sueltos.
5. Toda transición es `transition-all` (o `transition-colors`) — sin duraciones custom.
6. Móvil primero: clase base = móvil, `sm:`/`md:`/`lg:` para escalar.
7. Copys en español, tono formal-cercano. Montos con separador de miles y símbolo `$` + `MXN` cuando haya ambigüedad.
