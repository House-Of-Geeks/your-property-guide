import type { NextConfig } from "next";
// Suburb rows that are postal delivery names, institutions or shopping-centre
// post offices (src/lib/non-localities.ts). Relative import: the config is
// loaded outside the app's path aliases.
import nonLocalities from "./src/lib/data/non-localities.json";

const NON_LOCALITY_REDIRECTS = nonLocalities.entries.flatMap((e) => {
  const target = e.parent ? `/suburbs/${e.parent}` : `/postcodes/${e.postcode}`;
  return [
    { source: `/suburbs/${e.slug}`, destination: target, permanent: true },
    { source: `/suburbs/${e.slug}/:path*`, destination: e.parent ? `${target}/:path*` : target, permanent: true },
  ];
});

const nextConfig: NextConfig = {
  // Edge-cache static blog covers aggressively. They live in /public so are
  // immutable per deploy; a 1-year immutable header lets visitors and the
  // CDN keep them out of "fast origin transfer" billing after first hit.
  async headers() {
    return [
      {
        source: "/images/blog/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Old agency URLs. While the directory is off (below) they go straight
      // to the introduction form; when it returns, point them back at
      // /real-estate-agencies and /real-estate-agencies/:slug* (permanent).
      { source: "/agencies/:slug*", destination: "/get-help", permanent: false },
      // Agent lead-supply page renamed so the slug matches the query
      // ("real estate leads"), mirroring yourfinanceguide.com.au/finance-leads.
      { source: "/for-agents", destination: "/real-estate-leads", permanent: true },
      // Agent profiles stay off the site until Andy launches the directory
      // (2026-07-03). These pages were noindex but still showed placeholder
      // profiles; they go to the introduction form. Remove these two lines
      // (and restore the /agencies rules above) to bring the directory back.
      { source: "/agents/:path*", destination: "/get-help", permanent: false },
      { source: "/real-estate-agencies/:path*", destination: "/get-help", permanent: false },
      // The developer offer sold house-and-land listings, retired 14 Oct 2026.
      { source: "/real-estate-leads/property-developer-leads", destination: "/real-estate-leads", permanent: true },
      // Item 20 (30 Sep 2026): the Queensland stamp duty article was folded
      // into the calculator-first QLD guide. The /blog form is listed before
      // the /blog wildcard so it lands in one hop.
      { source: "/guides/stamp-duty-queensland-what-you-need-to-know", destination: "/guides/stamp-duty-qld", permanent: true },
      { source: "/blog/stamp-duty-queensland-what-you-need-to-know",   destination: "/guides/stamp-duty-qld", permanent: true },
      // Blog content moved into the unified /guides hub. Preserves SEO + any
      // external links (e.g. RSS subscribers, partner sites).
      { source: "/blog",          destination: "/guides",          permanent: true },
      { source: "/blog/:path*",   destination: "/guides/:path*",   permanent: true },
      // Portal consolidation (14 Oct 2026, docs/portal-consolidation-2026-10-14.md):
      // the site is an education and introduction service, not a listings
      // portal. The listing routes drew no clicks in 90 days of Search
      // Console data and nothing in Bing, so each one goes, in one hop, to
      // the page that now serves its reader. Listed before the suburb and
      // non-locality rules. `:path*` matches the bare path too (/buy), and
      // only whole segments, so /buying, /rental-yield-calculator and
      // /selling-guide are untouched. The 17 legacy /buy/*-thomson slug
      // redirects (property slug migration) are folded into the /buy rule:
      // they land on /buying in one hop instead of hopping through a /buy
      // listing that no longer exists.
      { source: "/buy/:path*",            destination: "/buying",  permanent: true },
      // No renting category exists under /guides/category; the renters'
      // rights and rentvesting guides are on the guides hub.
      { source: "/rent/:path*",           destination: "/guides",  permanent: true },
      // Sale prices live on the suburb profiles.
      { source: "/sold/:path*",           destination: "/suburbs", permanent: true },
      { source: "/off-market/:path*",     destination: "/selling", permanent: true },
      { source: "/house-and-land/:path*", destination: "/buying",  permanent: true },
      { source: "/best-deals/:path*",     destination: "/buying",  permanent: true },
      // A suburb's six listing sub-pages go to its profile. The segment is
      // matched whole against these six words only, so /rental-market,
      // /schools, /agents, /vs/... and street pages (410) are not caught.
      {
        source: "/suburbs/:slug/:listing(buy|rent|houses|units|townhouses|land)",
        destination: "/suburbs/:slug",
        permanent: true,
      },
      // "South Melbourne DC", "Penrith Plaza", "Parliament House": not places
      // people live. Each goes to the real suburb of that name in its
      // postcode, or to the postcode page (29 Sep 2026, 290 entries).
      ...NON_LOCALITY_REDIRECTS,
    ];
  },
  images: {
    // AVIF first (better compression than WebP, broad 2024+ browser support),
    // then WebP as fallback for older clients. Saves significant bandwidth on
    // property listing photos and blog covers.
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 30 days. Property/suburb photos rarely change
    // and the optimizer is the second-biggest invocation source after pages.
    minimumCacheTTL: 2_592_000,
    // Allowlist intentionally tight. Each entry is a host that visitors'
    // /_next/image requests can ask Vercel to fetch and transform — every
    // wildcard is an open door for someone to drive up the bill by asking
    // for transforms of arbitrary images on that domain.
    //
    // Verified against production Property_Image data on 2026-05-11:
    // ~98% Vercel Blob, ~2% Unsplash editorial, zero traffic on the old
    // agency-feed wildcards. Removed: `maps.googleapis.com`,
    // `i.realestate.com.au`, `rimh2.domainstatic.com.au`,
    // `*.realestateview.com.au`, `*.realtair.com`, `*.amazonaws.com`,
    // `*.cloudfront.net`. None of them were referenced anywhere in the
    // codebase or DB. Add specific hosts (not wildcards) when a new feed
    // genuinely needs them.
    remotePatterns: [
      // Vercel Blob — self-hosted property images
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Unsplash — editorial / blog cover images
      { protocol: "https", hostname: "images.unsplash.com" },
      // renet.photos CDN — documented legacy fallback for any unmigrated images
      { protocol: "https", hostname: "renet.photos" },
    ],
  },
};

export default nextConfig;
