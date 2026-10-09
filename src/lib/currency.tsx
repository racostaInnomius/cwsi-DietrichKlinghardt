import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { env } from "@/lib/env";
import { money } from "@/lib/format";

/**
 * Visitor-selected display currency (MXN / USD / EUR).
 *
 * DISPLAY ONLY. Prices are stored and charged in the currency set in the CMS
 * (USD today); a converted amount is an estimate from the Beytrax API's
 * `/api/public/fx-rates` (Stripe's exchange rate, ECB fallback). At checkout
 * Stripe charges the original price, offering the buyer's local currency via
 * Adaptive Pricing — so converted amounts are always prefixed with "≈".
 *
 * Prerendered HTML and the first client render always show the original
 * currency (no stored choice, no rates yet), so hydration matches; the
 * visitor's currency kicks in right after mount.
 */

export const CURRENCIES = ["usd", "mxn", "eur"] as const;
export type Currency = (typeof CURRENCIES)[number];

const STORAGE_KEY = "dkk-display-currency";

const EURO_REGIONS = new Set([
  "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT",
  "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK",
]);

function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && (CURRENCIES as readonly string[]).includes(value);
}

/**
 * First-visit guess: browser locale region (es-MX → MXN, de-DE → EUR), then
 * the timezone (Mexico's zones → MXN, Europe/* → EUR). Anything else keeps
 * the price's own currency (null).
 */
export function guessCurrency(
  languages: readonly string[],
  timeZone: string | undefined,
): Currency | null {
  for (const tag of languages) {
    const region = tag.split(/[-_]/)[1]?.toUpperCase();
    if (!region) continue;
    if (region === "MX") return "mxn";
    if (EURO_REGIONS.has(region)) return "eur";
    if (region === "US") return "usd";
  }
  if (timeZone) {
    if (/^America\/(Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ciudad_Juarez|Ojinaga|Mazatlan|Bahia_Banderas|Hermosillo|Tijuana)$/.test(timeZone)) {
      return "mxn";
    }
    if (timeZone.startsWith("Europe/") && !/^Europe\/(London|Dublin|Lisbon|Zurich|Oslo|Stockholm|Copenhagen|Warsaw|Prague|Budapest|Bucharest|Sofia|Istanbul|Moscow|Kiev|Kyiv|Minsk)$/.test(timeZone)) {
      return "eur";
    }
  }
  return null;
}

type Rates = Record<Currency, number>;

interface CurrencyContextValue {
  /** null = show every price in its own currency. */
  selected: Currency | null;
  select: (currency: Currency) => void;
  /** Converts minor units; null when no conversion applies (yet). */
  convert: (cents: number, from: string) => { cents: number; currency: Currency } | null;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  selected: null,
  select: () => {},
  convert: () => null,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Currency | null>(null);
  const [rates, setRates] = useState<Partial<Record<Currency, Rates>>>({});
  const requested = useRef(new Set<Currency>());

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private mode / blocked storage: fall through to the guess.
    }
    const initial = isCurrency(stored)
      ? stored
      : guessCurrency(
          navigator.languages ?? [navigator.language],
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        );
    if (initial) setSelected(initial);
  }, []);

  const select = useCallback((currency: Currency) => {
    setSelected(currency);
    try {
      window.localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      // Choice still applies for this visit.
    }
  }, []);

  const loadRates = useCallback((base: Currency) => {
    if (requested.current.has(base)) return;
    requested.current.add(base);
    fetch(`${env.API_URL}/api/public/fx-rates?base=${base}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { data?: { rates?: Rates } } | null) => {
        const next = json?.data?.rates;
        if (next) setRates((prev) => ({ ...prev, [base]: next }));
        else requested.current.delete(base);
      })
      .catch(() => requested.current.delete(base));
  }, []);

  const convert = useCallback<CurrencyContextValue["convert"]>(
    (cents, from) => {
      const base = from.toLowerCase();
      if (!selected || !isCurrency(base) || base === selected) return null;
      const table = rates[base];
      if (!table) {
        loadRates(base);
        return null;
      }
      const rate = table[selected];
      if (!rate) return null;
      return { cents: Math.round(cents * rate), currency: selected };
    },
    [selected, rates, loadRates],
  );

  const value = useMemo(() => ({ selected, select, convert }), [selected, select, convert]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

/** Converted amounts are estimates: whole units only, never false precision. */
function approxMoney(cents: number, currency: Currency): string {
  return `≈ ${money(Math.round(cents / 100) * 100, currency)}`;
}

/**
 * A price in the visitor's display currency. Shows the original amount until
 * a conversion is available, and keeps it in the tooltip afterwards.
 */
export function Price({ cents, currency = "usd" }: { cents: number; currency?: string }) {
  const { convert } = useCurrency();
  const original = money(cents, currency);
  const converted = convert(cents, currency);
  if (!converted) return <>{original}</>;
  return (
    <span className="price-approx" title={`Charged in ${currency.toUpperCase()}: ${original}`}>
      {approxMoney(converted.cents, converted.currency)}
    </span>
  );
}

/**
 * Short note for places where the visitor is about to pay. Renders nothing
 * while prices show in their own currency.
 */
export function CurrencyNote({ currency = "usd", className }: { currency?: string; className?: string }) {
  const { selected } = useCurrency();
  if (!selected || selected === currency.toLowerCase()) return null;
  return (
    <p className={className ?? "currency-note"}>
      Amounts in {selected.toUpperCase()} are approximate. You’re charged in{" "}
      {currency.toUpperCase()}; at checkout you can also pay in your local currency.
    </p>
  );
}
