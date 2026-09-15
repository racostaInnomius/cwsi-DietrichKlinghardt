# Estándar de hero — sitio Dietrich Klinghardt™

> Establecido: 2026-09-14, a partir del hero de `/foundation`. El cliente pidió
> que ese hero fuera la base de **todos** los heros del sitio, con excepción de
> Sophia (que solo hereda dimensiones/forma, no el color).
>
> Regla de oro: **todo hero mide lo mismo**. Si una página necesita un hero
> distinto (más alto, sin gradiente, etc.), es una excepción a documentar aquí,
> no un valor a inventar en el momento.

---

## 1. Las reglas (viven en `src/styles/base.css`, selector `.page-hero`)

| Propiedad | Valor | Token / origen |
|---|---|---|
| Margen lateral | inset, no full-bleed | `margin: 0 var(--gutter)` — el mismo gutter del nav, footer y quote |
| Esquinas | redondeadas | `border-radius: var(--radius-lg, 22px)` |
| Alto (**desktop, ≥900px**) | `clamp(420px, 37vw, 560px)` — **534px a 1440px de viewport, que es la referencia** | Definido en `.page-hero` dentro de `@media (min-width: 900px)` |
| Alto (**mobile, <900px**) | automático, según contenido | A propósito — ver §3 |
| Fondo | degradado navy→azul→ámbar (`--grad-card`, `tokens.css`) | Se activa con `<AnimatedGradient variant="card">`, nunca `variant="plain"` |
| Contenido | centrado verticalmente dentro de la caja | `.page-hero__inner { display:flex; flex-direction:column; justify-content:center }` (desktop) |

**Para aplicar el estándar a una página nueva:** el `<AnimatedGradient>` debe llevar `variant="card"` y `className="page-hero"` (más cualquier clase propia de la página). Nada más — el resto lo hereda de `base.css` automáticamente.

## 2. La excepción de Sophia

`[data-theme="sophia"]` ya redefine `--grad-card` a su propio teal
(`tokens.css`, línea ~372: `linear-gradient(135deg, #228c97 0%, #b7d0d2 55%, #e6f4f4 100%)`).
Por eso las páginas de Sophia (`SophiaTeamPage`, `NewPatientsPage`,
`AccommodationsPage`) usan el mismo `variant="card"` que todo el sitio — el
color correcto sale solo por el theme, sin overrides adicionales.

## 3. Por qué el alto fijo es solo desktop

En mobile, el mismo texto ocupa más líneas (columna más angosta), así que una
altura fija tomada de desktop **recorta contenido** — se probó y se confirmó
con Foundation (el logo y parte del párrafo quedaban cortados a 420px de
ancho). Por eso, debajo de 900px, `.page-hero` vuelve a `height: auto` y cada
página crece según lo que tenga.

## 4. Páginas con hero "especial" (pin de scroll)

Tres páginas no usan `.page-hero` directo sino su propio wrapper con scroll-pin
(`position: sticky` dentro de un contenedor más alto que crea la distancia de
scroll). Todas están alineadas al mismo estándar de **alto de la tarjeta
pineada**, aunque el wrapper que la contiene sea más alto:

| Página | Wrapper (scroll) | Tarjeta pineada | Alto de la tarjeta |
|---|---|---|---|
| Home (`/`) | `.home-hero-pin` (230vh) | `.plain-section.hero` | `clamp(420px, 37vw, 560px)` — igual al estándar |
| Courses (`/courses`) | `.courses-hero-pin` (160vh) | `.courses-hero` | `clamp(420px, 37vw, 560px)` — igual al estándar |

El wrapper alto es solo **distancia de scroll** para el efecto de "quedarse
pegado" — no es el tamaño visual del hero. El JS (`HomePage.tsx`) mide la
altura real de la tarjeta en cada frame (`getBoundingClientRect().height`), así
que cambiar este número es seguro: no hay ningún alto "hardcodeado" en el
cálculo del scroll.

## 5. `/store` — también en el estándar, con las cards reducidas

El panel `.top-picks` (arriba de `/store`) no es un hero clásico: combina el
texto tipo hero con una grilla real de hasta 5 productos comprables. Aun así,
el cliente pidió que también midiera igual — así que:

- Mismo `margin: 0 var(--gutter)` (sin el gap propio que tenía antes) y el
  mismo `height: clamp(420px, 37vw, 560px)` en desktop (≥900px).
- Para que 5 productos + el texto de cabecera caburan en esa altura, las
  cards se redujeron **proporcionalmente**: `.top-pick-card__media` bajó de
  `aspect-ratio: 1/1` a `3/2` (imagen más baja, mismo ancho de columna), el
  `h2` de la cabecera bajó de `--fs-display-md` a `clamp(24px, 2.6vw, 38px)`,
  y el padding interno (`.top-picks__inner`, `.top-picks__head`) se apretó a
  los mismos clamps compactos que usa cualquier `.page-hero__inner`.
- **Desktop-only, igual que todo lo demás** (§3): la grilla no tiene un
  layout de columnas distinto para mobile (sigue siendo `repeat(5, 1fr)` a
  cualquier ancho), así que forzar el alto fijo ahí recortaba el panel de
  productos entero. Se probó y confirmó — mismo tipo de falla que Foundation
  y Courses tuvieron antes de tener el guard de `@media (min-width: 900px)`.

### Pendiente aparte, no de hoy

En mobile, la grilla de 5 columnas (`.top-picks__grid`) no reflowea a menos
columnas — a 390px de ancho cada columna mide ~68px, y el contenido de la
primera tarjeta parece forzar un ancho mínimo mayor, empujando las otras 4
fuera de vista (`overflow: hidden` las esconde en vez de que aparezca scroll).
Esto **no lo causó** este ajuste — ya estaba así — pero quedó más visible al
revisar mobile. Si se quiere resolver, es un cambio de layout responsive
aparte (por ejemplo, `grid-template-columns: repeat(2, 1fr)` o un carrusel de
scroll horizontal bajo cierto ancho), no algo que toque el estándar de alto.

## 6. Historial de decisiones

- **2026-09-14**: alto compacto (−15% sobre el original de Foundation),
  márgenes despegados del borde (`--gutter`), esquinas redondeadas — todo
  fijado primero en `/foundation`, luego extendido a las 18 páginas con
  `.page-hero`, después a Home y Courses (heros con pin de scroll), y
  finalmente a Store (margen, esquinas, alto fijo en desktop, y las cards de
  producto reducidas proporcionalmente para que quepan — ver §5).
- Antes de esta fecha, cada página-hero tenía su propio margen/padding/alto
  ajustado a mano (`.academy-hero`, `.contact-hero`, `.course-dates-hero`,
  `.top-picks`, etc.) — esas variaciones se retiraron a propósito al fijar el
  estándar; si reaparecen, probablemente sea un override viejo que alguien
  reintrodujo sin saber que ya no hace falta.
