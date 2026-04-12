"use client";

import { useState, useMemo } from "react";
import { DollarSign, Info, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPriceFull } from "@/lib/utils/format";

// HEM base by number of dependants (monthly, $)
const HEM_BASE: Record<number, number> = {
  0: 2_000,
  1: 2_500,
  2: 3_000,
  3: 3_500,
};
const HEM_4PLUS = 4_000;

function getHEM(dependants: number): number {
  if (dependants >= 4) return HEM_4PLUS;
  return HEM_BASE[dependants] ?? HEM_4PLUS;
}

type DepositPercent = 10 | 15 | 20;
type AustralianState =
  | "QLD" | "NSW" | "VIC" | "WA" | "SA" | "TAS" | "ACT" | "NT";

const STATES: { value: AustralianState; label: string }[] = [
  { value: "QLD", label: "Queensland" },
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "WA",  label: "Western Australia" },
  { value: "SA",  label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT",  label: "Northern Territory" },
];

// Rough LMI estimate table for common LVRs
function estimateLMI(loanAmount: number, lvr: number): number {
  if (lvr <= 80) return 0;
  if (lvr <= 85) return Math.round(loanAmount * 0.005);
  if (lvr <= 90) return Math.round(loanAmount * 0.012);
  return Math.round(loanAmount * 0.022);
}

interface AffordabilityResult {
  affordablePurchasePrice: number;
  loanAmount: number;
  depositPercent: number;
  lvr: number;
  lmiCost: number;
  monthlyRepayment: number;
  estimatedBuyingCosts: number;
  estimatedStampDutyAndCosts: number;
  constraint: "deposit" | "serviceability";
  maxFromDeposit: number;
  maxFromBorrowing: number;
}

function computeAffordability(
  income1: number,
  income2: number,
  savings: number,
  monthlyExpenses: number,
  dependants: number,
  depositPct: DepositPercent,
  interestRate: number,
): AffordabilityResult | null {
  const grossAnnual = income1 + income2;
  if (grossAnnual <= 0 || savings <= 0) return null;

  const termYears = 30;
  const depositFraction = depositPct / 100;

  // Step 1: Effective savings after buying costs (~7% buffer leaves ~93%)
  const effectiveSavings = savings * 0.93;

  // Step 2: Max price from deposit
  const maxFromDeposit = Math.round(effectiveSavings / depositFraction);

  // Step 3: Borrowing power (mirrors BorrowingPowerCalculator logic)
  // Assessment rate: actual rate + 3% APRA buffer
  const assessmentRate = interestRate + 3;
  const netAnnual = grossAnnual * 0.72;
  const monthlyNetIncome = netAnnual / 12;
  const hemUsed = Math.max(monthlyExpenses, getHEM(dependants));
  const availableForRepayments = monthlyNetIncome - hemUsed;
  if (availableForRepayments <= 0) return null;

  const maxMonthlyRepayment = availableForRepayments * 0.85;
  const r = assessmentRate / 100 / 12;
  const n = termYears * 12;
  let maxBorrow: number;
  if (r === 0) {
    maxBorrow = maxMonthlyRepayment * n;
  } else {
    const factor = (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    maxBorrow = maxMonthlyRepayment * factor;
  }
  maxBorrow = Math.max(0, Math.round(maxBorrow));

  // Buying costs estimate (5% of purchase price — approximation)
  // For maxFromBorrowing we use a simplified approach
  const maxFromBorrowing = Math.round(maxBorrow + savings * 0.93);

  // Step 4: Binding constraint
  const affordablePurchasePrice = Math.min(maxFromDeposit, maxFromBorrowing);
  const constraint: "deposit" | "serviceability" =
    maxFromDeposit <= maxFromBorrowing ? "deposit" : "serviceability";

  // Step 5: Derived values at the affordable price
  const estimatedBuyingCosts = Math.round(affordablePurchasePrice * 0.05);
  const estimatedStampDutyAndCosts = estimatedBuyingCosts;
  const loanAmount = Math.max(0, Math.round(affordablePurchasePrice - savings + estimatedBuyingCosts));
  const lvr = affordablePurchasePrice > 0
    ? Math.round((loanAmount / affordablePurchasePrice) * 100)
    : 0;
  const lmiCost = estimateLMI(loanAmount, lvr);

  // Monthly repayment at the user's interest rate (not assessment rate)
  const rActual = interestRate / 100 / 12;
  let monthlyRepayment: number;
  if (rActual === 0) {
    monthlyRepayment = loanAmount / n;
  } else {
    monthlyRepayment = loanAmount * (rActual * Math.pow(1 + rActual, n)) / (Math.pow(1 + rActual, n) - 1);
  }

  return {
    affordablePurchasePrice,
    loanAmount: Math.max(0, loanAmount),
    depositPercent: depositPct,
    lvr,
    lmiCost,
    monthlyRepayment: Math.round(monthlyRepayment),
    estimatedBuyingCosts,
    estimatedStampDutyAndCosts,
    constraint,
    maxFromDeposit,
    maxFromBorrowing,
  };
}

export function AffordabilityCalculator() {
  const [income1, setIncome1] = useState(100_000);
  const [income2, setIncome2] = useState(0);
  const [savings, setSavings] = useState(100_000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(3_000);
  const [dependants, setDependants] = useState(0);
  const [depositPct, setDepositPct] = useState<DepositPercent>(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [selectedState, setSelectedState] = useState<AustralianState>("QLD");

  const result = useMemo(
    () =>
      computeAffordability(
        income1,
        income2,
        savings,
        monthlyExpenses,
        dependants,
        depositPct,
        interestRate,
      ),
    [income1, income2, savings, monthlyExpenses, dependants, depositPct, interestRate]
  );

  const fmt = (n: number) => formatPriceFull(Math.round(n));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Your Financial Details</h2>

        {/* Income */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="income1"
            label="Gross Annual Income"
            value={income1}
            onChange={setIncome1}
            placeholder="100,000"
          />
          <NumberInput
            id="income2"
            label="Partner's Gross Annual Income"
            value={income2}
            onChange={setIncome2}
            placeholder="0 (optional)"
          />
        </div>

        {/* Savings */}
        <NumberInput
          id="savings"
          label="Current Savings / Deposit ($)"
          value={savings}
          onChange={setSavings}
          placeholder="100,000"
          hint="Total savings available including any gifts or grants."
        />

        {/* Monthly expenses */}
        <NumberInput
          id="expenses"
          label="Monthly Living Expenses ($)"
          value={monthlyExpenses}
          onChange={setMonthlyExpenses}
          placeholder="3,000"
          hint="If below the HEM benchmark for your household, the bank minimum will be used."
        />

        {/* Dependants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Dependants
          </label>
          <div className="flex gap-2 flex-wrap">
            {[0, 1, 2, 3, 4, 5, 6].map((d) => (
              <button
                key={d}
                onClick={() => setDependants(d)}
                className={`min-w-[2.5rem] py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  dependants === d
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                {d === 6 ? "6+" : d}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            HEM benchmark: {fmt(getHEM(dependants >= 6 ? 4 : dependants))}/month
          </p>
        </div>

        {/* Target deposit % */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Deposit
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([10, 15, 20] as DepositPercent[]).map((pct) => (
              <button
                key={pct}
                onClick={() => setDepositPct(pct)}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                  depositPct === pct
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                {pct}%
                {pct < 20 && (
                  <span className="block text-xs font-normal opacity-75">LMI applies</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Interest rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            min={1}
            max={15}
            step={0.05}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <input
            type="range"
            min={1}
            max={15}
            step={0.05}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full mt-2 accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>1%</span>
            <span className="text-gray-500">Banks assess at your rate + 3% buffer</span>
            <span>15%</span>
          </div>
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State (for stamp duty estimate)
          </label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value as AustralianState)}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
          >
            {STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {result ? (
        <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
          {/* Hero */}
          <div className="gradient-brand p-6 text-white text-center">
            <p className="text-sm opacity-90">Affordable Purchase Price</p>
            <p className="text-5xl font-bold mt-1 tracking-tight">
              {fmt(result.affordablePurchasePrice)}
            </p>
            <p className="text-sm opacity-80 mt-2">
              {result.constraint === "deposit"
                ? "Deposit-limited — increase savings to buy more"
                : "Serviceability-limited — borrow more with higher income"}
            </p>
          </div>

          {/* Constraint banner */}
          <div className={`px-6 py-3 flex items-center gap-2 text-sm font-medium ${
            result.constraint === "deposit"
              ? "bg-amber-50 text-amber-800 border-b border-amber-100"
              : "bg-blue-50 text-blue-800 border-b border-blue-100"
          }`}>
            {result.constraint === "deposit" ? (
              <>
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                Your deposit is the limiting factor. Saving more will unlock a higher purchase price.
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Your borrowing capacity is the limiting factor. Your deposit could support a higher price.
              </>
            )}
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
            <StatCard label="Loan Required" value={fmt(result.loanAmount)} sub="estimated" />
            <StatCard label="LVR" value={`${result.lvr}%`} sub="loan-to-value" />
            <StatCard label="Monthly Repayment" value={fmt(result.monthlyRepayment)} sub={`at ${interestRate}%`} />
            <StatCard
              label="LMI Cost"
              value={result.lmiCost > 0 ? fmt(result.lmiCost) : "None"}
              sub={result.lmiCost > 0 ? "lender's mortgage insurance" : "20%+ deposit — LMI waived"}
            />
          </div>

          {/* LMI warning */}
          {result.lmiCost > 0 && (
            <div className="mx-6 mb-4 flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Lender&apos;s Mortgage Insurance (LMI) applies</p>
                <p className="text-xs mt-0.5">
                  With a {result.depositPercent}% deposit, LMI is required and estimated at{" "}
                  {fmt(result.lmiCost)}. This can usually be capitalised into the loan. Reaching a
                  20% deposit eliminates this cost entirely.
                </p>
              </div>
            </div>
          )}

          {/* Buying costs breakdown */}
          <div className="px-6 pb-4 space-y-2 border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Buying Costs Breakdown</p>
            <SummaryRow label="Purchase price" value={fmt(result.affordablePurchasePrice)} />
            <SummaryRow
              label={`Deposit (${result.depositPercent}%)`}
              value={fmt(result.affordablePurchasePrice * (result.depositPercent / 100))}
            />
            <SummaryRow
              label="Est. stamp duty + costs (~5%)"
              value={`~${fmt(result.estimatedStampDutyAndCosts)}`}
            />
            <SummaryRow label="Loan amount" value={fmt(result.loanAmount)} bold />
          </div>

          {/* Constraint comparison */}
          <div className="mx-6 mb-4 bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Maximum price comparison
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">From deposit ({result.depositPercent}%)</span>
              <span className={`font-medium ${result.constraint === "deposit" ? "text-amber-700" : "text-gray-900"}`}>
                {fmt(result.maxFromDeposit)}
                {result.constraint === "deposit" && " (binding)"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">From borrowing capacity</span>
              <span className={`font-medium ${result.constraint === "serviceability" ? "text-amber-700" : "text-gray-900"}`}>
                {fmt(result.maxFromBorrowing)}
                {result.constraint === "serviceability" && " (binding)"}
              </span>
            </div>
          </div>

          {/* Refine links */}
          <div className="px-6 pb-6 pt-2">
            <p className="text-sm font-medium text-gray-700 mb-3">Refine with our other calculators</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/stamp-duty-calculator"
                className="flex-1 flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <span>Precise stamp duty for {selectedState}</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Link>
              <Link
                href="/borrowing-power-calculator"
                className="flex-1 flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <span>Detailed borrowing power</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="px-6 pb-6">
            <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                This calculator provides estimates only and does not constitute financial or legal advice.
                Stamp duty and buying costs vary by state, property type, and buyer status.
                Speak with a mortgage broker and conveyancer for personalised figures.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-8 text-center text-gray-500">
          <DollarSign className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Enter your income and savings above to see what you can afford.</p>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          id={id}
          type="number"
          min={0}
          step={1000}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-600"}`}>
        {label}
      </span>
      <span className={`text-sm ${bold ? "font-bold text-gray-900" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}
