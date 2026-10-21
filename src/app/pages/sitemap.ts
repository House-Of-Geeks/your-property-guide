import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { categoryToSlug, getDistinctBlogCategories } from "@/lib/services/blog-service";
import { leadTypePages } from "@/lib/data/real-estate-leads";
import { GUIDE_BOOKS } from "@/lib/guide-books";

// No lastModified here: these are hub/tool pages with no single content
// date, and stamping `new Date()` on every request made lastmod meaningless
// to crawlers. Omit the field rather than fake it.
//
// Titles are the page <title> (without the brand suffix the root template
// adds). The HTML sitemap renders this same list.

type PageEntry = {
  url: string;
  title: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

export async function getPageSitemapEntries(): Promise<PageEntry[]> {
  // Category labels ship in the bundled blogs.ts data (no DB), so the hub
  // list is statically known. Advertised in canonical slug form
  // (e.g. /guides/category/buying-guide); raw-label URLs 308 to these.
  const categories = await getDistinctBlogCategories();

  return [
    { url: SITE_URL,                                   title: `${SITE_NAME}: free guides to selling and buying property in Australia`, changeFrequency: "daily",   priority: 1   },
    // The journey hubs, the plan and the introduction form (Oct 2026).
    { url: `${SITE_URL}/buying`,                       title: "Buying property in Australia: where to start", changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/plan`,                         title: "Your next-step plan for buying or selling property", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/get-help`,                     title: "Get personal help: an introduction to a local agent", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/agreement-check`,              title: "Free agency agreement check: before you sign with an agent", changeFrequency: "monthly", priority: 0.7 },
    // /buy, /rent, /sold, /off-market, /house-and-land and /best-deals were
    // retired on 14 Oct 2026 and 308 elsewhere (next.config.ts,
    // docs/portal-consolidation-2026-10-14.md): a sitemap lists none of them.
    { url: `${SITE_URL}/suburbs`,                      title: "Browse All Australian Suburbs | Property Data & Profiles", changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/regions`,                      title: "Property Regions Across Australia", changeFrequency: "weekly",  priority: 0.7 },
    // /agents and /real-estate-agencies are noindex while the directory is
    // paused, so they are not submitted (tests/seo/sitemap-hygiene.test.ts).
    { url: `${SITE_URL}/research`,                     title: "Property Research Tools", changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/price-guide`,                  title: "Property Price Guide | Australian Suburb Median Prices", changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/schools`,                      title: "Find a School | Browse 9,600+ Australian Schools", changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/mortgage-calculator`,          title: "Mortgage Repayment Calculator", changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/stamp-duty-calculator`,        title: "Stamp Duty Calculator", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/borrowing-power-calculator`,   title: "Borrowing Power Calculator", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/rental-yield-calculator`,      title: "Rental Yield Calculator", changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/cgt-calculator`,               title: "Capital Gains Tax Calculator", changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/refinancing-calculator`,       title: "Refinancing Calculator", changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/lmi-calculator`,               title: "LMI calculator: what lenders mortgage insurance costs in 2026", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/negative-gearing-calculator`,  title: "Negative gearing calculator: your weekly cost after tax (2026)", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/bridging-loan-calculator`,     title: "Bridging loan calculator", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/help-to-buy-calculator`,       title: "Help to Buy calculator", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/fhss-calculator`,              title: "FHSS calculator", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/appraisal`,                    title: "Free Property Appraisal from a Local Agent | No Obligation", changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/property-valuation`,           title: "Property Valuation Australia: Appraisal vs Estimate (2026)", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/affordability-calculator`,     title: "Property Affordability Calculator", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/real-estate-commission-calculator`, title: "Real Estate Commission Calculator", changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/selling-costs-calculator`,     title: "Selling Costs Calculator", changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/selling-guide`,                title: GUIDE_BOOKS.selling.title, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/buying-guide`,                 title: GUIDE_BOOKS.buying.title, changeFrequency: "monthly", priority: 0.9 },
    // The guides' chapters as pages of their own (15 Oct 2026).
    ...(["selling", "buying"] as const).flatMap((g) =>
      GUIDE_BOOKS[g].chapters.map((c) => ({
        url: `${SITE_URL}${GUIDE_BOOKS[g].href}/${c.slug}`,
        title: c.title,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ),
    { url: `${SITE_URL}/real-estate-leads`,            title: "Real Estate Leads for Agents | Exclusive Australian Seller Leads", changeFrequency: "monthly", priority: 0.7 },
    ...leadTypePages.map((p) => ({
      url: `${SITE_URL}/real-estate-leads/${p.slug}`,
      title: p.title,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${SITE_URL}/best-suburbs`,                 title: "Best Suburbs in Australia", changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/compare`,                      title: "Compare Suburbs Side by Side", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/find-your-suburb`,             title: "Find Your Suburb: A 30-Second Australian Property Quiz", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools`,                        title: "Free Australian Property Tools, Quizzes & Calculators", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools/agent-proposal-worksheet`, title: "Compare real estate agent proposals: free worksheet", changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/insights`,                     title: "Australian Property Insights, Latest News, Analysis & Updates", changeFrequency: "daily",   priority: 0.8 },
    { url: `${SITE_URL}/search`,                       title: "Search Your Property Guide", changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/methodology`,                  title: "How we source the data, and what we don't claim to know", changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/data`,                         title: "Our Data, Sources & Live Numbers", changeFrequency: "daily",   priority: 0.6 },
    { url: `${SITE_URL}/data-updates`,                 title: "Data Updates & Changelog", changeFrequency: "weekly",  priority: 0.5 },
    { url: `${SITE_URL}/sitemap`,                      title: "Sitemap", changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/states`,                       title: "Australian States Property Guide", changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/postcodes`,                    title: "Australian Postcode Property Guide", changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/market-reports`,               title: "Australian Property Market Reports", changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/rba-cash-rate`,                title: "RBA Cash Rate History & Property Market Impact", changeFrequency: "weekly",  priority: 0.6 },
    { url: `${SITE_URL}/glossary`,                     title: "Property Glossary: A-Z of Australian Real Estate Terms", changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/guides`,                       title: "Property Guides for Buyers and Sellers", changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/find-an-expert`,               title: "Find a Real Estate Agent: One Free Local Introduction", changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/first-home-buyers`,            title: "First Home Buyer Australia 2026: Grants, Schemes, Deposit & Stamp Duty", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/selling`,                      title: "Selling Your House in Australia 2026: Appraisal, Fees, Auction or Private Sale", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/upgrading`,                    title: "Upgrading or Downsizing Your Home Australia: Sell First, Buy First, or Bridge?", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/buying-and-selling`,           title: "Selling and buying at once: order, money and moving dates", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/buyers-agents`,                title: "Buyer's agents: what they do and what they cost", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/investing`,                    title: "Property Investment Australia 2026: Yield, Growth, Tax, Negative Gearing", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/renovating`,                   title: "Renovating a House in Australia 2026: Costs, Finance, Builders, ROI", changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`,                        title: `About ${SITE_NAME}: practical guides for Australian buyers and sellers`, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${SITE_URL}/contact`,                      title: `Contact ${SITE_NAME}`, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${SITE_URL}/privacy`,                      title: "Privacy Policy", changeFrequency: "yearly",  priority: 0.3 },
    ...categories.map((category) => ({
      url: `${SITE_URL}/guides/category/${categoryToSlug(category)}`,
      title: `${category} Articles | Property Blog`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getPageSitemapEntries();
  return entries.map(({ url, changeFrequency, priority }) => ({ url, changeFrequency, priority }));
}
