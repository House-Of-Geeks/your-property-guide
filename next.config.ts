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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        pathname: "/maps/api/staticmap**",
      },
      // Vercel Blob — self-hosted property images
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // renet.photos CDN — fallback for any images not yet migrated to Blob
      {
        protocol: "https",
        hostname: "renet.photos",
      },
      // Allow any https image host (covers other agency/agent image URLs)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
