/** Primary production domain (purchased). DNS not live on Cloudflare yet — see pendingCloudflareDns. */
export const domains = {
  primary: "novexahub.net",
  www: "www.novexahub.net",
  admin: "admin.novexahub.net",
  url: "https://novexahub.net",
  adminUrl: "https://admin.novexahub.net",
  legacy: {
    primary: "novexahub.live",
    admin: "admin.novexahub.live",
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
  domains.local.primary,
]);

/** Add these in Cloudflare when you go live — keep DNS-only (grey cloud) during testing if you prefer. */
export const pendingCloudflareDns = [
  {
    name: "@",
    type: "A or CNAME",
    value: "Point to your host (Vercel, Firebase Hosting, etc.)",
    proxied: false,
  },
  {
    name: "www",
    type: "CNAME",
    value: "novexahub.net",
    proxied: false,
  },
  {
    name: "admin",
    type: "CNAME",
    value: "Same target as the root domain",
    proxied: false,
  },
] as const;

/** For local testing before DNS is live — add to /etc/hosts then run npm run dev */
export const localHostsFileLines = [
  "127.0.0.1 novexahub.net",
  "127.0.0.1 www.novexahub.net",
  "127.0.0.1 admin.novexahub.net",
  "127.0.0.1 admin.localhost",
] as const;
