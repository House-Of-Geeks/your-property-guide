"use client";

import { useState, useMemo } from "react";
import { DollarSign, Info, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { formatPriceFull } from "@/lib/utils/format";

function calcMonthlyRepayment(principal: number, annualRate: number, termYears: number): number {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function computeRefinancing(inputs: {
  loanBalance: number;
  currentRate: number;
  newRate: number;
  remainingTermYears: number;
  exitFee: number;
  establishmentFee: number;
  legalFees: number;
  lmi: number;
}) {
  const { loanBalance, currentRate, newRate, remainingTermYears, exitFee, establishmentFee, legalFees, lmi } = inputs;

  const currentMonthly = calcMonthlyRepayment(loanBalance, currentRate, remainingTermYears);
  const newMonthly = calcMonthlyRepayment(loanBalance, newRate, remainingTermYears);
  const monthlySaving = currentMonthly - newMonthly;

  const totalSwitchingCosts = exitFee + establishmentFee + legalFees + lmi;

  const n = remainingTermYears * 12;
  const totalCurrentRepayments = currentMonthly * n;
  const totalNewRepayments = newMonthly * n;
  const totalInterestSaved = totalCurrentRepayments - totalNewRepayments;

  const breakEvenMonths = monthlySaving > 0 ? totalSwitchingCosts / monthlySaving : Infinity;

  let worthIt: "yes" | "maybe" | "no" | "negative";
  if (monthlySaving <= 0) {
    worthIt = "negative";
  } else if (breakEvenMonths < 24) {
    worthIt = "yes";
  } else if (breakEvenMonths <= 48) {
    worthIt = "maybe";
  } else {
    worthIt = "no";
  }

  return {
    currentMonthly,
    newMonthly,
    monthlySaving,
    totalSwitchingCosts,
    breakEvenMonths,
    totalInterestSaved,
    worthIt,
  };
}

export function RefinancingCalculator() {
  const [loanBalance, setLoanBalance] = useState(400_000);
  const [currentRate, setCurrentRate] = useState(6.5);
  const [newRate, setNewRate] = useState(5.9);
  const [remainingTermYears, setRemainingTermYears] = useState(25);
  const [exitFee, setExitFee] = useState(300);
  const [establishmentFee, setEstablishmentFee] = useState(600);
  const [legalFees, setLegalFees] = useState(1000);
  const [lmi, setLmi] = useState(0);

  const result = useMemo(
    () =>
      computeRefinancing({
        loanBalance,
        currentRate,
        newRate,
        remainingTermYears,
        exitFee,
        establishmentFee,
        legalFees,
        lmi,
      }),
    [loanBalance, currentRate, newRate, remainingTermYears, exitFee, establishmentFee, legalFees, lmi]
  );

  const fmt = (n: number) => formatPriceFull(Math.round(n));

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none";
  const dollarInputClass =
    "w-full rounded-lg border border-gray-300 pl-9 pr-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none";

  const worthItConfig = {
    yes: {
      icon: <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />,
      bg: "bg-green-50 border-green-200",
      text: "text-green-800",
      message: "Likely worth refinancing — you'll recoup costs in under 2 years.",
    },
    maybe: {
      icon: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      message:
        "Consider carefully — break-even is 2–4 years. Factor in your plans to keep this loan.",
    },
    no: {
      icon: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      message:
        "May not be worthwhile — break-even exceeds 4 years. Consider negotiating a rate reduction instead.",
    },
    negative: {
      icon: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      message: "Refinancing would not save money at this rate. The new rate must be lower than your current rate.",
    },
  };

  const cfg = worthItConfig[result.worthIt];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Loan Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Loan Balance */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Loan Balance
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={10_000}
                max={5_000_000}
                step={10_000}
                value={loanBalance}
                onChange={(e) => setLoanBalance(Number(e.target.value))}
                className={dollarInputClass}
              />
            </div>
            <input
              type="range"
              min={50_000}
              max={2_000_000}
              step={10_000}
              value={loanBalance}
              onChange={(e) => setLoanBalance(Number(e.target.value))}
              className="w-full mt-2 accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>$50K</span><span>$2M</span>
            </div>
          </div>

          {/* Current Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              min={1}
              max={20}
              step={0.05}
              value={currentRate}
              onChange={(e) => setCurrentRate(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          {/* New Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              min={1}
              max={20}
              step={0.05}
              value={newRate}
              onChange={(e) => setNewRate(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          {/* Remaining Term */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remaining Loan Term (years)
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[5, 10, 15, 20, 25, 30].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setRemainingTermYears(yr)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    remainingTermYears === yr
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
      </div>

      {/* Switching Costs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Switching Costs</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exit / Discharge Fee
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                step={50}
                value={exitFee}
                onChange={(e) => setExitFee(Number(e.target.value))}
                className={dollarInputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Loan Establishment Fee
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                step={50}
                value={establishmentFee}
                onChange={(e) => setEstablishmentFee(Number(e.target.value))}
                className={dollarInputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Legal / Settlement Fees
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                step={100}
                value={legalFees}
                onChange={(e) => setLegalFees(Number(e.target.value))}
                className={dollarInputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lender&apos;s Mortgage Insurance
              <span className="text-xs text-gray-400 ml-1">(if LVR &gt;80%)</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                step={500}
                value={lmi}
                onChange={(e) => setLmi(Number(e.target.value))}
                className={dollarInputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
        {/* Hero monthly saving */}
        <div className="gradient-brand p-6 text-white text-center">
          <p className="text-sm opacity-90">Monthly Saving</p>
          <p className="text-5xl font-bold mt-1 tracking-tight">
            {result.monthlySaving > 0 ? fmt(result.monthlySaving) : "$0"}
          </p>
          <p className="text-sm opacity-80 mt-1">
            {fmt(result.currentMonthly)} → {fmt(result.newMonthly)} per month
          </p>
        </div>

        <div className="p-6 space-y-3">
          {/* Rate comparison bar */}
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Rate Comparison
            </p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Current: {currentRate}%</span>
                  <span>{fmt(result.currentMonthly)}/mo</span>
                </div>
                <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((currentRate / 15) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>New: {newRate}%</span>
                  <span>{fmt(result.newMonthly)}/mo</span>
                </div>
                <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((newRate / 15) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-3">
            <ResultRow label="Total Switching Costs" value={fmt(result.totalSwitchingCosts)} />
            <ResultRow
              label="Break-Even Point"
              value={
                result.monthlySaving <= 0
                  ? "N/A"
                  : result.breakEvenMonths === Infinity
                  ? "Never"
                  : `${Math.ceil(result.breakEvenMonths)} months`
              }
              highlight="primary"
            />
            <ResultRow
              label="Total Interest Saved (over loan life)"
              value={result.monthlySaving > 0 ? fmt(result.totalInterestSaved) : "$0"}
              highlight={result.monthlySaving > 0 ? "green" : undefined}
            />
          </div>
        </div>

        {/* Is it worth it? */}
        <div className="px-6 pb-4">
          <div className={`flex items-start gap-3 rounded-lg border p-4 ${cfg.bg}`}>
            {cfg.icon}
            <div>
              <p className={`text-sm font-semibold ${cfg.text}`}>Is it worth it?</p>
              <p className={`text-sm mt-0.5 ${cfg.text}`}>{cfg.message}</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="px-6 pb-6">
          <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              This calculator provides estimates only. Actual savings depend on your specific
              loan terms. Fees shown are indicative — confirm costs with your lender.
              Consider seeking independent financial advice before refinancing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "primary" | "green" | "red";
}) {
  const valueClass =
    highlight === "primary"
      ? "text-sm font-bold text-primary"
      : highlight === "green"
      ? "text-sm font-semibold text-green-700"
      : highlight === "red"
      ? "text-sm font-semibold text-red-600"
      : "text-sm font-semibold text-gray-900";

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
