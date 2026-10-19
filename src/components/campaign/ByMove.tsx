"use client";

import type { ReactNode } from "react";
import { DEFAULT_MOVE, useMove } from "@/components/interactive/move-context";

// Shows the buyer's version of a passage when Buying is picked in the hero,
// and the seller's version for Selling and Both (20 Oct 2026). Lets the
// server-rendered bands further down the homepage keep talking to whoever
// the hero is talking to, without becoming client components themselves.

export function ByMove({ buying, other }: { buying: ReactNode; other: ReactNode }) {
  const move = useMove()?.move ?? DEFAULT_MOVE;
  return <>{move === "buying" ? buying : other}</>;
}
