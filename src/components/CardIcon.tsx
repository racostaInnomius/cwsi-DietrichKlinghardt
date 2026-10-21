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

/** A card's icon by its CMS key; an unknown or empty key draws `fallback`. */
export function CardIcon({ name, fallback = LeafIcon }: { name: string; fallback?: typeof DropletIcon }) {
  const Icon = CARD_ICONS[name] ?? fallback;
  return <Icon />;
}
