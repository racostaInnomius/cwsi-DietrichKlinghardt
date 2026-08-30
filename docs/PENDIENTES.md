# Pendientes — sitio Dietrich Klinghardt™

> Registro vivo de todo lo que quedó abierto en cada fase, separado en dos:
> **lo que nos deben** (insumos de terceros que no podemos producir nosotros) y
> **lo que nos toca** (trabajo o decisiones nuestras).
>
> Actualizado: 2026-08-28, al cerrar F9. La **secuencia** de publicación está
> en `GO_LIVE.md`; aquí está el inventario.
> El detalle de cada fase está en `IMPLEMENTATION_PLAN.md`.

---

## A. Nos deben — insumos de terceros

Nada de esto se puede resolver escribiendo código. Cada línea dice quién lo debe
y qué se queda bloqueado mientras no llegue.

| # | Qué | Quién | Fase | Qué bloquea |
|---|---|---|---|---|
| A1 | **Archivos KALICE con licencia web** | Diseñadora / cliente | F1 | ✅ **Entregados** (2026-08-28): familia completa en `Kalice Family 2026/`, © 2023 Margot Lévêque, sin rastro de "Trial". Instalados `regular/italic/medium/bold` en `public/fonts/`; el diseño usa **tres pesos (400/500/700)**, confirmado contando nodos del Figma |
| A2 | **Copy de New Patients** | Vic | F2 | La página existe con el formulario, pero la columna de contenido está vacía (colapsa sola) |
| A3 | **Retrato de Dr. Klinghardt** para About | Vic | F2 | ✅ **Entregado** (2026-08-29) e instalado: `klinghardt-portrait.webp`. La bio ya va a dos columnas |
| A4 | **Audio de las pistas de Music** | Vic | F2 | La página de Music muestra estado vacío; la discografía comprable depende de esto |
| A5 | **Fotos + texto del header de Online Courses** | Vic | F3 | `TeachersStrip` está construido pero no renderiza sin la fila `courses-teachers` |
| A6 | **Categorías finales del Shop** (vs. el catálogo de ink.ag) | Vic + Noemi | F6 | Las 7 categorías actuales salen del diseño; cambiarlas después es una migración de enum |
| A7 | **Cuenta Stripe Connect de la Fundación** con `charges_enabled` | Cliente | F5 | ⛔ Sin ella la página de donación no puede cobrar. Hoy dice "Donations open soon" |
| A8 | **Restricted key de Stripe del tenant** (scope: *Checkout Sessions: write*) | Cliente | F6 | ⛔ Sin ella el carrito no puede crear sesiones de pago |
| A9 | **Payment Links live** por curso y por evento | Cliente | F2/F3 | Sin ellos las páginas muestran "registration not open" en vez de un botón que no cobra |
| A10 | **Base legal de los datos de terapeutas** | Cliente / legal | F4 | 136 datos de contacto de terceros movidos de una GmbH alemana a un sitio de EE.UU. Consintieron aparecer en ink.ag, no necesariamente aquí |
| A11 | **Página Akademie** | Vic | F9 | Ruta scaffolded; el cliente la trabaja aparte |
| A12 | **Validación de diseño en móvil** | Noemi | F8 | El Figma no trae diseños mobile; el responsive es criterio propio |
| A13 | **Decisión de membresía Weekly Talks** ($25/mes, trial 7d) | Cliente | F7 | Define si el CTA va a un Payment Link recurrente o a un flujo con gating. Hoy el CTA sale de la fila `weekly-talks-cta` y pasa por `checkoutHref`: **sin Payment Link live no aparece botón** |
| A14 | **Confirmar la grafía de la marca: `Akademy™` o `Academy™`** | Cliente / Noemi | F9 | El Figma se contradice: escribe **`Dr. Klinghardt Akademy™` 15 veces** (incluida la barra de navegación) y `Academy™` 4. Seguimos la forma de la navegación, que es la dominante. Es una **marca registrada**: publicarla mal escrita es peor que discrepar del Figma, así que hay que confirmarlo antes del go-live. Ojo: `Klinghardt Akademie` es otra cosa — la academia alemana en Europa — y esa sí va así |

---

## B. Nos toca — trabajo y decisiones nuestras

### B.1 Operación / despliegue

| # | Qué | Fase | Estado |
|---|---|---|---|
| B1 | **Subir el CMS de imagen** (`docker compose pull && up -d`) | F3, F4 | ✅ **Hecho por Javier** (2026-08-28): `cwsf-beytrax:1.1.116` → **1.1.123**. Verificado: `/api/training-paths` devuelve las 5 formaciones y `/api/practitioners` los 136. No hubo migraciones pendientes: las 3 del hueco ya estaban en la BD (batches 31, 32 y 33), es decir la base iba **por delante** del contenedor, que es el orden correcto |
| B2 | **Subir el API de imagen** | F6 | ✅ **Hecho por Javier** (2026-08-28): `cwsb-beytrax:1.1.133` → **1.1.136** (el release de F6, no trabajo ajeno). Verificado: `POST /api/public/checkout-session` ya responde 400 a cuerpo vacío en vez de 404. La única migración del hueco, `040_tenant_stripe_secret_key`, ya estaba aplicada. Este bump es además el que activó la mitad (a) de B18 |
| B3 | **Registrar un runner self-hosted para `cwsi-dietrich`** | F9 | ✅ **Hecho** (ver B22). Contexto original: el workflow pide `runs-on: [self-hosted, plesk]` y la repo tenía **0 runners**, así que cada push se encolaba y acababa `cancelled`. Renace, Bistro e Iconic tienen **cada una el suyo**; la cuenta es de usuario, no organización, así que no hay pool que heredar. El panel de Plesk (`:8443`) no es accesible desde fuera, así que no sirve un runner de GitHub. ✅ Ya hechos: Document Root `dkk.beytrax.com/dist`, TLS Let's Encrypt, secret `PLESK_GIT_HOOK_UUID` |
| B20 | **Activar "Additional deployment actions" en Plesk** con `bash scripts/plesk-deploy.sh` | F9 | ✅ **Hecho por Javier.** Era lo que faltaba para la publicación simple, independiente del runner |
| B22 | **Registrar el runner en el VPS** | F9 | ✅ **Hecho** (2026-08-28). `plesk-runner-dkk` en `/home/cwsadmin/actions-runner-dkk`, servicio `actions.runner.javierpacher-cwsi-dietrich.plesk-runner-dkk`, etiquetas `self-hosted, Linux, X64, plesk`. Verificado de punta a punta: un push a `main` dispara el webhook de Plesk, Plesk hace pull + `plesk-deploy.sh`, y el cambio queda publicado |
| B23 | **Apagar el hosting Node.js en Plesk para los dominios estáticos** | F9 | ✅ **Hecho en `dkk.beytrax.com`** (`plesk ext nodejs --disable -domain dkk.beytrax.com`): tenía `PassengerEnabled on` / `PassengerAppType node` / `PassengerStartupFile app.js` sin que existiera `app.js`, y mod_passenger reclamaba toda petición que no resolviera a un archivo — antes que los rewrites — devolviendo **500** en vez de 404. Verificado: 37/37 páginas en 200, `/sitemap.xml` y assets ausentes en 404. ⚠️ **Destapó dos efectos** que hubo que arreglar en el `.htaccess` (ver B24). ⛔ **Sigue pendiente en los hermanos**: `sistworldfoundation.org`, que ya es público, responde 500 hoy ante cualquier archivo ausente; `iconicbytanny.com` lo tapa con un rewrite catch-all que devuelve 200 (soft-404) |
| B24 | **`.htaccess`: precedencia de `.html` sobre el directorio homónimo** | F9 | ✅ Hecho, pero **conviene replicarlo en los sitios hermanos** cuando se les apague Node.js. El SSG emite la página y sus hijas como hermanos (`courses.html` **y** `courses/art.html`), así que `/courses` nombra a la vez un archivo y un directorio. Sin Passenger de por medio ganaba `mod_dir`: 301 a `/courses/`, que no tiene índice → **403**. Afectaba a `/courses`, `/academy`, `/foundation` y `/sophia`. Arreglo: `DirectorySlash Off` + resolver el `.html` primero. El `DirectorySlash Off` es imprescindible — `mod_dir` redirige **antes** de que corran los rewrites por directorio, así que sin él la regla nunca llega a dispararse |
| B21 | **Token de rebuild acotado a esta repo** | F9 | ✅ **Resuelto** (2026-08-28). El token guardado en `sites.rebuild_token_encrypted` **sí** alcanza `javierpacher/cwsi-dietrich`: se comprobó un `repository_dispatch` real llegado a la repo (run `33190863017`, 16:37), que entonces quedó `cancelled` sólo porque aún no había runner. Cadena completa verificada después: dispatch → runner → webhook de Plesk → publicado (run `33194101828`, verde) |
| B18 | **Permitir el origen `dkk.beytrax.com`** | F9 | ⚠️ **Son DOS listas, no una.** (a) API: `ALLOWED_ORIGINS` en `api.beytrax.com/.env` → ✅ escrito y **ya activo** (verificado: `ACAO: https://dkk.beytrax.com`). (b) CMS: `BEYTRAX_PUBLIC_ORIGINS` en `portal.beytrax.com/.env` — es de donde Payload saca `cors`/`csrf` — → ✅ escrito y **ya activo** tras recrear el contenedor (verificado: `ACAO: https://dkk.beytrax.com` también en `portal.beytrax.com`). Síntoma cuando falta (b): las colecciones responden 200 **con datos pero sin cabecera CORS**, el navegador las descarta y el directorio sale en «0 results» sin error de servidor. Respaldos `.env.bak-20260828-dkk` en ambos |
| B19 | **Variables de entorno de la suscripción en Plesk** | F9 | `SITE_URL`, `CMS_SITE_DOMAIN`, `INDEXABLE=false`, API/CMS/tenant/site. Se hornean en el build: cambiarlas exige redesplegar |
| B4 | **`VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY`** (clave de la **plataforma**, no del tenant) en el entorno del sitio | F5 | Sin ella la donación degrada aunque la Fundación ya tenga Connect |

### B.2 Código pendiente

| # | Qué | Fase | Por qué importa |
|---|---|---|---|
| B5 | **Fulfillment por línea del carrito**: ledger por ítem (migración) + bucle del correo de acceso | F6 | ⛔ Es lo que mantiene el checkout cerrado (`CART_FULFILLMENT_IMPLEMENTED = false`). `product_fulfillments` tiene UNA fila por sesión, así que una cesta de N productos no se puede registrar ni entregar. ⚠️ El template de `sendAccessEmail` es de un solo ítem y está en la ruta viva de Iconic — no reescribir sin tests |
| B6 | **Variante del correo para productos físicos** ("va en camino", sin liga de acceso) | F6 | Hoy un pedido solo-físico no recibiría ningún correo de Beytrax (solo el recibo de Stripe) |
| B7 | **Borrar el guard del checkout** una vez B5+B6+A8 estén | F6 | Una línea; va al final, nunca antes |
| B8 | **Decidir proveedor de tiles del mapa** | F4 | Carto ahora estampa "API KEY REQUIRED". Se usa OpenStreetMap, que funciona sin clave pero cuya política pide a los sitios de producción no apoyarse en ella. Cambiar `TILES` a MapTiler/Stadia son dos líneas |
| B9 | **Prueba real end-to-end de donación** + verificar que sale el correo de recibo | F5 | ⚠️ El flujo MoR **nunca estuvo en producción**: con SistWorld solo hubo sandbox y no se integró. Dietrich sería el primero, así que hay que tratarlo como no probado |
| B10 | **Revisar la fila Connect de SistWorld en prod** (`acct_1TotQd3…`, `charges_enabled=true`) | F5 | Viene de aquellas pruebas sandbox y hoy la expone el `site-context` **público de producción**. Misma clase de riesgo que el incidente Iconic; borrarla si no sirve |
| B17 | **QA cross-browser + Lighthouse** contra el sitio desplegado | F8 | No se puede hacer desde aquí. El contraste, el reduced-motion, los metadatos y el peso de bundles ya se auditaron y corrigieron |
| B11 | **ADR-0002 tiene marcadores de conflicto de merge commiteados** (`<<<<<<< HEAD`) en `cwsf-beytrax/docs/adr/0002-cms-audit-log.md` | — | Viene de una sesión anterior; el documento está roto |

### B.3 Contenido que cargamos nosotros en el CMS

| # | Qué | Fase | Nota |
|---|---|---|---|
| B12 | Reescribir la fila `newsletter` de `page-contents` | F2 | Todavía trae el copy del landing temporal ("Stay informed" / "Klinghardt® Newsletter"); el sitio nuevo la usa para "Join Our Newsletter" |
| B13 | Crear las filas de sección que faltan | F2 | El mapa completo está en `IMPLEMENTATION_PLAN.md` §7. Sin ellas cada bloque cae a su fallback, que es contenido real del diseño — no urge, pero no es editable |
| B14 | Cargar las **fechas de curso** como filas de `events` con su `trainingPath` | F3 | Sin ellas `/courses/<slug>/dates` muestra estado vacío |
| B15 | Geocodificar los **9 terapeutas sin coordenadas** o dejarlos solo en el listado | F4 | Hoy salen en la lista pero no en el mapa, y la página lo dice explícitamente |

---

## C. Cerrados durante la implementación

Se anotan para no volver a levantarlos.

- ✅ Capabilities del tenant: pasó de 8 a **28** (las 26 de Business + `music.external`, que ningún plan otorga, + `practitioners`). Antes le faltaban `events`, `faqs`, `board-members` y `legal-pages`, que F2/F3 sí usan.
- ✅ **D2** (modelado de cursos) · **D4** (migrar el directorio) · **D5** (clonar donación) · **D6** (restricted key cifrada) · **D7** (mapa sin API key) · **D9** (físicos con shipping).
- ✅ Migraciones aplicadas a prod: `20260828_030618` (training-paths), `20260828_040824` (practitioners), `20260828_133002` (campos de tienda), `040` (clave cifrada del tenant).
- ✅ Contenido cargado: 5 training paths, 136 terapeutas.
- ✅ Sitio **publicado** en `dkk.beytrax.com` (2026-08-28): verificado en producción — `noindex` en las páginas y `robots.txt` con `Disallow: /`.
- ✅ Token fine-grained de rebuild generado y asignado en el CMS, validado con "Rebuild now".
- ✅ `sites.rebuild_repo` repuntado de `racostaInnomius/cwsi-DietrichKlinghardt` a `javierpacher/cwsi-dietrich` (2026-08-28): la landing ya no recibirá cambios, este pasa a ser el sitio del CMS.
- ✅ **F8**: canonicals duplicados (cada página apuntaba a `/`), og de la landing en todas las páginas, tres fallos de contraste AA, reduced-motion incompleto y `app.js` de 384→67 KB gzip.
- ✅ Chat en vivo portado (B16 cerrado): verificado que nada del lado del chat estaba incompleto antes de tocarlo.

---

## D. Desviaciones contra el diseño (auditoría 2026-08-28)

El detalle completo, con método y evidencia, está en `AUDIT_FIGMA.md`. Aquí solo
el índice para seguimiento.

| # | Qué | Prioridad | Nota |
|---|---|---|---|
| D1 | **Decidir el modelo de fondo**: el diseño usa **un gradiente de página con banda blanca central**, no gradientes por sección | ⛔ Primero | Condiciona el color de texto de todas las secciones. El contraste que se pierde (blanco a 3.13:1 sobre el teal, 1.65:1 sobre el ámbar) es síntoma de esto, no la causa |
| D2 | **Sophia** (`/sophia`) | Alta | ✅ **Rehecha** (2026-08-30) desde el frame `0:6594`: *Founded by…* + bloque de **cifras 25+/10K/5/100%**, *A Different Kind of Medicine*, **Six Pillars** (6 tarjetas), *Cutting-edge Science* con los **4 pasos numerados**, *Healing the Whole Person* (4 terapias), *Complex Conditions* (8 píldoras) y la banda de cierre *Stop Wondering. Start Finding Answers.* Antes tenía 3 titulares inventados |
| D3 | **New Patients** | Alta | ✅ **Rehecha** (2026-08-30) desde el frame `0:7475`: *We Know You Have Been Through a Lot* con foto, **acordeón 01–05** de las preguntas frecuentes, las **4 tarjetas** del enfoque (Root-Cause / Individualized / A.R.T.® / 5 Levels), *What to Expect as a Patient* y la banda de cierre con el formulario. ⚠️ **El diseño dibuja las preguntas cerradas, sin respuestas** — las respuestas siguen siendo insumo del cliente (A2); hasta que lleguen cada fila lo dice en vez de abrirse a nada |
| D4 | **Homepage**: faltan las secciones de **Events**, **Sophia** y **Shop**; el hero es a sangre en vez de tarjeta con foto | Alta | Weekly Talks y Shop están como teaser pequeño; el diseño los trae como secciones completas |
| D5 | **5 Levels**: falta la pirámide numerada `01st`–`05th` y la cita | Media | ✅ **Hecha** (2026-08-29). Pirámide construida como lista ordenada real: ápice en triángulo + 4 bandas que ensanchan hacia la base (387→480→574→667 del lienzo de 1440), cada una con el **acento del diseño** (`#6a9ec0` `#5e9b74` `#b89b40` `#c9935a` `#d4756b`), sus glifos y los ejes *objective/subjective reality* rotados. Leyenda a la derecha con el mismo acento, y la **cita real** del frame. Declarada **Libre Baskerville** (era C1) para los ordinales. Vídeo servido desde Azure Blob con póster |
| D6 | **Weekly Talks**: faltan *Learn, Connect, Grow Together*, el bloque de **$25** y el **FAQ** | Media | |
| D7 | **Store**: falta *Dr. Klinghardt's Top 5 Picks of the Month* + *August 2026* | Media | En el diseño abre la página |
| D8 | **Accommodations** | Media | ✅ **Hecha** (2026-08-30) desde el frame `0:7840`: *How to Find Us* con el copy real, **los 6 hoteles** con dirección, teléfono con `tel:`, sitio y la nota de descuento de cada uno, y la banda de cierre con formulario. ⚠️ Sin fila de mapa en el CMS, el hueco enlaza a Google Maps en vez de dejar un marco vacío |
| D9 | **Academy**: falta *Klinghardt Akademie*, sobra *Online Courses*, y el orden difiere | Media | ✅ **Rehecha** (2026-08-29). Era una rejilla de 6 tarjetas pequeñas; el diseño son **6 filas a ancho completo que alternan imagen y texto**. Copy, eyebrows, líneas en Fraunces y etiquetas de botón transcritas del frame `0:3213`. Añadido *Klinghardt Akademie*, quitado *Online Courses* (que ahí no está) y respetado el orden del diseño. ⚠️ Faltan dos ilustraciones que el diseño sí trae: el **mapa de terapeutas** y la **pirámide de los 5 Niveles** — esas dos filas van a una columna hasta que existan. Las tarjetas de *Akademie* y *Foundation* se **dibujan en CSS** (son gradiente + wordmark), no esperan export |
| D10 | **Copy sustituido donde el diseño sí lo trae escrito**: About (*A Life Dedicated to Healing*), A.R.T., y las 4 etiquetas de Contact | Baja | Donde el diseño trae lorem, el copy propio es correcto y se queda |
| D11 | **Libre Baskerville 700** no está declarada | Baja | 20 nodos reales del diseño: los ordinales de la pirámide de los 5 Niveles |
| D12 | **Music**: falta el bloque *Discography* | Baja | |
| D13 | **Dos contrastes por debajo de AA que vienen del propio diseño** — decisión del cliente | Media | Se aplicaron **fieles al Figma** y ambos fallan medidos: (a) **barra de anuncio**, texto blanco sobre `#e9a43f` = **2.13:1** (con tinta oscura daba ~7:1; si se quiere accesible sin perder el ámbar, la barra tiene que bajar a ~`#b8792a`, que lleva blanco a 4.5:1); (b) **eyebrow del hero**, el dorado `#93661c` del diseño sobre la franja azul de la tarjeta = **1.81:1**; (c) **eyebrow de las páginas interiores**, blanco sobre el azul medio de la franja superior = **~3.9:1** — el diseño mide **4.0** en el mismo sitio, así que estamos a su nivel, no por debajo. Remedio si se quiere AA: oscurecer un punto el arranque de la franja, o llevar el eyebrow a los 18px semibold que usa el diseño (hoy son 12px). No son deslices nuestros: el archivo los dibuja así. El resto del sitio sí pasa AA |
| D14 | **Falta la foto del Dr. Klinghardt en la tarjeta del hero** | Media | ✅ **Hecho** (2026-08-29): el cliente entregó el panel completo del diseño (gradiente + retrato compuesto). Va como `<img>` y no como fondo, porque `.gradient-card` fija el shorthand `background` y lo pisaría — y así además se puede marcar como candidato LCP |
| D15 | **El vídeo necesita un host: no puede vivir en la repo** | ⛔ Alta | **Opción elegida a evaluar: Azure Blob** — ya es el almacén de media de la plataforma (`cwsbeytrax.blob.core.windows.net/beytrax-media/<tenant>/`, vía `@payloadcms/storage-azure`), así que no añade proveedor nuevo. Sirve por descarga progresiva con *range requests* (el usuario puede saltar), pero **sin bitrate adaptativo**: quien entre por móvil con mala red se traga el 1080p entero. Mitigación: subir también un 720p (~60 MB) y elegir por `media query`. Requiere `Content-Type: video/mp4` correcto y un reproductor `<video>` propio (el `VideoPlayer` actual es para iframes de terceros). | El máster entregado es **ProRes 422 10-bit 1920×1080, 9m20s, 128 Mbps = 8.4 GB**. Se movió a `media-source/` (ignorado por git) porque en `public/` el build lo habría copiado a `dist/` y Plesk lo habría publicado entero. Queda listo un derivado web **H.264 1080p, 123 MB** en `media-source/five-levels-1080p.mp4` y el póster en `public/images/five-levels-poster.webp`. **Falta decidir el host**: (b) **Mux** — pensado para esto, pero el sitio hoy **rechaza embeds Mux a propósito** (`videoEmbed()` en `cms.ts`) porque su playback va firmado, así que habría que portar el reproductor VOD como se hizo con el live; (c) **Vimeo/YouTube** — funciona **hoy sin código nuevo**: basta una fila en `video-embeds` y `VideoPlayer` (con consentimiento) lo reproduce en `/academy/five-levels` y en A.R.T.; (d) servirlo desde Plesk — descartado: 123 MB sin bitrate adaptativo y pasando por git |
| D16 | **Equipo de Sophia sembrado en el CMS** | ✅ | Hecho 2026-08-29 con `cwsf-beytrax/scripts/seed-dietrich-team.ts`: **8 personas** de `board-members` con foto, transcritas del frame `0:7051` (nombre + credencial + especialidades). Las fotos se subieron a **Azure Blob** vía Payload, no a la repo. Idempotente: re-ejecutar no pisa ediciones del admin. ⚠️ Al correrlo desde local fallan los hooks de auditoría y de rebuild (`ECONNREFUSED` contra el API local); no afectan a los datos, pero **el rebuild del sitio hay que dispararlo a mano** |
| D17 | **Token `--brand-text` para texto pequeño de marca** | ✅ | El teal `#0d858d` de Sophia mide **4.06:1 sobre blanco** — bajo AA por debajo de 24px, mientras que el navy de DK se puede usar en crudo. `--brand-text` resuelve a `--brand` en DK y a `--brand-3` en Sophia, así que ningún componente necesita saber en qué tema está. Mismo patrón que `--gold-text`. También hubo que **invertir el espaciado del hero según el tema**: el gradiente DK necesita el contenido ARRIBA (si baja, cae en la franja clara) y el de Sophia lo necesita ABAJO (aclara en 140px, y a y=28 no pasa ni oscuro ni claro) |
