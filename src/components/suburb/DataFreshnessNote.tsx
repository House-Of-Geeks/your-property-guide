import { RefreshCw } from "lucide-react";

interface DataFreshnessNoteProps {
  label:   string;
  asOf:    Date | null;
  source?: string;
}

export function DataFreshnessNote({ label, asOf, source }: DataFreshnessNoteProps) {
  if (!asOf) return null;

  const formatted = new Date(asOf).toLocaleDateString("en-AU", {
    month: "long",
    year:  "numeric",
  });

  return (
    <p className="flex items-center gap-1 text-xs text-gray-400 mt-2">
      <RefreshCw className="w-3 h-3 flex-shrink-0" />
      {label} data as of {formatted}
      {source && <span className="text-gray-300">· {source}</span>}
    </p>
  );
}
