import { useMemo, useState, type FormEvent } from "react";
import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import {
  PRESET_AMOUNTS,
  createDonationIntent,
  getStripe,
  useDonationContext,
  type SiteContext,
} from "@/lib/donations";
import { useSection } from "@/lib/sections";
import { money } from "@/lib/format";
import { env } from "@/lib/env";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";
import { Marked } from "@/components/Marked";
import { Breadcrumbs } from "@/components/shell/Breadcrumbs";

type Frequency = "one-time" | "monthly";

/**
 * Support the Foundation.
 *
 * The whole page hinges on one question, answered at runtime: can the
 * Foundation actually accept a charge? Its Stripe onboarding state is not
 * known at build time and changes without a rebuild, so a statically baked
 * answer would eventually be wrong. Until the account is live the page says
 * so plainly rather than showing a form that would fail at the last step.
 */
export function DonatePage() {
  const page = useSection("donate", {
    title: "Support the Foundation",
    paragraphs: [
      "Every contribution goes to preserving the archive, funding scholarships, and keeping this body of work available to the practitioners who come next.",
    ],
  });
  const { status, context } = useDonationContext();

  return (
    <>
      <Head>
        <title>Support the Dr. Klinghardt Foundation™</title>
        <meta
          name="description"
          content="Support the archive, the scholarships and the research of the Dr. Klinghardt Foundation."
        />
        <link rel="canonical" href={`${env.SITE_URL}/foundation/donate`} />
      </Head>

      <AnimatedGradient variant="page" intensity="soft" className="page-hero">
        <div className="wrap page-hero__inner">
          <Breadcrumbs
            items={[{ label: "Foundation", href: "/foundation" }, { label: "Support" }]}
          />
          <Reveal>
            <p className="eyebrow">Klinghardt Foundation™</p>
            <h1><Marked text={page.title} /></h1>
            {page.lead ? <p className="lead">{page.lead}</p> : null}
          </Reveal>
        </div>
      </AnimatedGradient>

      <section className="section wrap two-col">
        <Reveal className="prose">
          <h2>Where a contribution goes</h2>
          <p>
            The Foundation preserves decades of clinical observation, lectures,
            protocols and educational material, and makes them available to
            practitioners, researchers and students who would otherwise have no
            route to them.
          </p>
          <p>
            Contributions fund the archive itself, scholarships for practitioners
            in training, and research into questions raised by the clinical work.
          </p>
          <p className="donate-note">
            Donations are processed by Stripe. Card details never reach this site
            or the Foundation.
          </p>
        </Reveal>

        <Reveal as="aside" className="donate-panel" delay={120}>
          {status === "loading" ? (
            <p className="donate-panel__note">Checking donation availability…</p>
          ) : status === "ready" && context ? (
            <DonationForm context={context} />
          ) : (
            <ClosedNotice />
          )}
        </Reveal>
      </section>
    </>
  );
}

/**
 * Shown whenever the Foundation cannot take a charge — no Stripe account yet,
 * onboarding incomplete, or the API unreachable. Deliberately does not
 * distinguish between them: to a donor they are the same fact.
 */
function ClosedNotice() {
  return (
    <>
      <p className="eyebrow">Not open yet</p>
      <h2>Donations open soon</h2>
      <p className="donate-panel__note">
        The Foundation is still being established and cannot accept
        contributions yet. If you would like to support it, write to us and we
        will come back to you as soon as it can.
      </p>
      <Link className="btn btn-primary donate-panel__cta" to="/contact">
        Get in touch
      </Link>
    </>
  );
}

function DonationForm({ context }: { context: SiteContext }) {
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [amount, setAmount] = useState<number>(100);
  const stripePromise = useMemo(() => getStripe(), []);

  const options: StripeElementsOptions = useMemo(
    () => ({
      mode: frequency === "monthly" ? "subscription" : "payment",
      amount: Math.max(amount, 1) * 100,
      currency: "usd",
      // Merchant of record: the Foundation's name on the donor's statement.
      // This MUST match the `on_behalf_of` the API puts on the PaymentIntent
      // or Stripe rejects the confirmation.
      ...(context.connectedAccountId
        ? { onBehalfOf: context.connectedAccountId }
        : {}),
      appearance: {
        theme: "flat",
        variables: {
          colorPrimary: "#023866",
          colorBackground: "#ffffff",
          colorText: "#1c1916",
          fontFamily: '"DM Sans", system-ui, sans-serif',
          borderRadius: "6px",
        },
      },
    }),
    [frequency, amount, context.connectedAccountId],
  );

  return (
    // Elements' mode is fixed at creation, so switching frequency remounts it.
    <Elements key={frequency} stripe={stripePromise} options={options}>
      <FormFields
        context={context}
        frequency={frequency}
        setFrequency={setFrequency}
        amount={amount}
        setAmount={setAmount}
      />
    </Elements>
  );
}

function FormFields({
  context,
  frequency,
  setFrequency,
  amount,
  setAmount,
}: {
  context: SiteContext;
  frequency: Frequency;
  setFrequency: (value: Frequency) => void;
  amount: number;
  setAmount: (value: number) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements || busy) return;

    setBusy(true);
    setError(null);

    const ready = await elements.submit();
    if (ready.error) {
      setError(ready.error.message ?? "Please check the payment details.");
      setBusy(false);
      return;
    }

    let clientSecret: string;
    try {
      const intent = await createDonationIntent({
        tenantId: context.tenantId,
        siteId: context.siteId,
        amount,
        frequency,
        name: name.trim(),
        email: email.trim(),
      });
      clientSecret = intent.clientSecret;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the donation.");
      setBusy(false);
      return;
    }

    // Amount and frequency ride along on the return URL so the receipt can be
    // shown without a second round-trip for the PaymentIntent's metadata.
    const returnUrl = new URL("/foundation/donate/return", window.location.origin);
    returnUrl.searchParams.set("frequency", frequency);
    returnUrl.searchParams.set("amount", String(amount));

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: returnUrl.toString(),
        payment_method_data: {
          billing_details: { name: name.trim(), email: email.trim() },
        },
      },
    });

    // Reached only when the payment failed before redirecting.
    if (confirmError) {
      setError(confirmError.message ?? "The payment could not be completed.");
      setBusy(false);
    }
  }

  return (
    <form className="donate-form" onSubmit={submit}>
      <div className="donate-freq" role="group" aria-label="Donation frequency">
        {(["one-time", "monthly"] as const).map((option) => (
          <button
            key={option}
            type="button"
            className="donate-freq__option"
            aria-pressed={frequency === option}
            onClick={() => setFrequency(option)}
          >
            {option === "one-time" ? "One time" : "Monthly"}
          </button>
        ))}
      </div>

      <p className="donate-form__label">Amount</p>
      <div className="donate-amounts">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            type="button"
            className="donate-amount"
            aria-pressed={amount === preset}
            onClick={() => setAmount(preset)}
          >
            {money(preset * 100)}
          </button>
        ))}
        <label className="donate-amount donate-amount--custom">
          <span className="sr-only">Other amount in US dollars</span>
          <span aria-hidden="true">$</span>
          <input
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(event) => setAmount(Math.max(1, Number(event.target.value) || 0))}
          />
        </label>
      </div>

      <label className="donate-field">
        <span>Your name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
        />
      </label>
      <label className="donate-field">
        <span>Email for the receipt</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <div className="donate-payment">
        <PaymentElement />
      </div>

      {error ? <p className="donate-error">{error}</p> : null}

      <button className="btn btn-primary donate-panel__cta" disabled={!stripe || busy}>
        {busy
          ? "Processing…"
          : frequency === "monthly"
            ? `Give ${money(amount * 100)} monthly`
            : `Give ${money(amount * 100)}`}
      </button>
    </form>
  );
}
