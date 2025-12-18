import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/izle/film",
        destination: "/icerikler?tur=film",
        permanent: true,
      },
      {
        source: "/izle/dizi",
        destination: "/icerikler?tur=dizi",
        permanent: true,
      },
      {
        source: "/izle/dizi/:slug/:season(\\d+)",
        destination: "/izle/dizi/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "egkrjlxptyomswdanwbw.supabase.co",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
      },
      {
        protocol: "https",
        hostname: "yts.mx",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
