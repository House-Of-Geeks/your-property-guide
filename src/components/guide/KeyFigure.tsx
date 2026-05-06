interface KeyFigureProps {
  // The headline number / value, e.g. "$30,000" or "5%" or "35,000".
  value: string;
  // What it represents.
  label: string;
  // Optional context line under the label (source, date, caveat).
  context?: string;
  // Variant styling.
  tone?: "default" | "accent";
}

// Editorial pull-out for a single statistic. Use sparingly inside guide body
// to break up text walls and emphasise a citation-ready number.

export function KeyFigure({ value, label, context, tone = "default" }: KeyFigureProps) {
  const valueColor = tone === "accent" ? "text-cta" : "text-primary";
  return (
    <div className="my-8 grid sm:grid-cols-12 gap-4 sm:gap-6 items-baseline border-y border-line py-6">
      <div className="sm:col-span-4">
        <p className={`font-display text-5xl sm:text-6xl leading-none tracking-tight ${valueColor}`}>
          {value}
        </p>
      </div>
      <div className="sm:col-span-8">
        <p className="font-sans text-base text-ink leading-relaxed">{label}</p>
        {context && (
          <p className="font-sans text-xs text-ink-subtle uppercase tracking-wider mt-2">{context}</p>
        )}
      </div>
    </div>
  );
}
