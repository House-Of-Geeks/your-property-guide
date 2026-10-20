import type { ReactNode } from "react";
import type { GuideBookId } from "@/lib/guide-books";

// One chapter of a free guide (15 Oct 2026; retitled 20 Oct 2026). The chapter
// pages (/selling-guide/<slug>, /buying-guide/<slug>) and the printed PDFs
// render the same objects, so the web and the PDF never disagree. The title
// and slug live in src/lib/guide-books.ts with the guide's contents.

export interface ChapterCta {
  kind: "tool" | "plan" | "agreement-check" | "agent";
  title: string;
  body: string;
  label: string;
  href: string;
}

export interface Chapter {
  guide: GuideBookId;
  /** 1 to 10, matching the guide's contents. */
  number: number;
  /** The decision the chapter helps with, in a few words ("Understand your costs"). */
  step: string;
  standfirst: string;
  /**
   * The chapter's callout: "What experienced sellers do" in the selling
   * guide, "Seeing it from the seller’s side" in the buying guide.
   * Principle only, two to four sentences, never an anecdote.
   */
  callout: string;
  /** "Your checklist": the chapter's practical steps. */
  checklist: readonly string[];
  /** The one call to action at the end of the chapter. */
  cta: ChapterCta;
  /** When the chapter's figures were current, shown under it. */
  checked: string;
  Body: () => ReactNode;
}

// 20 Oct 2026 ("Clear decisions"): constructive titles. The callouts used to
// be "How it's done at the top end" and "What the selling agent is doing
// right now"; the checklists were "campaign" checklists.
export const CALLOUT_TITLE: Record<GuideBookId, string> = {
  selling: "What experienced sellers do",
  buying: "Seeing it from the seller’s side",
};

export const CHECKLIST_TITLE: Record<GuideBookId, string> = {
  selling: "Your checklist",
  buying: "Your checklist",
};

/** The general-information line under every chapter (from the guide's disclaimer). */
export const CHAPTER_DISCLAIMER =
  "General information only, not financial, legal or tax advice. Costs, rules and timeframes vary by state, suburb and situation, and they change. Check the current rules for your state before you act.";
