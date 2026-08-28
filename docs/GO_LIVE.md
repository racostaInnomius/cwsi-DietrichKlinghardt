# Go-live — sitio Dietrich Klinghardt™

> Dos publicaciones distintas, en este orden:
>
> 1. **Preview** en `dkk.beytrax.com` — el sitio definitivo, visible para
>    revisión, **fuera de buscadores**. Es lo que se puede hacer hoy.
> 2. **Público** en `dietrich-klinghardt.com` — cuando el cliente decida
>    reemplazar la landing. Hoy ese dominio sirve la landing temporal, que vive
>    en **otra repo**.
>
> Los pendientes completos están en `PENDIENTES.md`. Este documento es solo la
> secuencia de publicación.

---

## 1. Preview en `dkk.beytrax.com`

### 1.1 Plesk (subdominio ya creado en el VPS)

- **Document Root** → el `dist/` de esta repo.
- **Git**: repo `cwsi-dietrich`, rama `main`.
- **Additional deployment actions**: `bash scripts/plesk-deploy.sh`
- ✅ Certificado TLS y secret `PLESK_GIT_HOOK_UUID` — ya hechos.

**Publicar el sitio (sin depender de automatización):** basta con la acción de
deploy de arriba + un **Pull/Deploy manual** en Plesk. No hace falta configurar
variables de entorno en la suscripción: `.env.production` está commiteado con
los valores de preview correctos.

**Automatizar los rebuilds:**
1. ✅ **Runner self-hosted** — `plesk-runner-dkk`, en el VPS
   (`/home/cwsadmin/actions-runner-dkk`, servicio systemd bajo `cwsadmin`).
   El workflow pide `runs-on: [self-hosted, plesk]`; el panel de Plesk no es
   accesible desde fuera, así que un runner alojado por GitHub no sirve.
   Verificado: un push a `main` publica solo.
2. ⛔ Un **token de rebuild acotado a esta repo** (ver B21): repuntar
   `rebuild_repo` no basta, el PAT guardado sólo alcanza la repo de la landing.
   Hasta que exista, los pushes republican pero los cambios de contenido del CMS
   no disparan nada.

### 1.2 Variables de entorno de la suscripción

Se hornean en el build, así que cambiarlas exige **redesplegar**, no reiniciar.

| Variable | Valor en preview |
|---|---|
| `VITE_PUBLIC_SITE_URL` | `https://dkk.beytrax.com` |
| `VITE_PUBLIC_CMS_SITE_DOMAIN` | `dietrich-klinghardt.com` |
| `VITE_PUBLIC_INDEXABLE` | `false` |
| `VITE_PUBLIC_API_URL` | `https://api.beytrax.com` |
| `VITE_PUBLIC_CMS_URL` | `https://portal.beytrax.com` |
| `VITE_PUBLIC_TENANT_ID` / `VITE_PUBLIC_SITE_ID` | los del `.env.production` |
| `VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY` | clave de la **plataforma** (pendiente B4) |

> `CMS_SITE_DOMAIN` va separado a propósito: el CMS conoce este sitio por
> `dietrich-klinghardt.com` (así está la fila `sites`), pero el build se sirve
> desde otro host. `site-context` resuelve por el primero.

### 1.3 CORS en el API

Añadir `https://dkk.beytrax.com` a `ALLOWED_ORIGINS` de `CWSB-Baytrax` y
redesplegar. **Sin esto** el sitio se ve, pero fallan en silencio: la
revalidación del CMS en runtime, el alta al newsletter, el formulario de
contacto y la resolución de donaciones. Mantener también el dominio de la
landing en la lista.

### 1.4 Reinicio del CMS

`docker compose pull && docker compose up -d` en el servidor. Hasta entonces
`portal.beytrax.com` responde **404** en `/api/training-paths` y
`/api/practitioners`, así que Courses y el Directorio se ven vacíos aunque el
contenido ya esté cargado en la base. *(Pendiente B1.)*

### 1.5 Verificación después del primer deploy

- [ ] `https://dkk.beytrax.com/robots.txt` dice `Disallow: /`
- [ ] Cualquier página trae `<meta name="robots" content="noindex">`
- [ ] **No** existe `/sitemap.xml` (correcto en preview). Hoy responde **500**,
      no 404, por el hosting Node.js que Plesk tiene activo en el dominio —
      ver B23; afecta a cualquier archivo ausente y no es exclusivo de este sitio
- [ ] `/academy/therapists` muestra 136 terapeutas y el mapa con pines
- [ ] `/courses` muestra los 5 métodos; `/courses/art` la ruta de 9 pasos
- [ ] El alta al newsletter responde y llega el correo de confirmación
- [ ] `/newsletter/confirmed` y `/newsletter/error` siguen funcionando —
      hay correos vivos apuntando ahí
- [ ] La consola no muestra errores de CORS

---

## 2. Público en `dietrich-klinghardt.com`

**No hacer hasta que el cliente decida retirar la landing.**

1. Apuntar el Document Root del dominio a esta repo (la landing sale de escena).
2. Cambiar en el entorno:
   - `VITE_PUBLIC_SITE_URL` → `https://dietrich-klinghardt.com`
   - `VITE_PUBLIC_INDEXABLE` → `true`
   - `VITE_PUBLIC_CMS_SITE_DOMAIN` → se puede vaciar (ya coinciden)
3. Redesplegar y comprobar que `robots.txt` ahora dice `Allow: /` y que
   `/sitemap.xml` existe con 28 URLs.
4. Decidir qué pasa con `dkk.beytrax.com`: lo más limpio es **redirigir 301** al
   dominio real, para no dejar dos copias del mismo sitio en pie.
5. Enviar el sitemap en Search Console.

### Antes de este paso, obligatorio

- [ ] **Fuentes KALICE con licencia web** (A1) — hoy se sirve el fallback y la
      licencia del Figma es de prueba.
- [ ] Proveedor de tiles del mapa (B8) — OpenStreetMap pide no apoyarse en sus
      tiles en producción.
- [ ] Base legal de los datos de los 136 terapeutas (A10).
- [ ] Contenido del cliente cargado (A2–A6) y las filas de sección del CMS (B13).
- [ ] Lighthouse y QA cross-browser contra el sitio ya desplegado (B17).

---

## 3. Cobros — ninguno está activo

Los tres flujos de dinero están construidos y **cerrados a propósito**. Cada uno
degrada solo, así que se pueden abrir por separado y en cualquier orden.

| Flujo | Qué falta | Estado hoy |
|---|---|---|
| **Eventos y cursos** | Payment Links **live** en el CMS (A9) | Sin liga no hay botón; la página dice que el registro no está abierto |
| **Donaciones** | Cuenta Connect de la Fundación (A7) + clave publicable de la plataforma (B4) | "Donations open soon" |
| **Carrito** | Fulfillment por línea (B5) + correo de físicos (B6) + restricted key (A8) + desplegar el API (B2), y **al final** quitar el guard (B7) | El endpoint responde 409 antes de leer siquiera la clave del tenant |

⚠️ **El flujo de donaciones nunca ha estado en producción** — con SistWorld solo
se probó en sandbox. Dietrich sería el primero, así que antes de anunciarlo hace
falta un cobro real de prueba y verificar que sale el correo de recibo (B9).

⚠️ **El carrito redirige a `sites.domain`**: las `success_url`/`cancel_url` de
Stripe se arman en el servidor con el dominio de la fila `sites`, así que
mientras el sitio viva en el subdominio un checkout devolvería al comprador a
`dietrich-klinghardt.com`, que sirve la landing. Se resuelve solo al pasar al
dominio real; si se quisiera abrir el carrito antes, hay que contemplarlo.
