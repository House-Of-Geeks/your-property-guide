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
