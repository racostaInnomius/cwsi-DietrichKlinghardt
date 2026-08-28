import { useState } from "react";
import { Head } from "vite-react-ssg";
import { useCollection } from "@/lib/content";
import { useSection, SECTION } from "@/lib/sections";
import { splitByTime } from "@/lib/format";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { EventRow } from "@/components/sections/EventRow";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * Events listing — upcoming and past, split on `startDateTime`.
 *
 * Both lists render in the static HTML (the tab only toggles which one is
 * shown), so every event is crawlable and linkable regardless of JS.
 */
export function EventsPage() {
  const copy = useSection(SECTION.homeEvents, {
    title: "Learn Directly from Dr. Klinghardt",
    paragraphs: [
      "Workshops, seminars and live webinars — in person and online. Seats are limited and released as each date is confirmed.",
    ],
  });

  const { upcoming, past } = splitByTime(useCollection("events"));
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const rows = tab === "upcoming" ? upcoming : past;

  return (
    <>
      <Head>
        <title>Events & Webinars — Dr. Dietrich Klinghardt™</title>
        <meta
          name="description"
          content="Upcoming workshops, seminars and live webinars with Dr. Dietrich Klinghardt."
        />
      </Head>

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Events & webinars</p>
            <h1><Marked text={copy.title} /></h1>
            {copy.lead ? <p className="lead">{copy.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        <div className="tabs" role="tablist" aria-label="Event dates">
          <button
            type="button"
            role="tab"
            className="tab"
            aria-selected={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
          >
            Upcoming <span>{upcoming.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            className="tab"
            aria-selected={tab === "past"}
            onClick={() => setTab("past")}
          >
            Past <span>{past.length}</span>
          </button>
        </div>

        {rows.length ? (
          <ul className="event-list">
            {rows.map((event, index) => (
              <EventRow
                key={String(event.id ?? index)}
                event={event}
                delay={index * 70}
              />
            ))}
          </ul>
        ) : (
          <p className="empty-note">
            {tab === "upcoming"
              ? "New dates are being confirmed. Join the newsletter below and you’ll hear first."
              : "No past events are archived yet."}
          </p>
        )}
      </section>

      <NewsletterSection />
    </>
  );
}
