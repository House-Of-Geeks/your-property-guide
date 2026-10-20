// The framing on each /guides/* article (15 Oct 2026; reworded 20 Oct 2026
// for "Clear decisions"): a short hook at the top that says what matters
// in the topic and what to check, and one call to action at the end that
// fits why people read it. The type names keep their original "campaign"
// wording; the copy no longer uses it as the idea.

/** Which end-of-article call to action fits the article. */
export type CampaignCtaKind =
  | "selling-plan" // build my next-step plan (selling)
  | "buying-plan" // build my next-step plan (buying)
  | "moving-plan" // buying and selling
  | "agreement-check" // before you sign an agency agreement
  | "selling-agent" // one participating selling agent
  | "buyers-agent"; // one buyer's agent on your side

export interface ArticleCampaign {
  /**
   * One or two sentences, at most about 50 words, that say what matters in
   * the article's topic and what to check. Plain Australian English, no
   * first person, and no fact that isn't already in the article.
   */
  hook: string;
  cta: CampaignCtaKind;
}

export type ArticleCampaignBatch = Readonly<Record<string, ArticleCampaign>>;

/** The guide chapter an article's call to action points to (chapters.ts). */
export interface ArticleChapterRef {
  guide: "selling" | "buying";
  chapter: number;
}
