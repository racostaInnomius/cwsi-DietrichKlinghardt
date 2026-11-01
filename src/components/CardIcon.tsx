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
 * The Dr. Klinghardt mark. It is the one card icon that is not a line
 * drawing: it keeps its own colours, so it sits on the tinted square the
 * other icons use rather than replacing it (client, 2026-11-01). The file is
 * the client's own cut-out at 96px, three times the size it draws at, for
 * dense screens.
 */
function DkMarkIcon() {
  return <img className="icon-mark" src="/images/dk-mark.png" alt="" width={96} height={96} loading="lazy" />;
}

/** A card's icon by its CMS key; an unknown or empty key draws `fallback`. */
export function CardIcon({ name, fallback = LeafIcon }: { name: string; fallback?: typeof DropletIcon }) {
  if (name === "dk") return <DkMarkIcon />;
  const Icon = CARD_ICONS[name] ?? fallback;
  return <Icon />;
}
