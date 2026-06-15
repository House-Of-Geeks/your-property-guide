"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  computeBorrowingPower,
  getHEM,
  DEFAULT_ASSESSMENT_RATE,
} from "@/lib/utils/borrowing-power";

const INCOME_PRESETS = [80_000, 120_000, 160_000, 200_000];
const DEPENDANT_OPTIONS = [0, 1, 2, 3, 4];

// Fixed assumptions for the mini tool, kept conservative and documented. The
// full calculator lets the reader change these.
const TERM_YEARS = 30;

function formatMoney(n: number): string {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

// Inline mini borrowing-power calculator. Strips the full
// /borrowing-power-calculator down to combined income, expenses and
// dependants for quick what-if exploration inside a guide. Uses the same
// shared computeBorrowingPower() engine so the numbers match the full tool,
// then links out for the inputs it doesn't expose (deposit, rate, term, debts).
//
// Renders inside .prose-ypg blocks but resets prose styles (not-prose) so the
// inputs don't pick up article typography.
export function MiniBorrowingPowerEmbed({
  defaultIncome = 120_000,
  defaultExpenses = 3_000,
}: {
  defaultIncome?: number;
  defaultExpenses?: number;
} = {}) {
  const [income, setIncome] = useState<number>(defaultIncome);
  const [expenses, setExpenses] = useState<number>(defaultExpenses);
  const [dependants, setDependants] = useState<number>(0);

  const result = useMemo(
    () =>
      computeBorrowingPower(
        income,
        /* income2 */ 0,
        expenses,
        dependants,
        /* existingDebts */ 0,
        DEFAULT_ASSESSMENT_RATE,
        TERM_YEARS,
      ),
    [income, expenses, dependants],
  );

  return (
    <div className="not-prose my-10 rounded-2xl border border-line bg-surface-warm p-6 sm:p-8">
      <p className="text-xs font-sans uppercase tracking-[0.25em] text-ink-subtle mb-2">
        Quick estimate
      </p>
      <h3 className="font-display text-2xl text-ink leading-tight mb-5">
        How much could you borrow?
      </h3>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Income */}
        <div>
          <label className="block text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
            Combined gross income
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
            step={5_000}
            min={0}
            className="w-full rounded-lg border border-line bg-surface-raised px-4 py-2.5 font-sans text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {INCOME_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setIncome(p)}
                className={`px-2.5 py-1 text-xs font-sans rounded-md border transition-colors ${
                  p === income
                    ? "bg-ink text-white border-ink"
                    : "bg-surface-raised border-line text-ink-muted hover:border-primary/40 hover:text-primary"
                }`}
              >
                {formatMoney(p)}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses */}
        <div>
          <label className="block text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
            Monthly living expenses
          </label>
          <input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(Math.max(0, Number(e.target.value) || 0))}
            step={250}
            min={0}
            className="w-full rounded-lg border border-line bg-surface-raised px-4 py-2.5 font-sans text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
          <p className="mt-2 font-sans text-xs text-ink-subtle">
            The bank uses at least the HEM benchmark ({formatMoney(getHEM(dependants))}/mo for your household).
          </p>
        </div>
      </div>

      {/* Dependants */}
      <div className="mt-5">
        <label className="block text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-2">
          Dependants
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DEPENDANT_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDependants(d)}
              className={`min-w-[2.5rem] px-3 py-1.5 text-sm font-sans font-medium rounded-lg border transition-colors ${
                d === dependants
                  ? "bg-ink text-white border-ink"
                  : "bg-surface-raised border-line text-ink hover:border-primary/40 hover:text-primary"
              }`}
            >
              {d === 4 ? "4+" : d}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="mt-7 rounded-xl border border-line bg-surface-raised p-5">
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-subtle mb-1">
          Estimated borrowing capacity
        </p>
        {result ? (
          <>
            <p className="font-display text-4xl text-ink leading-none">
              {formatMoney(result.maxLoan)}
            </p>
            <p className="mt-2 font-sans text-sm text-ink-muted">
              Buys around {formatMoney(result.estimatedPurchasePrice)} with a 20% deposit, at roughly{" "}
              {formatMoney(result.monthlyRepayment)}/month on a {TERM_YEARS}-year loan.
            </p>
          </>
        ) : (
          <p className="mt-1 font-sans text-sm text-ink-muted">
            Enter an income above your living expenses to see a capacity estimate.
          </p>
        )}
      </div>

      <p className="mt-4 font-sans text-xs text-ink-subtle leading-relaxed">
        A simplified estimate assessed at a buffered {DEFAULT_ASSESSMENT_RATE}% over {TERM_YEARS} years, with
        no existing debts. To factor in a partner&rsquo;s income, credit cards, car loans, your real deposit
        and rate,{" "}
        <Link
          href="/borrowing-power-calculator"
          className="inline-flex items-center gap-1 text-ink border-b border-line-strong hover:border-primary hover:text-primary pb-0.5 font-medium"
        >
          use the full calculator <ArrowRight className="w-3 h-3" />
        </Link>
      </p>
    </div>
  );
}
