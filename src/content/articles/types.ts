// The campaign framing on each /guides/* article (campaign rebuild, 15 Oct
// 2026): a short hook at the top that ties the topic to the campaign, and
// one call to action at the end that fits why people read it.

/** Which end-of-article call to action fits the article. */
export type CampaignCtaKind =
  | "selling-plan" // build my campaign plan (selling)
  | "buying-plan" // build my buying plan
  | "moving-plan" // buying and selling
  | "agreement-check" // before you sign an agency agreement
  | "selling-agent" // one selling agent who runs the campaign
  | "buyers-agent"; // one buyer's agent on your side

export interface ArticleCampaign {
  /**
   * One or two sentences, at most about 50 words, that tie the article's
   * topic to the campaign idea. Plain Australian English, no first person,
   * and no fact that isn't already in the article.
   */
  hook: string;
  cta: CampaignCtaKind;
}

export type ArticleCampaignBatch = Readonly<Record<string, ArticleCampaign>>;
