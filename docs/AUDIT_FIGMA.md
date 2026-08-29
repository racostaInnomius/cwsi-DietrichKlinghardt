# Auditoría: lo construido vs. el diseño de Figma

**Fecha:** 2026-08-28 · **Archivo:** `dkt_final` (`1UictD2h0rCrONQOGVRh1Y`), última
modificación 2026-08-27 · **Método:** API REST de Figma — se descargó el archivo
completo (7.5 MB) y se leyeron los valores reales (rellenos, gradientes,
familias, pesos, tamaños, posiciones), más exportación PNG del frame Homepage.
La comparación del lado del sitio se hizo sobre el **HTML construido** en
`dist/`, no sobre el código fuente.

> **Respuesta corta: no estamos 1:1.** Ocho páginas coinciden en estructura,
> pero el **Homepage y Sophia difieren de fondo**, y otras cinco están
> incompletas. Lo que reportaste del texto que se pierde en el gradiente no es
> un fallo de contraste aislado: es el síntoma de una regla de diseño que
> tradujimos mal, y está explicado en §1.

---

## 1. El hallazgo de fondo: el gradiente es de PÁGINA, no de sección

En el diseño, `Rectangle 296` es **un único gradiente que recorre la página
entera** (y=30 → y=5238 de un frame de 5597px):

| Posición | Color | Dónde cae |
|---|---|---|
| 0.09 | `#023866` navy | hero |
| 0.18 | `#199b9f` teal | |
| **0.24 – 0.57** | **`#ffffff` blanco** | **todo el bloque central** |
| 0.71 | `#1a9ca0` teal | |
| 0.89 – 1.00 | `#f4f0e5` → `#f79b09` | newsletter y pie |

Nosotros construimos **gradientes independientes por sección**
(`--grad-hero`, `--grad-section`, `--grad-warm`), y cada uno recorre el rango
completo navy→ámbar **dentro de su propia altura**. Consecuencias medidas:

- El recorrido de color se comprime en cada sección, así que el texto acaba
  sobre colores para los que nunca se pensó. Blanco sobre el teal medio da
  **3.13:1** y sobre el ámbar final **1.65:1** — ambos por debajo de AA (4.5:1).
- En el diseño **el bloque central es blanco con texto oscuro**: ink `#1c1916`,
  cuerpo `#6b6456`/`#7a7060`, eyebrow dorado `#c27d09`. Nosotros pusimos texto
  blanco sobre gradiente oscuro en esas mismas secciones.

**El caso que reportaste** (`A.R.T. Klinghardt™` casi invisible) es exactamente
esto: en el diseño esa sección es **blanca, con la miniatura de un vídeo a la
izquierda y texto oscuro**; en nuestra versión es una banda de gradiente oscuro
con texto blanco. El eyebrow ya quedó corregido (2.28:1 → 11.2:1), pero **eso es
un parche sobre una traducción equivocada**, no la solución.

> Decisión pendiente contigo: rehacer el fondo como un gradiente de página con
> banda blanca central (fiel al diseño) o mantener el actual por secciones y
> re-teñir los textos. Lo primero es más trabajo y es lo que pide el diseño.

## 2. Tipografía — aquí sí estamos alineados

Conteo real de nodos de texto del archivo:

| Familia | Pesos usados | Nodos | Nuestro token |
|---|---|---|---|
| DM Sans | 400 / 500 / 600 / 700 | 1 243 | `--font-sans` ✅ |
| Kalice | **400 / 500 / 700** | 158 | `--font-display` ✅ |
| Fraunces | 300 (y un 400) | 74 | `--font-serif` ✅ |
| Libre Baskerville | 700 | 20 | ⚠️ no está |

- **Kalice se usa en tres pesos**, no dos: instalar Medium (500) y Bold (700)
  además de Regular fue correcto. Tamaños dominantes 57px, 93px, 26px, 22px.
- **Fraunces no era una sustitución nuestra**: es una fuente real del diseño
  (28–40px, títulos de tarjeta y acentos en itálica). El token acierta.
- **Libre Baskerville 700** aparece 20 veces, y no es una captura pegada: son
  los ordinales `01st`–`05th` de la pirámide de los 5 Niveles (27px) y algún
  título. Hoy no está declarada. *(Pendiente nuevo: C1.)*
- Inter, SF Pro, PingFang, Proxima Nova y Uni Neue aparecen a 4–9px: son
  maquetas pegadas dentro del diseño, no sistema tipográfico. Ignorarlas.

## 3. Página por página

Comparación de titulares (h1/h2) del `dist/` contra los titulares ≥26px del
frame correspondiente.

### ✅ Alineadas en estructura

| Página | Nota |
|---|---|
| **Directorio** (`/academy/therapists`) | Ambos titulares coinciden literalmente |
| **Online Courses** (`/courses`) | Los 5 métodos coinciden exactamente |
| **Curso interno** (`/courses/art`) | Los 5 bloques coinciden: During training · Course of training · Requirements · Recommended additional seminars · Course content & seminar dates |
| **Team** (`/sophia/team`) | Coincide |
| **Foundation** | Coinciden los 3 titulares principales y los 4 compromisos |
| **Events** | "Learn Directly from Dr. Klinghardt™" ✓ |
| **Contact** | Estructura ✓, pero **las 4 tarjetas tienen otras etiquetas**: diseño = General Inquiries · Media & Press · Dr. Klinghardt Foundation · Speaking & Events; nuestro = General enquiries · Seminars & academy · Sophia Health Institute · Press & speaking |
| **Music** | "Music as Medicine" ✓; falta el bloque **Discography** (hoy sale el título de la fila del CMS) |

### ⚠️ Incompletas — falta contenido que el diseño sí tiene

| Página | Lo que falta |
|---|---|
| **5 Levels** | Toda la **pirámide numerada** `01st`–`05th` (Libre Baskerville 27px) y la **cita** *"I have tried to establish some guidelines for thera…"* |
| **Weekly Talks** | `Learn, Connect, Grow Together`, el **bloque de precio $25** y el **FAQ**. Sólo tenemos el titular |
| **Store** | La sección **"Dr. Klinghardt's Top 5 Picks of the Month" + "August 2026"**, que en el diseño abre la página |
| **Accommodations** | `Hotels in The Local Area` y el cierre `Ready to Take The Next Step` |
| **Academy** | Falta **Klinghardt Akademie**; añadimos "Online Courses", que ahí no está; el orden difiere (diseño: Therapists → A.R.T. → 5 Levels → Publications → Akademie → Foundation) |
| **New Patients** | Falta casi todo: `We Know You Have Been Through a Lot`, los dos bloques `You May Be Wondering…`, la lista numerada 01–05, las 4 tarjetas (Individualized Care, Root-Cause Medicine, A.R.T.®, 5 Levels) y `What to Expect as a Patient` |

### ⛔ Divergentes de fondo

**Homepage.** El diseño tiene 8 secciones; nosotros 6, y de otra manera.

| Diseño | Nuestro |
|---|---|
| Hero = **tarjeta con esquinas redondeadas y márgenes**, foto del Dr. a la derecha, titular **navy** *"Innovator in Medicine"*, botones *Subscribe to mailing list* / *Upcoming events* | Hero **a sangre**, gradiente oscuro, titular **blanco** *"Healing Beyond Symptoms"* con palabra rotatoria |
| Párrafo grande en Kalice 36px + botón *Learn More* | Bloque "An Innovator in Medicine" a dos columnas |
| **Listado de eventos** con fecha a la izquierda (Fraunces 40px), pestañas *Upcoming / Past*, botón *View all events* | — no está |
| **Sección A.R.T. blanca** con miniatura de vídeo, subtítulo en Fraunces itálica, botones *About the course* / *Course dates* | Banda de gradiente oscuro, texto blanco, sin vídeo |
| **Sección Sophia** con imagen y botones *Learn more* / *New patients* | — no está |
| **Banda Weekly Talks**: tarjeta insertada, titular 117px **multicolor**, maqueta del directo | Tarjeta teaser pequeña |
| **Sección Shop** completa: píldoras de categoría, carrusel de producto con precios y sello *Klinghardt's Pick* | Tarjeta teaser pequeña |
| Newsletter centrado *"Join Our Newsletter"* | Newsletter con copy del landing viejo (*"Stay informed"* — es B12) |

**Sophia** (`/sophia`, frame `0:6594`). Prácticamente no coincide. El diseño es
una landing completa: *Founded by Dr. Dietrich Klinghardt™ Built for True
Healing* · *A Different Kind of Medicine, Built Around You.* · bloque de cifras
**10K / 25+ / 100% / 5** · *Six Pillars of A Different Approach.* ·
*Cutting-edge Science Meets Heartfelt Care.* · *Healing the Whole Person, Mind,
Body, and Spirit.* · *Complex Conditions. Real Answers.* · cierre *Stop
Wondering. Start Finding Answers.* Nuestra página tiene tres titulares
inventados.

**About.** Diseño: *Dr. Dietrich Klinghardt™* + *A Life Dedicated to Healing*.
Nuestro: *An Innovator in Medicine* + *Four decades of asking why*.

**A.R.T.** (`/academy/art`). Diseño: *A.R.T Klinghardt™*. Nuestro: *Autonomic
Response Testing* + *Learn it, or find someone who has* (inventado).

---

## 4. Qué cuenta como desviación y qué no

Para ser justos con lo ya construido:

- Buena parte del Homepage y de Events está en **lorem ipsum** en el diseño, así
  que escribir copy propio ahí fue deliberado y correcto. Lo que **no** es
  defendible es haber sustituido copy que el diseño sí trae escrito — *A Life
  Dedicated to Healing*, *Six Pillars…*, *Stop Wondering. Start Finding
  Answers.*
- La ausencia de secciones enteras (Events y Shop en el Home, la pirámide de los
  5 Niveles, el FAQ de Weekly Talks, New Patients) **sí** es deuda contra el
  diseño, no una decisión.
- El pie con la marca de agua `Dr. Dietrich Klinghardt™` a 93px aparece en los
  20 frames y lo tenemos ✓.

## 5. Orden sugerido

1. **Decidir el modelo de fondo (§1).** Condiciona el color de texto de todas
   las secciones, así que va primero: cualquier arreglo de contraste hecho antes
   habrá que rehacerlo.
2. **Sophia y New Patients**, que son las dos más alejadas.
3. **Homepage**: recuperar las secciones de Events, Sophia y Shop, y rehacer el
   hero como tarjeta.
4. Completar 5 Levels, Weekly Talks, Store y Accommodations.
5. Copy de About, A.R.T. y las etiquetas de Contact.
6. Declarar **Libre Baskerville** y usarla en los ordinales de la pirámide.

## Limitaciones de esta auditoría

- Se compararon **titulares y estructura**, no espaciados, cuadrículas ni
  tamaños exactos por bloque. Un repaso de retícula es un segundo pase.
- No hay frames de móvil en el archivo: el responsive sigue siendo criterio
  nuestro y necesita validación de Noemi (ya estaba anotado).
- Los frames traen lorem ipsum en varios sitios; donde lo hay, no se puede
  juzgar el copy.

---

## 6. Segunda pasada de color (2026-08-28)

Revisión pedida tras notar que la barra de anuncio se veía más clara que en el
Figma. Método: muestreo de píxeles sobre los frames **renderizados** (`magick
-format "%[pixel:p{x,y}]"`), más un censo de todos los rellenos sólidos del
archivo. Conclusión: **los tokens base eran correctos** — `#1c1916`, `#6b6456`,
`#023866`, `#ede8da` y `#bc8f44` son literalmente los colores más usados del
diseño, y `--gold-bright` ya valía `#e9a43f`, idéntico a la barra. Las
discrepancias reales eran otras tres:

| # | Qué estaba mal | Qué dice el diseño |
|---|---|---|
| 1 | Barra de anuncio con **texto oscuro** | Fondo `#e9a43f` ✅ ya coincidía; el texto es **blanco**. Con tinta oscura la franja entera se lee lavada, que es lo que se notó |
| 2 | Tarjeta del hero con gradiente **diagonal teal→verde→ámbar**, inventado | Es **vertical**: abre en el mismo `#023866` de la página, sube a azul pálido `#a9cad1` sobre el primer tercio —la banda donde va el titular— y sólo vira a ámbar `#cca256` al final |
| 3 | La capa de movimiento **tapaba** el gradiente real | Estaba al 220% de tamaño y opacidad 1: a esa escala deja de ser una deriva y se convierte en otro gradiente, con las paradas donde no van. Bajada a 130%/0.45 en tarjetas y 120%/0.35 en la página |

Efecto medido en el hero, que antes tenía el titular ilegible: h1 **6.77:1**,
lead **7.68:1**, botones 6.67 y 4.55. Los dos que siguen por debajo de AA
(barra de anuncio 2.13:1 y eyebrow del hero 1.81:1) **son del diseño**, no
nuestros — quedan en D13 para que los decida el cliente.

También se corrigió el contenido de la tarjeta: iba pegado abajo y ahora va
centrado, que es donde el diseño lo pone — y no por estética, sino porque esa
es la franja azul pálida sobre la que el texto oscuro funciona.
