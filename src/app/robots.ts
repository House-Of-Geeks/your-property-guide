import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/*.woff2", "/*.woff"],
      },
      // OpenAI
      { userAgent: "GPTBot",          allow: "/" },
      { userAgent: "OAI-SearchBot",   allow: "/" },
      { userAgent: "ChatGPT-User",    allow: "/" },
      // Anthropic
      { userAgent: "ClaudeBot",       allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User",     allow: "/" },
      // Google AI
      { userAgent: "Google-Extended", allow: "/" },
      // Perplexity
      { userAgent: "PerplexityBot",   allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      // Common Crawl
      { userAgent: "CCBot",           allow: "/" },

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
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
