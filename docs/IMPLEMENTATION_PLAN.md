# Plan de implementación — Sitio completo Dietrich Klinghardt™

> **Estado: PROPUESTO (2026-08-28).** Reemplaza la landing temporal de `cwsi-dietrich`
> por el sitio completo del Figma `dkt_final` (22 frames, file `1UictD2h0rCrONQOGVRh1Y`).
> Fuentes de verdad: el Figma + `docs/FIGMA_NOTES.md` (56 hilos de la diseñadora,
> rescatados 2026-08-27). Tenant `75cadacc-…`, site `d333e78f-…`,
> dominio `dietrich-klinghardt.com`.
>
> **Cómo usar este documento:** cada fase es autocontenida (objetivo → tareas →
> criterio de aceptación → esfuerzo). Las decisiones D1–D9 se cierran en Fase 0;
> ninguna fase posterior arranca con su decisión abierta.

## 1. Principios (fijados por Javier)

1. **SSG + revalidación runtime contra el CMS** se conserva (patrón actual del repo:
   loaders de `vite-react-ssg` + `ContentProvider`).
2. **`music-embeds` se conserva tal cual**, incluida la validación defensiva estricta
   (solo `https://w.soundcloud.com/player/`).
3. Mismo stack: Vite 6 + React 19 + TS + `vite-react-ssg` (repo `cwsi-dietrich`), deploy
   Plesk ya cableado (`plesk-deploy.sh` + `cms-rebuild.yml`).
4. Un solo idioma: EN.
5. Las rutas del double opt-in (`/newsletter/confirmed`, `/newsletter/error`) **no se
   rompen** — hay correos de confirmación vivos apuntando ahí.

## 2. Lo que se reusa de Beytrax (verificado contra esquema real)

| Necesidad del diseño | Capacidad existente |
|---|---|
| Copy editable por página | `page-contents` (slug por página) |
| Eventos: listado, detalle, Book Now $249–349 | `events` (start/end, timezone, capacity, price, `checkout_url`/`stripe_payment_link_id`, sold_out_message, countdown) |
| Fechas de cursos comprables | `events` con `category`/`format` (ver D2) |
| Video de 5 Levels / promos | `video-embeds` + Mux VOD (`promo_video_id` en events/products) |
| **Weekly Talks live + replay + chat** | `events.live_mode` + `mux_live_resource_id` + `enable_replay` + tablas `chat_messages`/`chat_bans` — ya construido |
| Discografía comprable con entrega de audio | `digital_products.access_track_id` (+ `access_video_id`) |
| Store (productos) | `digital_products` (falta categoría — Fase 6) |
| Team de Sophia | `board-members` |
| Acordeones FAQ (Weekly Talks, New Patients) | `faqs` |
| Newsletter (form en todas las páginas) | `POST /api/public/newsletter/subscribe` (double opt-in) — igual que la landing actual |
| Form de contacto (Sophia/New Patients) | `POST /api/public/contact` |
| Donación de la Foundation | Flujo donations MoR (patrón SistWorld) — nota de la diseñadora: clonar la página de SistWorld re-tematizada |
| Correo de acceso post-compra | webhook tenant-stripe (WhatsApp opcional ✅) |

## 3. Decisiones — cerradas y por cerrar (Fase 0)

**Cerradas por las notas de la diseñadora:**
- **D1 — Carrito: SÍ va** (nav con shopping cart, unifica shop + cursos). El *cómo* del
  backend es nuestro (ver D6).
- **D4 — Directorio de terapeutas:** migrar TODO de
  `https://www.ink.ag/en/pages/therapeutensuche` y replicar su funcionamiento.
- **D5 — Donación:** clonar la página de SistWorld (Figma referenciado en las notas)
  con color/fuentes/logo DK.
- **D8 — Live in-house:** la interfaz de live del diseño es la requerida (no plataforma
  externa).

**Por cerrar en Fase 0 (con recomendación):**
- **D2 — Modelado de cursos.** Recomendación: colección nueva `training-paths`
  (tenant-scoped, capability-gated) para los 5 métodos (nombre, sigla, descripción,
  niveles, currículum de pasos, seminarios, target group, idiomas, diploma) + las
  **fechas de curso como `events`** con `category='course'` y relación `trainingPath`.
  Evita duplicar toda la maquinaria de pago/fulfillment que events ya tiene.
- **D3 — Membresía Weekly Talks ($25/mes, trial 7d).** La maquinaria de live/replay/chat
  existe; lo que NO existe es **auth de miembros + suscripción recurrente de consumidor**.
  Recomendación: lanzar el sitio con la página de Weekly Talks + CTA "Join" a un
  **Payment Link de suscripción** de Stripe (los Payment Links soportan recurring +
  trial), y el **gating del archivo** como fase post-launch (magic-link estilo receptor
  inveid o token firmado por email). NO bloquear el go-live por esto.
- **D6 — Backend del carrito.** Un carrito real multi-ítem exige crear **Stripe Checkout
  Sessions** server-side en la cuenta del tenant → hay que **almacenar la secret key del
  tenant** (hoy solo guardamos el `whsec`). Recomendación: columna
  `stripe_secret_key_encrypted` en `tenant_payment_config` (pgcrypto, mismo patrón que
  el whsec) + endpoint público `POST /api/public/checkout-session` que valida los ítems
  contra el CMS y arma la sesión con `line_items` (usa `digital_products.stripe_price_id`,
  que ya existe). El webhook de fulfillment se extiende para resolver **multi-ítem por
  `price_id`** (hoy resuelve por `payment_link_id`). Alternativa si el cliente no da la
  key: "carrito visual" que enlaza Payment Links uno a uno (peor UX; no recomendado).
- **D7 — Mapas.** Directorio: mapa estilizado **MapLibre/Leaflet** (sin API key, tiles
  libres, pines desde lat/lng de la colección). Accommodations/Sophia: **iframe de Google
  Maps** (como el diseño). Confirmar que no se quiere Google en el directorio.
- **D9 — Física del Store.** Hay productos físicos (CDs, tests, color glasses):
  ¿shipping? Recomendación: Stripe Checkout con `shipping_address_collection` + flag
  `isPhysical` en el producto; el correo de fulfillment para físicos dice "te lo
  enviamos" (sin link de acceso). Confirmar con Vic si el shop US envía o si los físicos
  se quedan en el shop europeo (INK).

**Insumos del cliente (bloquean fases marcadas):**
- Archivos **KALICE** regular+bold (woff2) + confirmación de licencia web (bloquea F1).
- Fotos y texto del header de Online Courses (F3) · copy de New Patients (F2) ·
  audio de las pistas (F2-Music) · categorías finales del Shop (F6) — todos "Vic".
- Cuenta Stripe del tenant: Payment Links por curso/evento (F2/F3) y, si D6 aprueba,
  la restricted/secret key (F6).

## 4. Fases

### Fase 0 — Decisiones + insumos (gate)
**Objetivo:** cerrar D2/D3/D6/D7/D9 con cliente y diseñadora; recibir KALICE; inventario
de contenido (qué página usa qué colección + slugs de `page-contents`).
**Tareas:** sesión con Vic/Noemi usando la tabla §3; escribir las decisiones aquí;
definir el mapa de slugs (`home`, `about`, `contact`, `five-levels`, `weekly-talks`,
`foundation`, `sophia-home`, `new-patients`, `accommodations`, …).
**Criterio:** D2–D9 cerradas por escrito; KALICE en `public/fonts/`.
**Esfuerzo:** bajo (coordinación). **Bloquea:** todo.

### Fase 1 — Design system + shell del sitio
**Objetivo:** la base visual y de navegación sobre la que se montan todas las páginas.
**Tareas:**
- Tipografías: `@font-face` KALICE (display/serif) + DM Sans (Google Fonts con
  fallback stack); escala tipográfica del Figma.
- Tokens CSS de **dos paletas**: DK (navy/dorado/cream + gradientes) y Sophia (teal),
  como variables bajo `[data-theme="dk"|"sophia"]` — la nota de la diseñadora: mismo
  font/estilos, cambia el color scheme.
- Shell: announcement bar (contenido desde `page-contents`), header con **mega-nav
  dropdowns** (Sophia / Academy), slot de carrito (placeholder hasta F6), footer 4
  columnas + watermark, breadcrumbs.
- **Primitivas de motion** (con `prefers-reduced-motion`):
  `<AnimatedGradient>` (fondo animado entre secciones — ref newgenre.studio),
  `<Reveal>` (secciones entran al scroll — ref beautyunscripted.com),
  `<LineQuote>` (quotes línea por línea — misma ref),
  `<RotatingWord>` (palabra del hero — ref consciouslife.com).
  Implementación: IntersectionObserver + CSS; sin framer-motion (peso en SSG).
- Scaffold de rutas completo (todas las páginas del sitemap, con placeholders),
  preservando `/newsletter/confirmed|error` y el `.htaccess` SSG.
- `src/data/demo.ts` extendido: fallback local por página (mismo patrón actual).
**Criterio:** navegación completa navegable con placeholders, 2 temas conmutando por
sección, motion primitives demostradas en una página, typecheck/lint/build verdes.
**Esfuerzo:** medio-alto.

### Fase 2 — Páginas CMS-driven con colecciones existentes (el grueso SSG) ✅

> **Implementada 2026-08-27** (commits `bb2fc49`, `6e18006`, `03945ca`, `d17544b`).
> El landing temporal se eliminó de esta repo (sigue vivo en su URL actual; este
> proyecto se publica en otra). Rutas entregadas: Home, Events (listado + detalle
> pre-renderizado por slug), About, Contact, Academy, A.R.T., 5 Levels, Music,
> Foundation, Weekly Talks, Privacy/Terms, y el ramal Sophia completo (landing,
> Team, New Patients, Travel & accommodations). `/newsletter/confirmed|error`
> intactas, ahora dentro del shell.
>
> Quedan como scaffold, re-etiquetadas a su fase real: Publications (F3),
> Akademie (carga de contenido), Courses (F3), Therapists (F4), Store y Cart (F6).
>
> **Deuda conocida de F2:** falta el copy de New Patients y el retrato de About
> (ambos del cliente) — las secciones colapsan en vez de dejar media rejilla
> vacía; y la fila `newsletter` del CMS todavía trae el copy del landing (§7).


**Objetivo:** todas las páginas que NO requieren colecciones nuevas.
**Tareas (por página, todas con loader SSG + revalidación runtime):**
- **Home**: hero + intro (`page-contents`), eventos próximos (`events`), bloque ART,
  newsletter. *(El tramo inferior del Home no quedó capturado — revisar el frame
  `0:698` con zoom durante la maquetación.)*
- **Events** listado (tabs upcoming/past sobre `start_date_time`, cards con precio) +
  **Event detail** (sidebar fecha/precio/seats/Book Now → `checkout_url`).
- **About** (bio + timeline animado), **Contact** (4 tarjetas mailto con "ventana
  emergente" por tarjeta — nota de la diseñadora), **5 Levels** (video Mux vía
  `video-embeds`/promo + pirámide con hover states).
- **Music**: player `music-embeds` (sin tocar la validación) + links
  SoundCloud/Spotify + discografía desde `digital_products` (con `access_track_id`);
  botón de compra directo por `checkout_url` hasta F6 (el cart la absorbe después).
- **Foundation** (contenido + CTA a F5), **Weekly Talks** página marketing (banner
  next-live desde `events` live, FAQ desde `faqs`, CTA según D3).
- **Sophia** (tema teal): landing, **Meet Our Team** (`board-members`), **New Patient
  Info** (FAQ + form `POST /api/public/contact`), **Travel & Accommodations** (hoteles
  desde `page-contents` o colección simple + iframe Google Maps).
**Criterio:** cada página renderiza contenido real del CMS con fallback local; correo
de double opt-in sigue aterrizando bien; Lighthouse ≥90 en las claves.
**Esfuerzo:** alto (es la fase más grande).

### Fase 3 — Cursos (colección nueva + 3 plantillas) ✅

> **Implementada 2026-08-27.** Sitio: `5b7a155` en `cwsi-dietrich`. CMS: `e5c55bb`
> en `cwsf-beytrax` (autorizado explícitamente por Javier — es el CMS compartido).
>
> **Sitio** — 3 plantillas de los frames 0:2063 / 0:2403 / 0:2732: grid de los 5
> métodos, página de training path completa (about, during training, ruta
> numerada, requisitos de examen, seminarios recomendados, listado de seminarios)
> y página de fechas comprables. 10 rutas pre-renderizadas (`/courses/<slug>` y
> `/courses/<slug>/dates`).
>
> El contenido real de los 5 métodos está transcrito del Figma en
> `src/data/trainingPaths.ts` y `useTrainingPaths()` monta encima las filas del
> CMS **campo por campo** — una fila a medio llenar no puede blanquear el resto.
>
> **CMS** — colección `training-paths` capability-gated (`training-paths`, clave =
> slug por la regla zero-backfill del catálogo) + `events.trainingPath`,
> `events.instructor`, `events.language`. Migración `20260828_030618`: **solo
> aditiva**, 0 DROPs en el UP, `drift:check` verde.
>
> **Decisión de diseño clave:** una fecha de curso NO es un objeto nuevo — es una
> fila de `events` apuntando a su path. El pago, el fulfillment y la conciliación
> son exactamente los que ya existen; no se construyó nada para cobrar un seminario.
>
> **Aplicado en PRODUCCIÓN (2026-08-27):** migración `20260828_030618` aplicada
> (batch 31) **antes** del deploy, como manda la regla de orden · capabilities
> `training-paths` **y `events`** otorgadas al tenant (no tenía `events`, sin la
> cual no podía crear ninguna fecha de curso; ambas dentro de su plan Business) ·
> los 5 métodos cargados con `scripts/seed-dietrich-training-paths.ts` ·
> imágenes `citmadmin/cwsf-beytrax:1.1.121` (+ `-migrator`) publicadas.
>
> **Falta solo el reinicio del CMS en el servidor** (requiere SSH; la migración
> ya está aplicada, así que `migrate` no tiene nada pendiente). Hasta entonces
> `portal.beytrax.com/api/training-paths` responde 404 y el sitio usa el
> contenido empaquetado.
>
> **Pendientes de contenido:** header animado de Courses (`TeachersStrip` está
> listo pero no renderiza sin la fila `courses-teachers`; faltan las fotos de
> Vic) · las fechas de curso como filas de `events` con su `trainingPath`.
>
> ⚠️ El tenant sigue **sin** `faqs`, `board-members` ni `legal-pages`, que F2 sí
> usa (Weekly Talks/New Patients, Sophia Team, Privacy/Terms). Están dentro de
> Business; se otorgan cuando se cargue ese contenido.

<details>
<summary>Plan original de la fase</summary>

### Fase 3 — Cursos (colección nueva + 3 plantillas)
**Objetivo:** Online Courses completo según D2.
**Tareas:**
- **CMS (`cwsf-beytrax`, compartido):** colección `training-paths` capability-gated
  (`courses` en `enabled_modules` — solo tenants con la capability la ven), campos
  según Figma (sigla, niveles chips, currículum de pasos numerados, seminarios,
  target group, idiomas, diploma, orden). Migración Payload con la disciplina de
  `MIGRATIONS_OWNERSHIP.md` + `drift:check` (⚠️ misma clase de riesgo que el incidente
  `email_template`: snapshot SIEMPRE al día).
- Relación en `events`: campo `trainingPath` (relationship, opcional) para las fechas.
- **Sitio:** grid de métodos (0:2063), página interna por método con sus próximas
  fechas (0:2403 — la nota: "cada tarjeta lleva a su propia página interna"; generar
  las 5 rutas por slug), y detalle de training path (0:2732).
- Header animado de Courses (fotos con movimiento lateral) — fotos de Vic.
**Criterio:** los 5 métodos administrables desde el CMS; fechas = events comprables con
fulfillment ya probado; otros tenants NO ven la colección.
**Esfuerzo:** medio-alto.

</details>

### Fase 4 — Directorio de terapeutas ✅

> **Implementada y aplicada a PRODUCCIÓN (2026-08-27).** Sitio `09477cb`
> (cwsi-dietrich) · CMS `d7ea1f0` (cwsf-beytrax) · API `80b6f50` (CWSB-Baytrax).
>
> **Fuente:** no hubo scraping. El directorio alemán llama a su propio endpoint
> JSON — `https://www.ink.ag/apps/therapeuten?page=1&pageSize=250` — con todo
> estructurado: **136 terapeutas, 127 ya con lat/lng**, contacto, dirección y
> certificaciones. `scripts/import-practitioners.ts` lo consume, es idempotente
> por `sourceId` (re-correrlo actualiza, no duplica) y tiene `DRY_RUN=1`.
>
> **CMS:** colección `practitioners` capability-gated + migración
> `20260828_040824` (solo aditiva, 0 DROPs, drift verde) **aplicada a prod**;
> capability concedida al tenant; los 136 registros cargados.
>
> **Sitio:** página 0:3616 completa — búsqueda sobre nombre/ciudad/CP/calle/país,
> filtro por cualificación, mapa Leaflet con 127 pines y grid paginado. Los 136
> están en el HTML estático (crawleable, funciona sin JS); el filtrado corre en
> memoria, así que la página sigue siendo un archivo estático sin buscador detrás.
>
> **Decisiones de modelado:** las cualificaciones se guardan como *claves*
> estables (`art`, `pk`…) y el sitio pone las etiquetas — re-escribir un rótulo
> no puede vaciar un filtro en silencio. `professionalTitle` se conserva **en su
> idioma original**: "Heilpraktiker" es una profesión regulada alemana sin
> equivalente inglés, traducirla falsearía las credenciales de alguien.
>
> ⚠️ **Pendientes de F4:**
> 1. **Proveedor de tiles** antes del go-live. Carto ahora estampa "API KEY
>    REQUIRED" en cada tile; se usa OpenStreetMap, que funciona sin clave, pero
>    su política pide a los sitios de producción no apoyarse en ella. Cambiar a
>    MapTiler/Stadia (tier gratis con clave) son dos líneas en `TILES`.
> 2. **Revisión de datos personales.** Son datos de contacto de 136 terceros
>    movidos de una GmbH alemana a un sitio de EE.UU.; consintieron aparecer en
>    ink.ag. Conviene que el cliente confirme la base legal, y las bajas deben
>    hacerse poniendo la ficha en `hidden` aquí (borrarla en el origen no basta:
>    el siguiente import la traería de vuelta).
> 3. Los 9 sin coordenadas salen en el listado pero no en el mapa.

<details>
<summary>Plan original de la fase</summary>

### Fase 4 — Directorio de terapeutas
**Objetivo:** el directorio completo con datos reales migrados (D4).
**Tareas:**
- **CMS:** colección `practitioners` capability-gated (nombre, título/chips,
  qualifications, ciudad, país, lat/lng, tel, email, website, idiomas, status).
- **Import:** script de scraping/migración desde `ink.ag/en/pages/therapeutensuche`
  (una vez, con revisión manual del resultado; guardar el script en `scripts/`).
- **Sitio:** página 0:3616 — búsqueda por texto/dirección, filtro por qualification,
  mapa (según D7: MapLibre + pines desde lat/lng, geocoding one-off en el import),
  grid paginado (Load more).
**Criterio:** todos los terapeutas del sitio europeo visibles y filtrables; mapa
funcional sin API keys de pago (salvo decisión D7 distinta).
**Esfuerzo:** medio-alto (el import es lo impredecible).

</details>

### Fase 5 — Donaciones Foundation ✅ (código) · ⛔ bloqueada operativamente

> **Implementada 2026-08-27**, commit `e817def` en `cwsi-dietrich`. Sin cambios
> de CMS ni de API: el flujo de donaciones MoR ya existía completo para
> SistWorld y solo se portó y re-tematizó.
>
> **Foundation** (`/foundation`): copy real del frame 0:5277 — titular de tres
> frases, propósito, los cuatro compromisos y la quote de cierre. Corregido el
> typo "DDr. Klinghardt" del diseño.
>
> **Donación** (`/foundation/donate` + `/foundation/donate/return`): Stripe
> Elements en modo diferido con `onBehalfOf` = la cuenta conectada de la
> Fundación, que **debe** coincidir con el `on_behalf_of` que el API pone en el
> PaymentIntent o Stripe rechaza la confirmación. La página de retorno
> **recupera el PaymentIntent** en vez de confiar en el `redirect_status` de la
> URL — un parámetro de URL no es prueba de que el dinero se movió — y
> re-consulta mientras siga `processing`.
>
> **Si se puede donar se decide en RUNTIME, no en el build:** depende del
> onboarding de Stripe de la Fundación, que cambia sin rebuild, así que hornearlo
> en el HTML acabaría siendo mentira. Falta la clave publicable también degrada
> igual, para que nunca aparezca un formulario que falla en el último paso.
>
> ⛔ **Bloqueo operativo — la página NO puede cobrar todavía:**
> 1. El tenant Dietrich **no tiene cuenta Stripe Connect** (`stripe_connect_accounts`
>    solo tiene a SistWorld). Sin ella `POST /api/donations/create-intent`
>    responde 409 y la página muestra "Donations open soon".
> 2. Falta `VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY` (la clave **de la plataforma**,
>    no la del tenant) en el entorno del sitio.
> 3. El propio diseño dice que la Fundación *"is being established"*, así que el
>    estado cerrado puede además ser el correcto por ahora.
>
> **Verificado** contra `site-context` de producción en las dos ramas:
> `dietrich-klinghardt.com` → sin cuenta conectada (estado cerrado, revisado en
> navegador) · `sistworldfoundation.org` → cuenta real (rama del formulario).
> Elements en sí queda sin verificar end-to-end: no hay cuenta ni clave, que es
> justo el prerrequisito que el plan ya anticipaba.

<details>
<summary>Plan original de la fase</summary>

### Fase 5 — Donaciones Foundation
**Objetivo:** página de donación clonada de SistWorld, re-tematizada DK (D5).
**Tareas:** portar `DonatePage`/`DonateReturnPage` del patrón sistworld (Stripe
Elements + donations MoR `on_behalf_of`); tematizar; **prerrequisito operativo:** el
tenant necesita cuenta Stripe **Connect** con `charges_enabled` (flujo donations es
MoR vía plataforma — distinto del Stripe personal de events/store; coordinar alta).
**Criterio:** donación de prueba end-to-end + correo de recibo; degradación correcta si
Connect no está listo (patrón auto-degradante ya existente).
**Esfuerzo:** medio (reuso alto).

</details>

### Fase 6 — Store + carrito (la fase con más backend)
**Objetivo:** catálogo con categorías + carrito unificado (D1/D6/D9).
**Tareas:**
- **CMS:** en `digital_products`: campos `category` (select según lo que confirme Vic)
  + `isPhysical` + `featuredRank` (para "Top 5 Picks of the Month" — la curación
  mensual se administra con este campo + `page-contents` para el mes).
- **API (`CWSB-Baytrax`):** según D6 — `stripe_secret_key_encrypted` en
  `tenant_payment_config` (migración; ⚠️ verificar el siguiente número libre — hoy van
  en 039 y hay sesiones paralelas tomando números) + `POST /api/public/checkout-session`
  (valida ítems contra CMS, line_items por `stripe_price_id`, shipping para físicos,
  `success_url`/`cancel_url` del sitio) + **fulfillment multi-ítem**: `resolveFulfillment`
  aprende a resolver por `price_id` de los line items (además del `payment_link_id`
  actual) y el correo de acceso lista N ítems; para físicos, variante "en camino".
- **Sitio:** página Store (Top-5 + filtros por categoría + grid), cart drawer global
  (estado en localStorage), botones ADD en Store/Music/Cursos, checkout → sesión.
- Tests: suite del webhook extendida (multi-ítem, físico+digital mixto).
**Criterio:** compra multi-ítem de prueba end-to-end (digital entrega acceso, físico
pide dirección); Payments-vs-Emails card sigue reconciliando (registro al recibir ya
implementado).
**Esfuerzo:** alto. **Riesgo:** el mayor del plan; si D6 se rechaza, degradar a compra
directa por producto (F2-Music ya lo deja funcionando).

### Fase 7 — Weekly Talks live (+ membresía según D3)
**Objetivo:** el live in-house con la interfaz del diseño.
**Tareas:** página live usando la maquinaria existente (`events.live_mode` + Mux Live +
replay + chat 038/039); banner "next live talk" + add-to-calendar (ICS generado);
suscripción $25/mes vía Payment Link recurrente (mínimo viable); si D3 aprueba gating:
fase separada post-launch (magic-link de miembro + archivo de replays filtrado).
**Criterio:** un live de prueba visible en la página con chat; CTA de membresía cobrando.
**Esfuerzo:** medio (mínimo viable) / alto (con gating).

### Fase 8 — Motion pass + QA + SEO
**Objetivo:** el nivel de acabado que piden las notas.
**Tareas:** pasada de animaciones página por página contra las referencias (gradientes,
reveals, quotes, hover pirámide, timeline About); accesibilidad (focus, aria, contraste,
`prefers-reduced-motion`); SEO (title/meta/og por ruta vía `<Head>`, sitemap.xml,
robots); perf (imágenes del Figma exportadas optimizadas — usar el PAT de Figma para
exportar assets); QA cross-browser + móvil (⚠️ el Figma no trae diseños mobile —
criterio propio responsive, validar con Noemi las 3-4 páginas clave).
**Criterio:** checklist de notas de FIGMA_NOTES.md 100% cubierto o descartado por
escrito; Lighthouse ≥90; revisión de Noemi aprobada.
**Esfuerzo:** medio.

### Fase 9 — Contenido + go-live
**Objetivo:** reemplazo en producción sin romper lo vivo.
**Tareas:** carga de contenido real en el CMS (slugs de F0; eventos/cursos/productos
reales con sus Payment Links **live** — ⚠️ lección Iconic: cero URLs de sandbox, slugs
sin espacios); backfill de `enabled_modules` del tenant (`courses`, `practitioners`,
video/live según fase); alta del webhook tenant-stripe del cliente (3 eventos, patrón
documentado); smoke E2E en prod (compra, booking de evento, newsletter, donación);
deploy final (el dominio ya apunta al repo — es un replace, no un cutover DNS).
**Criterio:** sitio completo vivo en `dietrich-klinghardt.com`; la landing vieja fuera;
double opt-in histórico sigue funcionando.
**Esfuerzo:** medio.

## 5. Orden y dependencias

```
F0 → F1 → F2 ─┬→ F3 (cursos)      ─┬→ F8 → F9
              ├→ F4 (directorio)   │
              ├→ F5 (donaciones)   │
              ├→ F6 (store+cart)   │
              └→ F7 (weekly talks) ┘
```
F3–F7 son paralelizables entre sí tras F2. Si urge salir: **F0–F2 + F9 es un sitio
publicable** (todo lo demás puede llegar por fases sobre el sitio vivo — SSG rebuilds).

## 6. Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Colecciones nuevas en el CMS compartido rompen snapshot/drift (clase `email_template`) | Alta | Disciplina MIGRATIONS_OWNERSHIP + drift:check en cada PR; capability-gate para no tocar otros tenants |
| Guardar la Stripe secret key del tenant (D6) amplía superficie de secretos | Alta | pgcrypto mismo patrón whsec; solo el endpoint de checkout la lee; restricted key si Stripe lo permite |
| Import de ink.ag incompleto/sucio | Media | Revisión manual post-import; script idempotente re-ejecutable |
| Contenido de Vic tarda (fotos, copy, audio, categorías) | Media | Fallbacks locales por página; fases no bloqueadas entre sí |
| Sin diseños mobile en el Figma | Media | Responsive con criterio propio + validación de Noemi en F8 |
| KALICE sin licencia web | Media | Bloqueo explícito en F0; fallback temporal serif del sistema solo en dev |
| Membresía gated crece de alcance | Media | D3 la saca del go-live; Payment Link recurrente como mínimo viable |

## 7. Mapa de slugs de `page-contents`

Cerrado en F2 (era entregable de F0). La fuente de verdad en código es
`src/lib/sections.ts`; esta tabla es su lectura para quien carga contenido.

**Regla:** *una fila por bloque*, no una fila por página. Una fila con toda la
página adentro obliga a leer el copy por índice de bloque — el mismo acoplamiento
posicional que rompió Iconic. Falta una fila ⇒ el bloque cae al fallback que vive
junto a su markup; nunca queda en blanco ni corre el resto del texto.

| Slug | Dónde aparece |
|---|---|
| `announcement` | Barra dorada superior (todas las páginas). Lleva además `ctaLabel` + `ctaUrl` |
| `home-hero` · `home-intro` · `home-events` · `home-art` · `home-shop` · `home-talks` | Bloques del Home, en ese orden |
| `newsletter` | Bloque de suscripción (Home, Events y el resto de páginas) |
| `about` · `contact` · `academy` · `art` · `five-levels` · `music` · `foundation` · `weekly-talks` | Páginas propias |
| `about-timeline` · `contact-cards` · `five-levels-list` · `music-links` · `accommodations-list` · `accommodations-map` · `weekly-talks-cta` | Listas: **una línea por registro, campos separados por `\|`** (ver `useRecords` en `src/lib/sections.ts`) |
| `sophia-home` · `sophia-team` · `new-patients` · `accommodations` | Ramal Sophia (tema teal) |

⚠️ **Colisión pendiente de contenido:** la fila `newsletter` ya existe en el CMS
con el copy del landing temporal (título *"Stay informed"*, primer párrafo
*"Klinghardt® Newsletter"*). El sitio nuevo la usa para el bloque *"Join Our
Newsletter"* del diseño, así que hoy renderiza el texto viejo. Es una edición de
un campo en el CMS — queda en la carga de contenido de F9, no es código.

## 8. Referencias

- `docs/FIGMA_NOTES.md` — notas completas de la diseñadora (y JSON crudo).
- Memoria de sesión: mapa frame→node-id de los 22 frames.
- `cwsi-sistworld` — patrón de página de donación a clonar (D5).
- `cwsi-IconicMethod`/`cwsi-Renace` — patrones SSG+CMS+Plesk ya probados.
- Lección Iconic (jul-2026): nunca URLs de sandbox en fallbacks; slugs exactos.
