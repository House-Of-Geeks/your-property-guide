import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Paths kept out of every crawler's reach. A named user-agent group replaces
// the * group for that bot instead of merging with it, so each allow group
// must repeat this list or the bot would be allowed into these paths.
// /downloads/ holds the gated lead-magnet PDFs; keeping them out of the
// index keeps the /selling-guide funnel as the front door. /print/ is the
// printable guide the PDFs are made from.
const PRIVATE_PATHS = ["/api/", "/dashboard/", "/downloads/", "/print/"];

const ALLOW_RULE = { allow: "/", disallow: PRIVATE_PATHS };

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...PRIVATE_PATHS, "/*.woff2", "/*.woff"],
      },
      // OpenAI
      { userAgent: "GPTBot",          ...ALLOW_RULE },
      { userAgent: "OAI-SearchBot",   ...ALLOW_RULE },
      { userAgent: "ChatGPT-User",    ...ALLOW_RULE },
      // Anthropic
      { userAgent: "ClaudeBot",       ...ALLOW_RULE },
      { userAgent: "Claude-SearchBot", ...ALLOW_RULE },
      { userAgent: "Claude-User",     ...ALLOW_RULE },
      // Google AI
      { userAgent: "Google-Extended", ...ALLOW_RULE },
      // Perplexity
      { userAgent: "PerplexityBot",   ...ALLOW_RULE },
      { userAgent: "Perplexity-User", ...ALLOW_RULE },
      // Common Crawl
      { userAgent: "CCBot",           ...ALLOW_RULE },
      // Microsoft Bing — explicit allows for Bing's primary indexer
      // (bingbot), the preview crawler that builds SERP cards
      // (BingPreview), the Bing Ads crawler (adidxbot), and the legacy
      // MSN bot. Wildcard rules cover them too, but listing them
      // explicitly signals welcome and improves Bing Webmaster Tools'
      // confidence score for crawl access.
      { userAgent: "bingbot",         ...ALLOW_RULE },
      { userAgent: "BingPreview",     ...ALLOW_RULE },
      { userAgent: "adidxbot",        ...ALLOW_RULE },
      { userAgent: "msnbot",          ...ALLOW_RULE },

      // SEO data scrapers — blocked entirely. They crawl deep and
      // aggressively across the address-detail pages but only feed
      // their own paying customers' SEO dashboards; they don't affect
      // our search rankings or social previews, so blocking them is
      // pure cost savings with no upside lost. All of these honour
      // robots.txt by default.
      { userAgent: "AhrefsBot",       disallow: "/" },
      { userAgent: "SemrushBot",      disallow: "/" },
      { userAgent: "MJ12bot",         disallow: "/" },
      { userAgent: "DotBot",          disallow: "/" },
      { userAgent: "BLEXBot",         disallow: "/" },
      { userAgent: "DataForSeoBot",   disallow: "/" },
      { userAgent: "PetalBot",        disallow: "/" },
      { userAgent: "Bytespider",      disallow: "/" },
      { userAgent: "SeekportBot",     disallow: "/" },
      { userAgent: "MegaIndex",       disallow: "/" },
      { userAgent: "SerpstatBot",     disallow: "/" },
      { userAgent: "ZoominfoBot",     disallow: "/" },
      // Also denied at the edge by the firewall; this is the signal for
      // any that do read robots.txt.
      { userAgent: "AionBot",         disallow: "/" },
      { userAgent: "AwarioBot",       disallow: "/" },
      { userAgent: "Reflectionbot",   disallow: "/" },
      { userAgent: "ExaSearchBot",    disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
