import type { ArticleCampaign, ArticleCampaignBatch } from "./types";
import { batch1 } from "./batches/batch-01";
import { batch2 } from "./batches/batch-02";
import { batch3 } from "./batches/batch-03";
import { batch4 } from "./batches/batch-04";
import { batch5 } from "./batches/batch-05";
import { batch6 } from "./batches/batch-06";
import { batch7 } from "./batches/batch-07";
import { batch8 } from "./batches/batch-08";
import { batch9 } from "./batches/batch-09";

export type { ArticleCampaign, CampaignCtaKind } from "./types";

// Every article's hook and call to action, by slug. Written in batches of
// about 20 (highest-traffic and commission or fee articles first); a test
// keeps every slug in src/lib/guides/registry.ts covered once all batches
// are in.
const BATCHES: readonly ArticleCampaignBatch[] = [batch1, batch2, batch3, batch4, batch5, batch6, batch7, batch8, batch9];

export const ARTICLE_CAMPAIGN: Readonly<Record<string, ArticleCampaign>> = Object.assign({}, ...BATCHES);

export function articleCampaign(slug: string): ArticleCampaign | undefined {
  return ARTICLE_CAMPAIGN[slug];
}
