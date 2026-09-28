import type { ReactNode } from "react";

/** Shared gate/status block — originally LiveTalkPage's, reused by ArchivesPage for the same membership_required gate. */
export function LiveNotice({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <div className="live-notice" role="status">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
      {children}
    </div>
  );
}
