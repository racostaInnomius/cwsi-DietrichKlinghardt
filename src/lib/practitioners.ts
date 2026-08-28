import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { externalUrl, fetchCollection } from "./cms";
import { env } from "./env";
import type { ContentDoc } from "@/data/demo";

/**
 * The practitioner directory.
 *
 * Qualifications arrive from the CMS as stable keys and are given their English
 * wording here — the filter matches on the key, so re-wording a label can never
 * silently empty a filter.
 */

export const QUALIFICATIONS = [
  { key: "master_ank", label: "Master ANK" },
  { key: "certified_therapist", label: "Certified Therapist" },
  { key: "certified_advisor", label: "Certified Advisor" },
  { key: "art", label: "A.R.T.® (Autonomic Response Testing®)" },
  { key: "pk", label: "PK (Psycho-Kinesiology)" },
  { key: "mft", label: "MFT (Mental Field Techniques)" },
] as const;

const QUALIFICATION_LABELS = new Map(QUALIFICATIONS.map((q) => [q.key, q.label]));

/** ISO-2 → the country name shown on the card. */
const COUNTRIES: Record<string, string> = {
  DE: "Germany",
  CH: "Switzerland",
  AT: "Austria",
  GB: "United Kingdom",
  IT: "Italy",
  ES: "Spain",
  HU: "Hungary",
  US: "United States",
  NL: "Netherlands",
  BE: "Belgium",
  FR: "France",
  PL: "Poland",
};

export interface Practitioner {
  id: string;
  name: string;
  academicTitle?: string;
  /** "Therapist" / "Advisor" — the source's gendered titles collapse here. */
  role: string;
  /** Kept in the original language: regulated titles have no honest translation. */
  professionalTitle?: string;
  street?: string;
  zip?: string;
  city?: string;
  countryCode?: string;
  country?: string;
  /** "Berlin, Germany" — the line under the name. */
  location: string;
  phone?: string;
  secondaryPhone?: string;
  email?: string;
  /** Validated absolute URL, or undefined. */
  website?: string;
  /** Bare host for display, e.g. "www.hp-rudolph.de". */
  websiteLabel?: string;
  lat?: number;
  lng?: number;
  qualifications: { key: string; label: string }[];
  complementary: string[];
  /** Everything searchable about this person, lowercased. */
  haystack: string;
}

const str = (value: unknown): string | undefined => {
  const text = typeof value === "string" ? value.trim() : "";
  return text || undefined;
};

function normalise(doc: ContentDoc): Practitioner {
  const countryCode = str(doc.country)?.toUpperCase();
  const country = countryCode ? (COUNTRIES[countryCode] ?? countryCode) : undefined;
  const city = str(doc.city);

  const rawSite = str(doc.website);
  // Directory entries are typed by hand and usually omit the scheme.
  const website = rawSite
    ? externalUrl(/^https?:\/\//i.test(rawSite) ? rawSite : `https://${rawSite}`)
    : undefined;

  const keys = Array.isArray(doc.qualifications)
    ? doc.qualifications.filter((k): k is string => typeof k === "string")
    : [];

  const complementary = Array.isArray(doc.complementaryApplications)
    ? doc.complementaryApplications
        .map((row) => str((row as { label?: unknown })?.label))
        .filter((label): label is string => Boolean(label))
    : [];

  const person: Practitioner = {
    id: String(doc.id ?? ""),
    name: str(doc.name) ?? "",
    academicTitle: str(doc.academicTitle),
    role: doc.role === "advisor" ? "Advisor" : "Therapist",
    professionalTitle: str(doc.professionalTitle),
    street: str(doc.street),
    zip: str(doc.zip),
    city,
    countryCode,
    country,
    location: [city, country].filter(Boolean).join(", "),
    phone: str(doc.phone),
    secondaryPhone: str(doc.secondaryPhone),
    email: str(doc.email),
    website,
    websiteLabel: rawSite?.replace(/^https?:\/\//i, "").replace(/\/$/, ""),
    lat: typeof doc.lat === "number" ? doc.lat : undefined,
    lng: typeof doc.lng === "number" ? doc.lng : undefined,
    qualifications: keys.map((key) => ({
      key,
      label: QUALIFICATION_LABELS.get(key) ?? key,
    })),
    complementary,
    haystack: "",
  };

  // Searching by "address" in the design means anything that locates a person:
  // postcode, city, street or country all have to hit.
  person.haystack = [
    person.name,
    person.academicTitle,
    person.professionalTitle,
    person.street,
    person.zip,
    person.city,
    person.country,
    person.countryCode,
    ...person.complementary,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return person;
}

/**
 * Route loader for the directory page.
 *
 * This collection loads per-route rather than with the rest of the site: it is
 * the only one large enough to matter and only one page reads it, so putting it
 * in the shared loader would inline every practitioner's contact details into
 * every page of the site.
 */
export async function loadPractitioners(): Promise<{ practitioners: ContentDoc[] }> {
  return {
    practitioners: await fetchCollection("practitioners", {
      depth: 0,
      where: { "where[status][equals]": "active" },
    }),
  };
}

export function usePractitioners(): Practitioner[] {
  const loaded = useLoaderData() as { practitioners?: ContentDoc[] } | undefined;
  const [rows, setRows] = useState<ContentDoc[]>(loaded?.practitioners ?? []);

  // Same runtime revalidation the rest of the content gets, scoped to this page.
  const shouldRefresh =
    env.RUNTIME_CMS && Boolean(env.TENANT_ID) && Boolean(env.SITE_ID);
  useEffect(() => {
    if (!shouldRefresh) return;
    let active = true;
    void loadPractitioners().then((fresh) => {
      if (active && fresh.practitioners.length) setRows(fresh.practitioners);
    });
    return () => {
      active = false;
    };
  }, [shouldRefresh]);

  return useMemo(
    () =>
      rows
        .map(normalise)
        .filter((person) => person.name)
        .sort((a, b) => {
          // Country, then city, then name — the source is ordered by postcode,
          // which means nothing to an English-speaking reader.
          const country = (a.country ?? "").localeCompare(b.country ?? "");
          if (country) return country;
          const city = (a.city ?? "").localeCompare(b.city ?? "");
          return city || a.name.localeCompare(b.name);
        }),
    [rows],
  );
}

export function filterPractitioners(
  people: Practitioner[],
  query: string,
  qualification: string,
): Practitioner[] {
  const needle = query.trim().toLowerCase();
  return people.filter((person) => {
    if (qualification && !person.qualifications.some((q) => q.key === qualification)) {
      return false;
    }
    return !needle || person.haystack.includes(needle);
  });
}
