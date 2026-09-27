import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";

/**
 * Archives: Applied Psycho-Neurobiology (APN) — content removed (client,
 * 2026-09-27), see ArchivesPage.tsx for the fuller note. Was migrated from
 * klinghardt-akademie.de; cleared to the site's standard empty state
 * pending real content.
 */
export function ArchivesApnPage() {
  return (
    <div className="archives-page">
      <Seo
        title={"Applied Psycho-Neurobiology (APN) — Archives — Dr. Dietrich Klinghardt™"}
        description="The Archives are being rebuilt with new content."
        path="/archives/apn-applied-psycho-neurobiology"
        noindex
      />

      <section className="section wrap">
        <Breadcrumbs
          items={[
            { label: "Archives", href: "/archives" },
            { label: "Applied Psycho-Neurobiology (APN)" },
          ]}
        />
        <h1>Applied Psycho-Neurobiology (APN)</h1>
        <p className="empty-note">
          This page is being rebuilt with new content. In the meantime,
          reach out via <a href="/contact">Contact</a> for anything you're
          looking for.
        </p>
      </section>
    </div>
  );
}
