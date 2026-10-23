import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  transpilePackages: ["simple-icons"],
  // Lets production hosts load Next.js JS in dev (via /etc/hosts).
  allowedDevOrigins: [
    "novexahub.live",
    "www.novexahub.live",
    "admin.novexahub.live",
    "novexahub.net",
    "www.novexahub.net",
    "admin.novexahub.net",
    "admin.localhost",
  ],
  turbopack: {
    resolveAlias: {
      protobufjs: "protobufjs/minimal",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      protobufjs: "protobufjs/minimal",
    };
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "*.firebasestorage.app", pathname: "/**" },
    ],
  },
  async redirects() {
    // Canonical homes for common legal-page URLs payment reviewers use.
    return [
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/shipping-policy", destination: "/delivery-policy", permanent: true },
      { source: "/shipping", destination: "/delivery-policy", permanent: true },
      { source: "/returns", destination: "/refund-policy", permanent: true },
      { source: "/return-policy", destination: "/refund-policy", permanent: true },
      { source: "/cancellation-policy", destination: "/refund-policy", permanent: true },
    ];
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

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
