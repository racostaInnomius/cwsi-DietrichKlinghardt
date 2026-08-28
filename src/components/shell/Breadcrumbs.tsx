import { Link } from "react-router-dom";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * "← Events / A.R.T. Klinghardt™" — the back-arrow breadcrumb the design puts
 * on every internal page (event detail, course dates, training paths).
 *
 * The first crumb doubles as the back link, matching the arrow in the design;
 * the last one is the current page and is not a link.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items.length) return null;
  const [first, ...rest] = items;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          {first.href ? (
            <Link to={first.href}>
              <span className="breadcrumbs__arrow" aria-hidden="true">
                ←
              </span>
              {first.label}
            </Link>
          ) : (
            <span>{first.label}</span>
          )}
        </li>
        {rest.map((crumb, index) => {
          const isLast = index === rest.length - 1;
          return (
            <li key={`${crumb.label}-${index}`}>
              <span className="breadcrumbs__sep" aria-hidden="true">
                /
              </span>
              {crumb.href && !isLast ? (
                <Link to={crumb.href}>{crumb.label}</Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{crumb.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
