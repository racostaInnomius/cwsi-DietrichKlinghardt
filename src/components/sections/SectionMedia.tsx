import type { ReactNode } from "react";
import type { Section } from "@/lib/sections";
import { videoEmbed } from "@/lib/cms";
import { VideoPlayer } from "@/components/sections/VideoPlayer";
import { InViewVideo } from "@/components/sections/InViewVideo";

/**
 * What a block's media fields amount to, in one place.
 *
 * Every Page Contents row offers the same three ways to fill a media slot,
 * and an editor should not have to learn which of them a given section
 * happens to read (client, 2026-11-05: the Foundation section took a video
 * from a video host but ignored the picture field right above it):
 *
 *   - "Video destacado"  → a film from a video host, in the site's player.
 *   - "Imagen principal" → the uploaded file: a picture, or a clip, which
 *                          plays itself once when it scrolls into view.
 *   - neither            → nothing, so the caller draws what it drew before.
 *
 * `poster` is the frame a clip shows while it loads and to anyone who asked
 * for less motion, so a section that has one passes it.
 */
export function sectionMedia(block: Section, { poster, title }: { poster: string; title: string }): ReactNode {
  const video = videoEmbed(block.raw?.featuredVideo);
  if (video) return <VideoPlayer video={video} />;

  const file = block.image;
  if (!file) return null;

  const alt = block.imageAlt || block.title || title;
  if (block.imageMime?.startsWith("video/")) {
    return <InViewVideo src={file} poster={poster} title={alt} width={1920} height={1080} />;
  }
  return <img src={file} alt={alt} loading="lazy" decoding="async" />;
}

/** True when the slot is filled from the CMS, so the caller can skip its own. */
export function hasSectionMedia(block: Section): boolean {
  return Boolean(videoEmbed(block.raw?.featuredVideo) || block.image);
}

/**
 * True only for the player with a play button, which must not be wrapped in
 * a link: the link would swallow the click that starts it. A clip that plays
 * itself has no button to steal, so it is not one of these.
 */
export function isPlayerVideo(block: Section): boolean {
  return Boolean(videoEmbed(block.raw?.featuredVideo));
}
