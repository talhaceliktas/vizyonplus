import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/icerikler",
        destination: "/icerikler/diziler",
        permanent: false,
      },
    ];
  },
  images: {
    domains: [
      "m.media-amazon.com",
      "egkrjlxptyomswdanwbw.supabase.co",
      "avatar.iran.liara.run",
      "yts.mx",
    ],
  },
};

export default nextConfig;
