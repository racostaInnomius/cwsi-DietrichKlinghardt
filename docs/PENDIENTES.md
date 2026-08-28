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
| A1 | **Archivos KALICE** (`.woff2` regular + bold) **y confirmación de licencia web** | Diseñadora / cliente | F1 | ⚠️ El Figma usa `Kalice-Trial`, cuya licencia **no cubre web**. Hoy el sitio cae al fallback Cormorant. Es un riesgo legal, no solo estético. `public/fonts/README.md` documenta dónde van |
| A2 | **Copy de New Patients** | Vic | F2 | La página existe con el formulario, pero la columna de contenido está vacía (colapsa sola) |
| A3 | **Retrato de Dr. Klinghardt** para About | Vic | F2 | La bio se ve a una columna en vez de dos |
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

---

## B. Nos toca — trabajo y decisiones nuestras

### B.1 Operación / despliegue

| # | Qué | Fase | Estado |
|---|---|---|---|
| B1 | **Subir el CMS de imagen** (`docker compose pull && up -d`) | F3, F4 | ⛔ Pendiente, **sin migraciones de por medio**. El VPS corre `cwsf-beytrax:1.1.116` y lo último publicado es `1.1.123` (7 versiones atrás). Las 3 migraciones del hueco ya están en la BD: `20260828_030618_add_training_paths` (batch 31), `20260828_040824_add_practitioners` (32), `20260828_133002_add_store_product_fields` (33) → la base va **por delante** del contenedor, que es el orden correcto. Hasta el bump, `portal.beytrax.com/api/training-paths` y `/api/practitioners` dan 404 |
| B2 | **Subir el API de imagen** | F6 | ⛔ Pendiente, **sin migraciones de por medio**. El VPS corre `cwsb-beytrax:1.1.133` y lo último publicado es `1.1.136` (que es el release de F6, no trabajo ajeno). La única migración del hueco, `040_tenant_stripe_secret_key`, ya está aplicada (`tenant_payment_config.stripe_secret_key_encrypted` existe en prod). Este bump es además el que activa B18. Hasta entonces `POST /api/public/checkout-session` da 404 |
| B3 | **Registrar un runner self-hosted para `cwsi-dietrich`** | F9 | ✅ **Hecho** (ver B22). Contexto original: el workflow pide `runs-on: [self-hosted, plesk]` El workflow pide `runs-on: [self-hosted, plesk]` y la repo tiene **0 runners**, así que cada push se encola y acaba `cancelled` — por eso `dkk.beytrax.com` sigue mostrando la página por defecto de Plesk. Renace, Bistro e Iconic tienen **cada una el suyo**; la cuenta es de usuario, no organización, así que no hay pool que heredar. El panel de Plesk (`:8443`) no es accesible desde fuera, así que no sirve un runner de GitHub. ✅ Ya hechos: Document Root `dkk.beytrax.com/dist`, TLS Let's Encrypt, secret `PLESK_GIT_HOOK_UUID` |
| B20 | **Activar "Additional deployment actions" en Plesk** con `bash scripts/plesk-deploy.sh` | F9 | ✅ **Hecho por Javier.** Era lo que faltaba para la publicación simple, independiente del runner |
| B22 | **Registrar el runner en el VPS** | F9 | ✅ **Hecho** (2026-08-28). `plesk-runner-dkk` en `/home/cwsadmin/actions-runner-dkk`, servicio `actions.runner.javierpacher-cwsi-dietrich.plesk-runner-dkk`, etiquetas `self-hosted, Linux, X64, plesk`. Verificado de punta a punta: un push a `main` dispara el webhook de Plesk, Plesk hace pull + `plesk-deploy.sh`, y el cambio queda publicado |
| B23 | **Apagar el hosting Node.js en Plesk para los dominios estáticos** | F9 | ⛔ Pendiente y **no es solo de este sitio**. `dkk.beytrax.com` tiene `PassengerEnabled on` / `PassengerAppType node` / `PassengerStartupFile app.js` sin que exista `app.js`: mod_passenger reclama toda petición que no resuelva a un archivo — antes que los rewrites del `.htaccess` — y responde **HTTP 500** en lugar de 404. Se ve en `/sitemap.xml` y en cualquier asset ausente. **`sistworldfoundation.org`, que ya es público, se comporta igual hoy**; `iconicbytanny.com` lo tapa con un rewrite catch-all que devuelve 200 (soft-404). El arreglo es desactivar Node.js en el dominio; la regla del `.htaccess` que produce el 404 ya está puesta y empieza a funcionar sola en cuanto se apague |
| B21 | **Token de rebuild acotado a esta repo** | F9 | ✅ **Resuelto** (2026-08-28). El token guardado en `sites.rebuild_token_encrypted` **sí** alcanza `javierpacher/cwsi-dietrich`: se comprobó un `repository_dispatch` real llegado a la repo (run `33190863017`, 16:37), que entonces quedó `cancelled` sólo porque aún no había runner. Cadena completa verificada después: dispatch → runner → webhook de Plesk → publicado (run `33194101828`, verde) |
| B18 | **Añadir `dkk.beytrax.com` a `ALLOWED_ORIGINS`** del API | F9 | ✅ **Escrito** en `/var/www/vhosts/beytrax.com/api.beytrax.com/.env` (respaldo `.env.bak-20260828-dkk`). ⏳ **Toma efecto al recrear el contenedor**, que va junto con el bump de imagen del API — hasta entonces el sitio se ve pero fallan en silencio la revalidación del CMS, el newsletter, el formulario de contacto y las donaciones |
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
