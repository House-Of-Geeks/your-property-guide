// The buyer's answers on the introduction form, with the words both the form
// and the agent see (20 Oct 2026). One list, so the Sent 24/7 custom fields
// read exactly as the person chose them.

export const INTRO_BUYER_TYPES = [
  { id: "first-home", label: "My first home" },
  { id: "next-home", label: "My next home" },
  { id: "investing", label: "An investment" },
  { id: "downsizing", label: "Downsizing" },
] as const;

export const INTRO_BUDGETS = [
  { id: "under-600k", label: "Under $600k" },
  { id: "600k-900k", label: "$600k to $900k" },
  { id: "900k-1.3m", label: "$900k to $1.3m" },
  { id: "1.3m-2m", label: "$1.3m to $2m" },
  { id: "over-2m", label: "Over $2m" },
  { id: "unsure", label: "Not sure yet" },
] as const;

const labelFrom = (list: readonly { id: string; label: string }[], id: string | null | undefined) =>
  id ? (list.find((o) => o.id === id)?.label ?? id) : undefined;

export const buyerTypeLabel = (id: string | null | undefined) => labelFrom(INTRO_BUYER_TYPES, id);
export const budgetLabel = (id: string | null | undefined) => labelFrom(INTRO_BUDGETS, id);
