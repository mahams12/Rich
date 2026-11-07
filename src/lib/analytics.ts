// Shared analytics types + lightweight UA/bot parsing (no dependencies).
export interface AnalyticsEvent {
  kind: "pageview" | "heartbeat" | "conversion";
  vid: string;
  sid: string;
  path: string;
  title?: string;
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  fbclid?: boolean;
  gclid?: boolean;
  cType?: string;
  seconds?: number;
  device?: string;
  os?: string;
  browser?: string;
  country?: string;
  city?: string;
  asn?: number;
  dataCenter?: boolean;
  ipHash?: string;
  createdAt: string;
}

const BOT_UA =
  /bot|crawler|spider|scraper|crawling|headless|puppeteer|playwright|selenium|phantom|slurp|baidu|yandex|curl|wget|python-requests|httpclient|libwww|lighthouse|pagespeed|gtmetrix|pingdom|uptime|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|gptbot|claudebot|ccbot|facebookexternalhit|whatsapp|telegrambot|linkedinbot|discordbot/i;

export function isBot(ua: string) {
  return !ua || BOT_UA.test(ua);
}

const DC_ASNS = new Set([14061, 16509, 15169, 8075, 13335, 14618, 16276, 24940, 51167, 20473, 63949, 9009, 36352, 32934]);

export function parseUa(ua: string) {
  const mobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(ua);
  const tablet = /iPad|Tablet|Android(?!.*Mobi)/i.test(ua);
  const device = tablet ? "tablet" : mobile ? "mobile" : "desktop";
  const os = /Windows NT/i.test(ua) ? "Windows"
    : /Mac OS X|Macintosh/i.test(ua) ? "macOS"
    : /Android/i.test(ua) ? "Android"
    : /iPhone|iPad|iPod/i.test(ua) ? "iOS"
    : /CrOS/i.test(ua) ? "ChromeOS"
    : /Linux/i.test(ua) ? "Linux" : "Other";
  const browser = /Edg\//i.test(ua) ? "Edge"
    : /OPR\/|Opera/i.test(ua) ? "Opera"
    : /Firefox\//i.test(ua) ? "Firefox"
    : /SamsungBrowser/i.test(ua) ? "Samsung Internet"
    : /Chrome\//i.test(ua) ? "Chrome"
    : /Safari\//i.test(ua) ? "Safari" : "Other";
  return { device, os, browser };
}

export function isDataCenterAsn(asn: number | undefined) {
  return !!asn && DC_ASNS.has(asn);
}
