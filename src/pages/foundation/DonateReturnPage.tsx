import { useCallback, useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Link, useSearchParams } from "react-router-dom";
import { getStripe } from "@/lib/donations";
import { money } from "@/lib/format";
import { AnimatedGradient } from "@/components/motion/AnimatedGradient";
import { Reveal } from "@/components/motion/Reveal";

type Status = "loading" | "succeeded" | "processing" | "failed" | "error";

/**
 * Where Stripe sends the donor after confirming.
 *
 * Stripe appends `payment_intent_client_secret` and `redirect_status`; the
 * amount and frequency come from the params the donate page put on the return
 * URL. The PaymentIntent is retrieved rather than trusting `redirect_status`,
 * because that hint is a URL parameter and a URL parameter is not evidence
 * that money moved.
 *
 * Bank redirects can land here while the charge is still pending, so a
 * `processing` intent is polled rather than reported either way.
 */
export function DonateReturnPage() {
  const [params] = useSearchParams();
  const clientSecret = params.get("payment_intent_client_secret");
  const amount = Number(params.get("amount")) || 0;
  const frequency = params.get("frequency") === "monthly" ? "monthly" : "one-time";

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  const retrieve = useCallback(async () => {
    if (!clientSecret) {
      setStatus("error");
      setMessage("This link is missing its payment reference.");
      return;
    }
    const stripe = await getStripe();
    if (!stripe) {
      setStatus("error");
      setMessage("The payment library could not be loaded.");
      return;
    }

    const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret);
    if (error || !paymentIntent) {
      setStatus("error");
      setMessage(error?.message ?? "We could not read the donation status.");
      return;
    }

    switch (paymentIntent.status) {
      case "succeeded":
        setStatus("succeeded");
        break;
      case "processing":
        setStatus("processing");
        break;
      case "requires_payment_method":
        setStatus("failed");
        setMessage("The payment was not completed. No money has been taken.");
        break;
      default:
        setStatus("failed");
        setMessage(`The donation ended in an unexpected state (${paymentIntent.status}).`);
    }
  }, [clientSecret]);

  useEffect(() => {
    void retrieve();
  }, [retrieve]);

  // Bank-redirect methods settle asynchronously; check back rather than
  // leaving the donor on a screen that never resolves.
  useEffect(() => {
    if (status !== "processing") return;
    const id = window.setTimeout(() => void retrieve(), 3000);
    return () => window.clearTimeout(id);
  }, [status, retrieve]);

  const copy = {
    loading: { title: "Checking your donation…", body: "" },
    processing: {
      title: "Your donation is processing.",
      body: "Your bank is still confirming the payment. You can close this page — the receipt will reach you by email either way.",
    },
    succeeded: {
      title: "Thank you.",
      body: amount
        ? `Your ${frequency === "monthly" ? "monthly " : ""}gift of ${money(amount * 100)} supports the archive, the scholarships and the research. A receipt is on its way to your inbox.`
        : "Your gift supports the archive, the scholarships and the research. A receipt is on its way to your inbox.",
    },
    failed: { title: "The donation did not go through.", body: message },
    error: { title: "We could not confirm the donation.", body: message },
  }[status];

  return (
    <>
      <Seo
        title={"Thank you — Dr. Klinghardt Foundation™"}
        noindex
      />

      <AnimatedGradient variant="page" intensity="soft" className="status-page">
        <div className="wrap status-page__inner">
          <Reveal>
            <span
              className={`status-icon ${status === "succeeded" ? "success" : status === "failed" || status === "error" ? "error" : ""}`}
              aria-hidden="true"
            >
              {status === "succeeded" ? "✓" : status === "loading" || status === "processing" ? "…" : "!"}
            </span>
            <p className="eyebrow">Klinghardt Foundation™</p>
            <h1>{copy.title}</h1>
            {copy.body ? <p className="lead">{copy.body}</p> : null}

            <div className="status-page__actions">
              {status === "failed" ? (
                <Link className="btn btn-primary" to="/foundation/donate">
                  Try again
                </Link>
              ) : null}
              <Link
                className={status === "failed" ? "btn btn-outline" : "btn btn-primary"}
                to="/foundation"
              >
                Back to the Foundation
              </Link>
            </div>
          </Reveal>
        </div>
      </AnimatedGradient>
    </>
  );
}
