export function Brand({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className={inverted ? "brand brand-inverted" : "brand"} aria-label="Dietrich Klinghardt">
      <span>Dietrich</span>
      <span>Klinghardt<i>®</i></span>
    </span>
  );
}
