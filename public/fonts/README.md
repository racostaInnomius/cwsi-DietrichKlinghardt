# Fonts

## Kalice — display face ✅ installed

The brand display face, used by every heading (36–117px). Licensed webfonts,
delivered by the client on 2026-08-28 — **not** the `Kalice-Trial` the Figma
file references, whose licence does not cover web embedding.

    kalice-regular.woff2   400 normal   ← the only face a page normally fetches
    kalice-italic.woff2    400 italic
    kalice-medium.woff2    500 normal
    kalice-bold.woff2      700 normal

© 2023 Margot Lévêque. The full family, including the `.otf` masters and the
weights not shipped here (ExtraBold, Black and their italics), is kept in
`Kalice Family 2026/` at the root of this repository, which is private.

Four faces are declared in `src/styles/base.css` but a page downloads only what
it matches: the site sets `font-weight: 400` on every display element, so
Regular is normally the single request. The others exist so that a heading that
does ask for them renders in the brand face rather than dropping to Georgia.
`kalice-regular.woff2` is preloaded from `index.html`.

## DM Sans — body

Loaded from Google Fonts in `src/index.css` (weights 400/500/600/700). Free to
embed, nothing to host.

## Fraunces — serif accents

Also from Google Fonts (weight 300, plus italics). Used for card titles and
italic accents such as *"AUTONOMIC RESPONSE TESTING®"*. If the client prefers
Kalice in those places instead, change the single `--font-serif` token in
`src/styles/tokens.css` — no component references the family directly.
