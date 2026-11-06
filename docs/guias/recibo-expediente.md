# Guía: recibo "expediente de servicio" con ilustración 3D

Guía para construir la nueva página pública del ticket (`/t/[slug]`) y lo que el panel necesita para alimentarla.
Se trabaja **por fases**; cada encargo a Codex es una fase. No adelantes trabajo de otra fase.

## 0. Referencias

- **Maqueta aprobada (fuente de verdad visual y de tiempos):** `marketing/maquetas/recibo/expediente.html`.
  Ábrela y léela antes de las fases 3 y 4. Lo que la guía no especifica (tiempos de animación, tamaños, textos de
  la ilustración, geometría) se **porta** de ahí; no se reinventa. El panel "Casos de la maqueta" y el modo
  "Líneas" **no** van a producción.
- **Imágenes 3D listas:** `public/recibo/3d/*.webp` (18 archivos, ya convertidos). Los PNG originales de
  `marketing/maquetas/recibo/3d/` no se usan ni se suben.
- **Código actual que se toca:** `src/modules/tickets/**`, `src/ui/tickets/**`, `src/app/t/[slug]/page.tsx`,
  `src/app/(panel)/panel/acciones.ts`, `src/ui/tickets/formulario-ticket.tsx`, `src/styles/globals.css`,
  `src/testing/dobles.ts`, `DESIGNS.md`.
- Reglas de arquitectura: `AGENTS.md` (hexagonal, sin ORM, dinero en centavos, contenedor por módulo,
  server actions delgadas, tests con dobles en memoria). Estilos: `DESIGNS.md`.

## 1. Decisiones cerradas

1. **Tipo de equipo** pasa a ser una categoría cerrada: `laptop | pc | todo_en_uno | otro`. El texto libre
   `equipo.tipo` se conserva como nombre visible opcional (si viene vacío se usa la etiqueta de la categoría).
2. **Cada concepto lleva una clase:** `pieza | mano_de_obra | mantenimiento | sistema | programa | ensamble |
   diagnostico | otro`. Opcionales: `pieza` (qué pieza), `etiqueta` (texto corto para chips y pantalla) y
   `piezaAnterior` (texto de "Antes: …").
3. **Garantía en días** (`garantiaDias`, 0–365, nulo en tickets viejos). La medalla solo sale con días > 0.
4. **Las reglas de la ilustración son una función pura** (`derivarEscena`) en `application/`: con la misma
   entrada da la misma escena. El panel y la página pública usan la misma.
5. **La ilustración en producción es solo 3D:** imágenes WebP compuestas en un SVG de 520 × 400 + capas
   animadas (guías, marcas, pastillas, polvo, escaneo, destellos). La pantalla del equipo va en una capa HTML
   con perspectiva (`matrix3d`). Categoría `otro` → escena genérica con el símbolo de BR TECH.
6. **El encabezado del recibo ya no lleva ondas** (`OndasGradiente`). Su fondo es el material de la tarjeta de
   banco (ver §4.2). Las ondas siguen en el resto del sitio.
7. **La narrativa usa los textos reales del ticket** (`problemaReportado`, `diagnostico`, `trabajoRealizado`).
   Solo los títulos y el texto de apoyo del encabezado salen de la clase principal.
8. **Seguridad:** todas las acciones de tickets del panel llaman a `exigirSesionPanel()` (hoy no lo hacen).
9. Montos siempre con `Dinero`/centavos en dominio; la presentación recibe unidades (como hoy).

---

## Fase 1 — Dominio, persistencia y seguridad

### 1.1 `src/modules/tickets/domain/clasificacion.ts` (nuevo)

```ts
export const CATEGORIAS_EQUIPO = ["laptop", "pc", "todo_en_uno", "otro"] as const
export type CategoriaEquipo = (typeof CATEGORIAS_EQUIPO)[number]

export const CLASES_CONCEPTO = ["pieza", "mano_de_obra", "mantenimiento", "sistema", "programa", "ensamble", "diagnostico", "otro"] as const
export type ClaseConcepto = (typeof CLASES_CONCEPTO)[number]

export const TIPOS_PIEZA = ["disco", "ram", "bateria", "ventilador", "fuente", "placa", "procesador", "video", "gabinete"] as const
export type TipoPieza = (typeof TIPOS_PIEZA)[number]

/** Piezas que tienen sentido en cada equipo (el panel solo ofrece estas). */
export const PIEZAS_POR_CATEGORIA: Record<CategoriaEquipo, readonly TipoPieza[]> = {
  laptop: ["disco", "ram", "bateria", "ventilador", "placa"],
  pc: ["disco", "ram", "ventilador", "fuente", "placa", "procesador", "video", "gabinete"],
  todo_en_uno: ["disco", "ram", "ventilador", "placa"],
  otro: [],
}

export const ETIQUETA_CATEGORIA: Record<CategoriaEquipo, string> = { laptop: "Laptop", pc: "PC de escritorio", todo_en_uno: "Todo en uno", otro: "Otro equipo" }
export const ETIQUETA_CLASE: Record<ClaseConcepto, string> = { pieza: "Pieza", mano_de_obra: "Mano de obra", mantenimiento: "Mantenimiento", sistema: "Sistema operativo", programa: "Programa", ensamble: "Ensamble", diagnostico: "Diagnóstico", otro: "Otro" }
export const ETIQUETA_PIEZA: Record<TipoPieza, string> = { disco: "Disco", ram: "Memoria RAM", bateria: "Batería", ventilador: "Ventilador", fuente: "Fuente de poder", placa: "Tarjeta madre", procesador: "Procesador", video: "Tarjeta de video", gabinete: "Gabinete" }

export const esCategoriaEquipo = (v: string): v is CategoriaEquipo => (CATEGORIAS_EQUIPO as readonly string[]).includes(v)
export const esClaseConcepto = (v: string): v is ClaseConcepto => (CLASES_CONCEPTO as readonly string[]).includes(v)
export const esTipoPieza = (v: string): v is TipoPieza => (TIPOS_PIEZA as readonly string[]).includes(v)

export const LARGO_ETIQUETA = 32
export const GARANTIA_MAX_DIAS = 365
```

### 1.2 `ItemTicket` (`domain/item-ticket.ts`)

Agregar a `DatosItemTicket` y a la clase: `clase: ClaseConcepto`, `pieza: TipoPieza | null`,
`etiqueta: string | null`, `piezaAnterior: string | null`. Invariantes (lanzan `DatosInvalidos`, mensajes en
español claro):

- `clase` debe ser válida (`esClaseConcepto`). Si no viene en `DatosItemTicket`, es `"otro"`.
- `pieza` solo se permite con `clase` `pieza` o `diagnostico`; con cualquier otra debe ser `null`.
- `piezaAnterior` solo con `clase` `pieza`.
- `etiqueta` y `piezaAnterior`: `trim`, vacío → `null`, máximo `LARGO_ETIQUETA` caracteres.

### 1.3 `Ticket` (`domain/ticket.ts`)

- Nuevos props: `equipoCategoria: CategoriaEquipo`, `garantiaDias: number | null`.
- `DatosEquipo` pasa a `{ categoria: CategoriaEquipo; tipo?: string | null; detalle?: string | null }`.
  `equipoTipo` = `textoOpcional(tipo) ?? ETIQUETA_CATEGORIA[categoria]` (la columna sigue siendo NOT NULL).
- `DatosNuevoTicket.garantiaDias?: number | null`. Validar entero 0…`GARANTIA_MAX_DIAS` o `null`.
- **Coherencia** (método privado `validarClasificacion()`), se ejecuta en `crear`, `actualizarEquipo`,
  `reemplazarItems` y el nuevo método de abajo:
  - Toda `pieza` de un ítem debe estar en `PIEZAS_POR_CATEGORIA[categoria]`.
    Mensaje: `La pieza "Batería" no aplica a PC de escritorio`.
  - `clase: "ensamble"` solo con categoría `pc`. Mensaje: `El ensamble solo aplica a PC de escritorio`.
- Nuevo `actualizarEquipoYConceptos(equipo: DatosEquipo, items: ItemTicket[], reloj)`: cambia ambos y valida una
  sola vez al final (si se cambian por separado, pasar de laptop a PC con una batería fallaría a medias).
- Nuevo `fijarGarantia(dias: number | null, reloj)`.
- Getters: `equipo` devuelve también `categoria`; nuevo `garantiaDias`.
- `instantanea()` incluye los campos nuevos.

### 1.4 `application/sugerir-clasificacion.ts` (nuevo, puro)

`sugerirClasificacion(concepto: string, detalle?: string | null): { clase: ClaseConcepto; pieza: TipoPieza | null }`.
Normaliza (minúsculas, sin acentos) `concepto + " " + detalle` y aplica reglas **en este orden** (la primera gana):

| # | Patrón (regex sobre texto normalizado) | Resultado |
|---|---|---|
| 1 | `mantenimiento\|limpieza\|pasta termica` | mantenimiento |
| 2 | `armado\|ensambl` | ensamble |
| 3 | `diagnostic\|revision` | diagnostico |
| 4 | `mano de obra\|instalacion de la pieza\|instalacion de pieza\|domicilio` | mano_de_obra |
| 5 | `windows\|sistema operativo\|\bso\b\|formate\|linux\|macos` | sistema |
| 6 | `ssd\|disco\|hdd\|nvme\|m\.2` | pieza / disco |
| 7 | `\bram\b\|memoria` | pieza / ram |
| 8 | `bateria` | pieza / bateria |
| 9 | `ventilador\|disipador\|\bfan\b` | pieza / ventilador |
| 10 | `fuente\|\bpsu\b` | pieza / fuente |
| 11 | `tarjeta madre\|motherboard\|placa base` | pieza / placa |
| 12 | `procesador\|\bcpu\b\|ryzen\|core i[3579]` | pieza / procesador |
| 13 | `tarjeta de video\|\bgpu\b\|rtx\|gtx\|radeon` | pieza / video |
| 14 | `gabinete` | pieza / gabinete |
| 15 | `office\|antivirus\|programa\|software\|licencia\|adobe\|autocad\|zoom\|instalacion de` | programa |
| — | ninguno | otro |

Casos de prueba obligatorios (textos reales del panel): "Mantenimiento interno del equipo" → mantenimiento;
"1pz de SSD 240GB" → pieza/disco; "Instalación de SO (Sistema operativo W11)" → sistema;
"Instalación de Office LTSC" → programa; "Diagnóstico completo" → diagnostico; "Armado de PC" → ensamble;
"Memoria RAM 8 GB" → pieza/ram; "Configuración de impresora" → otro.

### 1.5 `application/escena-servicio.ts` (nuevo, puro)

```ts
export type EscenaInterior = "pieza" | "mantenimiento" | "ensamble" | "diagnostico" | null
export type EscenaPantalla = "logo" | "sistema" | "programas" | "sistema_y_programas"
export type ClasePrincipal = "ensamble" | "diagnostico" | "pieza" | "mantenimiento" | "sistema" | "programa" | "otro"

export interface EscenaServicio {
  categoria: CategoriaEquipo
  principal: ClasePrincipal
  interior: EscenaInterior
  pantalla: EscenaPantalla
  /** Pieza protagonista de la escena "pieza". */
  pieza: { tipo: TipoPieza; nuevo: string; anterior: string } | null
  /** Pieza con falla en un diagnóstico (null = tarjeta madre). */
  falla: TipoPieza | null
  sistema: string | null          // nombre visible del sistema
  programas: string[]             // máximo 3, en orden
  totalProgramas: number
  piezasEnsamble: number          // conceptos de clase pieza en un ensamble
  soloDiagnostico: boolean
  chips: string[]                 // "lo que hicimos", máximo 6, sin repetidos
}

export interface ConceptoClasificado { concepto: string; clase: ClaseConcepto; pieza: TipoPieza | null; etiqueta: string | null; piezaAnterior: string | null }
export function derivarEscena(categoria: CategoriaEquipo, items: readonly ConceptoClasificado[]): EscenaServicio
export function etiquetaDe(item: ConceptoClasificado): string
```

Reglas (portadas de `derivar()` y `textos()` de la maqueta):

- `soloDiagnostico` = hay ítems y **todos** son `diagnostico`.
- `ensamble` = categoría `pc` y algún ítem `ensamble`.
- Pieza protagonista = el **primer** ítem `pieza` cuyo `pieza` no sea null, esté en `PIEZAS_POR_CATEGORIA` y
  tenga imagen suelta (`disco | ram | bateria | ventilador | fuente`). En un ensamble no hay pieza protagonista.
- `interior`: categoría `otro` → `null` siempre. Si no: ensamble → `"ensamble"`; soloDiagnostico →
  `"diagnostico"`; pieza protagonista → `"pieza"`; algún `mantenimiento` → `"mantenimiento"`; si no, `null`.
- `pantalla`: hay `sistema` y `programa` → `"sistema_y_programas"`; solo sistema → `"sistema"`; solo programas
  → `"programas"`; si no → `"logo"`.
- `principal`: ensamble > soloDiagnostico ("diagnostico") > algún ítem `pieza` > mantenimiento > sistema >
  programa > `"otro"` (incluye `mano_de_obra`).
- `etiquetaDe(item)`: `item.etiqueta` si existe; si no, para `sistema`/`programa` el concepto sin prefijos
  `Instalación de(l)`, `Activación de`, `Instalación y activación de`; para lo demás el concepto. Siempre se
  recorta a 24 caracteres (con "…" si se corta).
- `pieza.nuevo` = `etiquetaDe(item)`; `pieza.anterior` = `item.piezaAnterior` o, por defecto:
  disco "disco anterior", ram "memoria anterior", bateria "batería anterior", ventilador "ventilador anterior",
  fuente "fuente anterior".
- `falla` = `pieza` del primer ítem `diagnostico` (puede ser null).
- `chips`: si es ensamble → `` `${piezasEnsamble} piezas` ``, `"Armado y pruebas"` y luego las etiquetas de
  sistema/programas. Si no → `etiquetaDe` de cada ítem excepto `mano_de_obra` y `diagnostico`. Sin repetidos,
  máximo 6. En soloDiagnostico → `[]`.

### 1.6 `shared/domain/monto-en-letra.ts` (nuevo, puro)

`montoEnLetra(monto: Dinero, moneda: string): string | null`. Solo `MXN` (otra moneda → `null`). Formato:
`"Dos mil ciento veintiún pesos 00/100 M.N."` (centavos en dos dígitos). Porta `letras()` de la maqueta y agrega
millones hasta 999,999,999. Apócope correcta: "veintiún", "un peso", "veintiún mil", "cien", "cien mil", "un millón".
Pruebas: 0, 1, 21, 100, 101, 1000, 2121, 15520, 21000, 100000, 1000000, 2121.5 → "… 50/100 M.N.".

### 1.7 Entrada, ensamblado y DTOs

- `application/entrada.ts`: `ItemEntrada` + `clase: string; pieza?: string | null; etiqueta?: string | null;
  piezaAnterior?: string | null`. `DatosTicketEntrada.equipo` + `categoria: string`; + `garantiaDias?: number | null`.
- `ensamblado.ts`: `construirItems` valida `clase`/`pieza` con los guards (`DatosInvalidos` si no son válidos)
  y los pasa al `ItemTicket`. Nuevo `parsearCategoria(valor: string): CategoriaEquipo`.
- `crear-ticket.ts`: pasa `categoria` y `garantiaDias`.
- `actualizar-ticket.ts`: usa `actualizarEquipoYConceptos` en vez de `actualizarEquipo` + `reemplazarItems`, y
  `fijarGarantia`.
- `dtos.ts`:
  - `ItemDTO` + `clase`, `pieza`, `etiqueta` (**ya resuelta** con `etiquetaDe`), `etiquetaPropia` (la capturada,
    para el panel), `piezaAnterior`.
  - `TicketPublicoDTO.equipo` + `categoria`; + `garantiaDias: number | null`; + `escena: EscenaServicio`;
    + `desglose: { manoDeObra: number; piezas: number }` (piezas = suma de ítems `pieza`; mano de obra = el resto);
    + `totalEnLetra: string | null`.
  - `TicketResumenDTO` + `equipoCategoria`.

### 1.8 Migración `src/modules/shared/infrastructure/db/migrations/1791158400000_ticket-clasificacion.js`

Mismo estilo que las existentes (`pgm.sql`). **Up:**

```sql
ALTER TABLE service_ticket
  ADD COLUMN equipo_categoria text NOT NULL DEFAULT 'otro'
    CHECK (equipo_categoria IN ('laptop', 'pc', 'todo_en_uno', 'otro')),
  ADD COLUMN garantia_dias integer CHECK (garantia_dias BETWEEN 0 AND 365);

-- Los tickets existentes se clasifican por su texto libre
UPDATE service_ticket SET equipo_categoria = CASE
  WHEN equipo_tipo ~* '(laptop|port[aá]til|notebook)' THEN 'laptop'
  WHEN equipo_tipo ~* '(todo en uno|all.?in.?one|\maio\M)' THEN 'todo_en_uno'
  WHEN equipo_tipo ~* '(\mpc\M|escritorio|\mcpu\M|gabinete|computadora)' THEN 'pc'
  ELSE 'otro' END;

ALTER TABLE service_ticket_item
  ADD COLUMN clase text NOT NULL DEFAULT 'otro'
    CHECK (clase IN ('pieza', 'mano_de_obra', 'mantenimiento', 'sistema', 'programa', 'ensamble', 'diagnostico', 'otro')),
  ADD COLUMN pieza text
    CHECK (pieza IN ('disco', 'ram', 'bateria', 'ventilador', 'fuente', 'placa', 'procesador', 'video', 'gabinete')),
  ADD COLUMN etiqueta text CHECK (char_length(etiqueta) <= 32),
  ADD COLUMN pieza_anterior text CHECK (char_length(pieza_anterior) <= 32),
  ADD CONSTRAINT service_ticket_item_pieza_clase_chk CHECK (pieza IS NULL OR clase IN ('pieza', 'diagnostico')),
  ADD CONSTRAINT service_ticket_item_anterior_clase_chk CHECK (pieza_anterior IS NULL OR clase = 'pieza');

-- Clasificación inicial de los conceptos existentes (mismas reglas principales que sugerirClasificacion)
UPDATE service_ticket_item SET clase = CASE
  WHEN concepto ~* '(mantenimiento|limpieza|pasta t[eé]rmica)' THEN 'mantenimiento'
  WHEN concepto ~* '(armado|ensambl)' THEN 'ensamble'
  WHEN concepto ~* '(diagn[oó]stic|revisi[oó]n)' THEN 'diagnostico'
  WHEN concepto ~* '(windows|sistema operativo|\mso\M|format)' THEN 'sistema'
  WHEN concepto ~* '(ssd|disco|hdd|nvme)' THEN 'pieza'
  WHEN concepto ~* '(\mram\M|memoria)' THEN 'pieza'
  WHEN concepto ~* '(office|antivirus|programa|software|licencia)' THEN 'programa'
  ELSE 'otro' END;
UPDATE service_ticket_item SET pieza = 'disco' WHERE clase = 'pieza' AND concepto ~* '(ssd|disco|hdd|nvme)';
UPDATE service_ticket_item SET pieza = 'ram'   WHERE clase = 'pieza' AND pieza IS NULL AND concepto ~* '(\mram\M|memoria)';
-- Un ensamble en un equipo que no es PC quedaría inválido para el dominio
UPDATE service_ticket_item i SET clase = 'otro'
  FROM service_ticket t WHERE i.ticket_id = t.id AND i.clase = 'ensamble' AND t.equipo_categoria <> 'pc';
```

**Ojo:** el SQL va dentro de un template literal de JS; duplica las diagonales de las regex (`\\m`, `\\M`)
o Postgres recibirá `m` en lugar de `\m`.

**Down:** quita las dos restricciones y las columnas nuevas de ambas tablas.
Codex **no** corre la migración (necesita la base por túnel); la corre Claude.

### 1.9 Infraestructura

- `mapa-ticket.ts`: `FilaTicket` + `equipo_categoria`, `garantia_dias`; `FilaItem` + `clase`, `pieza`,
  `etiqueta`, `pieza_anterior`. Los valores desconocidos de la base caen a `"otro"` / `null` (no revientan).
- `repositorio-tickets-postgres.ts`: columnas nuevas en `COLUMNAS_TICKET`, en el `INSERT … ON CONFLICT` del ticket
  y en el `INSERT` de ítems (de 7 a 11 parámetros por fila) y en los `SELECT` de ítems.
- `src/testing/dobles.ts`: sin cambios salvo que algo deje de compilar.

### 1.10 Seguridad del panel

En `src/app/(panel)/panel/acciones.ts`, `guardarTicket`, `publicarTicket`, `despublicarTicket`,
`archivarTicket` y `alternarPago` llaman primero a `exigirSesionPanel()` (de
`@/src/modules/panel/infrastructure/exigir-sesion`) dentro del `try`, igual que `acciones-proyectos.ts`.
`iniciarSesion` y `cerrarSesion` no.

### 1.11 Pruebas de la fase 1

- `domain/item-ticket.test.ts` (nuevo): invariantes de 1.2.
- `domain/ticket.test.ts`: coherencia pieza/categoría, ensamble solo en PC, cambio laptop→PC con batería por
  `actualizarEquipoYConceptos` (válido si la batería se quita en el mismo paso), garantía fuera de rango,
  `equipoTipo` por defecto.
- `application/sugerir-clasificacion.test.ts`, `application/escena-servicio.test.ts`: los 12 casos de la maqueta
  (Mari, Luis, Carmen, Jorge, Pato, Diego, Laura, Ana, Roberto, Pablo, Sofía, Elena: ver `CASOS` en la maqueta)
  comprobando `interior`, `pantalla`, `principal`, `pieza`, `chips`.
- `shared/domain/monto-en-letra.test.ts`.
- `application/casos-uso.test.ts`: crear y actualizar guardan y devuelven los campos nuevos.
- `infrastructure/postgres.integration.test.ts`: ida y vuelta de los campos nuevos (se corre con
  `RUN_DB_TESTS=1`; lo corre Claude).

**Aceptación:** `npx tsc --noEmit`, `npm run lint` y `npm test` en verde. Ninguna pantalla cambia todavía salvo
que el formulario del panel deba compilar: en esta fase el formulario manda `categoria: "otro"` si aún no tiene
selector y `clase` sugerida con `sugerirClasificacion` (fase 5 lo hace bien).

---

## Fase 2 — Geometría de la ilustración (pura, sin React)

Archivo `src/ui/tickets/recibo/ilustracion/geometria.ts`. Porta de la maqueta `CAJAS`, `IMAGENES_3D`,
`encajar()`, `homografia()` y las posiciones de tarjetas. Valores exactos:

```ts
export const LIENZO = { w: 520, h: 400 } as const
export const LADO_ORIGINAL = 1254 // las cajas y puntos están en píxeles de la imagen original (cuadrada)
export const RUTA = "/recibo/3d"   // archivos .webp

/** Caja del objeto dentro de cada imagen: [x0, y0, x1, y1]. */
export const CAJAS: Record<NombreImagen, [number, number, number, number]> = {
  aio: [136, 117, 1108, 1130], "bateria-vieja": [21, 249, 1225, 1015], bateria: [23, 253, 1223, 1014],
  "fuente-vieja": [91, 210, 1168, 1076], fuente: [93, 210, 1164, 1075], hdd: [90, 377, 1173, 936],
  laptop: [52, 143, 1197, 1133], nvme: [67, 401, 1182, 867], "pc-vacia": [100, 311, 1147, 953],
  pc: [100, 311, 1147, 955], placa: [47, 150, 1203, 1113], procesador: [83, 318, 1148, 959],
  "ram-vieja": [57, 228, 1192, 1070], ram: [44, 317, 1218, 979], ssd: [102, 403, 1153, 899],
  "ventilador-sucio": [94, 361, 1164, 938], ventilador: [94, 364, 1162, 936], video: [89, 271, 1177, 956],
}

export const BASES_3D = {
  laptop: { imagen: "laptop", destino: { x: 70, y: 0, w: 366, h: 316 },
    pantalla: [[458, 180], [1170, 254], [1086, 772], [368, 662]],
    zonas: { disco: [880, 1010], ram: [640, 860], bateria: [470, 985], ventilador: [330, 820], placa: [700, 830] },
    nuevo: { x: 380, y: 300 }, viejo: { x: 38, y: 300 }, pastilla: { x: 392, y: 232 },
    izq: { nuevo: { x: 24, y: 300 }, viejo: { x: 362, y: 300 }, pastilla: { x: 24, y: 232 } } },
  pc: { imagen: "pc", vacia: "pc-vacia", destino: { x: 20, y: 10, w: 480, h: 270 },
    pantalla: [[124, 494], [608, 424], [610, 752], [120, 826]],
    zonas: { ram: [912, 545], procesador: [812, 545], placa: [880, 610], video: [810, 680], fuente: [735, 800], disco: [700, 625], ventilador: [695, 505] },
    nuevo: { x: 190, y: 296 }, viejo: { x: 30, y: 296 }, pastilla: { x: 192, y: 366 } },
  todo_en_uno: { imagen: "aio", destino: { x: 110, y: 0, w: 300, h: 300 },
    pantalla: [[198, 152], [1068, 328], [1032, 862], [150, 700]],
    zonas: { disco: [900, 880], ram: [700, 840], placa: [500, 800], ventilador: [980, 885] },
    nuevo: { x: 380, y: 300 }, viejo: { x: 38, y: 300 }, pastilla: { x: 384, y: 264 },
    izq: { nuevo: { x: 24, y: 300 }, viejo: { x: 362, y: 300 }, pastilla: { x: 24, y: 264 } } },
} as const

export const PIEZAS_3D = { disco: ["ssd", "hdd"], ram: ["ram", "ram-vieja"], bateria: ["bateria", "bateria-vieja"],
  ventilador: ["ventilador", "ventilador-sucio"], fuente: ["fuente", "fuente-vieja"] } as const // [nuevo, viejo]
export const ENSAMBLE_3D = { placa: "placa", procesador: "procesador", ram: "ram", video: "video", disco: "nvme", fuente: "fuente" } as const
export const ORDEN_ENSAMBLE = ["placa", "procesador", "ram", "video", "disco", "fuente"] as const
/** Escena de pantalla: se dibuja en coordenadas locales y la capa 3D la lleva al cuadrilátero de la pantalla. */
export const PANTALLA_LOCAL = { w: 300, h: 180 } as const
```

Funciones (todas puras, exportadas):

- `encajar(imagen, rect)` → `{ x, y, w, h, punto(p): [x, y] }`: encaja la **caja del objeto** dentro de `rect`
  conservando proporción, centrado (idéntico a la maqueta, con `L = LADO_ORIGINAL`).
- `tarjeta(p)` → `{ x: p.x - 12, y: p.y - 12, w: 144, h: 86 }` (rectángulo de una pieza suelta).
- `ladoDe(base, punto)` → `base.izq` si existe y `punto.x < 240`; si no, la base (para que la guía no cruce el equipo).
- `homografia(w, h, quad)` → string `matrix3d(...)` (porta la de la maqueta).
- `rutaImagen(nombre)` → `` `${RUTA}/${nombre}.webp` ``.

**Pruebas** `geometria.test.ts`: (1) toda pieza de `PIEZAS_POR_CATEGORIA` de laptop/pc/todo_en_uno con imagen
suelta tiene zona en su base; (2) todo punto de zona y de pantalla convertido con `encajar(...).punto` cae
dentro de `destino`; (3) `homografia` lleva las 4 esquinas del rectángulo a las 4 del cuadrilátero (±0.5);
(4) todos los nombres de `CAJAS` existen como archivo en `public/recibo/3d/` (usa `fs.existsSync`).

**Aceptación:** tipos, lint y pruebas en verde.

---

## Fase 3 — Componentes de la ilustración

Carpeta `src/ui/tickets/recibo/ilustracion/`. Sin acceso a BD. Reciben `escena: EscenaServicio` (y `activa`).
Porta de la maqueta las funciones `ilustrar`, `escenaPantalla`, `pastilla`, `guia`, `particulas`, `destello`,
`marcaZona` con los **mismos tiempos y tamaños**.

| Archivo | Qué hace |
|---|---|
| `ilustracion-servicio.tsx` | Server-safe (sin hooks, sin `server-only`): arma el `<svg viewBox="0 0 520 400">` con la base 3D (`<image>`), la escena interior y la pastilla, más `<CapaPantalla3D>`. Raíz con `data-interior` y `data-pantalla`. Importable desde cliente (el panel la usa). |
| `escenas.tsx` | Una función por escena interior: `escenaPieza`, `escenaMantenimiento`, `escenaDiagnostico`, `escenaEnsamble`, y `escenaGenerica` (categoría `otro`: símbolo `SimboloBrTech` de ~120 px centrado sobre luz suave + pastilla). |
| `escena-pantalla.tsx` | `logo`, `sistema`, `programas`, `sistema_y_programas` dibujadas en `0 0 300 180` (`PANTALLA_LOCAL`). Textos: "Instalando {sistema}", "{sistema} listo", "Programas instalados", tarjetas de hasta 3 programas con su inicial. |
| `capa-pantalla-3d.tsx` | `"use client"`. Div absoluto sobre el SVG con un lienzo de 520 × 400 px escalado por `ResizeObserver` (`scale(ancho / 520)`); dentro, un div de 300 × 180 con `transform: matrix3d(...)` y `transform-origin: 0 0` que contiene el SVG de la pantalla. |
| `activador.tsx` | `"use client"`. Pone `data-activa` en su contenedor cuando termina la entrada del diafragma (mismo patrón que `entrada/ondas-diferidas.tsx`: evento `brtech:entrada-fin` / `window.__brtechEntradaFin`). Prop `siempre` para el panel. |

Reglas de render (iguales a la maqueta):

- **Pieza:** imagen vieja en `tarjeta(lado.viejo)` con texto `Antes: {pieza.anterior}` debajo (y + 90);
  marca violeta pulsante en el punto de la zona; guía curva desde `(lado.nuevo.x + 60, lado.nuevo.y)` a la zona;
  imagen nueva en `tarjeta(lado.nuevo)` dentro de un grupo que flota; pastilla `Nuevo: {pieza.nuevo}`.
- **Mantenimiento:** igual con `ventilador-sucio` / `ventilador`, texto "Antes: polvo acumulado", 12 partículas
  de polvo que salen del centro de la pieza nueva (3 ciclos) y 2 destellos; pastilla "Limpieza interna".
- **Diagnóstico:** franja de escaneo sobre `destino` (2 pasadas), marca **ámbar** en la zona de `falla`
  (o `placa`), pastilla ámbar `Falla: {ETIQUETA_PIEZA en minúsculas}` (por defecto "tarjeta madre").
- **Ensamble (solo PC):** base `pc-vacia`; cada pieza de `ORDEN_ENSAMBLE` vuela desde la izquierda a su zona
  (68 × 44) con 0.45 s entre piezas, destello al llegar, todas se desvanecen y aparece `pc` completa;
  la pantalla arranca después; pastilla `{piezasEnsamble} piezas armadas`.
- **Sin interior:** pastilla verde según pantalla ("{sistema} instalado", "{n} programas instalados",
  "Sistema y programas listos", "Servicio completado").
- **Partículas deterministas** (sin `Math.random`): usa el índice para ángulo y distancia, así el HTML del
  servidor y del cliente coinciden.

CSS: agrega a `src/styles/globals.css` un bloque `/* Ilustración del recibo */` con las clases y `@keyframes` de
la maqueta (`trazar`, `etq-entra`, `fundido`, `salir`, `flota`, `girar`, `llenar`, `pop`, `polvo`, `escanear`,
`latir-falla`, `encaja`, `destello`, `sube-3d`) prefijadas `ilus-` para no chocar. Además:

```css
.ilus:not([data-activa]) * { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .ilus * { animation: none !important; } }
@media print { .ilus-contenedor { display: none; } }
```

El estado base de cada elemento es el **final** (visible); la animación parte de oculto con `backwards`. Así,
con movimiento reducido o si una animación no corre, se ve todo. Agrega `<noscript>` con
`.ilus * { animation: none !important }` en la página.

**Pruebas** `ilustracion.test.ts` (entorno node, `renderToStaticMarkup` + `createElement`, como
`recibo.test.ts`): renderiza las combinaciones categoría × interior × pantalla (incluida `otro`) y verifica que
no haya `undefined`/`NaN` en el HTML, que `data-interior`/`data-pantalla` coincidan y que cada `href` de imagen
apunte a `/recibo/3d/*.webp` existente.

**Aceptación:** tipos, lint y pruebas en verde. La ilustración todavía no se monta en la página.

---

## Fase 4 — Página pública `/t/[slug]`

### 4.1 Composición (`src/app/t/[slug]/page.tsx`)

Se conservan `GuardiaEntrada`, `EntradaRecibo`, `generateMetadata`, `opengraph-image.tsx` (ajustar tipos si
cambia el DTO) y `BloqueConoceMas`. Estructura nueva:

```
<PortadaExpediente>           encabezado: texto a la izquierda, ilustración a la derecha (lg); apilado en móvil
<div rejilla max-w-[1120px] lg:grid-cols-[1fr_372px] gap-7 -mt-[120px]>
  <ExpedienteServicio>         tarjeta blanca con borde de luz: título, historia, conceptos, cuentas, recomendaciones
  <aside sticky top-6>         en móvil va ANTES (order-first)
    <ResumenCuenta>            total y estado
    <ComoPagar> | <PagoRecibido>
    <TarjetaGarantia>          si aplica
    <AyudaWhatsApp>
</div>
<BloqueConoceMas>              igual que hoy + luz del cursor sobre la cuadrícula
```

### 4.2 Componentes (en `src/ui/tickets/recibo/`)

- **`portada-expediente.tsx`** (sustituye a `portada-recibo.tsx`): sin ondas. Fondo:
  ```
  radial-gradient(55% 70% at 18% 0%, rgba(255,255,255,.10), transparent 60%),
  repeating-linear-gradient(115deg, transparent 0 22px, rgba(255,255,255,.025) 22px 23px),
  linear-gradient(135deg, #2A1670 0%, #151127 60%, #24145A 100%)
  ```
  y un velo inferior `linear-gradient(to bottom, transparent 65%, rgba(11,8,24,.35))`. Barra: símbolo + BR TECH
  (como hoy) y `BotonImprimir` con texto "Descargar comprobante". Texto: rótulo `Nota de servicio {folio}` /
  `Recibo de pago {folio}`, H1 `Hola, {nombreDePila}` / `Gracias, {nombreDePila}` con `TextoDesenfocado`
  (`clamp(56px, 8vw, 104px)`), apoyo (ver 4.3), metas: Equipo (`equipo.detalle` si existe, si no etiqueta),
  Fecha del servicio, Entrega con punto verde vivo ("Lista hace N días" / "Diagnóstico listo hace N días",
  calculado en el servidor). Ilustración envuelta en `Activador` con una luz neutra detrás:
  `radial-gradient(closest-side, rgba(233,226,255,.13), rgba(120,54,226,.08) 60%, transparent)` con `blur(30px)`.
- **`expediente-servicio.tsx`**: título "Así quedó tu {equipo}" (ensamble: "Así armamos tu PC"; diagnóstico:
  "Lo que encontramos en tu {equipo}"), subtítulo, chip de folio. Borde de luz (`@property --a`, arco cónico
  que recorre la orilla cada 9 s; ver `.con-luz` en la maqueta).
- **`historia-servicio.tsx`** (`"use client"`): 3 pasos con los textos reales; los pasos sin texto no salen; si
  no hay ninguno, no sale la sección. Títulos: normal "Lo que nos contaste / Lo que encontramos / Lo que
  hicimos"; ensamble "Lo que buscabas / Lo que elegimos / Lo que hicimos"; diagnóstico "… / … / Lo que sigue"
  (usa `trabajoRealizado` o, si falta, `recomendaciones`). Chip ámbar en el paso 2 si `escena.falla`
  (`Falla en {pieza}`); chips violeta con palomita en el paso 3 (`escena.chips`). El riel se llena con el scroll
  y cada nodo se enciende con su gesto (golpe, latido, giro). Con movimiento reducido todo aparece encendido.
- **`tabla-conceptos.tsx`**: tabla de la maqueta (concepto + detalle, cant., precio, importe; en móvil solo
  concepto e importe), insignia verde "Pieza nueva" en clase `pieza`, filas con resplandor al pasar el cursor,
  importes que cuentan al entrar en pantalla (reusa `Contador` de `levantamientos/efectos-diagnostico.tsx`; si
  no es reusable tal cual, muévelo a `src/ui/primitivos/contador.tsx` y actualiza su import). Cuentas:
  subtotal, impuesto si > 0, total (Clash 28 px, sin morado).
- **Recomendaciones:** si existen, debajo de cuentas: línea con ícono `Lightbulb` y "**Para que dure:** …".
- **`resumen-cuenta.tsx`** (sustituye a `tarjeta-total.tsx`): tarjeta oscura con guilloché (rosetas como la
  maqueta, generadas de forma determinista), "Total a pagar"/"Total pagado", estado, monto Clash 48 px con
  `$` y centavos chicos, `totalEnLetra` (si no es null), partes (Mano de obra o Diagnóstico, Piezas si > 0,
  Impuesto si > 0). Pagado: reusa `SelloPagado`.
- **`como-pagar.tsx`** (rehacer): "Paga por transferencia"; tarjeta de banco ("plástico") con CLABE, titular y
  copiar, que se inclina con el cursor (componente cliente pequeño `TarjetaBanco`); filas Monto y Concepto con
  copiar; aviso flotante "CLABE copiada" / "Monto copiado" / "Concepto copiado" (amplía `BotonCopiar` o crea
  `AvisoCopiado`); botón WhatsApp "Ya transferí, enviar comprobante" con el mismo mensaje y enlace de hoy. Sin
  datos de pago: conserva el texto y botón actuales.
- **`pago-recibido.tsx`**: círculo verde con palomita que se dibuja, "Pago recibido", "Recibimos tus {total}.
  Gracias por confiar en nosotros, {nombre}."
- **`tarjeta-garantia.tsx`**: si `garantiaDias > 0`: medalla holográfica de la maqueta (SVG estático + foil que
  sigue al cursor, componente cliente), "Garantía de {n} días", texto `notaGarantia` o por defecto ("Sobre el
  armado y la configuración." en ensamble, "Sobre el trabajo realizado." en lo demás), barra de días restantes
  y "Te quedan N días, vigente hasta el {fecha}". Si `garantiaDias` es null/0 y hay `notaGarantia`: tarjeta
  sencilla con escudo y el texto. En `soloDiagnostico`: no sale.
- **`ayuda-whatsapp.tsx`**: "¿Dudas con tu servicio?" + "Escríbenos" al WhatsApp de `datos-contacto`.

`documento-ticket.tsx`: se conserva **solo** su membrete de impresión, o se mueve a `membrete-impresion.tsx`;
el resto se elimina si ya no se usa.

### 4.3 Textos (`src/ui/tickets/recibo/textos-recibo.ts`, puro y probado)

Género: laptop, PC, computadora → "lista"; `otro` usa "tu equipo" → "listo". Apoyo del encabezado:

- Ensamble: "Tu nueva PC ya está armada y probada. Aquí tienes cada pieza, tu garantía y la forma de pago."
- Diagnóstico: "Ya sabemos qué tiene tu {equipo}. Aquí tienes el diagnóstico, lo que sigue y la forma de pago."
- Resto: "Tu {equipo} ya está list{a|o} y vuelve a funcionar como debe. Aquí tienes todo lo que le hicimos, tu
  garantía y la forma de pago." (sin "tu garantía" si no hay garantía).
- Pagado: "Recibimos tu pago. Guarda esta página: es tu comprobante{ y tu garantía}."

Nombre corto del equipo: laptop "laptop", pc "PC", todo_en_uno "computadora", otro "equipo".

### 4.4 Impresión

"Descargar comprobante" imprime: membrete, datos, historia (todos los pasos visibles), conceptos, cuentas,
resumen y garantía en texto. Se ocultan ilustración, fondos, cómo pagar, ayuda, "Conoce más" y animaciones.
Colores exactos (`print-color-adjust: exact`). Ver el bloque `@media print` de la maqueta.

### 4.5 Pruebas

Actualiza `recibo.test.ts` (fixture con los campos nuevos) y agrega casos: pendiente vs pagado, sin datos de
pago, solo diagnóstico (sin garantía, "Lo que sigue"), categoría `otro`, garantía nula con nota, y que el HTML
nunca contenga `undefined`/`NaN`. `textos-recibo.test.ts` para 4.3.

**Aceptación:** tipos, lint y pruebas en verde; `npm run build` compila.

---

## Fase 5 — Panel de captura (`formulario-ticket.tsx` y página de detalle)

Todo con las recetas de `DESIGNS.md` (inputs `text-base sm:text-sm`, chips táctiles).

1. **Equipo:** "Tipo de equipo *" como chips (Laptop, PC de escritorio, Todo en uno, Otro equipo);
   "Nombre del equipo" opcional (placeholder = etiqueta de la categoría); "Marca / modelo / serie".
   Al cambiar la categoría: las piezas que ya no aplican se limpian y los ensambles fuera de PC pasan a "Otro",
   con un aviso en línea "Quitamos la pieza Batería: no aplica a PC de escritorio".
2. **Garantía:** sección propia con "Días de garantía" (número, 30 por defecto en tickets nuevos, 0 = sin
   garantía) y "Nota de garantía" (el textarea que hoy está en Detalle del servicio).
3. **Cada concepto:** debajo del detalle, una fila con:
   - "Clase" (select con `ETIQUETA_CLASE`). Mientras no la toques, se **sugiere sola** al escribir el concepto
     (`sugerirClasificacion`) y muestra una marca "Sugerida". En cuanto la cambias a mano, deja de sugerir.
     "Ensamble" deshabilitado si la categoría no es PC.
   - Si es Pieza: "¿Qué pieza?" (solo `PIEZAS_POR_CATEGORIA[categoria]` + "Sin especificar") y "Antes
     (opcional)" con placeholder según la pieza ("disco mecánico", "4 GB", "batería agotada"…).
   - Si es Diagnóstico: "Pieza con falla (opcional)".
   - "Texto corto (opcional)", `maxLength` 32, placeholder = `etiquetaDe` del concepto.
4. **Agregar rápido:** fila de chips arriba de los conceptos que agregan un concepto ya clasificado, sin precio
   (el foco va al precio): Mantenimiento, Windows 11, Office, Antivirus, SSD, Memoria RAM, Batería, Ventilador,
   Fuente de poder, Diagnóstico, Armado de PC. Solo los que aplican a la categoría. Catálogo en
   `src/ui/tickets/plantillas-concepto.ts`.
5. **Vista previa (lo que verá el cliente):** columna fija a la derecha en `lg` (abajo en móvil) con fondo del
   material del encabezado y `IlustracionServicio` con `derivarEscena(categoria, conceptos)` en vivo
   (`Activador siempre`), botón "Repetir animación" (remonta con `key`), chips de "lo que hicimos" y avisos:
   - Pieza sin especificar → "Indica qué pieza es para dibujarla."
   - Categoría Otro → "Con «Otro equipo» se muestra la ilustración genérica."
   - Garantía 0 → "Sin garantía: no se mostrará la medalla."
   - Sin problema/diagnóstico/trabajo → "Sin textos de historia: el cliente no verá «Así quedó tu…»."
6. **Envío:** `DatosTicketEntrada` con `equipo.categoria`, `garantiaDias` y por concepto `clase`, `pieza`,
   `etiqueta`, `piezaAnterior`. Los errores del dominio se muestran como hoy.
7. **Listado del panel** (`(app)/page.tsx`): muestra la categoría junto al cliente (texto pequeño).

**Pruebas:** `plantillas-concepto.test.ts` (cada plantilla, pasada por `sugerirClasificacion`, da su misma
clase/pieza) y que las piezas de cada plantilla pertenezcan a sus categorías.

**Aceptación:** tipos, lint y pruebas en verde; `npm run build` compila.

---

## Fase 6 — Documentación

- `DESIGNS.md` §5 "Recibo": reemplaza la descripción por la nueva estructura (portada con material de tarjeta
  e ilustración 3D, expediente, columna lateral, impresión) y una subsección "Ilustración del servicio" con las
  reglas de `derivarEscena`, dónde viven las imágenes y cómo calibrar una nueva (medir caja con transparencia,
  esquinas de pantalla y puntos de zona en píxeles de la imagen original).
- `AGENTS.md` → "Módulos actuales" → `tickets/`: menciona categoría de equipo, clase por concepto y garantía en días.

---

## Qué no tocar

- Entrada del diafragma (`entrada/`), `SelloPagado` (solo se reusa), `opengraph-image.tsx` (solo tipos),
  ondas del resto del sitio, otros módulos (`levantamientos`, `proyectos`, `contacto`), migraciones existentes.
- No agregar dependencias. No usar git para escribir. No correr migraciones ni pruebas con base de datos.

## Al terminar cada fase

Responde con: archivos creados/modificados, decisiones que tomaste y la guía no cubría, comandos corridos con su
resultado (`npx tsc --noEmit`, `npm run lint`, `npm test`, y `npm run build` en fases 4 y 5).
