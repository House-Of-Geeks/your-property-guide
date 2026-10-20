// The site's three kinds of action (v7, "Clear decisions", 20 Oct 2026).
// Plain class strings, in their own module so client components can import
// them alone.
//
// One solid action per screen: forest green with cream text and 4px corners
// (it flips to a cream button inside a .tone-dark band). The secondary is an
// outlined button where two buttons sit side by side; most second actions
// are a TEXT_LINK, an underlined link with an arrow, as in the approved design.

export const BUTTON_PRIMARY =
  "inline-flex items-center justify-center gap-3 rounded-[4px] bg-cta hover:bg-cta-hover text-cta-ink px-5 py-3 min-h-12 text-[15px] font-medium leading-snug transition-colors";

export const BUTTON_SECONDARY =
  "inline-flex items-center justify-center gap-3 rounded-[4px] border border-ink/70 text-ink hover:bg-ink hover:text-ink-inverse px-5 py-3 min-h-12 text-[15px] font-medium leading-snug transition-colors";

export const TEXT_LINK =
  "inline-flex items-center gap-3 border-b border-line-strong py-1.5 text-[15px] font-medium text-ink hover:text-primary hover:border-primary transition-colors";
