import { Check } from "lucide-react";

// A trust item can be a simple string (renders as a single inline check + text)
// or a rich object with a bold lead and a descriptive body line, matching the
// editorial "bold claim, then evidence" pattern used by polished B2B sites.
export type TrustItem = string | { lead: string; body: string };

interface TrustStripProps {
  items?: readonly TrustItem[];
  className?: string;
  // "light" reads on white surfaces; "dark" reads on inverse/dark surfaces.
  tone?: "light" | "dark";
  // "inline" is the original tight horizontal row (default for compatibility).
  // "rich" is the editorial 3-up grid with bold lead + body line per item.
  variant?: "inline" | "rich";
}

const DEFAULT_ITEMS: TrustItem[] = [
  "Free for buyers",
  "Paid by partners",
  "No spam, ever",
];

export function TrustStrip({
  items = DEFAULT_ITEMS,
  tone = "light",
  variant = "inline",
  className,
}: TrustStripProps) {
  const text = tone === "dark" ? "text-white/70" : "text-ink-muted";
  const lead = tone === "dark" ? "text-white" : "text-ink";
  const icon = tone === "dark" ? "text-white/40" : "text-cta";

  if (variant === "rich") {
    return (
      <ul className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 ${className ?? ""}`}>
        {items.map((item) => {
          const isRich = typeof item !== "string";
          const leadText = isRich ? item.lead : item;
          const bodyText = isRich ? item.body : null;
          const key = isRich ? item.lead : item;
          return (
            <li key={key} className="flex items-start gap-2.5">
              <Check className={`w-4 h-4 mt-1 shrink-0 ${icon}`} aria-hidden="true" />
              <p className={`font-sans text-sm leading-relaxed ${text}`}>
                <span className={`font-medium ${lead}`}>{leadText}</span>
                {bodyText && <> <span className="opacity-90">{bodyText}</span></>}
              </p>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-sans ${text} ${className ?? ""}`}>
      {items.map((item) => {
        const display = typeof item === "string" ? item : `${item.lead} ${item.body}`;
        const key = typeof item === "string" ? item : item.lead;
        return (
          <li key={key} className="inline-flex items-center gap-1.5">
            <Check className={`w-4 h-4 ${icon}`} aria-hidden="true" />
            {display}
          </li>
        );
      })}
    </ul>
  );
}
