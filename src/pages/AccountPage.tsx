import { Seo } from "@/components/Seo";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { useAuth } from "@/features/auth/useAuth";

/**
 * Minimal account entry point, reached from the header's account icon.
 *
 * Sign-in itself has no form on this site — it hands off to Safecertus (the
 * shared Beytrax IDP) and comes back through /auth/return. Once membership
 * plans and the Stripe customer portal are wired up (see the membership
 * architecture doc), this page grows a "your membership" section; today it
 * only proves identity, since that's what a member-only Weekly Talk checks.
 */
export function AccountPage() {
  const { status, me, signIn, signUp, signOut } = useAuth();

  return (
    <>
      <Seo title="My Account — Dr. Klinghardt™" noindex />

      <AnimatedGradient variant="card" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Dr. Klinghardt™</p>
            <h1>My Account</h1>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap">
        <Reveal className="account-card">
          {status === "loading" ? (
            <p className="account-card__loading">Loading your account…</p>
          ) : null}

          {status === "anonymous" ? (
            <>
              <div className="account-card__header">
                <h2>Sign in</h2>
              </div>
              <div className="account-card__body">
                <p className="lead">
                  Sign in to manage your account and access member-only content, like the
                  Weekly Talks membership.
                </p>
                <div className="account-card__actions">
                  <button type="button" className="btn btn-primary" onClick={() => signIn()}>
                    Sign In
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => signUp()}>
                    Create an account
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {status === "authenticated" && me ? (
            <>
              <div className="account-card__header">
                <h2>Hi {me.user.fullName.split(" ")[0] || me.user.fullName},</h2>
              </div>
              <div className="account-card__body">
                <dl className="account-card__details">
                  <div>
                    <dt>Name</dt>
                    <dd>{me.user.fullName}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{me.user.email}</dd>
                  </div>
                </dl>
                <div className="account-card__actions">
                  <button type="button" className="btn btn-outline" onClick={() => void signOut()}>
                    Sign out
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </Reveal>
      </section>
    </>
  );
}
