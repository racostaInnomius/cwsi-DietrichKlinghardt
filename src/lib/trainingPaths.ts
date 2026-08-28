import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { text } from "./content";
import { fetchCollection, richTextBlocks } from "./cms";
import { env } from "./env";
import { trainingPaths as bundled, type TrainingPath } from "@/data/trainingPaths";
import type { ContentDoc } from "@/data/demo";

/**
 * Training paths, read from the CMS when the `training-paths` collection is
 * available and merged over the bundled content field by field.
 *
 * The merge is per field, not per row: a CMS row that only fills in `about`
 * still inherits the curriculum and seminar list from the design. That matters
 * while the content is being loaded — a half-filled row must not blank the rest
 * of the page.
 */

function list(value: unknown, key: string): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      const row = item as Record<string, unknown>;
      const cell = row?.[key];
      return typeof cell === "string" ? cell : "";
    })
    .map((item) => item.trim())
    .filter(Boolean);
}

function steps(value: unknown): { label: string; note?: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as Record<string, unknown>;
      const label = typeof row?.label === "string" ? row.label.trim() : "";
      const note = typeof row?.note === "string" ? row.note.trim() : undefined;
      return label ? { label, note: note || undefined } : null;
    })
    .filter((step): step is { label: string; note?: string } => Boolean(step));
}

/** Only the fields the CMS row actually fills in override the bundled ones. */
function merge(base: TrainingPath, doc: ContentDoc): TrainingPath {
  const about = richTextBlocks(doc.about);
  const duringTraining = richTextBlocks(doc.duringTraining);
  const curriculum = steps(doc.curriculum);

  return {
    ...base,
    title: text(doc, "title", base.title),
    abbreviation: text(doc, "abbreviation", base.abbreviation),
    subtitle: text(doc, "subtitle", base.subtitle),
    shortDescription: text(doc, "shortDescription", base.shortDescription),
    diploma: text(doc, "diploma", base.diploma),
    recommendedNote: text(doc, "recommendedNote", base.recommendedNote ?? "") || undefined,
    levels: list(doc.levels, "label").length ? list(doc.levels, "label") : base.levels,
    targetGroup: list(doc.targetGroup, "label").length
      ? list(doc.targetGroup, "label")
      : base.targetGroup,
    languages: list(doc.languages, "label").length
      ? list(doc.languages, "label")
      : base.languages,
    examRequirements: list(doc.examRequirements, "label").length
      ? list(doc.examRequirements, "label")
      : base.examRequirements,
    recommendedSeminars: list(doc.recommendedSeminars, "label").length
      ? list(doc.recommendedSeminars, "label")
      : base.recommendedSeminars,
    seminars: list(doc.seminars, "title").length
      ? list(doc.seminars, "title")
      : base.seminars,
    footnotes: list(doc.footnotes, "text").length
      ? list(doc.footnotes, "text")
      : base.footnotes,
    about: about.length ? about : base.about,
    duringTraining: duringTraining.length ? duringTraining : base.duringTraining,
    curriculum: curriculum.length ? curriculum : base.curriculum,
    finalStep: text(doc, "finalStep", base.finalStep ?? "") || undefined,
    order: typeof doc.order === "number" ? doc.order : base.order,
  };
}

/**
 * Route loader for the three course templates.
 *
 * Loaded per-route rather than site-wide: the five paths carry their whole
 * curriculum and seminar list (~12KB), and only these pages read them. In the
 * shared loader that payload would be inlined into every page of the site.
 */
export async function loadTrainingPaths(): Promise<{ trainingPaths: ContentDoc[] }> {
  return { trainingPaths: await fetchCollection("training-paths") };
}

export function useTrainingPaths(): TrainingPath[] {
  const loaded = useLoaderData() as { trainingPaths?: ContentDoc[] } | undefined;
  const [rows, setRows] = useState<ContentDoc[]>(loaded?.trainingPaths ?? []);

  const shouldRefresh =
    env.RUNTIME_CMS && Boolean(env.TENANT_ID) && Boolean(env.SITE_ID);
  useEffect(() => {
    if (!shouldRefresh) return;
    let active = true;
    void loadTrainingPaths().then((fresh) => {
      if (active && fresh.trainingPaths.length) setRows(fresh.trainingPaths);
    });
    return () => {
      active = false;
    };
  }, [shouldRefresh]);

  return useMemo(() => {
    const merged = bundled.map((base) => {
      const doc = rows.find((row) => row.slug === base.slug);
      return doc ? merge(base, doc) : base;
    });

    // Paths the CMS adds that the bundle does not know about still show up —
    // otherwise a sixth method would be invisible until someone shipped code.
    const known = new Set(bundled.map((path) => path.slug));
    const extra = rows
    .filter((row) => typeof row.slug === "string" && !known.has(row.slug))
    .map((row) =>
      merge(
        {
          slug: String(row.slug),
          title: "",
          abbreviation: "",
          subtitle: "",
          shortDescription: "",
          levels: [],
          targetGroup: [],
          languages: [],
          diploma: "",
          about: [],
          duringTraining: [],
          curriculum: [],
          footnotes: [],
          examRequirements: [],
          recommendedSeminars: [],
          seminars: [],
          order: 99,
        },
        row,
      ),
    )
      .filter((path) => path.title);

    return [...merged, ...extra].sort((a, b) => a.order - b.order);
  }, [rows]);
}

export function useTrainingPath(slug: string | undefined): TrainingPath | undefined {
  return useTrainingPaths().find((path) => path.slug === slug);
}

/**
 * The course dates belonging to a path.
 *
 * Two ways in, because the CMS relationship does not exist yet: the
 * `trainingPath` relationship once the field is added, and the free-text
 * `category` on events meanwhile — tag a course date `art` and it lands on the
 * A.R.T. dates page today.
 */
export function eventsForPath(events: ContentDoc[], path: TrainingPath): ContentDoc[] {
  const slug = path.slug.toLowerCase();
  return events.filter((event) => {
    const related = event.trainingPath;
    if (related && typeof related === "object") {
      const relatedSlug = (related as { slug?: unknown }).slug;
      if (typeof relatedSlug === "string") return relatedSlug === path.slug;
    }
    if (typeof related === "string") return related === path.slug;
    const category = typeof event.category === "string" ? event.category : "";
    return category.trim().toLowerCase() === slug;
  });
}

export type { TrainingPath };
