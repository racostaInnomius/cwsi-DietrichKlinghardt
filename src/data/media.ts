/**
 * Self-hosted media that the CMS cannot hold.
 *
 * The shared CMS restricts `media` uploads to images, PDFs, HTML and zips
 * (`Media.upload.mimeTypes`), so a film cannot be a media document without
 * widening that for every tenant on the platform. The file therefore lives
 * directly in the same Azure Blob container the CMS itself writes to, under the
 * same tenant prefix — one asset uploaded once, not a new hosting provider:
 *
 *     az storage blob upload --container-name beytrax-media \
 *       --name "<tenant-id>/five-levels-1080p.mp4" --content-type video/mp4 ...
 *
 * Blob answers range requests (verified: HTTP 206), so the viewer can seek.
 * What it does not do is adapt the bitrate — everyone gets the 1080p file. If
 * that becomes a problem on mobile, the fix is a second, smaller encode rather
 * than a different player. See PENDIENTES D15.
 */
const BLOB = "https://cwsbeytrax.blob.core.windows.net/beytrax-media";
const TENANT = "75cadacc-54f9-4fa6-926a-30fca7c4c20e";

export const FIVE_LEVELS_VIDEO = {
  src: `${BLOB}/${TENANT}/five-levels-1080p.mp4`,
  poster: "/images/five-levels-poster.webp",
  title: "Dr. Klinghardt on the 5 Levels of Healing",
} as const;

/**
 * The pyramid animation on /academy/five-levels (client, 2026-09-22),
 * replacing the static `5_levels.png` in `.levels`. Same hosting rationale
 * as above — uploaded the same way, same container and tenant prefix — but
 * this one autoplays, muted and looped, the moment it scrolls into view
 * (LoopingVideo), unlike FIVE_LEVELS_VIDEO's click-to-play SelfHostedVideo:
 * 8 seconds and 12.2 MB, there's nothing to preload="none" against.
 */
export const PYRAMID_VIDEO = {
  src: `${BLOB}/${TENANT}/five-levels-pyramid-animation.mp4`,
  poster: "/images/5_levels.png",
  title: "The 5 Levels of Healing, from base to apex: 1st Physical Body, 2nd Energy Body, 3rd Mental, 4th Intuitive, 5th Spiritual",
} as const;
