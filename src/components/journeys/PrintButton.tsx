"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-4 py-2.5 text-[15px] font-semibold text-ink hover:border-ink print:hidden">
      <Printer className="h-4 w-4" aria-hidden="true" /> {label}
    </button>
  );
}
