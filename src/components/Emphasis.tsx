import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Marked } from "@/components/Marked";

/**
 * A paragraph with its **bold** and *italic* runs — what the CMS editor's own
 * bold/italic buttons produce (cms.ts richTextMarked writes them this way) and
 * how BLOCKS writes them. Used where the design emphasises part of a line (the
 * quotes); everywhere else paragraphs stay plain.
 *
 * Links are rendered too, so an address the editor writes actually goes
 * somewhere when clicked (client, 2026-10-26). Two ways they arrive:
 *   • the editor's own link button → cms.ts hands them over as [text](url);
 *   • an address typed into the copy → matched here and linked as it stands.
 * A path of this site ("/sophia") becomes a router link so it navigates
 * without reloading; anything else opens in a new tab. Only http and https
 * are linked, so a "javascript:" address in the CMS stays inert text.
 */

const PATTERN =
  /(\[[^\]\n]+\]\([^)\s]+\)|\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s<]+|www\.[^\s<]+)/;

const MARKDOWN_LINK = /^\[([^\]\n]+)\]\(([^)\s]+)\)$/;

/** Only addresses worth following; everything else stays plain text. */
function safeHref(raw: string): string | null {
  const url = raw.trim().replace(/[.,;:!?)]+$/, "");
  if (url.startsWith("/")) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (/^www\./i.test(url)) return `https://${url}`;
  return null;
}

function Anchor({ href, children }: { href: string; children: ReactNode }): ReactNode {
  if (href.startsWith("/")) return <Link to={href}>{children}</Link>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function Emphasis({ text }: { text: string }): ReactNode {
  return text.split(PATTERN).map((part, index) => {
    if (!part) return null;

    const link = MARKDOWN_LINK.exec(part);
    if (link) {
      const href = safeHref(link[2]);
      const label = <Marked text={link[1]} />;
      return href ? (
        <Anchor key={index} href={href}>
          {label}
        </Anchor>
      ) : (
        <Fragment key={index}>{label}</Fragment>
      );
    }

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
      return <strong key={index}><Marked text={part.slice(2, -2)} /></strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={index}><Marked text={part.slice(1, -1)} /></em>;

    // A bare address in the copy. Its trailing punctuation belongs to the
    // sentence, not to the link, so it is printed after it.
    if (/^(https?:\/\/|www\.)/i.test(part)) {
      const tail = /[.,;:!?)]+$/.exec(part)?.[0] ?? "";
      const shown = tail ? part.slice(0, -tail.length) : part;
      const href = safeHref(shown);
      if (href) {
        return (
          <Fragment key={index}>
            <Anchor href={href}>{shown}</Anchor>
            {tail}
          </Fragment>
        );
      }
    }

    return <Fragment key={index}><Marked text={part} /></Fragment>;
  });
}

/** The same text without its emphasis marks, for places that render plain. */
export function plainText(text: string): string {
  return text
    .replace(/\[([^\]\n]+)\]\([^)\s]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}
