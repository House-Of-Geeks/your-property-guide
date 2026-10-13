"use client";

import { createContext, useContext } from "react";
import type { GuideAudience } from "@/lib/guide-funnel";

interface GuidePageContext {
  /** Which guide this page's CTAs push; undefined keeps the selling default. */
  audience?: GuideAudience;
  /** The page's slug, added to funnel links as ?from= for attribution. */
  from?: string;
}

const Ctx = createContext<GuidePageContext>({});

/**
 * Set by GuideArticleLayout from the guide's frontmatter, so in-body CTAs
 * (MatchCTA) follow the page's persona without every call site restating it.
 */
export function GuideAudienceProvider({ audience, from, children }: GuidePageContext & { children: React.ReactNode }) {
  return <Ctx.Provider value={{ audience, from }}>{children}</Ctx.Provider>;
}

export function useGuidePage(): GuidePageContext {
  return useContext(Ctx);
}
