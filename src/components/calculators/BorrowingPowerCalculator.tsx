"use client";

import { useState, useMemo } from "react";
import { DollarSign, Info, Users, TrendingUp } from "lucide-react";
import { formatPriceFull } from "@/lib/utils/format";

// HEM base by number of dependants (monthly, $)
const HEM_BASE: Record<number, number> = {
  0: 2_000,
  1: 2_500,
  2: 3_000,
  3: 3_500,
};
const HEM_MAX_DEPENDANTS = 4;
const HEM_4PLUS = 4_000;

function getHEM(dependants: number): number {
  if (dependants >= HEM_MAX_DEPENDANTS) return HEM_4PLUS;
  return HEM_BASE[dependants] ?? HEM_4PLUS;
}

interface BorrowingResult {
  maxLoan: number;
  estimatedPurchasePrice: number;
  monthlyRepayment: number;
  monthlyNetIncome: number;
  hemUsed: number;
  availableForRepayments: number;
}

function computeBorrowingPower(
  income1: number,
  income2: number,
  monthlyExpenses: number,
  dependants: number,
  existingDebts: number,
  assessmentRate: number,
  termYears: number
): BorrowingResult | null {
  const grossAnnual = income1 + income2;
  if (grossAnnual <= 0) return null;

  const netAnnual = grossAnnual * 0.72;
  const monthlyNetIncome = netAnnual / 12;

  const hemBase = getHEM(dependants);
  const hemUsed = Math.max(monthlyExpenses, hemBase);

  const availableForRepayments = monthlyNetIncome - hemUsed - existingDebts;
  if (availableForRepayments <= 0) return null;

  const maxMonthlyRepayment = availableForRepayments * 0.85;

  const r = assessmentRate / 100 / 12;
  const n = termYears * 12;

  let maxLoan: number;
  if (r === 0) {
    maxLoan = maxMonthlyRepayment * n;
  } else {
    const factor = (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    maxLoan = maxMonthlyRepayment * factor;
  }

  maxLoan = Math.max(0, maxLoan);
  const estimatedPurchasePrice = maxLoan / 0.8; // assumes 20% deposit
  const monthlyRepayment = maxMonthlyRepayment;

  return {
    maxLoan: Math.round(maxLoan),
    estimatedPurchasePrice: Math.round(estimatedPurchasePrice),
    monthlyRepayment: Math.round(monthlyRepayment),
    monthlyNetIncome: Math.round(monthlyNetIncome),
    hemUsed: Math.round(hemUsed),
    availableForRepayments: Math.round(availableForRepayments),
  };
}

export function BorrowingPowerCalculator() {
  const [income1, setIncome1] = useState(100_000);
  const [income2, setIncome2] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(3_000);
  const [dependants, setDependants] = useState(0);
  const [existingDebts, setExistingDebts] = useState(0);
  const [assessmentRate, setAssessmentRate] = useState(7.5);
  const [termYears, setTermYears] = useState(30);

  const result = useMemo(
    () =>
      computeBorrowingPower(
        income1,
        income2,
        monthlyExpenses,
        dependants,
        existingDebts,
        assessmentRate,
        termYears
      ),
    [income1, income2, monthlyExpenses, dependants, existingDebts, assessmentRate, termYears]
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
            prefix="$"
            placeholder="100,000"
          />
          <NumberInput
            id="income2"
            label="Partner's Gross Annual Income"
            value={income2}
            onChange={setIncome2}
            prefix="$"
            placeholder="0 (optional)"
          />
        </div>

        {/* Expenses */}
        <NumberInput
          id="expenses"
          label="Monthly Living Expenses"
          value={monthlyExpenses}
          onChange={setMonthlyExpenses}
          prefix="$"
          placeholder="3,000"
          hint="If left below the HEM benchmark for your household, the bank minimum will be used."
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

        {/* Existing debts */}
        <NumberInput
          id="debts"
          label="Existing Monthly Debt Repayments"
          value={existingDebts}
          onChange={setExistingDebts}
          prefix="$"
          placeholder="0"
          hint="Include credit cards, car loans, personal loans, and other home loan repayments."
        />

        {/* Assessment rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assessment Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            min={3}
            max={15}
            step={0.1}
            value={assessmentRate}
            onChange={(e) => setAssessmentRate(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
          <input
            type="range"
            min={3}
            max={15}
            step={0.1}
            value={assessmentRate}
            onChange={(e) => setAssessmentRate(Number(e.target.value))}
            className="w-full mt-2 accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>3%</span>
            <span className="text-gray-500">
              Banks typically assess at your actual rate + 3% buffer
            </span>
            <span>15%</span>
          </div>
        </div>

        {/* Loan term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
          <div className="grid grid-cols-6 gap-2">
            {[5, 10, 15, 20, 25, 30].map((yr) => (
              <button
                key={yr}
                onClick={() => setTermYears(yr)}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                  termYears === yr
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                {yr}yr
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result ? (
        <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
          {/* Hero */}
          <div className="gradient-brand p-6 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 opacity-80" />
              <p className="text-sm opacity-90">Maximum Borrowing Capacity</p>
            </div>
            <p className="text-5xl font-bold tracking-tight">{fmt(result.maxLoan)}</p>
            <p className="text-sm opacity-80 mt-2">
              Estimated purchase price: {fmt(result.estimatedPurchasePrice)} (with 20% deposit)
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
            <StatCard
              label={`Monthly Repayment at ${assessmentRate}%`}
              value={fmt(result.monthlyRepayment)}
              sub="per month"
            />
            <StatCard
              label="Monthly Net Income"
              value={fmt(result.monthlyNetIncome)}
              sub="approx. after tax"
            />
            <StatCard
              label="Living Expenses Used"
              value={fmt(result.hemUsed)}
              sub="HEM or your figure"
            />
          </div>

          {/* Breakdown */}
          <div className="px-6 pb-4 space-y-3 border-t border-gray-100 pt-4">
            <SummaryRow label="Monthly net income" value={fmt(result.monthlyNetIncome)} />
            <SummaryRow label="Less: living expenses (HEM)" value={`-${fmt(result.hemUsed)}`} />
            <SummaryRow label="Less: existing debts" value={`-${fmt(existingDebts)}`} />
            <SummaryRow
              label="Available for repayments"
              value={fmt(result.availableForRepayments)}
              bold
            />
          </div>

          {/* Disclaimer */}
          <div className="px-6 pb-6 pt-2">
            <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                This is an estimate only. Actual borrowing capacity depends on your specific
                financial situation, lender policies, and current interest rates. Speak with a
                mortgage broker for a personalised assessment.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-8 text-center text-gray-500">
          <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Enter your income details above to calculate your borrowing power.</p>
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
  prefix,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
        <input
          id={id}
          type="number"
          min={0}
          step={1000}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-gray-300 ${prefix ? "pl-9" : "pl-3"} pr-3 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none`}
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

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
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
