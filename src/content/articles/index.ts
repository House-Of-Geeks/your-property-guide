import type { ArticleCampaign, ArticleCampaignBatch } from "./types";

export type { ArticleCampaign, CampaignCtaKind } from "./types";

// Every article's hook and call to action, by slug. Written in batches of
// about 20 (highest-traffic and commission or fee articles first); a test
// keeps every slug in src/lib/guides/registry.ts covered once all batches
// are in.
const BATCHES: readonly ArticleCampaignBatch[] = [];

export const ARTICLE_CAMPAIGN: Readonly<Record<string, ArticleCampaign>> = Object.assign({}, ...BATCHES);

export function articleCampaign(slug: string): ArticleCampaign | undefined {
  return ARTICLE_CAMPAIGN[slug];
}
