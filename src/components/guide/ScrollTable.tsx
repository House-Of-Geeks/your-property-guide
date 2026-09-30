// A wide table inside a guide scrolls sideways on a phone instead of widening
// the article. `contain: inline-size` keeps the table's width from reaching
// the grid column (the column has no min-width: 0, and table headers do not
// wrap), which is what pushed the conveyancing guide to 625px at a 375px
// viewport. The region is focusable so a keyboard user can scroll it.
export function ScrollTable({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className="overflow-x-auto [contain:inline-size]">
      {children}
    </div>
  );
}
