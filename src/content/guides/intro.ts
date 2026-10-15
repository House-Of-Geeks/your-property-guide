import type { GuideBookId } from "@/lib/guide-books";

// Each guide opens with a short note from Andy (campaign rebuild, 15 Oct
// 2026). The only facts in it are the ones in src/lib/founder.ts. The guide
// landing pages, the first chapter of each guide and the PDFs show it.

export interface GuideIntro {
  heading: string;
  paragraphs: readonly string[];
}

export const GUIDE_INTRO: Record<GuideBookId, GuideIntro> = {
  selling: {
    heading: "Why the campaign beats the market",
    paragraphs: [
      "I started my career selling homes worth $10 million to $20 million, all over Australia. At that level, nobody leaves the price to the market. The evidence is on the table before anyone names a number, the home is presented and launched for the one buyer who’ll pay the most, and every offer is negotiated as though the last $50,000 matters, because it does.",
      "In the past five years my advice has generated over $4 billion in property sales, and the lesson hasn’t changed: the price you get comes down to the campaign. A good market won’t save a weak campaign, and a slack agent can’t hide behind a slow one.",
      "This guide is that campaign, written down for every home. Chapters 1 to 3 get you your number. Chapter 4 presents the home for the top buyer. Chapter 5 hires the agent who’ll run it. Chapters 6 to 8 choose the method, launch it and negotiate every dollar. Chapters 9 and 10 close it out.",
    ],
  },
  buying: {
    heading: "Every seller’s agent is running a campaign. It’s aimed at you.",
    paragraphs: [
      "I started my career on the selling side, running campaigns for homes worth $10 million to $20 million. Every listing you’ll inspect is being sold with a campaign too: a price guide, a launch, the open homes, the follow-up calls and a deadline, all built to bring the most buyers to the highest number.",
      "None of that is a trick. It’s how property is sold. But a buyer who doesn’t know how the campaign works ends up paying for it. This guide shows you the seller’s playbook from your side of the table, so you can run your own buying campaign: know your number, read their tactics, and make your offer on your terms.",
    ],
  },
};
