"use client";

import { useState, useMemo } from "react";
import { Button, Input } from "@/components/ui";
import { calculateStampDuty } from "@/lib/utils/stamp-duty";
import { formatPriceFull } from "@/lib/utils/format";
import { Calculator, DollarSign, Info } from "lucide-react";

export function StampDutyCalculator() {
  const [price, setPrice] = useState("");
  const [isFirstHome, setIsFirstHome] = useState(false);
  const [isForeign, setIsForeign] = useState(false);
  const [isInvestment, setIsInvestment] = useState(false);

  const result = useMemo(() => {
    const value = Number(price.replace(/[^0-9]/g, ""));
    if (!value || value <= 0) return null;
    return calculateStampDuty({
      purchasePrice: value,
      isFirstHomeBuyer: isFirstHome,
      isForeignBuyer: isForeign,
      isInvestment,
    });
  }, [price, isFirstHome, isForeign, isInvestment]);

  const numericPrice = Number(price.replace(/[^0-9]/g, ""));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Input section */}
        <div className="space-y-4">
          <div>
            <label htmlFor="stamp-price" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="stamp-price"
                type="text"
                value={price}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  setPrice(raw ? Number(raw).toLocaleString() : "");
                }}
                placeholder="e.g. 650,000"
                className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-3 text-lg text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <CheckboxOption
              id="first-home"
              label="First home buyer"
              description="Eligible for QLD first home buyer concession"
              checked={isFirstHome}
              onChange={setIsFirstHome}
            />
            <CheckboxOption
              id="investment"
              label="Investment property"
              description="Not your primary place of residence"
              checked={isInvestment}
              onChange={setIsInvestment}
            />
            <CheckboxOption
              id="foreign"
              label="Foreign buyer"
              description="Additional 8% surcharge applies"
              checked={isForeign}
              onChange={setIsForeign}
            />
          </div>
        </div>

        {/* Results */}
        {result && numericPrice > 0 && (
          <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
            <div className="gradient-brand p-6 text-white text-center">
              <p className="text-sm opacity-90">Total Stamp Duty</p>
              <p className="text-4xl font-bold mt-1">{formatPriceFull(result.totalDuty)}</p>
              <p className="text-sm opacity-80 mt-1">
                Effective rate: {result.effectiveRate}%
              </p>
            </div>
            <div className="p-6 space-y-4">
              <ResultRow label="Transfer Duty" value={formatPriceFull(result.transferDuty)} />
              {result.firstHomeConcession > 0 && (
                <ResultRow
                  label="First Home Concession"
                  value={`-${formatPriceFull(result.firstHomeConcession)}`}
                  highlight
                />
              )}
              {result.foreignBuyerSurcharge > 0 && (
                <ResultRow
                  label="Foreign Buyer Surcharge (8%)"
                  value={formatPriceFull(result.foreignBuyerSurcharge)}
                  warning
                />
              )}
              <div className="border-t border-gray-200 pt-4">
                <ResultRow
                  label="Total Payable"
                  value={formatPriceFull(result.totalDuty)}
                  bold
                />
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  Based on QLD 2025-2026 transfer duty rates. This calculator provides an estimate only.
                  Consult your solicitor or conveyancer for exact figures.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckboxOption({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
      />
      <div>
        <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
          {label}
        </p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </label>
  );
}

function ResultRow({
  label,
  value,
  bold,
  highlight,
  warning,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-600"}`}>
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-green-600" : warning ? "text-red-600" : bold ? "text-lg font-bold text-gray-900" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
