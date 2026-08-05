import { useState } from "react";

export type PublicMusicEmbed = {
  title: string;
  artist?: string;
  caption?: string;
  kind: "track" | "playlist";
  embedUrl: string;
};

export function MusicPlayer({
  music,
  standalone = false,
}: {
  music: PublicMusicEmbed;
  standalone?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <section
      className={`music-player${standalone ? " music-player--standalone" : ""}`}
      aria-labelledby={`music-${standalone ? "standalone" : "inline"}-title`}
    >
      <p className="eyebrow">Listen on SoundCloud</p>
      <h2 id={`music-${standalone ? "standalone" : "inline"}-title`}>
        {music.title}
      </h2>
      {music.artist && <p className="music-artist">{music.artist}</p>}
      <div className={`soundcloud-frame soundcloud-frame--${music.kind}`}>
        {loaded ? (
          <iframe
            title={`${music.title} on SoundCloud`}
            src={music.embedUrl}
            loading="lazy"
            allow="autoplay"
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <div className="soundcloud-consent">
            <div className="soundcloud-consent__content">
              <p>The SoundCloud player loads content from a third party.</p>
              <button type="button" onClick={() => setLoaded(true)}>
                Load SoundCloud player
              </button>
            </div>
          </div>
        )}
      </div>
      {music.caption && <p className="music-caption">{music.caption}</p>}
    </section>
  );
}
