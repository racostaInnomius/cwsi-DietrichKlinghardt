import {
  ArchiveIcon,
  BoltIcon,
  BriefcaseIcon,
  ClipboardCheckIcon,
  DropletIcon,
  FlaskIcon,
  GlobeIcon,
  GraduationCapIcon,
  HeartIcon,
  LayersIcon,
  LeafIcon,
  MailIcon,
  MedalIcon,
  MicrophoneIcon,
  PulseIcon,
  ShieldIcon,
  SparklesIcon,
  SproutIcon,
  StarIcon,
  TargetIcon,
  TeamIcon,
  UserCheckIcon,
} from "@/components/Icons";

/** CMS icon keys (Page Contents → Cards → Icon) → this site's drawings. */
const CARD_ICONS: Record<string, typeof DropletIcon> = {
  droplet: DropletIcon,
  pulse: PulseIcon,
  leaf: LeafIcon,
  sparkles: SparklesIcon,
  clipboard: ClipboardCheckIcon,
  flask: FlaskIcon,
  "user-check": UserCheckIcon,
  team: TeamIcon,
  heart: HeartIcon,
  shield: ShieldIcon,
  target: TargetIcon,
  layers: LayersIcon,
  sprout: SproutIcon,
  bolt: BoltIcon,
  globe: GlobeIcon,
  star: StarIcon,
  mail: MailIcon,
  briefcase: BriefcaseIcon,
  microphone: MicrophoneIcon,
  archive: ArchiveIcon,
  "graduation-cap": GraduationCapIcon,
  medal: MedalIcon,
};

/**
 * The Dr. Klinghardt mark, the same drawing the browser tab carries. It is
 * the one card icon that is not a line drawing: it keeps its own colours and
 * fills the whole box, so the box drops its tinted background for it
 * (sections.css). Client (Ana, 2026-11-01): the generic line icons "se ven
 * de AI" and the mark is offered as an option in the CMS instead.
 */
function DkMarkIcon() {
  return <img className="icon-mark" src="/images/dk-mark.svg" alt="" width={40} height={40} loading="lazy" />;
}

/** A card's icon by its CMS key; an unknown or empty key draws `fallback`. */
export function CardIcon({ name, fallback = LeafIcon }: { name: string; fallback?: typeof DropletIcon }) {
  if (name === "dk") return <DkMarkIcon />;
  const Icon = CARD_ICONS[name] ?? fallback;
  return <Icon />;
}
