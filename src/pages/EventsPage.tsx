import { useState } from "react";
import { Seo } from "@/components/Seo";
import { useCollection } from "@/lib/content";
import { useSection, SECTION } from "@/lib/sections";
import { splitByTime } from "@/lib/format";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { EventCard } from "@/components/sections/EventRow";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

/**
 * Events listing — upcoming and past, split on `startDateTime`.
 *
 * The selected date group is presented as the three-column card grid from the
 * design. Every event detail route is still emitted by getStaticPaths.
 */
export function EventsPage() {
  const copy = useSection(SECTION.homeEvents, {
    title: "Learn Directly from Dr. Klinghardt",
    paragraphs: [
      "Browse upcoming workshops, webinars, and live sessions with Dr. Dietrich Klinghardt™.",
    ],
  });

  const { upcoming, past } = splitByTime(useCollection("events"));
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const rows = tab === "upcoming" ? upcoming : past;

  return (
    <>
      <Seo
        title={"Events & Webinars — Dr. Dietrich Klinghardt™"}
        description="Upcoming workshops, seminars and live webinars with Dr. Dietrich Klinghardt."
        path="/events"
      />

      <AnimatedGradient variant="card" intensity="soft" className="page-hero events-page__hero">
        <div className="wrap page-hero__inner events-page__hero-inner">
          <Reveal className="events-page__intro">
            <p className="eyebrow">Events & webinars</p>
            {copy.title === "Learn Directly from Dr. Klinghardt" ? (
              <h1>
                <span>Learn Directly</span>
                <span><Marked text="from Dr. Klinghardt™" /></span>
              </h1>
            ) : (
              <h1><Marked text={copy.title} /></h1>
            )}
            {copy.lead ? <p className="lead">{copy.lead}</p> : null}
          </Reveal>

          <div className="tabs events-page__tabs" role="tablist" aria-label="Event dates">
          <button
            type="button"
            role="tab"
            className="tab"
            id="events-tab-upcoming"
            aria-controls="events-panel"
            aria-selected={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
          >
            Upcoming events
          </button>
          <button
            type="button"
            role="tab"
            className="tab"
            id="events-tab-past"
            aria-controls="events-panel"
            aria-selected={tab === "past"}
            onClick={() => setTab("past")}
          >
            Past events
          </button>
        </div>
        </div>
      </AnimatedGradient>

      <section
        className="wrap events-page__listing"
        id="events-panel"
        role="tabpanel"
        aria-labelledby={`events-tab-${tab}`}
      >
        {rows.length ? (
          <ul className="events-grid">
            {rows.map((event, index) => (
              <EventCard
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
