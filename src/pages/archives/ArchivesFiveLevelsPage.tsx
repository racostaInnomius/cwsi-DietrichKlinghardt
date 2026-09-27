import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";

/**
 * Archives: 5 Levels of Healing™ — content removed (client, 2026-09-27),
 * see ArchivesPage.tsx for the fuller note. Was migrated from
 * klinghardt-akademie.de; cleared to the site's standard empty state
 * pending real content.
 */
export function ArchivesFiveLevelsPage() {
  return (
    <div className="archives-page">
      <Seo
        title={"5 Levels of Healing™ — Archives — Dr. Dietrich Klinghardt™"}
        description="The Archives are being rebuilt with new content."
        path="/archives/five-levels-of-healing"
        noindex
      />

      <section className="section wrap">
        <Breadcrumbs
          items={[{ label: "Archives", href: "/archives" }, { label: "5 Levels of Healing™" }]}
        />
        <h1>5 Levels of Healing™</h1>
        <p className="empty-note">
          This page is being rebuilt with new content. In the meantime,
          reach out via <a href="/contact">Contact</a> for anything you're
          looking for.
        </p>
      </section>
    </div>
  );
}
