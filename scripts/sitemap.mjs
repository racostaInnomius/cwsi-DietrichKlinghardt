#!/usr/bin/env node
/**
 * Generates sitemap.xml from what the build actually emitted.
 *
 * Reading `dist/` rather than the route table is deliberate: the route table
 * lists patterns (`/courses/:slug`), while `dist/` lists the pages that really
 * exist, including the ones expanded from CMS data. A sitemap that promises
 * URLs the build did not produce is worse than no sitemap.
 *
 * Pages that opted out with `noindex` are skipped — listing a page in the
 * sitemap while telling crawlers to ignore it is a contradiction.
 *
 * Runs after `vite-react-ssg build`; see the `build` script.
 */
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const DIST = "dist";

/**
 * Vite reads `.env.production` for `import.meta.env`; this script runs as plain
 * Node and would otherwise only see the shell. That gap published a PREVIEW
 * robots.txt from a build whose env file said the opposite — silently, since
 * each half was doing what it was told. So read the same file Vite reads, and
 * let a real environment variable win over it, which is Vite's own precedence.
 */
function envFromFile(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match || match[1] in process.env) continue;
    process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}
envFromFile(".env.production");

const SITE_URL = (process.env.VITE_PUBLIC_SITE_URL || "https://dietrich-klinghardt.com")
  .replace(/\/$/, "");
const INDEXABLE = process.env.VITE_PUBLIC_INDEXABLE === "true";

// robots.txt is written here, not shipped as a static file, so it can never
// disagree with the pages: a preview deployment says "stay out" and advertises
// no sitemap, and only a real deployment invites crawlers in.
function writeRobots(hasSitemap) {
  writeFileSync(
    join(DIST, "robots.txt"),
    INDEXABLE
      ? `User-agent: *\nAllow: /\n${hasSitemap ? `\nSitemap: ${SITE_URL}/sitemap.xml\n` : ""}`
      : "# Preview deployment — the public site lives elsewhere.\nUser-agent: *\nDisallow: /\n",
  );
}

if (!INDEXABLE) {
  writeRobots(false);
  console.log("robots.txt — Disallow (preview build); no sitemap emitted");
  process.exit(0);
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return full.endsWith(".html") ? [full] : [];
  });
}

const urls = [];
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, "utf8");
  const head = html.split("</head>")[0].replace(/<!--[\s\S]*?-->/g, "");
  if (/name="robots"[^>]*noindex/.test(head)) continue;

  const path = relative(DIST, file).split(sep).join("/").replace(/\.html$/, "");
  urls.push(path === "index" ? "/" : `/${path}`);
}

urls.sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));

const body = urls
  .map((path) => `  <url>\n    <loc>${SITE_URL}${path === "/" ? "/" : path}</loc>\n  </url>`)
  .join("\n");

writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
);

writeRobots(true);
console.log(`sitemap.xml — ${urls.length} URLs · robots.txt — Allow`);
