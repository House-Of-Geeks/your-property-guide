"use client";

import { useState, useMemo } from "react";
import { DollarSign, Info } from "lucide-react";
import { formatPriceFull } from "@/lib/utils/format";

type OwnershipType = "individual" | "joint" | "company" | "trust";
type MarginalRate = 19 | 32.5 | 37 | 45;

const OWNERSHIP_LABELS: Record<OwnershipType, string> = {
  individual: "Individual",
  joint: "Joint (50/50)",
  company: "Company",
  trust: "Trust",
};

function computeCGT(inputs: {
  purchasePrice: number;
  salePrice: number;
  purchaseCosts: number;
  saleCosts: number;
  yearsHeld: number;
  ownershipType: OwnershipType;
  marginalRate: MarginalRate;
  isPrimaryResidence: boolean;
  wasRented: boolean;
  totalDays: number;
  daysAsPrimaryResidence: number;
}) {
  const {
    purchasePrice,
    salePrice,
    purchaseCosts,
    saleCosts,
    yearsHeld,
    ownershipType,
    marginalRate,
    isPrimaryResidence,
    wasRented,
    totalDays,
    daysAsPrimaryResidence,
  } = inputs;

  const costBase = purchasePrice + purchaseCosts;
  const proceeds = salePrice - saleCosts;
  const grossGain = proceeds - costBase;

  let taxableGain = grossGain;
  let discountApplied: "none" | "full" | "partial" | "exempt" = "none";
  let exemptionNote = "";

  if (isPrimaryResidence && !wasRented) {
    // Full main residence exemption
    taxableGain = 0;
    discountApplied = "exempt";
    exemptionNote = "Full main residence exemption applies";
  } else if (isPrimaryResidence && wasRented) {
    // Partial exemption
    const daysRented = totalDays - daysAsPrimaryResidence;
    const taxableFraction = totalDays > 0 ? daysRented / totalDays : 0;
    const taxablePortion = grossGain * taxableFraction;
    if (yearsHeld > 1) {
      taxableGain = taxablePortion * 0.5;
      discountApplied = "partial";
    } else {
      taxableGain = taxablePortion;
      discountApplied = "partial";
    }
    exemptionNote = `Partial exemption: ${Math.round((1 - taxableFraction) * 100)}% exempt (${daysAsPrimaryResidence} of ${totalDays} days as primary residence)`;
  } else {
    // Investment property
    if (yearsHeld > 1) {
      taxableGain = grossGain * 0.5;
      discountApplied = "full";
    } else {
      taxableGain = grossGain;
      discountApplied = "none";
    }
  }

  // For joint ownership, each party pays on their share
  const shareMultiplier = ownershipType === "joint" ? 0.5 : 1;
  const perPartyTaxableGain = taxableGain * shareMultiplier;

  const taxPayable = Math.max(0, perPartyTaxableGain * (marginalRate / 100));
  const totalTaxPayable = ownershipType === "joint" ? taxPayable * 2 : taxPayable;

  const netProfit = grossGain - totalTaxPayable;
  const effectiveRate = grossGain > 0 ? (totalTaxPayable / grossGain) * 100 : 0;

  return {
    costBase,
    proceeds,
    grossGain,
    taxableGain,
    totalTaxPayable,
    netProfit,
    effectiveRate,
    discountApplied,
    exemptionNote,
    perPartyTaxableGain,
    perPartyTax: taxPayable,
    isJoint: ownershipType === "joint",
  };
}

export function CGTCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(500_000);
  const [salePrice, setSalePrice] = useState(700_000);
  const [purchaseCosts, setPurchaseCosts] = useState(0);
  const [saleCosts, setSaleCosts] = useState(0);
  const [yearsHeld, setYearsHeld] = useState(5);
  const [ownershipType, setOwnershipType] = useState<OwnershipType>("individual");
  const [marginalRate, setMarginalRate] = useState<MarginalRate>(37);
  const [isPrimaryResidence, setIsPrimaryResidence] = useState(false);
  const [wasRented, setWasRented] = useState(false);
  const [totalDays, setTotalDays] = useState(1825);
  const [daysAsPrimaryResidence, setDaysAsPrimaryResidence] = useState(912);

  const result = useMemo(
    () =>
      computeCGT({
        purchasePrice,
        salePrice,
        purchaseCosts,
        saleCosts,
        yearsHeld,
        ownershipType,
        marginalRate,
        isPrimaryResidence,
        wasRented,
        totalDays,
        daysAsPrimaryResidence,
      }),
    [
      purchasePrice,
      salePrice,
      purchaseCosts,
      saleCosts,
      yearsHeld,
      ownershipType,
      marginalRate,
      isPrimaryResidence,
      wasRented,
      totalDays,
      daysAsPrimaryResidence,
    ]
  );

  const fmt = (n: number) => formatPriceFull(Math.round(n));

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none";
  const dollarInputClass =
    "w-full rounded-lg border border-gray-300 pl-9 pr-3 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Purchase Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                step={1000}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className={dollarInputClass}
              />
            </div>
          </div>

          {/* Sale Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                step={1000}
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className={dollarInputClass}
              />
            </div>
          </div>

          {/* Purchase Costs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Costs
              <span className="text-xs text-gray-400 ml-1">(stamp duty, legal)</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                step={100}
                value={purchaseCosts}
                onChange={(e) => setPurchaseCosts(Number(e.target.value))}
                className={dollarInputClass}
              />
            </div>
          </div>

          {/* Sale Costs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Costs
              <span className="text-xs text-gray-400 ml-1">(agent, legal)</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                step={100}
                value={saleCosts}
                onChange={(e) => setSaleCosts(Number(e.target.value))}
                className={dollarInputClass}
              />
            </div>
          </div>
        </div>

        {/* Years Held */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years Held
            <span className="text-xs text-gray-400 ml-1">(must be &gt;1 year for 50% CGT discount)</span>
          </label>
          <input
            type="number"
            min={0}
            max={50}
            step={1}
            value={yearsHeld}
            onChange={(e) => setYearsHeld(Number(e.target.value))}
            className={inputClass}
          />
        </div>

        {/* Ownership Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ownership Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(OWNERSHIP_LABELS) as OwnershipType[]).map((t) => (
              <button
                key={t}
                onClick={() => setOwnershipType(t)}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                  ownershipType === t
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                {OWNERSHIP_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Marginal Tax Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marginal Tax Rate
          </label>
          <div className="grid grid-cols-4 gap-2">
            {([19, 32.5, 37, 45] as MarginalRate[]).map((r) => (
              <button
                key={r}
                onClick={() => setMarginalRate(r)}
                className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                  marginalRate === r
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>

        {/* Primary Residence */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimaryResidence}
              onChange={(e) => {
                setIsPrimaryResidence(e.target.checked);
                if (!e.target.checked) setWasRented(false);
              }}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              This is / was my primary residence (main residence exemption may apply)
            </span>
          </label>

          {isPrimaryResidence && (
            <label className="flex items-center gap-3 cursor-pointer ml-7">
              <input
                type="checkbox"
                checked={wasRented}
                onChange={(e) => setWasRented(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                I rented it out at some point (partial exemption applies)
              </span>
            </label>
          )}
        </div>

        {/* Partial exemption fields */}
        {isPrimaryResidence && wasRented && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-7">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Days Owned
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days Used as Primary Residence
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={daysAsPrimaryResidence}
                onChange={(e) => setDaysAsPrimaryResidence(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
        {/* Hero */}
        <div className="gradient-brand p-6 text-white text-center">
          <p className="text-sm opacity-90">Estimated CGT Payable</p>
          <p className="text-5xl font-bold mt-1 tracking-tight">
            {fmt(result.totalTaxPayable)}
          </p>
          {result.discountApplied === "exempt" && (
            <p className="text-sm opacity-80 mt-1">Full main residence exemption</p>
          )}
          {result.discountApplied === "full" && (
            <p className="text-sm opacity-80 mt-1">50% CGT discount applied (held &gt;1 year)</p>
          )}
          {result.discountApplied === "partial" && (
            <p className="text-sm opacity-80 mt-1">Partial exemption applied</p>
          )}
          {result.discountApplied === "none" && (
            <p className="text-sm opacity-80 mt-1">No CGT discount (held ≤1 year)</p>
          )}
        </div>

        <div className="p-6 space-y-3">
          <ResultRow label="Cost Base" value={fmt(result.costBase)} />
          <ResultRow label="Capital Proceeds" value={fmt(result.proceeds)} />
          <ResultRow
            label="Gross Capital Gain"
            value={fmt(result.grossGain)}
            highlight={result.grossGain < 0 ? "red" : undefined}
          />
          {result.discountApplied !== "exempt" && result.grossGain > 0 && (
            <>
              <div className="border-t border-gray-100 pt-3">
                <ResultRow
                  label={
                    result.discountApplied === "full"
                      ? "Taxable Capital Gain (after 50% discount)"
                      : result.discountApplied === "partial"
                      ? "Taxable Capital Gain (after partial exemption)"
                      : "Taxable Capital Gain"
                  }
                  value={fmt(result.taxableGain)}
                />
              </div>
              {result.isJoint && (
                <ResultRow
                  label="Your Share of Taxable Gain (50%)"
                  value={fmt(result.perPartyTaxableGain)}
                />
              )}
              <ResultRow
                label={result.isJoint ? "Your Share of CGT" : "Estimated CGT Payable"}
                value={fmt(result.perPartyTax)}
                highlight="primary"
              />
              {result.isJoint && (
                <ResultRow
                  label="Total CGT (both parties)"
                  value={fmt(result.totalTaxPayable)}
                />
              )}
            </>
          )}
          {result.discountApplied === "exempt" && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
              {result.exemptionNote}
            </div>
          )}
          {result.discountApplied === "partial" && result.exemptionNote && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
              {result.exemptionNote}
            </div>
          )}
          <div className="border-t border-gray-100 pt-3 space-y-3">
            <ResultRow
              label="Effective CGT Rate"
              value={`${result.effectiveRate.toFixed(1)}%`}
            />
            <ResultRow
              label="Net Profit After CGT"
              value={fmt(result.netProfit)}
              highlight={result.netProfit < 0 ? "red" : "green"}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="px-6 pb-6">
          <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              This is an estimate only. CGT calculations can be complex — factors such as
              capital improvements, depreciation recapture, and individual circumstances may
              affect your liability. Consult a registered tax adviser for your specific
              situation.
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
