import path from "node:path";
import type { NextConfig } from "next";

const workerSafeAliases = {
  protobufjs: "protobufjs/minimal",
  // Firestore's browser transport does not use the Node gRPC stack. Keep
  // grpc/proto-loader out of the Cloudflare Worker bundle: proto-loader
  // evaluates protobufjs codegen via new Function(), which Workers block
  // (EvalError at module init -> 500 on routes that statically import
  // firebase/firestore in their server graph).
  "@grpc/grpc-js": "./src/lib/grpc-worker-stub.cjs",
  "@grpc/proto-loader": "./src/lib/grpc-worker-stub.cjs",
};

const nextConfig: NextConfig = {
  // Serve blocking (non-streamed) metadata to all agents so title/canonical/
  // robots/OG tags land in <head> — fixes "metadata outside head" audit flags.
  htmlLimitedBots: /.*/,
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
    resolveAlias: workerSafeAliases,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      protobufjs: "protobufjs/minimal",
      "@grpc/grpc-js$": path.resolve("src/lib/grpc-worker-stub.cjs"),
      "@grpc/proto-loader$": path.resolve("src/lib/grpc-worker-stub.cjs"),
    };
    return config;
  },
  images: {
    // Route optimization through /api/img so responses carry a long
    // Cache-Control (the worker's built-in /_next/image cannot set headers).
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.pixabay.com", pathname: "/**" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "*.firebasestorage.app", pathname: "/**" },
    ],
  },
  async redirects() {
    // Canonical homes for common legal-page URLs payment reviewers use.
    return [
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/blog/:path*", destination: "/blogs/:path*", permanent: true },
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
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        ],
      },
    ];
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
