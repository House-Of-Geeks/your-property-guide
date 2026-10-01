// Frontmatter of the eight "cost of selling a house in {State}" guides.
// Lives outside the page template so the guide registry (sitemap lastmod,
// /guides, hub lists) can read a guide's title and date without importing
// the React template. The template re-exports it, so existing imports hold.
import type { GuideFrontmatter } from "@/components/guide/GuideArticleLayout";
import type { StateCode } from "@/lib/data/commission-rates";
import { money, sellingCostTable } from "@/lib/data/selling-costs";
import { COST_OF_SELLING_AS_OF, COST_OF_SELLING_STATE } from "@/lib/data/cost-of-selling-state";

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Frontmatter for a state cost guide; the route files build their metadata from it. */
export function costOfSellingFrontmatter(state: StateCode): GuideFrontmatter {
  const g = COST_OF_SELLING_STATE[state];
  const t = sellingCostTable(state);
  return {
    title: `Cost of Selling a House in ${t.stateName} (2026): Commission, Fees and Calculator`,
    description: `Every cost of selling a house in ${t.stateName}: commission of ${t.commission.low}% to ${t.commission.high}%, marketing, conveyancing, the ${lowerFirst(t.documents.label)}, tax, and what is different in ${t.stateName}. Worked at ${money(t.price)}, with a calculator.`,
    slug: g.slug,
    publishedAt: COST_OF_SELLING_AS_OF,
    updatedAt: COST_OF_SELLING_AS_OF,
    readingTimeMinutes: 9,
    author: { name: "Your Property Guide editorial", role: "Australian property research" },
    reviewedBy: { name: "Andy McMaster", role: "Editor" },
    persona: "selling",
  };
}
