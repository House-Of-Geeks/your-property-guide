"use client";

import { useState, useMemo } from "react";
import { DollarSign, Info, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";
import { formatPriceFull } from "@/lib/utils/format";

type RepaymentFrequency = "monthly" | "fortnightly" | "weekly";
type LoanType = "principal-interest" | "interest-only";

const PAYMENTS_PER_YEAR: Record<RepaymentFrequency, number> = {
  monthly: 12,
  fortnightly: 26,
  weekly: 52,
};

const FREQUENCY_LABELS: Record<RepaymentFrequency, string> = {
  monthly: "Monthly",
  fortnightly: "Fortnightly",
  weekly: "Weekly",
};

interface AmortizationRow {
  year: number;
  openingBalance: number;
  annualPrincipal: number;
  annualInterest: number;
  closingBalance: number;
}

function computeMortgage(
  principal: number,
  annualRate: number,
  termYears: number,
  frequency: RepaymentFrequency,
  loanType: LoanType
) {
  const ppy = PAYMENTS_PER_YEAR[frequency];
  const r = annualRate / 100 / ppy;
  const n = termYears * ppy;

  let payment: number;
  if (loanType === "interest-only") {
    payment = principal * (annualRate / 100) / ppy;
  } else {
    if (r === 0) {
      payment = principal / n;
    } else {
      payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }

  const totalRepayments = payment * n;
  const totalInterest = loanType === "interest-only"
    ? payment * n
    : totalRepayments - principal;

  // Build yearly amortization
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let year = 1; year <= termYears; year++) {
    const openingBalance = balance;
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let p = 0; p < ppy; p++) {
      const interestCharge = balance * r;
      let principalCharge: number;
      if (loanType === "interest-only") {
        principalCharge = 0;
      } else {
        principalCharge = Math.min(payment - interestCharge, balance);
      }
      yearlyInterest += interestCharge;
      yearlyPrincipal += principalCharge;
      balance = Math.max(0, balance - principalCharge);
    }

    rows.push({
      year,
      openingBalance,
      annualPrincipal: yearlyPrincipal,
      annualInterest: yearlyInterest,
      closingBalance: balance,
    });
  }

  return { payment, totalRepayments, totalInterest, rows };
}

export function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(500_000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [termYears, setTermYears] = useState(30);
  const [frequency, setFrequency] = useState<RepaymentFrequency>("monthly");
  const [loanType, setLoanType] = useState<LoanType>("principal-interest");
  const [showAllYears, setShowAllYears] = useState(false);

  const result = useMemo(
    () => computeMortgage(loanAmount, interestRate, termYears, frequency, loanType),
    [loanAmount, interestRate, termYears, frequency, loanType]
  );

  const visibleRows = showAllYears ? result.rows : result.rows.slice(0, 12);

  const principalPercent = Math.round(
    (loanAmount / result.totalRepayments) * 100
  );
  const interestPercent = 100 - principalPercent;

  const fmt = (n: number) => formatPriceFull(Math.round(n));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Loan Details</h2>

        {/* Loan Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              min={50_000}
              max={5_000_000}
              step={10_000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <input
            type="range"
            min={50_000}
            max={5_000_000}
            step={10_000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full mt-2 accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>$50K</span><span>$5M</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate (% p.a.)
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
            <span>1%</span><span>15%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Term
          </label>
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

        {/* Repayment Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Repayment Frequency
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["monthly", "fortnightly", "weekly"] as RepaymentFrequency[]).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                  frequency === f
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                {FREQUENCY_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Loan Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["principal-interest", "interest-only"] as LoanType[]).map((t) => (
              <button
                key={t}
                onClick={() => setLoanType(t)}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                  loanType === t
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                {t === "principal-interest" ? "Principal & Interest" : "Interest Only"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {/* Hero repayment */}
        <div className="gradient-brand p-6 text-white text-center">
          <p className="text-sm opacity-90">{FREQUENCY_LABELS[frequency]} Repayment</p>
          <p className="text-5xl font-bold mt-1 tracking-tight">
            {fmt(result.payment)}
          </p>
          <p className="text-sm opacity-80 mt-1">
            {loanType === "interest-only" ? "Interest only" : `${termYears}-year ${FREQUENCY_LABELS[frequency].toLowerCase()} repayments`}
          </p>
        </div>

        {/* Summary rows */}
        <div className="p-6 space-y-3">
          <SummaryRow label="Total Repayments" value={fmt(result.totalRepayments)} />
          <SummaryRow label="Total Interest Paid" value={fmt(result.totalInterest)} />
          {loanType !== "interest-only" && (
            <SummaryRow label="Principal" value={fmt(loanAmount)} />
          )}
        </div>

        {/* Principal vs Interest bar */}
        {loanType !== "interest-only" && (
          <div className="px-6 pb-6">
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Principal vs Interest Breakdown
            </p>
            <div className="flex rounded-full overflow-hidden h-4">
              <div
                className="bg-primary transition-all duration-500"
                style={{ width: `${principalPercent}%` }}
              />
              <div
                className="bg-orange-400 transition-all duration-500"
                style={{ width: `${interestPercent}%` }}
              />
            </div>
            <div className="flex gap-6 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm bg-primary" />
                Principal {principalPercent}%
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm bg-orange-400" />
                Interest {interestPercent}%
              </span>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="px-6 pb-6">
          <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              This calculator provides estimates only and does not constitute financial advice.
              Actual repayments may vary. Always consult a financial professional.
            </p>
          </div>
        </div>
      </div>

      {/* Amortization Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Amortization Schedule</h2>
          <span className="text-sm text-gray-500">Yearly breakdown</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs font-medium uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-right">Opening Balance</th>
                <th className="px-4 py-3 text-right">Principal</th>
                <th className="px-4 py-3 text-right">Interest</th>
                <th className="px-4 py-3 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleRows.map((row) => (
                <tr key={row.year} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.year}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{fmt(row.openingBalance)}</td>
                  <td className="px-4 py-3 text-right text-green-700">{fmt(row.annualPrincipal)}</td>
                  <td className="px-4 py-3 text-right text-orange-600">{fmt(row.annualInterest)}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{fmt(row.closingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {result.rows.length > 12 && (
          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <button
              onClick={() => setShowAllYears((v) => !v)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              {showAllYears ? (
                <>Show less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Show all {result.rows.length} years <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
