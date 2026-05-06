// Editorial section divider. A thin rule with three dots in the middle, in
// the brand magenta. Used between suburb-page sections to add visual rhythm
// without being heavy.

interface SectionDividerProps {
  className?: string;
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`flex items-center justify-center gap-2 py-4 ${className ?? ""}`}
    >
      <span className="block w-16 sm:w-24 h-px bg-line-strong" />
      <span className="block w-1 h-1 rounded-full bg-cta" />
      <span className="block w-1 h-1 rounded-full bg-primary" />
      <span className="block w-1 h-1 rounded-full bg-cta" />
      <span className="block w-16 sm:w-24 h-px bg-line-strong" />
    </div>
  );
}
