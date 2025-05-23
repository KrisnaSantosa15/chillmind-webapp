import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com", // For psychologist profile photos
      "cdnjs.cloudflare.com", // For leaflet map resources
      "cdn-icons-png.flaticon.com", // For custom map markers
    ],
  },
};

export default nextConfig;
