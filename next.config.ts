import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" }, // your 100 seed products
      { protocol: "https", hostname: "fastly.picsum.photos" }, // picsum redirects here
      { protocol: "https", hostname: "images.unsplash.com" }, // real Unsplash photos
      { protocol: "https", hostname: "res.cloudinary.com" }, // uploads in Step 9
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
