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
}: {
  src: string;
  poster: string;
  title: string;
  caption?: string;
}) {
  return (
    <figure className="video-frame video-frame--self">
      <video
        className="video-frame__media"
        controls
        preload="none"
        poster={poster}
        playsInline
        title={title}
      >
        <source src={src} type="video/mp4" />
        Your browser cannot play this video.{" "}
        <a href={src}>Download it instead</a>.
      </video>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
