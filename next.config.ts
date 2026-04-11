import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // www → non-www (canonical domain enforcement)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.yourpropertyguide.com.au" }],
        destination: "https://yourpropertyguide.com.au/:path*",
        permanent: true,
      },
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
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
        pathname: "/maps/api/staticmap**",
      },
      // Allow any https image host (covers existing heroImage URLs)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
