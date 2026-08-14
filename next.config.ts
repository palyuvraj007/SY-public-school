import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev server cross-origin requests from LAN IP
  async headers() {
    return [
      {
        source: "/_next/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;