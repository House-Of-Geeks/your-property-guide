"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Journey } from "@/lib/lead-kinds";

// The move someone picked (selling, buying or both), shared by the parts of
// a page that answer to it: the homepage hero's switch sets it, and the
// number tools, the plan preview and the agent finder follow it until
// someone changes them.
//
// With `publish`, the provider also tells the header and the phone bar
// (which live in the layout, outside the page's tree), so their plan button
// matches the move picked in the hero (19 Oct 2026).

export type Move = "selling" | "buying" | "both";

/** The move the homepage starts on, so the header can match it before hydration. */
export const DEFAULT_MOVE: Move = "selling";

export const journeyForMove = (m: Move): Journey => (m === "both" ? "buying-and-selling" : m);

const MoveContext = createContext<{ move: Move; setMove: (m: Move) => void } | null>(null);

// The published move: a tiny store the layout's components subscribe to.
let published: Move | null = null;
const listeners = new Set<() => void>();
function publish(m: Move | null) {
  if (published === m) return;
  published = m;
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function MoveProvider({ initial = DEFAULT_MOVE, publish: share = false, children }: { initial?: Move; publish?: boolean; children: ReactNode }) {
  const [move, setMove] = useState<Move>(initial);
  useEffect(() => {
    if (!share) return;
    publish(move);
  }, [share, move]);
  useEffect(() => {
    if (!share) return;
    return () => publish(null);
  }, [share]);
  return <MoveContext.Provider value={{ move, setMove }}>{children}</MoveContext.Provider>;
}

/** The shared move, or null outside a MoveProvider. */
export function useMove() {
  return useContext(MoveContext);
}

/** The move a page has published (the homepage hero), or null. For the header and the phone bar. */
export function usePublishedMove(): Move | null {
  return useSyncExternalStore(subscribe, () => published, () => null);
}
