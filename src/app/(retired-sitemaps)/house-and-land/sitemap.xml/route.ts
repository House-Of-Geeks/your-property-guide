// Retired listing section, see src/lib/retired-sitemap.ts.
import { retiredSitemapRoute } from "@/lib/retired-sitemap";

export const dynamic = "force-static";
export const GET = retiredSitemapRoute("house-and-land");
