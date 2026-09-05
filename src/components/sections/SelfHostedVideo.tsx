/**
 * A film we host ourselves, as opposed to `VideoPlayer`, which frames a
 * third party's iframe and therefore has to ask for consent first.
 *
 * Nothing to consent to here: the file sits in the same Azure Blob container as
 * the rest of this tenant's media, so playing it contacts no one new. That also
 * means the browser's own controls are enough — no bespoke player, no script.
 *
 * `preload="none"` matters: this is a 123 MB file and most visitors will scroll
 * past it. The poster is what they see until they press play, and nothing but
 * the poster is fetched until they do.
 */
export function SelfHostedVideo({
  src,
  poster,
  title,
  caption,
  className = "",
}: {
  src: string;
  poster: string;
  title: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure
      className={`video-frame video-frame--self${className ? ` ${className}` : ""}`}
    >
      {/* The box is the WRAPPER's, not the video's.
          A <video> is a replaced element: with no width of its own it falls
          back to its intrinsic size — 300×150 until the metadata arrives, and
          `preload="none"` means that is not until someone presses play. Putting
          the aspect ratio on the video therefore only shrank it to 300×169, and
          it jumped to full size mid-playback. The wrapper reserves the space
          from first paint and the video simply fills it. */}
      <div className="video-frame__media">
        <video
          controls
          preload="none"
          poster={poster}
          playsInline
          title={title}
          width={1920}
          height={1080}
        >
          <source src={src} type="video/mp4" />
          Your browser cannot play this video.{" "}
          <a href={src}>Download it instead</a>.
        </video>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
