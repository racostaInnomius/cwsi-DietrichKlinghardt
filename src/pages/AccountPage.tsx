import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { useAuth } from "@/features/auth/useAuth";
import { fetchAccountOverview, type AccountOverview } from "@/lib/account";
import { useCollection, text } from "@/lib/content";
import { openMembershipPortal } from "@/lib/membership";

function formatMoney(cents: number | null, currency: string | null): string | null {
  if (cents == null || !currency) return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function formatDate(value: string, includeTime = false): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(date);
}

function membershipLabel(status?: string): string {
  return {
    active: "Active",
    trialing: "Free trial",
    past_due: "Payment due",
    canceled: "Ended",
    incomplete: "Incomplete",
    incomplete_expired: "Expired",
    unpaid: "Payment required",
  }[status ?? ""] ?? "Not active";
}

type ActivityItem = {
  id: string;
  kind: "product" | "event" | "donation" | "booking";
  title: string;
  date: string;
  amount: string | null;
  status: string;
  note: string;
};

function accountActivity(overview: AccountOverview): ActivityItem[] {
  const purchases: ActivityItem[] = overview.purchases.map((purchase) => ({
    id: `purchase:${purchase.id}`,
    kind: purchase.kind,
    title: purchase.title,
    date: purchase.purchasedAt,
    amount: formatMoney(purchase.amountCents, purchase.currency),
    status: purchase.paymentStatus === "paid" ? "Paid" : "Payment failed",
    note:
      purchase.paymentStatus === "failed"
        ? "This checkout was not completed."
        : purchase.emailStatus === "sent"
          ? "Your confirmation and access details were sent by email."
          : purchase.emailStatus === "pending"
            ? "Payment received. Your confirmation email is being prepared."
            : "Payment received, but the access email needs attention. Please contact us.",
  }));
  const donations: ActivityItem[] = overview.donations.map((donation) => ({
    id: `donation:${donation.id}`,
    kind: "donation",
    title: donation.frequency === "monthly" ? "Monthly Foundation gift" : "Foundation donation",
    date: donation.createdAt,
    amount: formatMoney(donation.amountCents, donation.currency),
    status: donation.status === "succeeded" ? "Received" : donation.status,
    note:
      donation.frequency === "monthly"
        ? "This record reflects one monthly contribution payment."
        : "Thank you for supporting the Dr. Klinghardt Foundation.",
  }));
  const bookings: ActivityItem[] = overview.bookings.map((booking) => ({
    id: `booking:${booking.id}`,
    kind: "booking",
    title: booking.title,
    date: booking.createdAt,
    amount: formatMoney(booking.amountCents, booking.currency),
    status: booking.status === "confirmed" ? "Confirmed" : booking.status,
    note: `Scheduled for ${formatDate(booking.startsAt, true)}.`,
  }));
  return [...purchases, ...donations, ...bookings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function AccountPage() {
  const { status, me, signIn, signUp, signOut } = useAuth();
  const plans = useCollection("membership-plans");
  const [overview, setOverview] = useState<AccountOverview | null>(null);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      setOverview(null);
      setOverviewError(null);
      return;
    }
    let cancelled = false;
    setOverview(null);
    setOverviewError(null);
    fetchAccountOverview()
      .then((result) => {
        if (!cancelled) setOverview(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setOverviewError(err instanceof Error ? err.message : "We could not load your account.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [status, reloadKey]);

  const membership = overview?.membership;
  const planInterval = membership?.planKey === "annual" ? "year" : "month";
  const planTitle = text(
    plans.find((plan) => text(plan, "interval") === planInterval),
    "title",
    membership?.planKey === "annual" ? "Annual membership" : "Weekly Talks membership",
  );
  const activity = useMemo(() => (overview ? accountActivity(overview) : []), [overview]);

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
      <Seo
        title="My Account — Dr. Dietrich Klinghardt™"
        description="Manage your Dr. Klinghardt account, membership, purchases and access."
        path="/account"
        noindex
      />

      <AnimatedGradient variant="card" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Reveal>
            <p className="eyebrow">Dr. Klinghardt™</p>
            <h1>My Account</h1>
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap account-page">
        {status === "loading" ? (
          <p className="empty-note">Loading your account…</p>
        ) : status === "anonymous" ? (
          <Reveal className="account-card account-card--signin">
            <div className="account-card__header">
              <p className="eyebrow">Your space</p>
              <h2>Sign in</h2>
            </div>
            <div className="account-card__body">
              <p className="lead">
                Sign in to manage your membership, unlock the Archives and see purchases made
                with your account email.
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
          </Reveal>
        ) : me ? (
          <>
            <Reveal className="account-profile">
              <div className="account-profile__monogram" aria-hidden="true">
                {(me.user.fullName.trim()[0] || me.user.email[0] || "M").toUpperCase()}
              </div>
              <div>
                <p className="eyebrow">Welcome back</p>
                <h2>{me.user.fullName}</h2>
                <p>{me.user.email}</p>
              </div>
              <button type="button" className="btn btn-outline" onClick={() => void signOut()}>
                Sign out
              </button>
            </Reveal>

            {overviewError ? (
              <Reveal className="account-load-error">
                <h2>We couldn't load all of your account.</h2>
                <p>{overviewError}</p>
                <button type="button" className="btn btn-primary" onClick={() => setReloadKey((key) => key + 1)}>
                  Try again
                </button>
              </Reveal>
            ) : !overview ? (
              <p className="empty-note">Gathering your membership and purchase history…</p>
            ) : (
              <>
                <Reveal
                  className={`account-membership ${membership?.active ? "account-membership--active" : "account-membership--locked"}`}
                >
                  <div className="account-membership__copy">
                    <div className="account-membership__heading">
                      <p className="eyebrow">Weekly Talks membership</p>
                      <span className={`account-status account-status--${membership?.status ?? "none"}`}>
                        {membershipLabel(membership?.status)}
                      </span>
                    </div>
                    <h2>{membership?.active ? planTitle : "Weekly Talks & Archives"}</h2>

                    {membership?.active ? (
                      <p>
                        {membership.status === "trialing"
                          ? "Your trial includes the live Weekly Talks and the complete Archives."
                          : membership.status === "past_due"
                            ? "Your access remains open for now. Please update your payment method to keep it uninterrupted."
                            : membership.cancelAtPeriodEnd
                              ? "Your membership will not renew, but your access stays open through the end of this billing period."
                              : "Your membership includes every live Weekly Talk and the complete members-only Archives."}
                      </p>
                    ) : membership?.status === "incomplete" ? (
                      <p>Your membership checkout wasn't completed. Choose a plan to finish joining.</p>
                    ) : membership?.status === "canceled" || membership?.status === "incomplete_expired" ? (
                      <p>Your previous membership has ended. You can rejoin whenever you're ready.</p>
                    ) : membership?.status === "unpaid" ? (
                      <p>Your membership needs payment before member content can be unlocked.</p>
                    ) : (
                      <p>Join to watch the live weekly sessions and explore every recording in the Archives.</p>
                    )}

                    {membership?.currentPeriodEnd && membership.active ? (
                      <p className="account-membership__date">
                        {membership.cancelAtPeriodEnd ? "Access through" : membership.status === "trialing" ? "Trial ends" : "Renews"}{" "}
                        <strong>{formatDate(membership.currentPeriodEnd)}</strong>
                      </p>
                    ) : null}
                  </div>

                  <div className="account-membership__actions">
                    {membership?.active ? (
                      <>
                        <Link className="btn btn-primary" to="/archives">Open Archives</Link>
                        <Link className="btn btn-outline" to="/weekly-talks">Weekly Talks</Link>
                        <button
                          type="button"
                          className="account-text-action"
                          onClick={handleManageMembership}
                          disabled={openingPortal}
                        >
                          {openingPortal ? "Opening billing…" : "Manage billing & plan"}
                        </button>
                      </>
                    ) : (
                      <Link className="btn btn-primary" to="/weekly-talks">
                        {membership?.status ? "Rejoin the membership" : "Explore membership"}
                      </Link>
                    )}
                    {portalError ? <p className="account-inline-error">{portalError}</p> : null}
                  </div>
                </Reveal>

                <Reveal className="account-access-strip">
                  <div className={`account-access-icon ${membership?.active ? "is-unlocked" : ""}`} aria-hidden="true">
                    {membership?.active ? "✓" : "◇"}
                  </div>
                  <div>
                    <p className="eyebrow">Your library</p>
                    <h2>{membership?.active ? "Archives unlocked" : "Archives are members-only"}</h2>
                    <p>
                      {membership?.active
                        ? "Recordings, videos, PDFs, images and music are ready whenever you are."
                        : "Your account is ready; an active Weekly Talks membership is the final key."}
                    </p>
                  </div>
                  <Link className="btn btn-outline" to={membership?.active ? "/archives" : "/weekly-talks"}>
                    {membership?.active ? "Browse the library" : "See membership"}
                  </Link>
                </Reveal>

                <Reveal className="account-history">
                  <div className="account-history__heading">
                    <div>
                      <p className="eyebrow">Purchase history</p>
                      <h2>Your orders, events & giving</h2>
                    </div>
                    {activity.length ? <span>{activity.length} {activity.length === 1 ? "record" : "records"}</span> : null}
                  </div>

                  {activity.length ? (
                    <ol className="account-activity">
                      {activity.map((item) => (
                        <li key={item.id} className="account-activity__item">
                          <div className={`account-activity__mark account-activity__mark--${item.kind}`} aria-hidden="true">
                            {{ product: "P", event: "E", donation: "G", booking: "A" }[item.kind]}
                          </div>
                          <div className="account-activity__main">
                            <div className="account-activity__title-row">
                              <div>
                                <span className="account-activity__kind">
                                  {{ product: "Store purchase", event: "Event or course", donation: "Giving", booking: "Appointment" }[item.kind]}
                                </span>
                                <h3>{item.title}</h3>
                              </div>
                              {item.amount ? <strong>{item.amount}</strong> : null}
                            </div>
                            <div className="account-activity__meta">
                              <span>{formatDate(item.date)}</span>
                              <span>{item.status}</span>
                            </div>
                            <p>{item.note}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="account-history__empty">
                      <h3>No purchases yet</h3>
                      <p>
                        Purchases made with <strong>{me.user.email}</strong> will appear here automatically.
                        Donations appear when you give while signed in.
                      </p>
                      <div className="account-card__actions">
                        <Link className="btn btn-primary" to="/store">Explore the store</Link>
                        <Link className="btn btn-outline" to="/events">View events</Link>
                      </div>
                    </div>
                  )}
                </Reveal>
              </>
            )}
          </>
        ) : null}
      </section>
    </>
  );
}
