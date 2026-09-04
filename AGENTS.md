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

---

## ARQUITECTURA — Hexagonal (puertos y adaptadores)

> Toda feature con lógica de negocio sigue esta estructura. El marketing (páginas
> estáticas) vive en `src/ui/marketing/` y no necesita capa de dominio.

### Capas

```
src/modules/<modulo>/
  domain/          Entidades, value objects, invariantes y PUERTOS (interfaces).
                   No importa nada de infraestructura ni de Next.
  application/     Casos de uso: orquestan el dominio. Reciben puertos por
                   constructor. DTOs de entrada/salida con primitivas.
  infrastructure/  ADAPTADORES: implementan los puertos (Postgres, Resend…),
                   el contenedor de composición y las server actions delgadas.
src/ui/            Componentes de presentación (React). Sin acceso a BD.
src/app/           Solo routing y composición: la página llama a un caso de uso
                   vía el contenedor del módulo y pasa DTOs a componentes de ui/.
```

### Reglas

1. **Dirección de dependencias:** `app`/`ui` → `application` → `domain`.
   `infrastructure` → `domain`. El dominio no depende de nadie.
2. **Sin ORM.** Persistencia con `pg` + `Pool` (`src/modules/shared/infrastructure/db/pool.ts`)
   y SQL parametrizado. Migraciones con `node-pg-migrate` (`npm run migrate:up`).
3. **Dinero** siempre como enteros de centavos (`Dinero` VO). Nunca floats en BD.
4. Cada módulo expone un **contenedor** (`infrastructure/contenedor.ts`) que la
   presentación importa; nunca se instancian adaptadores en `app/` o `ui/`.
5. **Server actions** (`"use server"`) solo traducen entrada → caso de uso →
   `{ ok, error }`. Nada de lógica ahí. No exportan tipos (van en `tipos.ts`).
6. **Tests** (`vitest`): dominio y casos de uso con dobles en memoria
   (`src/testing/dobles.ts`). Integración de adaptadores con `RUN_DB_TESTS=1`.
7. Estilos: **`DESIGNS.md`** manda. No inventar tokens.

### Módulos actuales

- `tickets/` — tickets de servicio. Público en `/t/[slug]`, captura en `/panel`.
- `contacto/` — formulario de contacto (adaptador Resend).
- `panel/` — sesión del panel (cookie HMAC, la valida `src/proxy.ts`).
- `shared/` — `Dinero`, errores, puertos `Reloj`/`GeneradorId`, `pool`, `env` (zod).

### Base de datos

`brtech_site` en el contenedor `parrillasoft-db` del VPS (Postgres 17, compartido
con parrilla). Rol `brtech_app` con `CONNECTION LIMIT 5` y `statement_timeout`.
En dev se llega por túnel SSH a `127.0.0.1:5433`. En prod (Dokploy) el host es
`parrillasoft-db:5432` por la red `dokploy-network`.
