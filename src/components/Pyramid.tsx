import { Reveal } from "@/components/motion/Reveal";
import { FIVE_LEVELS } from "@/data/fiveLevels";

/**
 * The 5 Levels pyramid — apex triangle widening into four bands, each tied
 * to its own accent colour, with the "objective/subjective reality" axis
 * climbing each side. Built for /academy/five-levels; `compact` renders the
 * same structure at the smaller scale the /academy hub's card slot needs
 * (client, 2026-09-11: "la piramide debe quedar asi [Figma] identico" —
 * the hub's own version had dropped the ordinals, glyphs and axis labels).
 */
export function Pyramid({ compact = false }: { compact?: boolean }) {
  return (
    <Reveal className={`pyramid${compact ? " pyramid--compact" : ""}`} as="div">
      <span className="pyramid__axis pyramid__axis--left" aria-hidden="true">
        Objective reality
      </span>
      <span className="pyramid__axis pyramid__axis--right" aria-hidden="true">
        Subjective reality
      </span>

      <ol className="pyramid__stack">
        {FIVE_LEVELS.map((level, index) => (
          <li
            key={level.ordinal}
            className={`pyramid__level${index === 0 ? " pyramid__level--apex" : ""}`}
            style={
              {
                "--accent": level.accent,
                "--band": `${58 + (index - 1) * 14}%`,
              } as React.CSSProperties
            }
          >
            <span className="pyramid__ordinal">{level.ordinal}</span>
            <span className="pyramid__name">{level.name}</span>
            <span className="pyramid__glyph" aria-hidden="true">
              {level.glyph}
            </span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
