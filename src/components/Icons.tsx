export function VimeoIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 7.1c-.1 3.1-2.3 7.4-6.6 12.8-1.5 1.9-2.7 2.8-3.7 2.8-1.6 0-3-1.5-4-4.6L4.2 10c-.4-1.5-.8-2.2-1.3-2.2-.1 0-.8.4-1.9 1.1L0 7.5c1.2-1.1 2.4-2.1 3.6-3.2 1.6-1.4 2.8-2.1 3.7-2.2 2.1-.2 3.4 1.2 3.9 4.3.5 3.3.9 5.4 1.1 6.2.6 2.8 1.2 4.1 1.9 4.1.5 0 1.3-.8 2.3-2.5 1-1.7 1.6-3 1.7-3.9.2-1.5-.4-2.2-1.7-2.2-.6 0-1.2.1-1.9.4 1.2-4.1 3.6-6 7-5.9 2.5.1 3.7 1.6 3.6 4.5z" /></svg>;
}

export function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle className="fill" cx="17.5" cy="6.8" r="1" /></svg>;
}

export function FacebookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M13.5 21v-7h2.2l.3-2.6h-2.5V9.7c0-.8.2-1.3 1.3-1.3h1.4V6.1C15.9 6 15 6 14 6c-2.1 0-3.5 1.3-3.5 3.6v2h-2.3v2.6h2.3V21" /></svg>;
}

export function TelegramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9 22 2Z" /></svg>;
}

export function MenuIcon() {
  return <svg viewBox="0 0 28 18" aria-hidden="true"><path d="M1 1h26M1 9h26M1 17h26" /></svg>;
}

/* ── Sophia pillar / therapy card icons ──────────────────────────── */

export function ShieldIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z" /></svg>;
}

export function TargetIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle className="fill" cx="12" cy="12" r="1.2" /></svg>;
}

export function LayersIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3 8l9 5 9-5Z" /><path d="M3 12l9 5 9-5" /><path d="M3 16l9 5 9-5" /></svg>;
}

export function SproutIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21v-9" /><path d="M12 12C12 7 8 5 4 5c0 4 2 8 8 8Z" /><path d="M12 12c0-4.5 3.3-6.5 7-6.5.2 3.7-1.6 6.9-7 6.9Z" /></svg>;
}

export function BoltIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg>;
}

export function HeartIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5 4.6 13c-2-2-2-5.2 0-7.1 2-1.9 5-1.7 6.8.4l.6.7.6-.7c1.8-2.1 4.8-2.3 6.8-.4 2 1.9 2 5.1 0 7.1Z" /></svg>;
}

/* Contact page card icons (2026-09-11, against the Figma): one per
   category — mail for general inquiries, a briefcase for media/press, a
   microphone for speaking/events. HeartIcon above already covers the
   Foundation card. Stroke-based like EventMetaIcon below, not filled
   paths like HeartIcon, to sit inside the same small rounded badge. */
export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="8" width="18" height="11" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

export function MicrophoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}

/* Foundation page's "Four central commitments" list (2026-09-15, against
   the client's reference image): one icon per commitment — an archive box
   for the legacy/records one, a graduation cap for education, a flask for
   research, a globe for access/reach. Stroke-based, matching the Contact
   card icons above (MailIcon etc.) rather than the filled paths further
   up this file. */
export function ArchiveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  );
}

export function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M6 10.5V16c0 1 2.5 2.5 6 2.5s6-1.5 6-2.5v-5.5" />
      <path d="M22 8v6" />
    </svg>
  );
}

export function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 3h6" />
      <path d="M10 3v6L4.6 18.4A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.7-2.6L14 9V3" />
      <path d="M7.5 15h9" />
    </svg>
  );
}

export function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

export function DropletIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3.5 4.2 6 7.7 6 10.6a6 6 0 1 1-12 0C6 10.7 8.5 7.2 12 3Z" /></svg>;
}

export function JointIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="7" r="3.2" /><circle cx="17" cy="17" r="3.2" /><path d="M9.3 9.3l5.4 5.4" /></svg>;
}

export function LeafIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15Z" /><path d="M5 19c2-4 5-7 9-9" /></svg>;
}

export function ClipboardCheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 3.5h6v2H9z" /><path d="M8.5 13l2.2 2.2L15.5 11" /></svg>;
}

/* ── Event meta icons: person, time, calendar, tag, pin, language, seats ──
   16x16 viewBox, stroke-only, matching the treatment `.event-card__details
   svg` and `.event-panel__fact svg` apply (fill: none, stroke: currentColor
   or var(--brand)). Shared by the events listing cards and the event detail
   panel so both read from one set of shapes. */
export type EventMetaIconKind =
  | "person"
  | "time"
  | "calendar"
  | "tag"
  | "pin"
  | "language"
  | "seats";

export function EventMetaIcon({ kind }: { kind: EventMetaIconKind }) {
  if (kind === "person") {
    return <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5" r="2.25" /><path d="M4.5 13c.3-2.2 1.5-3.4 3.5-3.4s3.2 1.2 3.5 3.4" /></svg>;
  }
  if (kind === "time") {
    return <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.25" /><path d="M8 4.7V8l2.2 1.5" /></svg>;
  }
  if (kind === "calendar") {
    return <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="3.5" width="11" height="10" rx="1.3" /><path d="M2.5 6.7h11" /><path d="M5.5 2v3M10.5 2v3" /></svg>;
  }
  if (kind === "tag") {
    return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.7 8.3 8.3 2.7h5v5L7.7 13.3a1 1 0 0 1-1.4 0L2.7 9.7a1 1 0 0 1 0-1.4Z" /><circle className="fill" cx="11" cy="5" r="0.9" /></svg>;
  }
  if (kind === "pin") {
    return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14s4-3.6 4-7A4 4 0 0 0 4 7c0 3.4 4 7 4 7Z" /><circle cx="8" cy="7" r="1.35" /></svg>;
  }
  if (kind === "seats") {
    return <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="5.8" cy="6" r="2" /><circle cx="11.3" cy="6.5" r="1.6" /><path d="M2.3 13c.3-2 1.5-3.1 3.7-3.1s3.4 1.1 3.7 3.1" /><path d="M9.8 10.1c1.8.1 2.7 1.1 3 2.9" /></svg>;
  }
  return <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.25" /><path d="M2.9 8h10.2M8 2.75c1.6 1.5 2.3 3.2 2.3 5.25S9.6 11.8 8 13.25C6.4 11.8 5.7 10 5.7 8S6.4 4.2 8 2.75Z" /></svg>;
}

export function StarIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.3 9.7 6l4 .4-3 2.7.9 3.9L8 11l-3.6 2 .9-3.9-3-2.7 4-.4Z" /></svg>;
}

export function ArrowIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9M8.5 4.5 12 8l-3.5 3.5" /></svg>;
}

/** Same mark as the nav's cart button (shell/CartButton.tsx) — reused here
    for the Music discography cards' "Add" button. */
export function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 4h2.2l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Small stroke checkmark — the training-path panel's target group / language /
    diploma bullets and the exam-requirement chips (Figma draws these in a
    generic UI-kit green; this site has no green anywhere else in its palette,
    so it renders in the brand navy instead — same mark, the site's own ink). */
export function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.2 8.4 6.4 11.6 12.8 5" />
    </svg>
  );
}

/** Small stroke chevron — the seminar-list accordion rows. */
export function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3.5 11 8l-5 4.5" />
    </svg>
  );
}

/** Small stroke medal — the curriculum's closing "examination with certificate" bar. */
export function MedalIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="9.5" r="4" />
      <path d="M6 6 4.5 1.5h2L8 5l1.5-3.5h2L10 6" />
    </svg>
  );
}

/** Paper plane — the dark contact-form band's "Send message" button. */
export function SendIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 8.4 13.5 3l-4.3 11-1.7-4.3L2 8.4Z" strokeLinejoin="round" />
      <path d="M7.5 9.7 13.5 3" />
    </svg>
  );
}
