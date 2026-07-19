import { Link } from "react-router-dom";
import { Brand } from "@/components/Brand";

export function SubscriptionStatusPage({ success }: { success: boolean }) {
  return <main className="status-page">
    <Link to="/" aria-label="Dietrich Klinghardt home"><Brand /></Link>
    <section>
      <span className={success ? "status-icon success" : "status-icon error"}>{success ? "✓" : "!"}</span>
      <p className="eyebrow">Klinghardt Newsletter</p>
      <h1>{success ? "You’re subscribed." : "This link is no longer valid."}</h1>
      <p>{success ? "Thank you for confirming your email. You’ll now receive our latest events, research updates and webinar invitations." : "The confirmation link may have expired or already been used. You can return to the signup form and request a new one."}</p>
      <Link className="primary-button" to={success ? "/" : "/#newsletter"}>{success ? "Return home" : "Try again"}</Link>
    </section>
  </main>;
}
