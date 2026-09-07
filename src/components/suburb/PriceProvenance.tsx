import { Info } from "lucide-react";
import type { SalesProvenance } from "@/lib/sales-provenance";

// The line under every median house price: sample, source and period, plus
// the area caveat for ABS statistical-area figures (fix item 1, steps iv–v).
export function PriceProvenance({ provenance }: { provenance: SalesProvenance | null }) {
  if (!provenance) return null;
  return (
    <div className="mt-3 text-xs text-ink-subtle leading-relaxed">
      <p className="flex items-start gap-1.5">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <span>{provenance.short}</span>
      </p>
      {provenance.areaNote && <p className="mt-1 pl-5">{provenance.areaNote}</p>}
    </div>
  );
}
