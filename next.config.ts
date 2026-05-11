import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/agencies",
        destination: "/real-estate-agencies",
        permanent: true,
      },
      {
        source: "/agencies/:slug*",
        destination: "/real-estate-agencies/:slug*",
        permanent: true,
      },
      // Blog content moved into the unified /guides hub. Preserves SEO + any
      // external links (e.g. RSS subscribers, partner sites).
      { source: "/blog",          destination: "/guides",          permanent: true },
      { source: "/blog/:path*",   destination: "/guides/:path*",   permanent: true },
      // Property slug migration: removed agency suffix, added state code
      { source: "/buy/28-spearmint-street-griffin-4503-thomson",         destination: "/buy/28-spearmint-street-griffin-qld-4503",          permanent: true },
      { source: "/buy/dakabin-4503-thomson",                             destination: "/buy/dakabin-qld-4503-21611295",                     permanent: true },
      { source: "/buy/16-dent-crescent-burpengary-east-4505-thomson",    destination: "/buy/16-dent-crescent-burpengary-east-qld-4505",     permanent: true },
      { source: "/buy/newport-4020-thomson",                             destination: "/buy/newport-qld-4020-21613358",                     permanent: true },
      { source: "/buy/3-grassy-street-banya-4551-thomson",               destination: "/buy/3-grassy-street-banya-qld-4551",               permanent: true },
      { source: "/buy/8-medinah-circuit-north-lakes-4509-thomson",       destination: "/buy/8-medinah-circuit-north-lakes-qld-4509",        permanent: true },
      { source: "/buy/9-ficus-drive-palmview-4553-thomson",              destination: "/buy/9-ficus-drive-palmview-qld-4553",              permanent: true },
      { source: "/buy/63-sorrento-street-margate-4019-thomson",          destination: "/buy/63-sorrento-street-margate-qld-4019",           permanent: true },
      { source: "/buy/unit-14-9-violet-st-redcliffe-4020-thomson",       destination: "/buy/unit-14-9-violet-st-redcliffe-qld-4020",        permanent: true },
      { source: "/buy/27-cassidy-crescent-bridgeman-downs-4035-thomson", destination: "/buy/27-cassidy-crescent-bridgeman-downs-qld-4035",  permanent: true },
      { source: "/buy/6-belcher-street-caboolture-4510-thomson",         destination: "/buy/6-belcher-street-caboolture-qld-4510",          permanent: true },
      { source: "/buy/33-bellini-road-burpengary-4505-thomson",          destination: "/buy/33-bellini-road-burpengary-qld-4505",           permanent: true },
      { source: "/buy/4-18-20-wyllie-street-redcliffe-4020-thomson",     destination: "/buy/4-18-20-wyllie-street-redcliffe-qld-4020",      permanent: true },
      { source: "/buy/12-wilton-court-morayfield-4506-thomson",          destination: "/buy/12-wilton-court-morayfield-qld-4506",           permanent: true },
      { source: "/buy/56-sunreef-street-burpengary-4505-thomson",        destination: "/buy/56-sunreef-street-burpengary-qld-4505",         permanent: true },
      { source: "/buy/burpengary-4505-thomson",                          destination: "/buy/burpengary-qld-4505-21369936",                  permanent: true },
      { source: "/buy/burpengary-4505-21049882-thomson",                 destination: "/buy/burpengary-qld-4505-21049882",                  permanent: true },
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
