import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/images/**',
        search: '?**', // Allowing query strings starting with ?
      },
    ],
  },
};

export default nextConfig;
