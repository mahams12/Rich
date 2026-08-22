/** Primary production domain on Cloudflare Workers. DNS at Hostinger until nameservers move. */
export const domains = {
  primary: "novexahub.live",
  www: "www.novexahub.live",
  admin: "admin.novexahub.live",
  url: "https://novexahub.live",
  adminUrl: "https://admin.novexahub.live",
  legacy: {
    primary: "novexahub.net",
    admin: "admin.novexahub.net",
  },
  local: {
    primary: "localhost",
    admin: "admin.localhost",
  },
} as const;

export const adminHosts = new Set<string>([
  domains.admin,
  domains.legacy.admin,
  domains.local.admin,
]);

export function isAdminHost(host?: string | null) {
  if (!host) return false;
  return adminHosts.has(host.split(":")[0]);
}

export const primaryHosts = new Set<string>([
  domains.primary,
  domains.www,
  domains.legacy.primary,
  `www.${domains.legacy.primary}`,
  domains.local.primary,
]);

/** Cloudflare Worker custom domains — zone must be on the same account. */
export const pendingCloudflareDns = [
  {
    name: "@",
    type: "CNAME",
    value: "novexahub.workers.dev (or the Worker custom domain target)",
    proxied: true,
  },
  {
    name: "www",
    type: "CNAME",
    value: "novexahub.live",
    proxied: true,
  },
  {
    name: "admin",
    type: "CNAME",
    value: "novexahub.live",
    proxied: true,
  },
] as const;

/** For local testing before DNS is live — add to /etc/hosts then run npm run dev */
export const localHostsFileLines = [
  "127.0.0.1 novexahub.live",
  "127.0.0.1 www.novexahub.live",
  "127.0.0.1 admin.novexahub.live",
  "127.0.0.1 admin.localhost",
] as const;
