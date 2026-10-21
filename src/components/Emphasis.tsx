import { Fragment, type ReactNode } from "react";
import { Marked } from "@/components/Marked";

/**
 * A paragraph with its **bold** and *italic* runs — what the CMS editor's own
 * bold/italic buttons produce (cms.ts richTextMarked writes them this way) and
 * how BLOCKS writes them. Used where the design emphasises part of a line (the
 * quotes); everywhere else paragraphs stay plain.
 */
export function Emphasis({ text }: { text: string }): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
      return <strong key={index}><Marked text={part.slice(2, -2)} /></strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={index}><Marked text={part.slice(1, -1)} /></em>;
    return <Fragment key={index}><Marked text={part} /></Fragment>;
  });
}

/** The same text without its emphasis marks, for places that render plain. */
export function plainText(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}
