import type { GuideBookId } from "@/lib/guide-books";

// Each guide opens with a short note from Andy (15 Oct 2026; rewritten
// 20 Oct 2026 for "Clear decisions"). His experience is background: it says
// why the guide is worth reading, never what the reader's price will be. The
// only facts in it are the ones in src/lib/founder.ts. The guide landing
// pages, the first chapter of each guide and the PDFs show it.

export interface GuideIntro {
  heading: string;
  paragraphs: readonly string[];
}

export const GUIDE_INTRO: Record<GuideBookId, GuideIntro> = {
  selling: {
    heading: "Why I wrote this guide",
    paragraphs: [
      "Selling a home comes down to a handful of decisions that matter more than the rest: what the property is likely to be worth, what the sale will cost, what is worth preparing, who you sell with and how you handle the offers. Most people make them only a few times in their lives.",
      "I started my career selling homes across Australia and later advised property companies. The same questions come up at every price: what the evidence says, what each cost is for, and what is worth doing before you sell. Market conditions matter too, so this guide explains how to read them and where to focus on what you can control.",
      "Chapters 1 to 3 cover timing, value and costs. Chapter 4 helps you decide what to prepare. Chapters 5 to 7 cover choosing an agent, the way you sell and the marketing. Chapters 8 to 10 take you through offers, contracts, settlement and a 12-week timeline.",
    ],
  },
  buying: {
    heading: "Why I wrote this guide",
    paragraphs: [
      "Buying a home brings a lot of new information at once: borrowing limits, schemes, inspections, contracts and settlement dates. It helps to know which decisions come first, and which figures need confirming with a lender, conveyancer or inspector.",
      "I started my career on the selling side, so I know how sales are usually prepared, priced and run. This guide explains that process from the buyer’s point of view, so you can understand what you’re seeing and decide at your own pace.",
      "Chapters 1 to 3 cover where you’re starting from, your budget and the schemes in your state. Chapters 4 to 7 cover choosing an area, inspecting, how homes are marketed and sold, and making an offer. Chapters 8 to 10 take you through finance, contracts, settlement and a 12-week timeline.",
    ],
  },
};
