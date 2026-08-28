import { useRecords } from "@/lib/sections";

/**
 * The teacher cards that drift sideways across the Courses header — "el header
 * replica new.consciouslife.com: movimiento lateral de las fotos de los
 * doctores" (Noemi, 27 Aug).
 *
 * Vic still owes the photographs, so the strip renders name and discipline
 * cards and shows nothing at all when the `courses-teachers` row is empty. An
 * empty marquee sliding across the header would be worse than no marquee.
 *
 * The track is duplicated so the loop has no seam; the copy is hidden from
 * assistive technology, and the animation stops under reduced motion.
 */
export function TeachersStrip() {
  // name | discipline · city
  const teachers = useRecords("courses-teachers", 2, []);
  if (!teachers.length) return null;

  return (
    <div className="teachers" aria-label="Teachers">
      <div className="teachers__track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {teachers.map(([name, discipline]) => (
              <li key={`${copy}-${name}`} className="teacher">
                <b>{name}</b>
                <span>{discipline}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
