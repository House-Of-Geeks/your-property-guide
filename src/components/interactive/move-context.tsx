"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// The move someone picked (selling, buying or both), shared by the parts of
// a page that answer to it: the homepage hero's switch sets it, and the
// number tools and the plan builder follow it until someone changes them.

export type Move = "selling" | "buying" | "both";

const MoveContext = createContext<{ move: Move; setMove: (m: Move) => void } | null>(null);

export function MoveProvider({ initial = "selling", children }: { initial?: Move; children: ReactNode }) {
  const [move, setMove] = useState<Move>(initial);
  return <MoveContext.Provider value={{ move, setMove }}>{children}</MoveContext.Provider>;
}

/** The shared move, or null outside a MoveProvider. */
export function useMove() {
  return useContext(MoveContext);
}
