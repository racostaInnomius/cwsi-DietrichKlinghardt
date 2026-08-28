# Fonts

## Kalice — display face (pending)

Every heading in the design uses **Kalice** (36–117px). The `@font-face` blocks
are already declared in `src/styles/base.css`, so shipping it is only a matter of
dropping two files here:

```
public/fonts/kalice-regular.woff2   (weight 400)
public/fonts/kalice-bold.woff2      (weight 700)
```

No code change is needed — `--font-display` picks them up automatically.

⚠️ **The Figma file uses `Kalice-Trial`.** A trial licence does not cover web
embedding, so the production files must come with a proper webfont licence from
the designer (Noemi) or the foundry. Until they arrive the stack falls back to
Cormorant Garamond → Georgia → serif, which keeps the layout honest but is *not*
the brand face.

## DM Sans — body

Loaded from Google Fonts in `src/index.css` (weights 400/500/600/700). Free to
embed, nothing to host.

## Fraunces — serif accents

Also from Google Fonts (weight 300, plus italics). The design uses it for card
titles and italic accents such as *"AUTONOMIC RESPONSE TESTING®"*. If the client
prefers Kalice in those places instead, change the single `--font-serif` token in
`src/styles/tokens.css` — no component references the family directly.
