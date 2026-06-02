# FinPay Dashboard — Especificación Técnica de Diseño

---

## 1. RESUMEN VISUAL

- **Categoría:** Fintech / SaaS Dashboard
- **Densidad:** Moderadamente cargado — alta densidad de información bien organizada
- **Tono:** Formal con toques casuales (emojis en saludo, lenguaje cercano)
- **Nivel de sofisticación:** 9/10
- **Sensación transmitida:** Confianza, control financiero, modernidad premium, claridad de datos
- **Público objetivo:** Usuarios individuales o prosumers que gestionan finanzas personales o de pequeña empresa; millennials y Gen Z con afinidad tecnológica

---

## 2. PALETA DE COLORES

### Primary

- **HEX:** `#7C3AED`
- **RGB:** `rgb(124, 58, 237)`
- **HSL:** `hsl(263, 83%, 57%)`
- **Uso:** Color de marca principal, CTAs, botones primarios, elementos activos de sidebar, barras de progreso activas, íconos destacados

### Primary Hover & Accent

- **HEX:** `#5B21B6`
- **RGB:** `rgb(91, 33, 182)`
- **HSL:** `hsl(263, 70%, 42%)`
- **Uso:** Hover de botones, acentos secundarios, elementos de énfasis, degradados profundos

### Primary Light / Highlight

- **HEX:** `#EDE9FE`
- **RGB:** `rgb(237, 233, 254)`
- **HSL:** `hsl(250, 100%, 96%)`
- **Uso:** Fondos suaves, badges de marca, highlights, barras de gráficos secundarias (Expense)

### Success

- **HEX:** `#10B981`
- **RGB:** `rgb(16, 185, 129)`
- **HSL:** `hsl(160, 84%, 39%)`
- **Uso:** Badge "Successful" en tabla de transacciones, indicadores positivos, stats de crecimiento activo

### Success Background

- **HEX:** `#D1FAE5`
- **RGB:** `rgb(209, 250, 229)`
- **HSL:** `hsl(151, 81%, 96%)`
- **Uso:** Fondos de éxito, pills de estado activo

### Warning / Alertas

- **HEX:** `#F59E0B`
- **RGB:** `rgb(245, 158, 11)`
- **HSL:** `hsl(38, 92%, 50%)`
- **Uso:** Badge "Pending", estrellas de reseñas, alertas de suscripción próxima a vencer, ratings

### Background Dark (Layout structural)

- **HEX:** `#1E1B2E`
- **RGB:** `rgb(30, 27, 46)`
- **HSL:** `hsl(253, 25%, 14%)`
- **Uso:** Navbar, footer, tarjeta de crédito (gradiente/fondo oscuro)

### Text Primary & Headings

- **HEX:** `#111827`
- **RGB:** `rgb(17, 24, 39)`
- **HSL:** `hsl(221, 39%, 11%)`
- **Uso:** Texto principal, encabezados principales, valores monetarios grandes

### Text Secondary / Paragraphs

- **HEX:** `#374151`
- **RGB:** `rgb(55, 65, 81)`
- **HSL:** `hsl(215, 28%, 27%)`
- **Uso:** Texto secundario, párrafos, labels de formulario

### Text Muted / Borders

- **HEX:** `#6B7280`
- **RGB:** `rgb(107, 114, 128)`
- **HSL:** `hsl(220, 9%, 46%)`
- **Uso:** Texto muted, placeholders, bordes de cards y divisores de tabla

### Section Background / Cards Light

- **HEX:** `#F9FAFB`
- **RGB:** `rgb(249, 250, 251)`
- **HSL:** `hsl(210, 20%, 98%)`
- **Uso:** Fondos de sección, estructura interna de cards, hover de filas

### Main Background & Surface

- **HEX:** `#FFFFFF`
- **RGB:** `rgb(255, 255, 255)`
- **HSL:** `hsl(0, 0%, 100%)`
- **Uso:** Fondo principal de la aplicación, estructura de cards, modales, sidebar

---

### Tailwind Mapping

```js
colors: {
  primary:           '#7C3AED',   // violet-600
  'primary-hover':   '#5B21B6',   // violet-800
  'primary-light':   '#EDE9FE',   // violet-100
  success:           '#10B981',   // emerald-500
  'success-light':   '#D1FAE5',   // emerald-100
  'bg-dark':         '#1E1B2E',   // custom deep dark
  'text-primary':    '#111827',   // gray-900
  'text-secondary':  '#374151',   // gray-700
  'text-muted':      '#6B7280',   // gray-500
  'bg-section':      '#F9FAFB',   // gray-50
  surface:           '#FFFFFF',   // white
  warning:           '#F59E0B',   // amber-500
}
```
