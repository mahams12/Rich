import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  transpilePackages: ["simple-icons"],
  // Lets novexahub.net / admin.novexahub.net load Next.js JS in dev (via /etc/hosts).
  allowedDevOrigins: [
    "novexahub.net",
    "www.novexahub.net",
    "admin.novexahub.net",
    "admin.localhost",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "*.firebasestorage.app", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Allows Google auth windows to communicate with the app.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
};

export default nextConfig;
