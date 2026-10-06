import Link from "next/link";
import { STATE_NAMES } from "@/lib/data/commission-rates";
import type { AustralianState } from "@/lib/utils/stamp-duty";
import {
  HTB_INCOME_LIMITS,
  HTB_MIN_DEPOSIT_PCT,
  HTB_PRICE_CAPS,
  HTB_SHARE,
  HTB_YEAR,
  STATE_CAPITALS,
} from "@/lib/data/help-to-buy";

/** States with their own Help to Buy page; the rest link to the national guide's price caps. */
const STATE_PAGE: Partial<Record<AustralianState, string>> = {
  QLD: "/guides/help-to-buy-scheme-qld",
  NSW: "/guides/help-to-buy-scheme-nsw",
  VIC: "/guides/help-to-buy-scheme-victoria",
  WA: "/guides/help-to-buy-scheme-wa",
};

const fmt = (n: number) => `$${n.toLocaleString("en-AU")}`;

/**
 * The Help to Buy summary the first home buyer guides print, from
 * src/lib/data/help-to-buy.ts, so the income limits and price caps on every
 * guide change in one place each 1 July. Without a state it prints the
 * national summary.
 */
export function HelpToBuyNote({ state, as = "li" }: { state?: AustralianState; as?: "li" | "p" }) {
  const Tag = as;
  const caps = state ? HTB_PRICE_CAPS[state] : null;
  const capital = state ? `${STATE_CAPITALS[state]}${caps?.regionalCentres.length ? ` and ${caps.regionalCentres.join(", ")}` : ""}` : "";
  const href = (state && STATE_PAGE[state]) ?? "/guides/help-to-buy-scheme-australia";
  const label = state && STATE_PAGE[state] ? `Help to Buy in ${STATE_NAMES[state].replace(/^the /, "")}` : "Help to Buy guide";
  return (
    <Tag>
      <strong>Help to Buy (shared equity):</strong> the government contributes up to {HTB_SHARE.new.max}% of a new home
      or {HTB_SHARE.existing.max}% of an existing one, with a {HTB_MIN_DEPOSIT_PCT}% minimum deposit and no LMI. For{" "}
      {HTB_YEAR} the income limits are {fmt(HTB_INCOME_LIMITS.single)} (single) and {fmt(HTB_INCOME_LIMITS.joint)} (joint or
      single parent).
      {caps && (
        <>
          {" "}
          The price cap is {fmt(caps.capital)} in {capital}
          {caps.rest !== null && caps.rest !== caps.capital ? <> and {fmt(caps.rest)} elsewhere in the state</> : null}.
        </>
      )}{" "}
      It can&rsquo;t be combined with the 5% Deposit Scheme. See <Link href={href}>{label}</Link>.
    </Tag>
  );
}
