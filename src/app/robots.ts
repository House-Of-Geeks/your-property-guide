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
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
