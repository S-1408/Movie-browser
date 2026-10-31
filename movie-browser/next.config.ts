import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,//Enables component-level caching features.
  partialPrefetching: true, //Controls partial prefetching behavior.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }], //Allows Next.js Image to load images from TMDB.
  },
  turbopack: { //Configures the Turbopack bundler.
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"], //Specifies loaders used to process matching files.
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
