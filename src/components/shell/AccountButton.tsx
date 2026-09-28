import { Link } from "react-router-dom";
import { AccountIcon } from "@/components/Icons";
import { useAuth } from "@/features/auth/useAuth";

/**
 * Account entry point in the nav — same visual slot and treatment as
 * CartButton, next to it. Always links to /account: a signed-out visitor
 * sees the sign-in prompt there, a signed-in one sees their account. Nothing
 * here blocks on `status === "loading"` — the icon itself doesn't change
 * shape while auth resolves, only the destination page's content does.
 */
export function AccountButton() {
  const { status } = useAuth();

  return (
    <Link
      className="account-button"
      to="/account"
      aria-label={status === "authenticated" ? "Your account" : "Sign in"}
    >
      <AccountIcon />
    </Link>
  );
}
