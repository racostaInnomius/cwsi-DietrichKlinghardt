import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { exchangeAuthCode } from "@/lib/auth";
import { setTokens } from "@/features/auth/tokenStore";
import { useAuth } from "@/features/auth/useAuth";

/**
 * Landing page for the sign-in/sign-up OAuth hop.
 *
 * api.beytrax.com/auth/callback redirects here with `?exchange_code=...&next=...`
 * after Safecertus authenticates the visitor. We swap the one-time code for a
 * real access+refresh pair, hand it to the token store, then move on to
 * `next` (default /account). The code is single-use server-side and gets
 * stripped from the URL immediately, so a stale bookmark or a shared screen
 * can't replay it.
 */
export function AuthReturnPage() {
  const [params] = useSearchParams();
  const { refresh: refreshAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = params.get("exchange_code");
    const nextUrl = params.get("next") || "/account";

    if (!code) {
      window.location.replace("/account");
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const result = await exchangeAuthCode(code);
        if (cancelled) return;
        setTokens(result);

        try {
          window.history.replaceState(null, "", "/auth/return");
        } catch {
          /* non-blocking */
        }

        await refreshAuth();
        window.location.replace(safeNextPath(nextUrl));
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "We could not complete sign-in. Please try again.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Seo title="Signing you in — Dr. Klinghardt™" noindex />
      <AnimatedGradient variant="plain" intensity="soft" className="status-page">
        <div className="wrap status-page__inner">
          <Reveal>
            <span className={`status-icon ${error ? "error" : ""}`} aria-hidden="true">
              {error ? "!" : "…"}
            </span>
            <p className="eyebrow">Dr. Klinghardt™</p>
            <h1>{error ? "We could not complete your sign-in" : "Signing you in…"}</h1>
            {error ? <p className="lead">{error}</p> : null}
            {error ? (
              <div className="status-page__actions">
                <Link className="btn btn-primary" to="/account">
                  Try again
                </Link>
              </div>
            ) : null}
          </Reveal>
        </div>
      </AnimatedGradient>
    </>
  );
}

/** Same-site paths only — never lets a crafted `?next=` bounce off-domain. */
function safeNextPath(value: string): string {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    if (url.origin === window.location.origin) return url.pathname + url.search + url.hash;
  } catch {
    /* not a parseable URL — fall through */
  }
  return "/account";
}
