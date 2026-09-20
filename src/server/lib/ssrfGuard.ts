import { fetch as undiciFetch, Agent } from "undici";
import dns from "node:dns";
import net from "node:net";

const MAX_REDIRECTS = 3;
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024; // 5 MB
const DEFAULT_TIMEOUT_MS = 8000;

// FILE-04: block loopback, private (RFC1918), link-local, and other
// non-routable / metadata ranges so a server-side fetch can never be used
// to reach internal infrastructure (cloud metadata endpoints included).
const BLOCKED_IPV4_RANGES: Array<[string, number]> = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10], // carrier-grade NAT
  ["127.0.0.0", 8],
  ["169.254.0.0", 16], // link-local + cloud metadata (169.254.169.254)
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved
];

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function isBlockedIPv4(ip: string): boolean {
  const ipInt = ipv4ToInt(ip);
  return BLOCKED_IPV4_RANGES.some(([base, prefix]) => {
    const baseInt = ipv4ToInt(base);
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    return (ipInt & mask) === (baseInt & mask);
  });
}

function isBlockedIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === "::1") return true; // loopback
  if (normalized === "::") return true; // unspecified
  if (normalized.startsWith("fe80:") || normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) {
    return true; // link-local fe80::/10
  }
  if (/^f[cd][0-9a-f]{2}:/.test(normalized)) return true; // unique local fc00::/7
  // IPv4-mapped IPv6 addresses (::ffff:a.b.c.d) must be checked against the IPv4 rules too
  const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isBlockedIPv4(mapped[1]);
  return false;
}

export function isBlockedIp(ip: string): boolean {
  if (net.isIPv4(ip)) return isBlockedIPv4(ip);
  if (net.isIPv6(ip)) return isBlockedIPv6(ip);
  return true; // unknown format -> fail closed
}

export class SsrfBlockedError extends Error {
  constructor(host: string) {
    super(`Ziel-Host "${host}" verweist auf eine nicht erlaubte, interne oder private Netzwerkadresse.`);
    this.name = "SsrfBlockedError";
  }
}

/**
 * Custom DNS lookup used as the connector's `lookup` so every TCP connection
 * (initial request AND every redirect hop, since each creates a fresh
 * connection) re-resolves and re-validates the address it actually connects
 * to. This closes the classic SSRF "DNS rebinding" gap where a check against
 * one resolved IP is bypassed by a second, different resolution at connect time.
 */
function safeLookup(hostname: string, options: any, callback: any): void {
  dns.lookup(hostname, { all: true, verbatim: true }, (err, addresses) => {
    if (err) return callback(err, undefined, undefined);
    const list = Array.isArray(addresses) ? addresses : [addresses];
    if (list.length === 0) {
      return callback(new SsrfBlockedError(hostname), undefined, undefined);
    }
    for (const addr of list) {
      if (isBlockedIp(addr.address)) {
        return callback(new SsrfBlockedError(hostname), undefined, undefined);
      }
    }
    if (options && options.all) {
      return callback(null, list, undefined);
    }
    const chosen = list[0];
    return callback(null, chosen.address, chosen.family);
  });
}

const guardedAgent = new Agent({
  connect: { lookup: safeLookup as any, timeout: DEFAULT_TIMEOUT_MS },
});

function assertAllowedUrl(url: URL): void {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new SsrfBlockedError(url.hostname);
  }
  // Reject bracketed/raw IP literals that are blocked up front too (defense
  // in depth in addition to the DNS-rebinding-safe lookup above).
  const bareHost = url.hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(bareHost) && isBlockedIp(bareHost)) {
    throw new SsrfBlockedError(url.hostname);
  }
}

export interface SafeFetchResult {
  ok: boolean;
  status: number;
  url: string;
  headers: { get(name: string): string | null };
  text(): Promise<string>;
  json(): Promise<any>;
}

/**
 * SSRF-safe fetch for server-side calls to user-supplied URLs (Shopify
 * theme/app detectors, competitor price crawler). Validates scheme + resolved
 * IP on every hop, caps redirects, enforces a timeout and a response-size
 * ceiling. Use this instead of the global fetch for any outbound request
 * whose target host comes from user input.
 */
export async function safeFetch(
  inputUrl: string,
  init: { headers?: Record<string, string>; timeoutMs?: number } = {}
): Promise<SafeFetchResult> {
  let currentUrl = new URL(inputUrl);
  const timeoutMs = init.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    assertAllowedUrl(currentUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let res;
    try {
      res = await undiciFetch(currentUrl, {
        headers: init.headers,
        redirect: "manual",
        signal: controller.signal,
        dispatcher: guardedAgent,
      });
    } finally {
      clearTimeout(timeout);
    }

    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const location = res.headers.get("location");
      if (!location) {
        throw new Error("Redirect ohne Location-Header erhalten.");
      }
      if (hop === MAX_REDIRECTS) {
        throw new Error("Zu viele Weiterleitungen (maximal erlaubt: " + MAX_REDIRECTS + ").");
      }
      currentUrl = new URL(location, currentUrl);
      continue;
    }

    const contentLength = res.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_RESPONSE_BYTES) {
      throw new Error("Antwort überschreitet die maximal erlaubte Größe.");
    }

    const chunks: Buffer[] = [];
    let total = 0;
    const reader = res.body;
    if (reader) {
      for await (const chunk of reader as any) {
        total += chunk.length;
        if (total > MAX_RESPONSE_BYTES) {
          throw new Error("Antwort überschreitet die maximal erlaubte Größe.");
        }
        chunks.push(Buffer.from(chunk));
      }
    }
    const bodyBuffer = Buffer.concat(chunks);
    const finalUrlString = currentUrl.toString();

    return {
      ok: res.status >= 200 && res.status < 300,
      status: res.status,
      url: finalUrlString,
      headers: { get: (name: string) => res.headers.get(name) },
      text: async () => bodyBuffer.toString("utf-8"),
      json: async () => JSON.parse(bodyBuffer.toString("utf-8")),
    };
  }

  throw new Error("Zu viele Weiterleitungen.");
}
