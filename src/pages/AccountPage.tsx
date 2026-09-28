import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { useAuth } from "@/features/auth/useAuth";
import { fetchMembershipStatus, openMembershipPortal, type MembershipStatus } from "@/lib/membership";

/**
 * Account entry point, reached from the header's account icon.
 *
 * Sign-in itself has no form on this site — it hands off to Safecertus (the
 * shared Beytrax IDP) and comes back through /auth/return. Membership status
 * (Phase 6, full) is its own card below identity: a member sees their
 * renewal date and a "Manage membership" button (Stripe's own Billing
 * Portal, opened via a fresh redirect — never embedded), a signed-in
 * non-member sees a prompt to join instead.
 */
export function AccountPage() {
  const { status, me, signIn, signUp, signOut } = useAuth();
  const [membership, setMembership] = useState<MembershipStatus | null>(null);
  const [membershipError, setMembershipError] = useState<string | null>(null);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [openingPortal, setOpeningPortal] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    fetchMembershipStatus()
      .then((result) => {
        if (!cancelled) setMembership(result);
      })
      .catch((err) => {
        if (!cancelled) setMembershipError(err instanceof Error ? err.message : "We could not load your membership.");
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  const handleManageMembership = () => {
    setPortalError(null);
    setOpeningPortal(true);
    openMembershipPortal().catch((err) => {
      setOpeningPortal(false);
      setPortalError(err instanceof Error ? err.message : "We could not open the membership portal.");
    });
  };

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

        {status === "authenticated" ? (
          <Reveal className="account-card account-card--membership">
            <div className="account-card__header">
              <h2>Membership</h2>
            </div>
            <div className="account-card__body">
              {membershipError ? (
                <p className="lead">{membershipError}</p>
              ) : !membership ? (
                <p className="lead">Loading your membership…</p>
              ) : membership.active ? (
                <>
                  <dl className="account-card__details">
                    <div>
                      <dt>Status</dt>
                      <dd>{membership.status === "past_due" ? "Past due" : "Active"}</dd>
                    </div>
                    {membership.currentPeriodEnd ? (
                      <div>
                        <dt>{membership.cancelAtPeriodEnd ? "Ends on" : "Renews on"}</dt>
                        <dd>
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(new Date(membership.currentPeriodEnd))}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  {portalError ? <p className="lead">{portalError}</p> : null}
                  <div className="account-card__actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleManageMembership}
                      disabled={openingPortal}
                    >
                      {openingPortal ? "Opening…" : "Manage membership"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="lead">
                    You don't have an active membership yet. Join to unlock the Weekly Talks and
                    the Archives.
                  </p>
                  <div className="account-card__actions">
                    <Link className="btn btn-primary" to="/weekly-talks">
                      Become a member
                    </Link>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        ) : null}
      </section>
    </>
  );
}
