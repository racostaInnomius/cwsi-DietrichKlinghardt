# Notas de la diseñadora — Figma `dkt_final`

> Extraídas vía API de Figma el 2026-08-27 (56 hilos / 62 mensajes, autora: **Noemi Cruz**,
> 26–27 ago 2026). Archivo: `1UictD2h0rCrONQOGVRh1Y`. "Vic" = contacto del cliente.
> Se omiten aquí los hilos que solo enlazan frames entre sí (cableado del prototipo);
> el JSON crudo completo quedó respaldado junto a este doc.

## Globales (aplican a todo el sitio)

- **Fondo con gradiente ANIMADO entre secciones** — referencia: <https://newgenre.studio/>.
  Debe ser notorio en el hero (hasta el botón "Learn more") y más marcado en Shop y
  Newsletter.
- **Las secciones entran sutilmente al hacer scroll** (reveal animations) — referencia:
  <https://beautyunscripted.com/>.
- **Quotes animadas línea por línea** — misma referencia (sección
  "WE ARE AN AGENCY THAT IS REDEFINING"). Aplica al Home y a The 5 Levels of Healing.
- Branding: usar siempre colores y fuentes del branding, incluso en interfaces que no
  están diseñadas (p. ej. checkout).

## Navegación / e-commerce

- ⚠️ **Agregar un SHOPPING CART al navbar** — textual: *"tenemos shop, y también los
  cursos, no sé cómo sea mejor organizarlo en el back end"*. → El diseño pide carrito
  unificado (productos + cursos); la arquitectura de backend queda a nuestro criterio.

## Homepage (`DK__Homepage` 0:698)

- Una palabra del hero se anima — transición sutil, *"¿tal vez que gire?"* — referencia:
  <https://new.consciouslife.com/>.

## Online Courses (0:2063 / 0:2403)

- El header replica <https://new.consciouslife.com/>: movimiento lateral de las fotos de
  los doctores (derecha) + gradient del header animado. **Vic debe mandar fotos y texto.**
- Las tarjetas de método son distintas (nombre + descripción corta); **cada una, al dar
  click en "Next courses", lleva a su propia página interna** con las tarjetas de próximos
  cursos. En el diseño solo está el ejemplo de la primera (ART) — replicar para
  MFT/PK/SRT/ANK.

## Directorio de terapeutas (`DK__art therapistss` 0:3616)

- ⚠️ **Fuente de datos identificada**: <https://www.ink.ag/en/pages/therapeutensuche> —
  *"toda la información de el url proporcionado se debe vaciar y debe de funcionar igual
  a este. Agregar todos los terapeutas al nuevo mapa."* → migrar el directorio completo
  del sitio europeo actual (INK) y replicar su funcionamiento.

## Shop (`DK__shop` 0:4227)

- Catálogo de referencia (tienda actual en Europa): <https://www.ink.ag/en/pages/shop>.
  **Confirmar con Vic** qué categorías se incluyen al final (pueden ser más o menos que
  las del diseño) y si se migra todo el catálogo o se filtra.

## The 5 Levels of Healing (0:4703)

- Pirámide: hover states *"que se ilumine o haga algo cool"* (pedir ejemplo a Noemi si
  hace falta).
- Quotes animadas por líneas (ver Globales).

## Music (`DK__musics` 0:4973)

- SoundCloud oficial: <https://soundcloud.com/dr-dietrich-klinghardt>.
- **Pedir a Vic que comparta el audio** (los masters/las pistas).
- Animar el gradient sutilmente.

## Foundation (0:5277)

- ⚠️ **Crear una página de donación como la de SistWorld Foundation** (enlaza el Figma de
  SistWorld: node 139-1297), **cambiando color, fuentes y logo**. → Reusar el flujo de
  donations Beytrax ya construido para sistworld.

## About (0:5539)

- Timeline: *"animar — que se vea interactivo al ir scrolleando"*.

## Contact Us (0:5829)

- Los 4 correos abren *"ventanas emergentes"* para mandar correo a cada uno (mailto /
  modal por tarjeta).

## Weekly Talks (0:6051)

- *"Esta interfaz es la que dice Vic que debe de tener el live stream"* → el player de
  live del diseño es la interfaz requerida (stream in-house, no plataforma externa).
  Pendiente confirmar el mecanismo de membresía/cobro ($25/mes).

## Sophia Health Institute (0:6594 en adelante)

- *"A partir de aquí empiezan las páginas internas de Sophia. Cambia el color scheme,
  pero es el mismo font y estilos"* → mismo design system, paleta teal.

## New Patients (0:7475)

- **Vic debe proveer el copy** de esta página.

## Contenido pendiente del cliente (resumen)

| Qué | Quién |
|---|---|
| Fotos y texto del header de Online Courses | Vic |
| Copy de New Patients | Vic |
| Audio de las pistas de Music | Vic |
| Categorías finales del Shop (vs. catálogo INK) | Vic + Noemi |
| Página Akademie (trabajo aparte) | Vic |
