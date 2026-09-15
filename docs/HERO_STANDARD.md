# Estándar de hero — sitio Dietrich Klinghardt™

> **Base actual: `/sophia` (2026-09-15).** Reemplaza el estándar anterior,
> basado en `/foundation` (2026-09-14) — ver §6 para el historial completo.
> El cliente pidió que el hero de `/sophia` (su propio `.sophia-hero`,
> `sections.css`) fuera ahora la base de **dimensiones y posicionamiento** de
> todos los heros del sitio.
>
> Regla de oro: **todo hero comparte la misma altura mínima, margen y
> esquinas**. Si una página necesita algo distinto (sin hero, más alto, etc.),
> es una excepción a documentar aquí, no un valor a inventar en el momento.

---

## 1. Las reglas (viven en `src/styles/base.css`, selector `.page-hero`)

Cada valor está copiado directamente de `.sophia-hero`/`.sophia-hero__inner`
(medido en vivo a 1440/1024/768/390px), no re-derivado:

| Propiedad | Valor | Token / origen |
|---|---|---|
| Margen lateral | inset, no full-bleed | `margin: 0 clamp(12px, 2.2vw, 34px)` — el margen propio de `.sophia-hero`, más angosto que `--gutter` |
| Esquinas | redondeadas, sutiles | `border-radius: var(--radius-sm)` (6px) |
| Alto | **mínimo** `min(64vh, 600px)`, en **todos los anchos** | `min-height` en `.page-hero`, sin media query — ver §3 |
| Padding interno | generoso y simétrico | `.page-hero__inner { padding-block: clamp(64px, 9vw, 128px) }` |
| Fondo | degradado navy→azul→ámbar (`--grad-card`, `tokens.css`) | Se activa con `<AnimatedGradient variant="card">` |
| Contenido | centrado verticalmente dentro de la caja | `.page-hero { display:flex }` + `.page-hero__inner { flex:1; display:flex; flex-direction:column; justify-content:center }` |

**Para aplicar el estándar a una página nueva:** el `<AnimatedGradient>` debe
llevar `variant="card"` y `className="page-hero"` (más cualquier clase propia
de la página). Nada más — el resto lo hereda de `base.css` automáticamente.

### Detalle importante: `.gradient-card` pisa el `border-radius`

Todo `.page-hero` con `variant="card"` también carga la clase `.gradient-card`
(`motion.css`, que se importa DESPUÉS de `base.css`). `.gradient-card` trae su
propio `border-radius: var(--radius-lg, 22px)` a la misma especificidad
(0,1,0) que `.page-hero`, así que gana por orden de carga. Antes esto era
invisible porque ambas reglas usaban `--radius-lg` por coincidencia; ahora que
`.page-hero` quiere `--radius-sm`, hace falta el selector compuesto
`.page-hero.gradient-card { border-radius: var(--radius-sm) }` (especificidad
0,2,0) para que realmente gane. El mismo patrón se repite en `.courses-hero` y
`.top-picks` — cualquier hero nuevo con esquinas distintas a `--radius-lg`
necesita este mismo tipo de override.

## 2. Antes: el modelo de `/foundation` (2026-09-14, ya no vigente)

La versión anterior de este documento fijaba una altura **fija** (`height:
clamp(420px, 37vw, 560px)`), aplicada **solo en desktop** (`@media
(min-width: 900px)`) porque una altura fija recorta contenido en mobile —
confirmado con Foundation, Courses y Store (ver commits del 2026-09-14/15).

El modelo de `/sophia` resuelve ese problema de raíz: usa **`min-height`**, no
`height`. Un mínimo nunca recorta — si el contenido necesita más espacio,
crece. Por eso el nuevo estándar ya no necesita el guard de `@media
(min-width: 900px)`: se aplica igual en mobile, tablet y desktop.

**Trade-off aceptado a propósito:** con `min-height`, una página cuyo
contenido sea más alto que 64vh/600px simplemente crece más que las demás —
"todos los heros miden lo mismo" pasa a leerse como "todos comparten el mismo
mínimo", no un alto idéntico pixel por pixel. Es el mismo trade-off que
`/sophia` ya hacía desde antes de ser la base.

## 3. Por qué ya no hace falta un caso especial para mobile

Con `height` fija, mobile necesitaba `height: auto` aparte (texto en más
líneas en columna angosta = contenido más alto = recorte). Con `min-height`
eso deja de ser un problema — por eso `.page-hero` en `base.css` ya no tiene
ninguna media query: el mismo `min-height: min(64vh, 600px)` corre en
cualquier ancho, y las páginas con más contenido (ej. `/academy/art` a
631px, `/courses/art` a 660px) simplemente superan el mínimo sin clipping.
Confirmado en vivo en las 14 páginas `.page-hero` restantes, a 1440px y
390px — ver el registro de pruebas en el historial de conversación del
2026-09-15.

## 4. Páginas con hero "especial" (pin de scroll)

Dos páginas no usan `.page-hero` directo sino su propio wrapper con scroll-pin
(`position: sticky` dentro de un contenedor más alto que crea la distancia de
scroll). Ambas están alineadas al mismo estándar de **alto mínimo de la
tarjeta pineada**, aunque el wrapper que la contiene sea más alto:

| Página | Wrapper (scroll) | Tarjeta pineada | Alto de la tarjeta |
|---|---|---|---|
| Home (`/`) | `.home-hero-pin` (`calc(min(64vh, 600px) + 14px)`, ver nota) | `.plain-section.hero` | `min-height: min(64vh, 600px)` — igual al estándar |
| Courses (`/courses`) | `.courses-hero-pin` (160vh, desktop-only ≥900px) | `.courses-hero` | `min-height: min(64vh, 600px)` — igual al estándar |

El wrapper alto es solo **distancia de scroll** para el efecto de "quedarse
pegado" — no es el tamaño visual del hero. El JS (`HomePage.tsx`) mide la
altura real de la tarjeta en cada frame (`getBoundingClientRect().height`), así
que cambiar este número es seguro: no hay ningún alto "hardcodeado" en el
cálculo del scroll.

**Courses conserva su guard de `@media (min-width: 900px)`** en el pin/sticky
mismo (no en el alto): el efecto de scroll-jacking no encaja con el layout
apilado de mobile (texto + cluster de fotos en una sola columna) — es una
decisión de comportamiento, no de tamaño, así que quedó fuera del alcance de
este cambio aunque `min-height` ya no necesitaría el guard por sí solo.

**Nota (2026-09-15) — Home ya no tiene "dwell":** el cliente pidió que el
teaser de Akademie (`.home-academy`, justo debajo del hero) se distinguiera
"al entrar al sitio" y animara al cargar el DOM, no al hacer scroll. Eso es
incompatible con reservar un tramo largo de scroll antes de mostrarlo, así que
`.home-hero-pin` se recortó del `230vh` original a prácticamente el alto de la
propia tarjeta (+14px de colchón, solo para que `position: sticky` siga
resolviendo). Efecto secundario aceptado a propósito: el degradado de fondo
del wrapper (pensado para revelarse gradualmente en ese scroll largo) ya casi
no se alcanza a ver — se sacrificó ese detalle por el pedido explícito de
inmediatez. `Reveal`/`SplitReveal` ganaron un prop `triggerOn="load"`
(default `"scroll"`, sin efecto en el resto del sitio) usado solo en el bloque
de Akademie para que su animación de letra por letra corra al montar, no al
entrar en el viewport.

## 5. `/store` — también en el estándar

El panel `.top-picks` (arriba de `/store`) no es un hero clásico: combina el
texto tipo hero con una grilla real de hasta 5 productos comprables. Aun así,
el cliente pidió que también midiera igual:

- Mismo `margin: 0 clamp(12px, 2.2vw, 34px)` y el mismo `min-height: min(64vh,
  600px)`, ahora en **todos los anchos** (el guard de `@media (min-width:
  900px)` que existía solo por la altura fija ya no hace falta — ver §3).
- Las cards de producto siguen reducidas proporcionalmente respecto a su
  tamaño original (`.top-pick-card__media` en `aspect-ratio: 3/2`, cabecera en
  `clamp(24px, 2.6vw, 38px)`) — eso no cambió hoy.
- La grilla de 5 columnas (`.top-picks__grid`) **sí reflowea** en mobile
  (`repeat(2, 1fr)` bajo 860px, una sola columna bajo 420px) — el "pendiente"
  que este documento marcaba antes (grilla fija de 5 columnas recortada en
  mobile) ya no aplica; confirmado en vivo a 390px: el panel crece a ~1955px
  de alto en una sola columna, sin recortes.

## 6. Historial de decisiones

- **2026-09-14**: alto fijo (−15% sobre el original de Foundation), márgenes
  despegados del borde (`--gutter`), esquinas grandes (`--radius-lg`) — todo
  fijado primero en `/foundation`, luego extendido a las 18 páginas con
  `.page-hero`, después a Home y Courses (heros con pin de scroll), y
  finalmente a Store. Alto fijo, así que desktop-only en todos los casos
  (mobile recortaba contenido).
- Antes de esa fecha, cada página-hero tenía su propio margen/padding/alto
  ajustado a mano (`.academy-hero`, `.contact-hero`, `.course-dates-hero`,
  `.top-picks`, etc.) — esas variaciones se retiraron a propósito al fijar el
  estándar.
- **2026-09-15 (mañana)**: el `.home-hero-pin` de Home (wrapper de scroll, no
  la tarjeta) se recortó en varias vueltas — de 230vh a 210vh, luego a
  prácticamente el alto de la tarjeta (+14px) — para que el teaser de Akademie
  apareciera "de inmediato" al entrar al sitio. Ver §4.
- **2026-09-15 (tarde) — cambio de base**: "Haz que el hero de /sophia sea
  ahora la base... de todos los heros del sitio." Reemplazó el modelo de
  `/foundation` por el de `/sophia`: `min-height` en vez de `height` fija,
  margen más angosto (`clamp(12px, 2.2vw, 34px)` en vez de `--gutter`),
  esquinas más chicas (`--radius-sm` en vez de `--radius-lg`), padding interno
  más generoso y simétrico (`clamp(64px, 9vw, 128px)`). Al no poder recortar,
  `min-height` elimina la necesidad del guard `@media (min-width: 900px)` en
  `.page-hero`, `.plain-section.hero` (Home) y `.top-picks` (Store); el pin de
  Courses conserva su guard porque es una decisión de comportamiento (scroll-
  jacking), no de tamaño. Aplicado a las 14 páginas `.page-hero` restantes,
  Home, Courses y Store — probado en vivo en cada una a 1440px y 390px.
- **2026-09-15 (misma tarde) — cuatro páginas salen del estándar**: el cliente
  pidió que `/events`, `/sophia/team`, `/sophia/new-patients` y
  `/sophia/accommodations` NO llevaran hero — "regresarlo a como estaba
  anteriormente" (antes de 2026-09-14, commit `199f322`). Cada una volvió a
  `<AnimatedGradient variant="plain">` y su caja (`.page-hero`) se resetea a
  margen/radio/alto neutros vía una clase propia (`.events-page__hero` para
  Events, `.sophia-plain-hero` compartida por las tres de Sophia) — el texto
  vuelve a sentarse directo sobre el degradado de la página, sin tarjeta, sin
  dimensiones fijas, exactamente como antes de que existiera este estándar.
  Las reglas de tipografía de `.page-hero` (color del eyebrow, del h1, del
  lead, y los overrides de contraste específicos de Sophia) NO se tocaron —
  esas son anteriores al estándar de cajas y siguen aplicando.
