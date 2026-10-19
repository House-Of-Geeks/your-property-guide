"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Journey } from "@/lib/lead-kinds";
import type { PlanPlace } from "@/lib/plans/start";

// The move someone picked (selling, buying or both), shared by the parts of
// a page that answer to it: the homepage hero's switch sets it, and the
// number tools, the plan preview and the agent finder follow it until
// someone changes them.
//
// With `publish`, the provider also tells the header and the phone bar
// (which live in the layout, outside the page's tree), so their plan button
// matches the move picked in the hero (19 Oct 2026), and since 20 Oct 2026
// the suburb picked there too: the phone bar's "Next-step plan" used to drop
// it and ask for the state again.

export type Move = "selling" | "buying" | "both";

/** The move the homepage starts on, so the header can match it before hydration. */
export const DEFAULT_MOVE: Move = "selling";

export const journeyForMove = (m: Move): Journey => (m === "both" ? "buying-and-selling" : m);

interface MoveState {
  move: Move;
  setMove: (m: Move) => void;
  /** The suburb picked in the hero's plan field, or null. */
  place: PlanPlace | null;
  setPlace: (p: PlanPlace | null) => void;
}

const MoveContext = createContext<MoveState | null>(null);

// What the page has published: a tiny store the layout's components subscribe to.
let published: Move | null = null;
let publishedPlace: PlanPlace | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function MoveProvider({ initial = DEFAULT_MOVE, publish: share = false, children }: { initial?: Move; publish?: boolean; children: ReactNode }) {
  const [move, setMove] = useState<Move>(initial);
  const [place, setPlace] = useState<PlanPlace | null>(null);
  useEffect(() => {
    if (!share) return;
    if (published !== move) {
      published = move;
      notify();
    }
  }, [share, move]);
  useEffect(() => {
    if (!share) return;
    if (publishedPlace?.slug !== place?.slug) {
      publishedPlace = place;
      notify();
    }
  }, [share, place]);
  useEffect(() => {
    if (!share) return;
    return () => {
      published = null;
      publishedPlace = null;
      notify();
    };
  }, [share]);
  return <MoveContext.Provider value={{ move, setMove, place, setPlace }}>{children}</MoveContext.Provider>;
}

/** The shared move, or null outside a MoveProvider. */
export function useMove() {
  return useContext(MoveContext);
}

/** The move a page has published (the homepage hero), or null. For the header and the phone bar. */
export function usePublishedMove(): Move | null {
  return useSyncExternalStore(subscribe, () => published, () => null);
}

/** The suburb a page has published (the homepage hero's field), or null. For the header and the phone bar. */
export function usePublishedPlace(): PlanPlace | null {
  return useSyncExternalStore(subscribe, () => publishedPlace, () => null);
}
