"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { calculateStampDuty } from "@/lib/utils";
import type { AustralianState } from "@/lib/utils/stamp-duty";

const STATES: AustralianState[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];

const PRESET_PRICES = [500_000, 700_000, 1_000_000, 1_500_000];

function formatMoney(n: number): string {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

// Inline mini stamp-duty calculator. Strips the full calculator down to
// state + price + first-home-buyer toggle for quick what-if exploration in
// the body of a guide. Links out to the full calculator for nuance.
//
// Renders inside .prose-ypg blocks but resets prose styles inside the form so
// the inputs don't pick up article typography.
export function MiniStampDutyEmbed() {
  const [state, setState] = useState<AustralianState>("NSW");
  const [price, setPrice] = useState<number>(700_000);
  const [isFirstHomeBuyer, setIsFirstHomeBuyer] = useState(false);

  const result = useMemo(
    () =>
      calculateStampDuty(price, state, isFirstHomeBuyer, /* foreign */ false, /* investment */ !isFirstHomeBuyer ? false : false),
    [price, state, isFirstHomeBuyer],
  );

  return (
    <div className="not-prose my-10 rounded-2xl border border-line bg-surface-warm p-6 sm:p-8">
      <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
        Quick estimate
      </p>
      <h3 className="font-display text-2xl text-ink leading-tight mb-5">
        Stamp duty calculator
      </h3>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* State */}
        <div>
          <label className="block text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
            State
          </label>
          <div className="flex flex-wrap gap-1.5">
            {STATES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setState(s)}
                className={`px-3 py-1.5 text-sm font-sans font-medium rounded-lg border transition-colors ${
                  s === state
                    ? "bg-ink text-white border-ink"
                    : "bg-surface-raised border-line text-ink hover:border-primary/40 hover:text-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
            Purchase price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
            step={10_000}
            min={0}
            className="w-full rounded-lg border border-line bg-surface-raised px-4 py-2.5 font-sans text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PRESET_PRICES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrice(p)}
                className={`px-2.5 py-1 text-xs font-sans rounded-md border transition-colors ${
                  p === price
                    ? "bg-ink text-white border-ink"
                    : "bg-surface-raised border-line text-ink-muted hover:border-primary/40 hover:text-primary"
                }`}
              >
                {formatMoney(p)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FHB toggle */}
      <label className="mt-5 inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isFirstHomeBuyer}
          onChange={(e) => setIsFirstHomeBuyer(e.target.checked)}
          className="w-4 h-4 rounded border-line accent-primary"
        />
        <span className="font-sans text-sm text-ink">
          I&rsquo;m a first home buyer (apply concessions)
        </span>
      </label>

      {/* Result */}
      <div className="mt-7 rounded-xl border border-line bg-surface-raised p-5">
        <div className="flex items-baseline justify-between gap-4 mb-2">
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle">
            Estimated stamp duty
          </p>
          {result.concessionApplied && (
            <span className="text-xs font-sans text-emerald-700 font-medium">
              FHB concession applied
            </span>
          )}
        </div>
        <p className="font-display text-4xl text-ink leading-none">
          {formatMoney(Math.round(result.total))}
        </p>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          {result.effectiveRate > 0 ? (
            <>{(result.effectiveRate * 100).toFixed(2)}% effective rate on {formatMoney(price)}</>
          ) : (
            <>No transfer duty payable at this price &amp; concession.</>
          )}
        </p>

        {result.concessionApplied && result.concessionAmount > 0 && (
          <p className="mt-1 font-sans text-xs text-ink-subtle">
            You&rsquo;re saving {formatMoney(Math.round(result.concessionAmount))} vs the standard rate.
          </p>
        )}
      </div>

      <p className="mt-4 font-sans text-xs text-ink-subtle leading-relaxed">
        This is a simplified estimate using current state brackets. For an exact
        figure factoring in foreign-buyer surcharges, off-the-plan concessions,
        or pensioner rebates,{" "}
        <Link
          href="/stamp-duty-calculator"
          className="inline-flex items-center gap-1 text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 font-medium"
        >
          use the full calculator <ArrowRight className="w-3 h-3" />
        </Link>
      </p>
    </div>
  );
}
