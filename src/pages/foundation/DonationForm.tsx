import { useMemo, useState, type FormEvent } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { PRESET_AMOUNTS, createDonationIntent, getStripe, type SiteContext } from "@/lib/donations";
import { money } from "@/lib/format";

type Frequency = "one-time" | "monthly";

/**
 * The donation form, in its own module so Stripe Elements is a separate chunk.
 * It is only ever needed once the Foundation can actually accept a charge, so
 * no other page should pay for the SDK.
 */
export default function DonationForm({ context }: { context: SiteContext }) {
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
