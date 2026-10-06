import Link from "next/link";
import { ScrollTable } from "@/components/guide/ScrollTable";
import { formatDate } from "@/lib/utils/format";
import { AUSTRALIAN_STATES, type AustralianState } from "@/lib/utils/stamp-duty";
import {
  HG_CAPITAL_AREAS,
  HG_CHECKED_ON,
  HG_DATES,
  HG_MIN_DEPOSIT_PCT,
  HG_NT_CAP_BEFORE_SPLIT,
  HG_OTHER_TERRITORY_CAPS,
  HG_PRICE_CAPS,
  HG_SINGLE_PARENT_SELL_WEEKS,
  HG_SOURCES,
  fmtCap,
  hgCapSentence,
} from "@/lib/data/home-guarantee";

const STATE_LABELS: Record<AustralianState, string> = {
  NSW: "New South Wales", VIC: "Victoria", QLD: "Queensland", WA: "Western Australia",
  SA: "South Australia", TAS: "Tasmania", ACT: "Australian Capital Territory", NT: "Northern Territory",
};

/**
 * The 5% Deposit Scheme summary the first home buyer guides print, from
 * src/lib/data/home-guarantee.ts, so the price caps and rules on every guide
 * change in one place. List items (first home buyers, single parents, and the
 * closed regional guarantee outside the ACT) to sit inside a <ul>.
 */
export function HomeGuaranteeNote({ state }: { state: AustralianState }) {
  return (
    <>
      <li>
        <strong>5% Deposit Scheme (the expanded First Home Guarantee):</strong> buy with a{" "}
        {HG_MIN_DEPOSIT_PCT.firstHome}% deposit and no LMI. Since {HG_DATES.expanded}{" "}
        there&rsquo;s no income test and
        no limit on places. The price cap is {hgCapSentence(state)}
        {state === "NT" ? <> (Darwin&rsquo;s cap rose from {fmtCap(HG_NT_CAP_BEFORE_SPLIT)} on {HG_DATES.ntCapSplit})</> : null}.
        See our <Link href="/guides/first-home-guarantee">5% Deposit Scheme guide</Link>.
      </li>
      <li>
        <strong>Single parents and legal guardians (Family Home Guarantee):</strong> a{" "}
        {HG_MIN_DEPOSIT_PCT.singleParent}% deposit, the same price caps and no income test. You don&rsquo;t have to be a
        first home buyer, but any other home you own must be sold within {HG_SINGLE_PARENT_SELL_WEEKS} weeks of settling.
      </li>
      {/* The ACT had no regional areas under the regional guarantee (Direction s4A(3)). */}
      {state !== "ACT" && (
        <li>
          <strong>Regional First Home Buyer Guarantee:</strong> closed. No new guarantees have been issued since{" "}
          {HG_DATES.expanded}; regional buyers use the 5% Deposit Scheme at their area&rsquo;s price cap.
        </li>
      )}
    </>
  );
}

/** Every state's and territory's 5% Deposit Scheme price caps, with the regional centres and the source. */
export function HomeGuaranteeCapsTable() {
  const centres = AUSTRALIAN_STATES.filter((s) => HG_PRICE_CAPS[s].regionalCentres.length > 0)
    .map((s) => `${STATE_LABELS[s]}: ${HG_PRICE_CAPS[s].regionalCentres.join(", ")}`)
    .join(". ");
  return (
    <>
      <ScrollTable label="5% Deposit Scheme property price caps by state and territory">
        <table>
          <thead>
            <tr><th>State or territory</th><th>Capital city and regional centres</th><th>Rest of the state</th></tr>
          </thead>
          <tbody>
            {AUSTRALIAN_STATES.map((s) => {
              const c = HG_PRICE_CAPS[s];
              return (
                <tr key={s}>
                  <td><strong>{STATE_LABELS[s]}</strong></td>
                  {c.rest === null ? (
                    <td colSpan={2}>{fmtCap(c.capital)} across the territory</td>
                  ) : (
                    <>
                      <td>{fmtCap(c.capital)} ({HG_CAPITAL_AREAS[s]})</td>
                      <td>{fmtCap(c.rest)}</td>
                    </>
                  )}
                </tr>
              );
            })}
            {HG_OTHER_TERRITORY_CAPS.map((t) => (
              <tr key={t.area}>
                <td><strong>{t.area}</strong></td>
                <td colSpan={2}>{fmtCap(t.cap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        Regional centres that take the capital-city cap: {centres}. Both the purchase price and the lender&rsquo;s
        valuation must be at or under the cap. Darwin&rsquo;s cap rose from {fmtCap(HG_NT_CAP_BEFORE_SPLIT)} on{" "}
        {HG_DATES.ntCapSplit}; the other caps have applied since {HG_DATES.expanded}. Source:{" "}
        <a href={HG_SOURCES.priceCaps.href} target="_blank" rel="noopener noreferrer">Housing Australia</a> and the{" "}
        <a href={HG_SOURCES.mandate.href} target="_blank" rel="noopener noreferrer">Investment Mandate Direction, s29F</a>,
        checked {formatDate(HG_CHECKED_ON)}. Check an exact address with Housing Australia&rsquo;s postcode tool.
      </p>
    </>
  );
}
