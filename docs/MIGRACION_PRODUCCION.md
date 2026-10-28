# Migración a producción — `dkk.beytrax.com` → `dietrich-klinghardt.com`

> Runbook de corte. Sustituye a la §2 de `GO_LIVE.md`, que quedó desactualizada
> (la fila `sites` ya se movió al subdominio el 2026-10-10, el CORS ya está
> hecho y los tiles del mapa ya son MapTiler).
>
> Verificado contra producción el **2026-10-27**: DNS, Plesk, la base de datos,
> los dos `.env` del VPS, los certificados y un build de prueba con los valores
> del dominio real.

---

## 0. Qué es realmente esta migración

No es un despliegue nuevo ni un cambio de servidor. Son **tres cambios que
tienen que ocurrir juntos**, porque cada uno por separado deja el sitio a medias:

| # | Cambio | Dónde | Efecto si va solo |
|---|---|---|---|
| 1 | `sites.domain` → `dietrich-klinghardt.com` | base de datos | Login, alta al newsletter y los retornos de Stripe dejan de funcionar en el subdominio **antes** de que el dominio real sirva el sitio |
| 2 | `VITE_PUBLIC_SITE_URL` + `INDEXABLE=true` | `.env.production` del repo | El dominio real serviría el sitio con `noindex` y canónicas apuntando al subdominio: duplicado para Google |
| 3 | Document Root del dominio real → el `dist/` de esta repo | Plesk | El dominio real sigue sirviendo la landing vieja |

**Decisión del cliente (2026-10-27): el repositorio definitivo de
`dietrich-klinghardt.com` es `javierpacher/cwsi-dietrich`.** Eso añade un cuarto
cambio al corte (repuntar el repo de Plesk, paso **P5**) y a cambio deja una
sola cadena de publicación: un repo, un runner, un hook, un dominio. El doble
push a `realorigin` deja de ser necesario; ese repo queda como espejo o se
retira.

**Lo que NO hay que tocar, y es la mejor noticia del análisis:**

- **DNS.** `dietrich-klinghardt.com`, `www` y `dkk.beytrax.com` ya resuelven al
  **mismo IP** (`160.153.183.218`). No hay propagación que esperar, no hay TTL
  que bajar, no hay ventana de DNS. El corte es instantáneo y reversible.
- **Certificados.** El de `dietrich-klinghardt.com` es Let's Encrypt y ya cubre
  apex **y** `www` (vence 2026-12-15).
- **`www`.** nginx ya responde 301 de `www` al apex.
- **CORS.** Las dos listas (`ALLOWED_ORIGINS` del API y `BEYTRAX_PUBLIC_ORIGINS`
  del CMS) ya incluyen `dietrich-klinghardt.com` y `www`. Comprobado por
  cabecera `access-control-allow-origin` real en los dos servicios.
- **Correo.** MX en Titan, SPF, DKIM de Resend y DMARC ya están en el dominio y
  no se tocan: al no cambiar DNS, el correo no corre ningún riesgo. El remitente
  del newsletter ya es `contact@dietrich-klinghardt.com`.
- **Contenido de la base.** Un barrido de **todas** las columnas de texto y JSONB
  del esquema encontró `dkk.beytrax.com` en exactamente **una** fila útil:
  `sites.domain`. (Las otras 3 apariciones son historial en `cms_audit_log`.)
  No hay enlaces absolutos al subdominio metidos en el contenido.

---

## 1. Estado verificado hoy

### 1.1 Los dos dominios

| | `dkk.beytrax.com` | `dietrich-klinghardt.com` |
|---|---|---|
| Sirve | el sitio definitivo, 54 páginas | la landing vieja (build de agosto) |
| Document Root | `.../dkk.beytrax.com/dist` | `.../httpdocs/dist` |
| Repo de Plesk | `javierpacher/cwsi-dietrich` (`origin`) | `racostaInnomius/cwsi-DietrichKlinghardt` (`realorigin`) |
| Commit servido | `7158644` (hoy) | `972ddb9` (2026-08-05) |
| Modo de despliegue | auto | **auto** |
| Post-deploy | `bash scripts/plesk-deploy.sh` | `bash scripts/plesk-deploy.sh` |
| Node.js / Passenger | apagado | apagado |
| `.htaccess` | el bueno (precedencia `.html`, 404 reales) | el viejo: catch-all que devuelve **200 a todo** |
| Último deploy | hoy | 2026-08-06 |

**Los dos repos tienen el mismo contenido.** Comprobado el 2026-10-27:
`realorigin/main` y `origin/main` están en el **mismo commit** (`7158644`,
divergencia `0 0`), porque el procedimiento empuja a los dos. `racostaInnomius`
**no es "la repo de la landing"**: también lleva el sitio nuevo. La landing
antigua sobrevive solo como el commit `972ddb9` y como los archivos que Plesk
dejó en `httpdocs` en agosto, porque **el clon bare del servidor** es lo que
está congelado, no el repositorio de GitHub.

Consecuencia buena: **el corte no reapunta ningún repo**. El dominio real ya
está cableado a un repositorio cuyo `main` es el sitio nuevo; solo falta
desplegarlo. Consecuencia mala, y es la trampa de todo el expediente:

> ⚠️ **El dominio real está en modo `auto` apuntando a `realorigin/main`.** El
> repo bare del servidor sigue anclado en `972ddb9` (agosto) aunque llevamos
> meses empujando a `realorigin`, así que **hoy no hay webhook de GitHub
> activo**: un push no publica nada. El riesgo no es un push, es que alguien
> conecte ese webhook o pulse *Pull & Deploy* en el panel: entonces el dominio
> público serviría el sitio nuevo con el `.env.production` de hoy, es decir
> `robots.txt` en `Disallow: /` y canónicas a `dkk.beytrax.com`.
>
> Pasarlo a `manual` cuesta un comando y quita esa posibilidad de encima.

### 1.2 La fila `sites` manda más de lo que parece

`sites.domain` = `dkk.beytrax.com` hoy. El API la usa para construir, siempre en
servidor y nunca desde el navegador:

- `success_url` / `cancel_url` del carrito, de las membresías y del portal de
  suscripción (`checkoutSession`, `membershipCheckout`, `membershipPortal`, `fxCheckout`)
- el redirect del doble opt-in del newsletter: `https://{domain}/newsletter/confirmed` y `/newsletter/error`
- los enlaces de acceso a vídeo y a directos de Mux
- el `post_logout_redirect_uri` del logout OIDC
- la resolución del login: `auth.controller` exige que el host del retorno sea
  **exactamente igual** a `sites.domain` y la fila esté `active`, o el usuario
  acaba en el portal en vez de volver al sitio
- la base de los QR (`<qrDomain || domain>/q/<slug>`), que se **congela al crear
  el código**

Consecuencia operativa: **hay correos vivos** con enlaces a
`dkk.beytrax.com/newsletter/confirmed`. Por eso el subdominio no se apaga: se
convierte en un 301 permanente.

### 1.3 Lo que el build de corte produce

Build de prueba ejecutado hoy en local con `SITE_URL=https://dietrich-klinghardt.com`
e `INDEXABLE=true`. Resultado: **build verde**, 54 páginas, `robots.txt` con
`Allow: /` y el sitemap declarado, `sitemap.xml` con **28 URLs**, canónicas
correctas (`https://dietrich-klinghardt.com/academy`, etc.).

Las otras 26 páginas salen `noindex` **a propósito**: cuenta, carrito, retornos
de pago, autenticación, legales, archivos y los 5 métodos (ver 2.2).

---

## 2. Bloqueos y decisiones antes del corte

Ninguno impide técnicamente el corte. Todos cambian lo que el visitante ve el
primer día, así que son go/no-go de negocio, no de ingeniería.

### 2.1 Legales vacíos — **decidido: se publica igual**

`legal_pages` tiene **cero filas** para este tenant, así que `/privacy` y
`/terms` dicen que la política no está publicada. Ambas son `noindex`.

**Decisión del cliente (2026-10-27): se deja en blanco y se publica el
directorio.** Queda constancia de lo que se planteó al decidirlo: el sitio sale
indexable con los datos de contacto de **136 terceros** europeos y sin aviso de
privacidad, y **A10 sigue abierto** — la base legal para mover esos datos desde
la GmbH alemana a un sitio de EE. UU. nunca se documentó. Consintieron aparecer
en ink.ag, no necesariamente aquí.

Cuando lleguen los textos de Ana es cargar filas en `legal-pages`, sin código ni
redespliegue.

### 2.2 Los 5 métodos siguen ocultos — **decidido: se respeta**

Las 5 filas de `training-paths` (`art`, `ank`, `srt`, `pk`, `mft`) están en
estado **`hidden`** desde que Ana las ocultó el 2026-10-26. `/courses` es un
teaser y `/courses/<slug>` responde "Coming Soon" con `noindex`.

**Decisión del cliente (2026-10-27): se mantiene tal cual lo dejó Ana.** No se
toca nada en el CMS al cortar. Publicarlas después es un cambio de estado más un
rebuild, sin código.

### 2.3 Cobros: solo **dos** eventos reales necesitan Payment Link

Reauditado con el cliente el 2026-10-28. Del catálogo del tenant, **los 16
productos son ficticios** (enlaces de sandbox, sin valor) y el cliente confirma
que da igual que pierdan el botón. Los eventos, en cambio, **son reales**.

De los 4 eventos publicados, solo 2 se ven afectados por el corte:

| Evento | Vía | Tras el corte |
|---|---|---|
| Free Weekly Talks, 30 oct | `registration_type: open`, sin enlace Stripe | sobrevive |
| Bad Krozingen, 1–8 nov | `learnMoreUrl` → klinghardt-akademie.de, rango 250–820 USD | sobrevive |
| 5 Levels NYC · 2-Day Pass, 28–29 ene 2027 | `checkoutUrl` **sandbox** | **pierde el botón** |
| 5 Levels NYC · Jan 29th Pass, 29 ene 2027 | `checkoutUrl` **sandbox** | **pierde el botón** |

La razón está en una línea de `EventDetailPage.tsx`:
`registrationUrl = registrationType === "paid" ? checkoutUrl : learnMoreUrl`.
El guard de `checkout.ts` solo mira `checkoutUrl`, así que un evento que se
vende fuera (Bad Krozingen) o que es gratuito nunca pasa por él.

**Petición concreta al cliente (A9), ya acotada a dos enlaces:**

| Evento | Importe que debe cobrar |
|---|---|
| 5 Levels NYC · 2-Day Pass | **1,600 USD** |
| 5 Levels NYC · Jan 29th Pass | **950 USD** |

⚠️ El precio y el Payment Link son campos **independientes y nadie comprueba que
coincidan** (A13). Quien pegue el link debe poner precio y link en la misma
sesión, o la página anunciará una cifra y Stripe cobrará otra.

En cuanto una fila tenga un enlace live el botón reaparece solo, sin
redespliegue: el guard deja pasar cualquier `buy.stripe.com` que no lleve
`/test_`.

### 2.4 Safecertus — ✅ **resuelto 2026-10-27**

Safecertus es nuestro (`workspace/safecertus`), así que no hubo que pedirlo a
nadie. El cliente OIDC es el servicio **#14 `com.safecertus.beytrax`** en
`CWSBsafecertus`; su `post_logout_redirect_uris` pasó de

```
["https://beytrax.com","https://sistworldfoundation.org/","https://dkk.beytrax.com/"]
```
a esa misma lista **más** `https://dietrich-klinghardt.com/`.

Tres detalles que conviene no olvidar:

- **La barra final es significativa.** El API arma `https://<site.domain>/` y
  `redirect.utils.js` compara por igualdad exacta, sin normalizar barras.
- **El `redirect_uri` de login no cambia**: es
  `https://api.beytrax.com/auth/callback`, el del API, no el del sitio. Solo el
  logout depende del dominio.
- **Se conservó `https://dkk.beytrax.com/`** a propósito: durante la transición
  el subdominio sigue vivo como 301 y no queremos romper sesiones en curso.

No se puede probar antes del corte: la URI solo se envía cuando `sites.domain`
ya es el dominio nuevo. La comprobación vive en la checklist de la §5.

### 2.5 🟢 Cerrados desde que se escribió `GO_LIVE.md`

- Fuentes KALICE con licencia (A1) — entregadas e instaladas.
- Tiles del mapa (B8) — ya se sirve el estilo MapTiler del cliente; OSM quedó solo como fallback.
- CORS en los dos servicios (B18) — incluye el dominio real y `www`.
- Passenger apagado y `.htaccess` correcto — **en el subdominio**. El dominio real todavía tiene el `.htaccess` viejo; se resuelve solo al desplegar, porque el bueno viaja en `public/.htaccess`.

---

### 2.6 Mux: lista blanca de dominios — ✅ **resuelto 2026-10-28**

La *playback restriction* que el API aplica a toda reproducción firmada
(`MUX_PLAYBACK_RESTRICTION_ID=7rpIjlMWKQTf02DwqizmU02lwqvOjXtvwtDx6KKiWe3YA`)
filtra por `Referer`. Antes del 28 de octubre contenía solo:

```json
"allowed_domains": ["beytrax.com", "*.beytrax.com"]
```

Es decir que, al cambiar de dominio, **Mux habría rechazado todo**: los weekly
talks en directo, los replays y el archivo. No es un fallo visible en consola de
forma obvia, así que se habría diagnosticado tarde.

Corregido con un `PUT /video/v1/playback-restrictions/<id>/referrer`:

```json
"allowed_domains": ["beytrax.com", "*.beytrax.com",
                    "dietrich-klinghardt.com", "*.dietrich-klinghardt.com"]
```

`allow_no_referrer` se mantuvo en `false`, igual que estaba.

Dos cosas que conviene no olvidar:

- Esa restricción **la comparten todos los tenants** de la plataforma, porque
  sale de una sola variable de entorno del API. Por eso los dominios de beytrax
  se conservan; quitarlos rompería a los demás sitios.
- El cambio es aditivo y ya está aplicado, así que **no hay nada que hacer
  durante la ventana de corte**. Funciona igual antes y después.

#### Lo otro de Mux: `events.live_test_mode`

El modo prueba de Mux **no es de la cuenta, es una bandera por evento**. La
cuenta es real: hay assets de 13 minutos, y un asset *test* de Mux se corta a
10 segundos. Pero el weekly talk publicado del **30 de octubre de 2026** tiene
`live_test_mode = true`, y su recurso Mux lo refleja:

```
live_stream_id aKnET00VIevedv5tcj00   test=true   max_continuous_seconds=300
```

Con esa bandera encendida, el API hace tres cosas distintas:

- `resolveMuxLiveMaxContinuousSeconds` recorta la emisión a
  `MUX_TEST_LIVE_MAX_SECONDS`, **5 minutos**, y Mux le pone su marca de agua.
- No reserva almacenamiento de replay (`admin/muxLive.controller.ts`), así que
  **la charla no deja grabación**.
- Se salta el límite de sesiones por IP y no descuenta minutos de entrega del
  plan, porque un stream de prueba es gratis.

Es decir que un evento real emitido así se corta a los 5 minutos y no deja
replay. **Hay que apagar `live_test_mode` en los eventos reales antes de
emitirlos**, desde el administrador, y es independiente del cambio de dominio.
Ojo también con `max_continuous_seconds = 300`: al apagar la bandera conviene
subirlo a la duración real de la charla.

---

### 2.7 Stripe: el carrito **ya está abierto**, no cerrado

`GO_LIVE.md` daba el carrito por cerrado. Hoy no lo está, y eso cambia lo que se
le dice al cliente. Las dos puertas de `checkoutSession.controller.ts`
(`sites.cart_checkout_enabled` y la clave del tenant) están abiertas:

| Pieza | Estado |
| --- | --- |
| `sites.cart_checkout_enabled` | `true` |
| `tenant_payment_config.stripe_secret_key_encrypted` | presente (cifrada) |
| `tenant_payment_config.email_from` | `contact@dietrich-klinghardt.com` |
| Planes de membresía publicados | 2 — Mensual 25 USD, Anual 279 USD |
| Suscripciones en `site_memberships` | 4 filas, al menos 3 `active` con `sub_…` reales del 2026-10-02 |
| Connect de la Fundación | `acct_1UG6oEKdAZEkvAqH`, `charges_enabled: false` → donaciones cerradas (A7) |
| Webhooks | apuntan a `api.beytrax.com`, no cambian con el dominio |

**🔴 Verificado 2026-10-28: la clave del tenant es `sk_test`.** Se descifró el
prefijo con `pgp_sym_decrypt` y la `NEWSLETTER_ENCRYPTION_KEY` (que es la que
usa `getStripeSecretKey`). Consecuencias:

- El carrito y el paywall **aparentan cobrar y no cobran**. Las 3 suscripciones
  "activas" son de prueba, igual que sus `cus_…` y `sub_…`.
- Los dos `stripe_price_id` de `membership_plans` son precios de **test mode**,
  así que **no existen en live**. Las membresías mensual y anual no se arreglan
  cambiando la clave: hay que **recrear los dos precios en modo real** y escribir
  los nuevos `price_…` en `membership_plans`.
- El `whsec_…` del tenant también es el del endpoint de prueba.

Tarea, entonces, y no es de cinco minutos:

1. En el Stripe del cliente, en **modo real**: crear el producto de membresía con
   sus dos precios (25 USD/mes y 279 USD/año), generar una clave restringida
   `sk_live_…` y registrar el endpoint de webhook contra `api.beytrax.com`.
2. Guardar la clave y el `whsec` por el panel de administración (se cifran al
   guardar; nunca por SQL directo).
3. Actualizar `stripe_price_id` en los dos planes.
4. Decidir qué se hace con las suscripciones de prueba: no migran. Si alguna
   corresponde a una persona real, hay que volver a suscribirla en real.

Hasta que eso pase, **el paywall no debe anunciarse como funcionando**.

**Pendiente del cliente:** MapTiler puede tener restricción por dominio en su
panel. Si la tiene y solo lista el subdominio, el mapa del directorio sale en
blanco tras el corte.

---

## 3. Preparación (se puede hacer hoy, no cambia nada público)

**P1. Desarmar la trampa del despliegue automático.** ✅ **Hecho 2026-10-27.**
Verificado después: modo `manual`, el UUID del webhook intacto y la acción
post-deploy `bash scripts/plesk-deploy.sh` sobrevivió al `--update`.
```bash
ssh cwsadmin@160.153.178.66
sudo plesk ext git --update -domain dietrich-klinghardt.com \
  -name cwsi-DietrichKlinghardt.git -deployment-mode manual
sudo plesk ext git --info -domain dietrich-klinghardt.com -name cwsi-DietrichKlinghardt.git
```

**P2. La landing vieja no necesita respaldo: está en git.**
Verificado el 2026-10-27. El repo bare del dominio (`git/cwsi-DietrichKlinghardt.git`)
está anclado en **`972ddb9`** (*fix(site): pin approved Dietrich portrait*,
2026-08-05), que es **ancestro de `realorigin/main` y de `origin/main`**, y
`git status` del árbol desplegado contra ese commit sale **limpio**: ni un
archivo modificado a mano en el servidor. Lo único no versionado en `httpdocs`
es `dist/` y `node_modules/`, y `npm run build` regenera el primero.

Recuperar la landing, si alguna vez hace falta:
```bash
git checkout 972ddb9        # o: git worktree add ../landing-vieja 972ddb9
```
No hace falta `cp -a` a `/root`. (Esta nota corrige una versión anterior de este
documento, que pedía respaldarla por creer que no estaba versionada.)

**P3. Decidir los go/no-go de la §2** con el cliente: legales, métodos ocultos,
botones de compra, Safecertus.

**P4. Registrar el `post_logout_redirect_uri` en Safecertus.** ✅ **Hecho
2026-10-27**, ver §2.4. Resultó ser trabajo nuestro, no de un tercero.

**P5. Entrada de repo propia para el dominio real.** ✅ **Hecha 2026-10-27.**

No se pudo repuntar la entrada existente: **Plesk no deja cambiar la URL del
remoto**. La interfaz lo dice, y la CLI es peor — `--update -remote-url`
responde *"The repository was updated"* y **deja la URL igual**. Verificar con
`--info`, nunca creer al mensaje de éxito.

Así que se creó una **segunda entrada**, en vez de borrar y recrear la vieja:

| | |
|---|---|
| Nombre | `cwsi-dietrich.git` |
| Remoto | `git@github.com:javierpacher/cwsi-dietrich.git`, rama `main` |
| Ruta de despliegue | `/dkk` (**no** `httpdocs`) |
| Modo | `manual` |
| Deploy key | `Dietrich`, uuid `15ae763f-2642-ee4e-b877-e61ade620471` |
| Acción post-deploy | `bash scripts/plesk-deploy.sh` |
| **Webhook UUID** | **`895cd56c-33ee-b349-db90-46cb6576cfb0`** ← el valor de la §7 |

La clave la dio de alta Javier en su repo como `plesk dietrich-klinghardt.com`,
solo lectura. Huella `SHA256:s0Wke8rlLJ5l9+OyQNKcE34l6gRCs3pjbkGQZwt17LM`.
Comprobada contra GitHub: responde `Hi javierpacher/cwsi-dietrich!`.

> La clave hace falta **aunque despleguemos en manual**: el modo decide *cuándo*
> despliega, no cómo baja el código, y ese repo es privado. Sin clave,
> *Repository not found*.
>
> Ojo con la confusión que ya tuvimos: el repo de Javier **ya tenía** una deploy
> key (`dietrich-plesk`), pero es de la suscripción de **beytrax.com**, la del
> preview. Cada suscripción guarda sus privadas en su propio vhost, así que
> `dietrich-klinghardt.com` no puede usarla. Una clave por repo es, además, la
> convención que esa suscripción ya seguía (tiene cinco).

⚠️ **Plesk no crea la ruta de despliegue.** Guarda `/dkk` sin chistar y el
deploy revienta con `fatal: this operation must be run in a work tree`, que no
menciona la carpeta. Hay que crearla a mano, igual que `httpdocs`:
```bash
install -d -o admin_dietrich-klinghardt -g psaserv -m 750 \
  /var/www/vhosts/dietrich-klinghardt.com/dkk
```

**Ensayo de build hecho el 2026-10-27 y verde:** `plesk ext git --deploy` sobre
esa entrada hizo `npm ci` + `npm run build` y dejó **54 páginas** en
`/dkk/dist`, con `robots.txt` en `Disallow` (correcto: el `.env.production` del
repo sigue en modo preview). Con eso queda descartado el riesgo mayor de la
ventana de corte, que el build fallara en **esta** suscripción, que tiene su
propio Node y no es donde corre el preview.

La entrada vieja (`cwsi-DietrichKlinghardt.git` → `racostaInnomius`, sirviendo
`httpdocs`) **se queda en su sitio, en modo manual**, como camino de rollback.
Se retira cuando el corte esté asentado.

## 4. La ventana de corte

Gracias a **P5** el corte ya **no tiene ningún paso destructivo**: el sitio
nuevo se construye en `/dkk` sin tocar lo que el público ve, y publicar es
mover el Document Root. El orden sigue importando, porque entre el paso 2 y el
5 el subdominio queda roto para login y newsletter.

**1 · Cambiar el entorno del build** (`.env.production` de esta repo):
```diff
-VITE_PUBLIC_SITE_URL=https://dkk.beytrax.com
+VITE_PUBLIC_SITE_URL=https://dietrich-klinghardt.com
-VITE_PUBLIC_CMS_SITE_DOMAIN=dietrich-klinghardt.com
+VITE_PUBLIC_CMS_SITE_DOMAIN=
-VITE_PUBLIC_INDEXABLE=false
+VITE_PUBLIC_INDEXABLE=true
```
`CMS_SITE_DOMAIN` se vacía: existía solo para que `site-context` resolviera por
un dominio distinto del servido, y ahora coinciden. Por eso el paso 2 no es
negociable: con la fila en `dkk` y el build pidiendo `dietrich-klinghardt.com`,
`site-context` responde *"No site registered for host"* — comprobado.

En el mismo commit, quitar la excepción de staging de `src/lib/checkout.ts`.

**2 · Mover la fila `sites`** (único `UPDATE` de toda la migración), desde el
CMS y no por SQL, para que quede en `cms_audit_log` y corran los hooks:
Sites → el sitio → Dominio = `dietrich-klinghardt.com`. Aprovechar la misma
pantalla para poner `qrDomain` igual.

**3 · Publicar el código:**
```bash
git push origin main       # repo definitivo del dominio real
git push realorigin main   # opcional: el espejo, mientras exista
```

**4 · Construir en `/dkk`**, que todavía no sirve a nadie:
```bash
sudo bash -c 'umask 022; plesk ext git --deploy \
  -domain dietrich-klinghardt.com -name cwsi-dietrich.git'
```
`umask 022` no es opcional: por SSH se hereda `027` y el sitio responde 403.

El post-deploy imprime cuál de los dos builds salió. **Tiene que decir:**
```
● PUBLIC build: pages are indexable and sitemap.xml is published.
```
Si dice `⚠ PREVIEW build`, el entorno no se aplicó: **parar aquí**. Y lo bueno
del diseño nuevo es que parar aquí no cuesta nada, porque el público sigue
viendo la landing.

Verificar en disco antes de publicar:
```bash
sudo grep -c '<loc>' /var/www/vhosts/dietrich-klinghardt.com/dkk/dist/sitemap.xml  # 28
sudo cat /var/www/vhosts/dietrich-klinghardt.com/dkk/dist/robots.txt               # Allow: /
```

**5 · Publicar: cambiar el Document Root** de `/httpdocs/dist` a `/dkk/dist`
(Plesk → Hosting Settings). Instantáneo, y es el único momento en que cambia lo
que ve el público.

**6 · Convertir el subdominio en 301.** Se evaluó dejarlo como ambiente de
pruebas y **el cliente decidió que no (2026-10-28)**: con una sola fila `sites`,
en dkk seguiría viéndose bien el contenido pero login, alta al newsletter,
checkout y Mux se romperían o escribirían en producción, que es peor que no
tenerlo. Si algún día se retoma, lo que habría que revisar es la excepción de
`checkout.ts` (dejaría de sobrar), dos juegos de variables de build y a quién
republica el rebuild del CMS.
 `dkk.beytrax.com` pasa a reenvío
permanente a `https://dietrich-klinghardt.com`. No se borra **nunca**: hay
correos de confirmación de newsletter ya enviados y los QR congelan el host al
crearse.

## 5. Verificación posterior

```bash
# El dominio real sirve el sitio nuevo, indexable
curl -s https://dietrich-klinghardt.com/robots.txt            # Allow: / + Sitemap:
curl -s https://dietrich-klinghardt.com/sitemap.xml | grep -c '<loc>'   # 28
curl -s https://dietrich-klinghardt.com/academy | grep canonical        # dominio real
curl -so /dev/null -w '%{http_code}\n' https://dietrich-klinghardt.com/no-existe.xml   # 404, no 200

# El subdominio redirige
curl -sI https://dkk.beytrax.com/ | head -1                   # 301
curl -sI https://dkk.beytrax.com/newsletter/confirmed | grep -i location

# El API reconoce el dominio nuevo
curl -s 'https://api.beytrax.com/api/public/site-context?domain=dietrich-klinghardt.com'
```

Y a mano, porque ninguna de estas se puede comprobar con `curl`:

- [ ] Las 54 páginas responden 200 (`/courses`, `/academy`, `/foundation` y
      `/sophia` son a la vez página y directorio: son las que delatan un
      `.htaccess` mal aplicado)
- [ ] `/academy/therapists`: 136 terapeutas y el mapa con pines
- [ ] Alta al newsletter de punta a punta, incluido el clic del correo de
      confirmación, que ahora debe aterrizar en el dominio real
- [ ] Login y **logout** de un miembro (aquí se ve si Safecertus admitió el URI)
- [ ] Un directo o un replay de Mux
- [ ] Consola del navegador sin errores de CORS
- [ ] Lighthouse y QA cross-browser (B17), que hasta ahora no se podían hacer

---

## 6. Rollback

Barato, porque no se tocó DNS y porque la landing sigue intacta en `httpdocs`:

1. **Document Root de vuelta** a `/httpdocs/dist`. Con eso el público vuelve a
   ver la landing en segundos; es el paso que de verdad revierte la publicación.
2. Volver `sites.domain` a `dkk.beytrax.com` desde el CMS.
3. Quitar el 301 del subdominio y redesplegarlo con el `.env.production`
   anterior.

Lo único sin vuelta atrás limpia es la indexación: en cuanto Google vea el
dominio real como indexable, revertir deja URLs indexadas que ya no existen. Por
eso `INDEXABLE=true` va en el corte y no antes.

## 7. Después del corte

- **Rebuild del CMS apuntado al dominio nuevo.** Con **P5** hecho esto se
  vuelve casi trivial: `sites.rebuild_repo` ya es `javierpacher/cwsi-dietrich`,
  su workflow ya corre en el runner self-hosted del VPS, y el dominio real ya
  tira de ese mismo repo. Lo único que sobra es a qué hook golpea el workflow:
  hoy el secret `PLESK_GIT_HOOK_UUID` lleva el UUID del **subdominio**, así que
  una edición de contenido republicaría el 301 en vez del sitio.

  **Cambiar ese secret** a **`895cd56c-33ee-b349-db90-46cb6576cfb0`**, que es
  el hook de la entrada `cwsi-dietrich.git` creada en P5. **No** el
  `f36d866c-…`, que es el de la entrada vieja y seguirá desplegando `httpdocs`. Nota de permisos: podemos *leer* el
  nombre del secret, pero escribirlo exige `admin` sobre el repo,
  que no tenemos → **lo aplica el cliente** (2026-10-27), que sí tiene acceso.
  No hace falta pedírselo a Javier.

  Con el repo en modo `manual`, confirmar que el webhook igualmente despliega;
  si Plesk lo ignora, dejarlo en `auto` **después** del corte, que a partir de
  ese momento ya es lo deseable.
- **Search Console**: dar de alta el dominio, enviar el sitemap y vigilar el
  informe de cobertura las primeras dos semanas.
- **Cerrar lo que quedó abierto**: Payment Links live (A9), la política de
  privacidad, y decidir si se publican los 5 métodos.
- **Limpiar `GO_LIVE.md`**, cuya §2 queda sustituida por este documento.

---

## 8. Resumen de riesgos, por orden de daño

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Se publica el sitio con `noindex` por accidente | baja: no hay webhook activo, pero basta con que alguien lo ponga o pulse *Pull* en Plesk | **P1**, barato |
| Se corta sin política de privacidad con 136 datos personales publicados | decisión, no azar | §2.1 |
| El build de corte sale en modo preview y Google indexa el `Disallow` | baja | el deploy lo imprime; abortar si dice PREVIEW |
| El `--fetch` del repo nuevo falla por permisos el día del corte | media | **P5** probado con `--fetch` días antes, con Javier despierto |
| Se pone en el secret de §7 un UUID que ya no existe | media si P5 va por el camino (2) | releer el UUID con `--info` después de recrear |
| El cliente descubre que no hay botones de compra | alta | avisarlo antes (§2.3) |
| Enlaces de correos ya enviados se rompen | alta si se borra el subdominio | 301 permanente, nunca borrar |
