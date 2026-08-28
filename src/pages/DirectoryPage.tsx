import { lazy, Suspense, useMemo, useState, type FormEvent } from "react";
import { Seo } from "@/components/Seo";
import { useSection } from "@/lib/sections";
import {
  QUALIFICATIONS,
  filterPractitioners,
  usePractitioners,
} from "@/lib/practitioners";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

// Leaflet only exists in the browser, so the map is split out of the static
// build entirely and mounted after hydration.
const PractitionerMap = lazy(() =>
  import("@/components/directory/PractitionerMap").then((m) => ({
    default: m.PractitionerMap,
  })),
);

const PAGE_SIZE = 12;

/**
 * A.R.T.® practitioner directory.
 *
 * Search and filter run over the whole list in memory: 136 rows is nothing, and
 * doing it client-side keeps the page a static file with no search endpoint
 * behind it. Every practitioner is in the HTML from the first paint, so the
 * directory is crawlable and works before (and without) JavaScript.
 */
export function DirectoryPage() {
  const page = useSection("therapists", {
    title: "Are You Looking For an A.R.T.® Klinghardt® Therapist?",
    paragraphs: [
      "Browse our directory to find practitioners near you. Visit their personal websites to learn more about the services and approach each of them offers.",
    ],
  });

  const people = usePractitioners();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [qualification, setQualification] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);

  const results = useMemo(
    () => filterPractitioners(people, query, qualification),
    [people, query, qualification],
  );
  const visible = results.slice(0, shown);

  // Only offer a qualification if somebody actually holds it.
  const available = useMemo(
    () =>
      QUALIFICATIONS.filter((q) =>
        people.some((person) => person.qualifications.some((held) => held.key === q.key)),
      ),
    [people],
  );

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(draft);
    setShown(PAGE_SIZE);
  }

  return (
    <>
      <Seo
        title={"Find an A.R.T.® Therapist — Dr. Dietrich Klinghardt™"}
        description="Global directory of practitioners certified in Autonomic Response Testing, Psycho-Kinesiology and Mental Field Techniques."
        path="/academy/therapists"
      />

      <AnimatedGradient variant="plain" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Akademy", href: "/academy" }, { label: "Find a therapist" }]}
          />
          <Reveal>
            <p className="eyebrow">Global practitioner directory</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap directory">
        <form className="directory-search" onSubmit={search} role="search">
          <label className="directory-search__field">
            <span className="sr-only">Search by name, address, postcode or city</span>
            <input
              type="search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Name, city, postcode or address…"
            />
          </label>
          <label className="directory-search__field">
            <span className="sr-only">Filter by qualification</span>
            <select
              value={qualification}
              onChange={(event) => {
                setQualification(event.target.value);
                setShown(PAGE_SIZE);
              }}
            >
              <option value="">All qualifications</option>
              {available.map((q) => (
                <option key={q.key} value={q.key}>
                  {q.label}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>

        <p className="directory-count" aria-live="polite">
          {results.length} {results.length === 1 ? "result" : "results"}
          {query || qualification ? (
            <button
              type="button"
              className="directory-clear"
              onClick={() => {
                setDraft("");
                setQuery("");
                setQualification("");
                setShown(PAGE_SIZE);
              }}
            >
              Clear
            </button>
          ) : null}
        </p>

        {results.length ? (
          <Suspense fallback={<div className="directory-map directory-map--loading" />}>
            <PractitionerMap people={results} />
          </Suspense>
        ) : null}

        <h2 className="section-title directory-heading">
          <Marked text="A.R.T.® Klinghardt® Therapists" />
        </h2>

        {visible.length ? (
          <>
            <ul className="practitioner-grid">
              {visible.map((person, index) => (
                <Reveal
                  as="li"
                  key={person.id}
                  className="practitioner"
                  delay={(index % PAGE_SIZE) * 40}
                  shift={12}
                >
                  <h3>
                    {person.academicTitle ? `${person.academicTitle} ` : ""}
                    {person.name}
                  </h3>
                  <p className="practitioner__role">
                    {person.role}
                    {person.professionalTitle ? ` · ${person.professionalTitle}` : ""}
                  </p>
                  {person.location ? (
                    <p className="practitioner__place">{person.location}</p>
                  ) : null}

                  <ul className="practitioner__contact">
                    {person.phone ? (
                      <li>
                        <span aria-hidden="true">📞</span>
                        <a href={`tel:${person.phone.replace(/[^\d+]/g, "")}`}>
                          {person.phone}
                        </a>
                      </li>
                    ) : null}
                    {person.email ? (
                      <li>
                        <span aria-hidden="true">📧</span>
                        <a href={`mailto:${person.email}`}>{person.email}</a>
                      </li>
                    ) : null}
                    {person.website ? (
                      <li>
                        <span aria-hidden="true">🌐</span>
                        <a href={person.website} target="_blank" rel="noreferrer">
                          {person.websiteLabel}
                        </a>
                      </li>
                    ) : null}
                  </ul>

                  {person.qualifications.length ? (
                    <>
                      <p className="practitioner__label">Qualifications</p>
                      <ul className="practitioner__quals">
                        {person.qualifications.map((q) => (
                          <li key={q.key}>
                            <Marked text={q.label} />
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </Reveal>
              ))}
            </ul>

            {shown < results.length ? (
              <button
                type="button"
                className="btn btn-outline load-more"
                onClick={() => setShown((count) => count + PAGE_SIZE)}
              >
                Load more
              </button>
            ) : null}
          </>
        ) : (
          <p className="empty-note">
            {people.length
              ? "No practitioners match that search. Try a city, a postcode, or clear the filters."
              : "The directory is being prepared. Join the newsletter below and you’ll hear when it is available."}
          </p>
        )}
      </section>

      <NewsletterSection />
    </>
  );
}
