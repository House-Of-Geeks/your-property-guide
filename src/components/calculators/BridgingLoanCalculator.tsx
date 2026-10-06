"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, MapPin } from "lucide-react";
import { SuburbAutocomplete } from "@/components/search/SuburbAutocomplete";
import { SuburbAppraisalCTA } from "@/components/suburb/SuburbAppraisalCTA";
import { AppraisalForm } from "@/components/forms/AppraisalForm";
import { formatPriceFull } from "@/lib/utils/format";
import { STATE_NAMES } from "@/lib/data/commission-rates";
import { AUSTRALIAN_STATES, type AustralianState } from "@/lib/utils/stamp-duty";
import type { HomeValueSummary } from "@/lib/home-value";
import { sourceLine } from "@/lib/value-range";
import {
  PEAK_LVR_CAP,
  computeBridging,
  defaultBridgingInput,
  defaultBuyingCosts,
  defaultSellingCosts,
  type BridgingInput,
  type InterestMode,
  BRIDGING_CALCULATOR_SOURCE,
  bridgingCalculatorSource,
} from "@/lib/bridging-calc";
import { PUBLISHED_CAPITALISED_RATES } from "@/lib/data/bridging-lenders";
import { NumberInput } from "./CommissionCalculator";

const field =
  "w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white";
const MONTHS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];


/**
 * Peak debt, end debt and what bridging costs, from the sale price of the
 * current home and the price of the next one. The sale price drives every
 * figure, so the visitor can start from their suburb's published median and
 * is offered a free appraisal to firm it up. The arithmetic is in
 * src/lib/bridging-calc.ts, shared with /guides/bridging-loans-guide.
 */
export function BridgingLoanCalculator() {
  const [input, setInput] = useState<BridgingInput>(() => defaultBridgingInput("NSW"));
  // Selling and buying costs follow the prices and state until the visitor types their own.
  const [sellingOverride, setSellingOverride] = useState<number | null>(null);
  const [buyingOverride, setBuyingOverride] = useState<number | null>(null);
  const [suburb, setSuburb] = useState<HomeValueSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const set = <K extends keyof BridgingInput>(k: K, v: BridgingInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const sellingCosts = sellingOverride ?? defaultSellingCosts(input.salePrice, input.state, input.mortgageOwing);
  const buyingCosts = buyingOverride ?? defaultBuyingCosts(input.purchasePrice, input.state);
  const effective = useMemo(() => ({ ...input, sellingCosts, buyingCosts }), [input, sellingCosts, buyingCosts]);
  const r = useMemo(() => computeBridging(effective), [effective]);
  const fmt = (n: number) => formatPriceFull(Math.round(n));

  const pickSuburb = async (slug: string) => {
    setLoading(true);
    setLookupError(null);
    try {
      const res = await fetch(`/api/suburbs/summary?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error("lookup failed");
      const next = (await res.json()) as HomeValueSummary;
      setSuburb(next);
      const median = next.medianHousePrice ?? next.medianUnitPrice;
      setInput((p) => ({
        ...p,
        salePrice: median ?? p.salePrice,
        state: (AUSTRALIAN_STATES as readonly string[]).includes(next.state) ? (next.state as AustralianState) : p.state,
      }));
    } catch {
      setLookupError("We couldn't load that suburb. Enter your expected sale price instead.");
    } finally {
      setLoading(false);
    }
  };

  const dwelling = suburb?.medianHousePrice != null ? "house" : "unit";
  const median = suburb ? (suburb.medianHousePrice ?? suburb.medianUnitPrice) : null;
  const source = suburb && median !== null ? sourceLine(suburb, dwelling) : null;
  const saving = r.bridgingCost - r.sellFirstCost;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">The home you&rsquo;re selling</h2>

        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">Start from your suburb (optional)</p>
          {suburb ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              <div className="flex items-start justify-between gap-4">
                <p className="inline-flex items-center gap-2 font-medium text-gray-900">
                  <MapPin className="w-4 h-4 text-primary" aria-hidden="true" /> {suburb.name}, {suburb.state} {suburb.postcode}
                </p>
                <button
                  type="button"
                  onClick={() => setSuburb(null)}
                  className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-4 cursor-pointer"
                >
                  Change suburb
                </button>
              </div>
              {median !== null ? (
                <p className="mt-1">
                  We&rsquo;ve set the sale price to the published median {dwelling} price, {fmt(median)}. It is the
                  suburb&rsquo;s figure, not a valuation of your home.
                  {source && <span className="block text-xs text-gray-500 mt-1">Source: {source}</span>}
                </p>
              ) : (
                <p className="mt-1">
                  We don&rsquo;t publish a median for {suburb.name}, so enter your own estimate. A local agent can give you
                  a figure from recent sales.
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-300 bg-white">
              <SuburbAutocomplete placeholder="Suburb or postcode, e.g. Bondi or 2026" onSelectLocation={(slug) => pickSuburb(slug)} />
            </div>
          )}
          {loading && (
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Loading the suburb&hellip;
            </p>
          )}
          {lookupError && <p className="mt-2 text-sm text-red-700">{lookupError}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput id="br-sale" label="Expected sale price" value={input.salePrice} onChange={(v) => set("salePrice", v)} prefix="$" step={10_000} />
          <NumberInput id="br-owing" label="Mortgage still owing" value={input.mortgageOwing} onChange={(v) => set("mortgageOwing", v)} prefix="$" step={10_000} />
          <div className="sm:col-span-2">
            <NumberInput
              id="br-selling"
              label="Selling costs"
              value={sellingCosts}
              onChange={(v) => setSellingOverride(v)}
              prefix="$"
              step={1_000}
              hint={
                sellingOverride === null
                  ? `Our estimate: commission at the typical ${STATE_NAMES[input.state].replace(/^the /, "")} rate plus GST, marketing, legal documents, conveyancing and the mortgage discharge.`
                  : "Your figure."
              }
            />
            {sellingOverride !== null && (
              <button type="button" onClick={() => setSellingOverride(null)} className="mt-1 text-xs text-primary underline underline-offset-4 cursor-pointer">
                Use our estimate
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">The home you&rsquo;re buying</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput id="br-price" label="Purchase price" value={input.purchasePrice} onChange={(v) => set("purchasePrice", v)} prefix="$" step={10_000} />
          <div>
            <label htmlFor="br-state" className="block text-sm font-medium text-gray-700 mb-1">State or territory</label>
            <select id="br-state" value={input.state} onChange={(e) => set("state", e.target.value as AustralianState)} className={field}>
              {AUSTRALIAN_STATES.map((s) => (
                <option key={s} value={s}>{STATE_NAMES[s].replace(/^the /, "")}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Stamp duty: {fmt(r.stampDuty)} at the owner-occupier rate.</p>
          </div>
          <div>
            <NumberInput
              id="br-buying"
              label="Conveyancing and registration"
              value={buyingCosts}
              onChange={(v) => setBuyingOverride(v)}
              prefix="$"
              step={500}
              hint={buyingOverride === null ? "Our estimate for the state, including the new mortgage." : "Your figure."}
            />
            {buyingOverride !== null && (
              <button type="button" onClick={() => setBuyingOverride(null)} className="mt-1 text-xs text-primary underline underline-offset-4 cursor-pointer">
                Use our estimate
              </button>
            )}
          </div>
          <NumberInput id="br-savings" label="Savings you'll put in" value={input.savings} onChange={(v) => set("savings", v)} prefix="$" step={5_000} hint="Cash towards the purchase. Leave at 0 if you'll borrow it all." />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">The loan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="br-rate"
            label="Bridging interest rate (% a year)"
            value={input.bridgingRate}
            onChange={(v) => set("bridgingRate", v)}
            step={0.05}
            hint={
              input.interestMode === "capitalised"
                ? `An example. Banks that add the interest to the loan published ${PUBLISHED_CAPITALISED_RATES.low}% to ${PUBLISHED_CAPITALISED_RATES.high}% on 6 October 2026.`
                : "CBA and ANZ charge their standard variable rate. ANZ's owner-occupier interest-only rate was 7.79% on 17 September 2026."
            }
          />
          <div>
            <label htmlFor="br-mode" className="block text-sm font-medium text-gray-700 mb-1">How the lender charges bridging interest</label>
            <select id="br-mode" value={input.interestMode} onChange={(e) => set("interestMode", e.target.value as InterestMode)} className={field}>
              <option value="capitalised">Added to the loan each month (Westpac, St.George, Bendigo)</option>
              <option value="monthly">Paid monthly, interest only (CBA, ANZ)</option>
            </select>
          </div>
          <div>
            <label htmlFor="br-months" className="block text-sm font-medium text-gray-700 mb-1">Months until your home sells and settles</label>
            <select id="br-months" value={input.months} onChange={(e) => set("months", Number(e.target.value))} className={field}>
              {MONTHS.map((m) => <option key={m} value={m}>{m} months</option>)}
            </select>
          </div>
          <NumberInput id="br-fees" label="Loan fees and valuations" value={input.loanFees} onChange={(v) => set("loanFees", v)} prefix="$" step={100} hint="Westpac and St.George publish $600 to set up, $100 for documents, $8 a month and $350 to discharge. Add valuations if your lender charges for them." />
          <NumberInput id="br-ongoing" label="Rate on the loan after the sale (% a year)" value={input.ongoingRate} onChange={(v) => set("ongoingRate", v)} step={0.05} hint="An example rate. Use your lender's quote." />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Your bridging loan</h2>
        {r.status === "invalid" ? (
          <p className="text-sm text-gray-700">Enter the sale price of your current home and the price of the next one.</p>
        ) : (
          <>
            <dl className="space-y-3">
              <Row label="Net sale proceeds (sale price less selling costs)" value={fmt(r.netSaleProceeds)} />
              <Row label="Borrowed at the start (mortgage, purchase, duty, costs and fees, less savings)" value={fmt(r.startingDebt)} />
              <Row label="Bridging loan (the part the sale repays)" value={fmt(r.bridgingLoan)} />
              {input.interestMode === "capitalised" ? (
                <Row label={`Interest added over ${input.months} months at ${input.bridgingRate}%`} value={fmt(r.capitalisedInterest)} />
              ) : (
                <Row label={`Interest you pay each month on the bridging loan at ${input.bridgingRate}%`} value={fmt(r.monthlyBridgingInterest)} />
              )}
              <Row label="Peak debt" value={fmt(r.peakDebt)} />
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                <dt className="text-sm text-gray-600">Peak debt against both homes&rsquo; value ({fmt(r.combinedValue)})</dt>
                <dd className="text-sm font-semibold text-right">
                  <span className={r.withinCap ? "text-gray-900" : "text-red-700"}>{r.peakLvr}%</span>{" "}
                  <span
                    className={`ml-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      r.withinCap ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {r.withinCap ? `Within ${PEAK_LVR_CAP}%` : `Above ${PEAK_LVR_CAP}%`}
                  </span>
                </dd>
              </div>
              <Row label="End debt after the sale" value={r.surplus > 0 ? "None" : fmt(r.endDebt)} />
              {r.surplus > 0 && <Row label="Left over after repaying everything" value={fmt(r.surplus)} />}
              <Row label={`Monthly repayment on the end debt (${input.termYears} years at ${input.ongoingRate}%)`} value={fmt(r.monthlyRepayment)} />
              <div className="flex items-center justify-between pt-1">
                <dt className="text-sm font-medium text-gray-900">What bridging costs you (interest plus fees)</dt>
                <dd className="text-xl font-bold text-primary">{fmt(r.bridgingCost)}</dd>
              </div>
            </dl>
            {!r.withinCap && (
              <p className="mt-4 text-sm text-gray-700">
                Most lenders cap peak debt at 75 to {PEAK_LVR_CAP}% of the two homes&rsquo; combined value. At {r.peakLvr}%
                this plan is likely to be declined as it stands. More savings, a lower purchase price or selling first would
                bring it down.
              </p>
            )}
            <p className="mt-4 text-xs text-gray-500">
              An estimate, not a quote. Interest is charged on the part of the loan the sale repays, the method Westpac
              publishes, and repayments on the end debt are assumed from the start. Lenders differ: CBA asks for interest-only
              payments on the total debt, and Bendigo Bank adds interest on the whole loan for the new home.
            </p>
          </>
        )}
      </div>

      {r.status === "ok" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Bridging or selling first?</h2>
          <p className="text-sm text-gray-700">
            Selling first avoids the bridging interest, but you rent between homes and move twice. Enter what that would cost
            you for the same {input.months} months.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberInput id="br-rent" label="Weekly rent between homes" value={input.weeklyRent} onChange={(v) => set("weeklyRent", v)} prefix="$" step={25} />
            <NumberInput id="br-move" label="Second move and storage" value={input.extraMoveCost} onChange={(v) => set("extraMoveCost", v)} prefix="$" step={500} />
          </div>
          <dl className="space-y-3">
            <Row label="Bridging: interest plus fees" value={fmt(r.bridgingCost)} />
            <Row label={`Selling first: ${input.months} months' rent plus the extra move`} value={fmt(r.sellFirstCost)} />
          </dl>
          <p className="text-sm font-medium text-gray-900">
            {saving > 0
              ? `On these figures, selling first costs ${fmt(saving)} less.`
              : saving < 0
                ? `On these figures, bridging costs ${fmt(-saving)} less than selling first.`
                : "On these figures, the two cost the same."}{" "}
            <Link href="/guides/sell-first-or-buy-first" className="text-primary underline underline-offset-4">
              Sell first or buy first?
            </Link>
          </p>
        </div>
      )}

      {suburb ? (
        <div id="appraisal-form" className="scroll-mt-24">
          <SuburbAppraisalCTA
            suburbName={suburb.name}
            suburbSlug={suburb.slug}
            source={bridgingCalculatorSource(suburb.slug)}
            formName={BRIDGING_CALCULATOR_SOURCE}
          />
        </div>
      ) : (
        <div id="appraisal-form" className="scroll-mt-24 rounded-xl border border-line bg-surface-warm p-6 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.18em] text-cta font-medium mb-2">The number that moves everything</p>
          <h3 className="font-display text-xl sm:text-2xl text-ink leading-tight tracking-tight mb-2">
            Firm up your sale price before you talk to a lender
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed mb-5">
            Every figure above depends on what your current home sells for. A local agent will give you a free appraisal
            from recent comparable sales, and the lender will want a valuation for the bridging application anyway.
          </p>
          <Suspense fallback={<div className="h-96" aria-busy="true" />}>
            <AppraisalForm source={bridgingCalculatorSource()} formName={BRIDGING_CALCULATOR_SOURCE} />
          </Suspense>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
      <dt className="text-sm text-gray-600">{label}</dt>
      <dd className="text-sm font-semibold text-gray-900 text-right whitespace-nowrap">{value}</dd>
    </div>
  );
}
