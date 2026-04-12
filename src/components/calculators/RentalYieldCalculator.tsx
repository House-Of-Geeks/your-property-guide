"use client";

import { useState, useMemo } from "react";
import { DollarSign, Info, Home, TrendingUp } from "lucide-react";
import { formatPriceFull } from "@/lib/utils/format";

interface RentalYieldResult {
  annualRentalIncome: number;
  grossYield: number;
  netYield: number;
  totalPurchaseCosts: number;
  totalAnnualCosts: number;
  annualNetIncome: number;
  weeklyCashFlow: number;
  annualLoanRepayments: number;
}

function computeRentalYield(
  purchasePrice: number,
  weeklyRent: number,
  stampDuty: number,
  legalFees: number,
  buildingInspection: number,
  councilRates: number,
  waterRates: number,
  insurance: number,
  managementPct: number,
  maintenancePct: number,
  loanAmount: number,
  loanRate: number,
  loanTermYears: number
): RentalYieldResult | null {
  if (purchasePrice <= 0 || weeklyRent <= 0) return null;

  const annualRentalIncome = weeklyRent * 52;

  // Purchase costs
  const totalPurchaseCosts = stampDuty + legalFees + buildingInspection;
  const totalCostBase = purchasePrice + totalPurchaseCosts;

  // Annual ongoing costs
  const managementCost = (managementPct / 100) * annualRentalIncome;
  const maintenanceCost = (maintenancePct / 100) * purchasePrice;
  const totalAnnualCosts =
    councilRates + waterRates + insurance + managementCost + maintenanceCost;

  // Yields
  const grossYield = (annualRentalIncome / purchasePrice) * 100;
  const netYield = ((annualRentalIncome - totalAnnualCosts) / totalCostBase) * 100;

  const annualNetIncome = annualRentalIncome - totalAnnualCosts;

  // Loan repayments (optional)
  let annualLoanRepayments = 0;
  if (loanAmount > 0 && loanRate > 0) {
    const r = loanRate / 100 / 12;
    const n = loanTermYears * 12;
    const monthly = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    annualLoanRepayments = monthly * 12;
  }

  const weeklyCashFlow = (annualNetIncome - annualLoanRepayments) / 52;

  return {
    annualRentalIncome: Math.round(annualRentalIncome),
    grossYield: Math.round(grossYield * 100) / 100,
    netYield: Math.round(netYield * 100) / 100,
    totalPurchaseCosts: Math.round(totalPurchaseCosts),
    totalAnnualCosts: Math.round(totalAnnualCosts),
    annualNetIncome: Math.round(annualNetIncome),
    weeklyCashFlow: Math.round(weeklyCashFlow),
    annualLoanRepayments: Math.round(annualLoanRepayments),
  };
}

export function RentalYieldCalculator() {
  // Property
  const [purchasePrice, setPurchasePrice] = useState(600_000);
  const [weeklyRent, setWeeklyRent] = useState(500);

  // Purchase costs
  const [stampDuty, setStampDuty] = useState(0);
  const [legalFees, setLegalFees] = useState(2_000);
  const [buildingInspection, setBuildingInspection] = useState(600);

  // Ongoing costs
  const [councilRates, setCouncilRates] = useState(2_000);
  const [waterRates, setWaterRates] = useState(800);
  const [insurance, setInsurance] = useState(2_500);
  const [managementPct, setManagementPct] = useState(8);
  const [maintenancePct, setMaintenancePct] = useState(0.5);

  // Loan (optional)
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanRate, setLoanRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);

  const result = useMemo(
    () =>
      computeRentalYield(
        purchasePrice,
        weeklyRent,
        stampDuty,
        legalFees,
        buildingInspection,
        councilRates,
        waterRates,
        insurance,
        managementPct,
        maintenancePct,
        loanAmount,
        loanRate,
        loanTermYears
      ),
    [
      purchasePrice,
      weeklyRent,
      stampDuty,
      legalFees,
      buildingInspection,
      councilRates,
      waterRates,
      insurance,
      managementPct,
      maintenancePct,
      loanAmount,
      loanRate,
      loanTermYears,
    ]
  );

  const fmt = (n: number) => formatPriceFull(Math.round(n));

  const cashFlowColor =
    result && result.weeklyCashFlow >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Property & Rent */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="purchase-price"
            label="Purchase Price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            prefix="$"
            step={10_000}
          />
          <NumberInput
            id="weekly-rent"
            label="Weekly Rent"
            value={weeklyRent}
            onChange={setWeeklyRent}
            prefix="$"
            step={10}
          />
        </div>
      </div>

      {/* Purchase costs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Purchase Costs</h2>
        <p className="text-sm text-gray-500">
          Use our{" "}
          <a href="/stamp-duty-calculator" className="text-primary underline hover:no-underline">
            Stamp Duty Calculator
          </a>{" "}
          to estimate stamp duty for your state.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput
            id="stamp-duty"
            label="Stamp Duty"
            value={stampDuty}
            onChange={setStampDuty}
            prefix="$"
            step={500}
          />
          <NumberInput
            id="legal-fees"
            label="Legal / Conveyancing Fees"
            value={legalFees}
            onChange={setLegalFees}
            prefix="$"
            step={100}
          />
          <NumberInput
            id="inspection"
            label="Building Inspection"
            value={buildingInspection}
            onChange={setBuildingInspection}
            prefix="$"
            step={50}
          />
        </div>
      </div>

      {/* Ongoing costs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Annual Ongoing Costs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            id="council"
            label="Council Rates (p.a.)"
            value={councilRates}
            onChange={setCouncilRates}
            prefix="$"
            step={100}
          />
          <NumberInput
            id="water"
            label="Water Rates (p.a.)"
            value={waterRates}
            onChange={setWaterRates}
            prefix="$"
            step={50}
          />
          <NumberInput
            id="insurance"
            label="Building Insurance (p.a.)"
            value={insurance}
            onChange={setInsurance}
            prefix="$"
            step={100}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PercentInput
            id="management"
            label="Property Management Fee"
            value={managementPct}
            onChange={setManagementPct}
            step={0.5}
            hint={`= ${fmt((managementPct / 100) * weeklyRent * 52)}/year`}
          />
          <PercentInput
            id="maintenance"
            label="Maintenance Allowance (% of value)"
            value={maintenancePct}
            onChange={setMaintenancePct}
            step={0.1}
            hint={`= ${fmt((maintenancePct / 100) * purchasePrice)}/year`}
          />
        </div>
      </div>

      {/* Optional loan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Loan Details{" "}
          <span className="text-sm font-normal text-gray-400">(optional — for cash flow)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput
            id="loan-amount"
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            prefix="$"
            step={10_000}
          />
          <PercentInput
            id="loan-rate"
            label="Interest Rate (% p.a.)"
            value={loanRate}
            onChange={setLoanRate}
            step={0.05}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
            <div className="flex gap-1.5 flex-wrap">
              {[10, 15, 20, 25, 30].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setLoanTermYears(yr)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    loanTermYears === yr
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

      {/* Results */}
      {result ? (
        <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
          {/* Hero */}
          <div className="gradient-brand p-6 text-white">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm opacity-90">Gross Rental Yield</p>
                <p className="text-4xl font-bold mt-1">{result.grossYield}%</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Net Rental Yield</p>
                <p className="text-4xl font-bold mt-1">{result.netYield}%</p>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
            <StatCard
              label="Annual Rental Income"
              value={fmt(result.annualRentalIncome)}
              sub="before expenses"
            />
            <StatCard
              label="Annual Expenses"
              value={fmt(result.totalAnnualCosts)}
              sub="ongoing costs"
            />
            <StatCard
              label="Annual Net Income"
              value={fmt(result.annualNetIncome)}
              sub="before tax"
            />
            <StatCard
              label="Weekly Cash Flow"
              value={`${result.weeklyCashFlow >= 0 ? "+" : ""}${fmt(result.weeklyCashFlow)}`}
              sub={loanAmount > 0 ? "after loan repayments" : "no loan entered"}
              valueClassName={cashFlowColor}
            />
          </div>

          {/* Breakdown */}
          <div className="px-6 pb-4 border-t border-gray-100 pt-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">Income &amp; Cost Breakdown</p>
            <SummaryRow label="Weekly rent" value={fmt(weeklyRent)} />
            <SummaryRow label="Annual rental income (× 52)" value={fmt(result.annualRentalIncome)} />
            <SummaryRow label="Total purchase costs" value={fmt(result.totalPurchaseCosts)} sub />
            <SummaryRow label="Annual ongoing costs" value={fmt(result.totalAnnualCosts)} sub />
            {loanAmount > 0 && (
              <SummaryRow
                label="Annual loan repayments"
                value={fmt(result.annualLoanRepayments)}
                sub
              />
            )}
            <div className="border-t border-gray-200 pt-3">
              <SummaryRow
                label="Annual net income (before tax)"
                value={fmt(result.annualNetIncome)}
                bold
              />
            </div>
          </div>

          <div className="px-6 pb-6 pt-2">
            <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                This calculator provides estimates only and does not constitute financial or tax
                advice. Yields, expenses, and cash flow will vary based on actual property
                performance. Consult a financial adviser or accountant for a personalised assessment.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-8 text-center text-gray-500">
          <Home className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Enter a purchase price and weekly rent to calculate yield.</p>
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
  step = 1000,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  step?: number;
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
          step={step}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={`w-full rounded-lg border border-gray-300 ${prefix ? "pl-9" : "pl-3"} pr-3 py-3 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none`}
        />
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function PercentInput({
  id,
  label,
  value,
  onChange,
  step = 0.5,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          min={0}
          max={100}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full rounded-lg border border-gray-300 pl-3 pr-8 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          %
        </span>
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  valueClassName,
}: {
  label: string;
  value: string;
  sub: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-bold text-gray-900 ${valueClassName ?? ""}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  sub,
}: {
  label: string;
  value: string;
  bold?: boolean;
  sub?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span
        className={`text-sm ${bold ? "font-semibold text-gray-900" : sub ? "text-gray-400 pl-4" : "text-gray-600"}`}
      >
        {label}
      </span>
      <span className={`text-sm ${bold ? "font-bold text-gray-900" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}
