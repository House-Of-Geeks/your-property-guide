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

// Both tones render in ink: roof tile is kept for actions (brand v4). `tone`
// stays in the props so existing call sites compile.
export function KeyFigure({ value, label, context }: KeyFigureProps) {
  const valueColor = "text-ink";
  return (
    <div className="my-8 grid sm:grid-cols-12 gap-4 sm:gap-6 items-baseline border-y border-line py-6">
      <div className="sm:col-span-4">
        <div className={`font-display font-bold text-[2.75rem] sm:text-5xl leading-none tracking-[-0.03em] tabular-nums ${valueColor}`}>
          {value}
        </div>
      </div>
      <div className="sm:col-span-8">
        <div className="font-sans text-base text-ink leading-relaxed">{label}</div>
        {context && (
          <div className="font-sans text-sm text-ink-muted mt-2">{context}</div>
        )}
      </div>
    </div>
  );
}
