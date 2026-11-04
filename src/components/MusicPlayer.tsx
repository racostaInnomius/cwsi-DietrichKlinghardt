export type PublicMusicEmbed = {
  title: string;
  artist?: string;
  caption?: string;
  kind: "track" | "playlist";
  embedUrl: string;
};

/**
 * The SoundCloud player.
 *
 * It used to sit behind a "Load SoundCloud player" button, so the frame — and
 * the third-party cookies that come with it — only loaded once the visitor
 * asked for it. The client's call (2026-11-04): the player is the point of the
 * page, and a visitor should not have to click to reach it, so it loads with
 * the page. `loading="lazy"` still holds it back until it is near the
 * viewport, and the sandbox and referrer policy are unchanged.
 */
export function MusicPlayer({
  music,
  standalone = false,
}: {
  music: PublicMusicEmbed;
  standalone?: boolean;
}) {
  return (
    <section
      className={`music-player${standalone ? " music-player--standalone" : ""}`}
      aria-labelledby={`music-${standalone ? "standalone" : "inline"}-title`}
    >
      <p className="eyebrow">Listen our music</p>
      <h2 id={`music-${standalone ? "standalone" : "inline"}-title`}>
        {music.title}
      </h2>
      {music.artist && <p className="music-artist">{music.artist}</p>}
      <div className={`soundcloud-frame soundcloud-frame--${music.kind}`}>
        <iframe
          title={`${music.title} on SoundCloud`}
          src={music.embedUrl}
          loading="lazy"
          allow="autoplay"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
      {music.caption && <p className="music-caption">{music.caption}</p>}
    </section>
  );
}
