import { Head } from "vite-react-ssg";
import { env } from "@/lib/env";

/**
 * Per-page metadata: title, description, canonical and the social cards.
 *
 * One component rather than hand-written tags per page, because the tags have
 * to agree with each other — a canonical that disagrees with og:url, or a
 * social card describing a different page, is worse than none. It also stops
 * the site-wide tags in index.html from being the ones a crawler reads: those
 * are now only the truly global ones (charset, icon, site_name), and everything
 * page-specific is emitted here.
 */
export function Seo({
  title,
  description,
  /** Path with a leading slash, e.g. "/about". Omit for a noindex page. */
  path,
  image,
  noindex,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}) {
  // A preview deployment is never indexable, whatever the page asked for.
  const hidden = noindex || !env.INDEXABLE;
  const url = path ? `${env.SITE_URL}${path === "/" ? "" : path}` : undefined;
  const card = image ?? `${env.SITE_URL}/images/dietrich-klinghardt.jpg`;

  return (
    <Head>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}

      {/* A noindex page gets no canonical and no social card: it is either
          private, per-viewer or duplicate, and advertising it would undo the
          point of hiding it. */}
      {hidden ? <meta name="robots" content="noindex" /> : null}
      {!hidden && url ? <link rel="canonical" href={url} /> : null}

      {!hidden ? <meta property="og:title" content={title} /> : null}
      {!hidden && description ? (
        <meta property="og:description" content={description} />
      ) : null}
      {!hidden && url ? <meta property="og:url" content={url} /> : null}
      {!hidden ? <meta property="og:image" content={card} /> : null}
      {!hidden ? <meta name="twitter:title" content={title} /> : null}
      {!hidden && description ? (
        <meta name="twitter:description" content={description} />
      ) : null}
      {!hidden ? <meta name="twitter:image" content={card} /> : null}
    </Head>
  );
}
