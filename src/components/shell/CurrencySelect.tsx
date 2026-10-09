import { CURRENCIES, useCurrency, type Currency } from "@/lib/currency";

/**
 * Display-currency switch in the nav (MXN / USD / EUR). Only changes how
 * prices READ — see lib/currency.tsx; the charge stays in the CMS currency.
 * Until the visitor's currency is known (prerender, first paint) it shows USD,
 * the currency every price is set in today.
 */
export function CurrencySelect() {
  const { selected, select } = useCurrency();

  return (
    <label className="currency-select" title="Display prices in">
      <span className="sr-only">Currency</span>
      <select
        value={selected ?? "usd"}
        onChange={(event) => select(event.target.value as Currency)}
      >
        {CURRENCIES.map((code) => (
          <option key={code} value={code}>
            {code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
