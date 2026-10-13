/**
 * A stat figure in tabular numerals. Brand v4 (Oct 2026) dropped the
 * count-up animation: numbers show as they are, at rest.
 */
export function StatNumber({ value, className }: { value: string; className?: string }) {
  return (
    <span className={className ? `tabular-nums ${className}` : "tabular-nums"}>
      {value}
    </span>
  );
}
