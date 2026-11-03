import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
  ...defineCloudflareConfig({}),
  // Cloudflare CI runs `npm run build` — that now invokes the OpenNext build,
  // which shells out to this command for the inner Next.js build (kept on
  // webpack per next.config.ts). Produces .open-next/worker.js for wrangler.
  buildCommand: "next build --webpack",
};
