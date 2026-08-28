import { useState } from "react";
import type { VideoEmbed } from "@/lib/cms";

/**
 * Consent-gated video frame, matching how the SoundCloud player behaves: the
 * third-party iframe is only created once the visitor asks for it, so no
 * request leaves for YouTube or Vimeo on page load.
 */
export function VideoPlayer({ video }: { video: VideoEmbed }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className="video-frame" data-ratio={video.aspectRatio}>
      <div className="video-frame__media">
        {loaded ? (
          <iframe
            title={video.title}
            src={video.embedUrl}
            loading="lazy"
            allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="video-frame__consent"
            onClick={() => setLoaded(true)}
          >
            <span className="video-frame__play" aria-hidden="true">
              ▶
            </span>
            <span>
              Play “{video.title}”
              <small>Loads the player from a third party.</small>
            </span>
          </button>
        )}
      </div>
      {video.caption ? <figcaption>{video.caption}</figcaption> : null}
    </figure>
  );
}
