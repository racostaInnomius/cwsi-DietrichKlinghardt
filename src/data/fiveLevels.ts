/**
 * The five levels, transcribed from the Figma frame `0:4703` — ordinals,
 * labels, description headings, copy, glyphs and the accent colour each level
 * carries. Those accents are the design's own values, and they are what ties
 * a band of the pyramid to its paragraph on the right.
 *
 * Shared between /academy/five-levels (the full pyramid + legend) and the
 * "5 Levels of Healing" branch on /academy (a condensed version of the same
 * pyramid) — one source for the level names, order and colours so the two
 * never drift apart.
 */
export type Level = {
  ordinal: string;
  /** The label inside the pyramid, e.g. "Spiritual (5 SB)". */
  name: string;
  /** The heading of the description beside it, e.g. "05 — Spiritual dimension". */
  heading: string;
  body: string;
  /** The mark the design sets at the right edge of each band. */
  glyph: string;
  accent: string;
};

export const FIVE_LEVELS: Level[] = [
  {
    ordinal: "05th",
    name: "Spiritual (5 SB)",
    heading: "05 — Spiritual dimension",
    body: "The spiritual core through which the divine learns within us.",
    glyph: "✦",
    accent: "#6a9ec0",
  },
  {
    ordinal: "04th",
    name: "Intuitive (4IB)",
    heading: "04 — Intuitive body",
    body: "A reality sensed only intuitively, beyond language and analysis. Shaped by family history and transpersonal forces.",
    glyph: "◉",
    accent: "#5e9b74",
  },
  {
    ordinal: "03rd",
    name: "Mental (3MB)",
    heading: "03 — Mental body",
    body: "Our information carrier, like a computer that stores memories and interprets perceptions.",
    glyph: "◇",
    accent: "#b89b40",
  },
  {
    ordinal: "02nd",
    name: "Energy Body (2EB)",
    heading: "02 — Energy body",
    body: "The link between mind and body — the level of biophysics.",
    glyph: "◈",
    accent: "#c9935a",
  },
  {
    ordinal: "01st",
    name: "Physical Body (1PB)",
    heading: "01 — Physical body",
    body: "The densest level, governed by mechanics, chemistry, and physics.",
    glyph: "⊕",
    accent: "#d4756b",
  },
];
