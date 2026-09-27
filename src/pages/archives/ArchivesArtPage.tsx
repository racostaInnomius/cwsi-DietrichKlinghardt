import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";

/**
 * Archives: A.R.T. Klinghardt™ — content removed (client, 2026-09-27), see
 * ArchivesPage.tsx for the fuller note. Was migrated from
 * klinghardt-akademie.de; cleared to the site's standard empty state
 * pending real content.
 */
export function ArchivesArtPage() {
  return (
    <div className="archives-page">
      <Seo
        title={"A.R.T. Klinghardt™ — Archives — Dr. Dietrich Klinghardt™"}
        description="The Archives are being rebuilt with new content."
        path="/archives/art-klinghardt"
        noindex
      />

      <section className="section wrap">
        <Breadcrumbs
          items={[{ label: "Archives", href: "/archives" }, { label: "A.R.T. Klinghardt™" }]}
        />
        <h1>A.R.T. Klinghardt™</h1>
        <p className="empty-note">
          This page is being rebuilt with new content. In the meantime,
          reach out via <a href="/contact">Contact</a> for anything you're
          looking for.
        </p>
      </section>
    </div>
  );
}
