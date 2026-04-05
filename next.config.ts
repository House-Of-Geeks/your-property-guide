import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
