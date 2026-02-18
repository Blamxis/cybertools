export function safeParseUrl(raw: string): URL | null {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

export function hasDangerousScheme(url: URL): boolean {
  const scheme = url.protocol.replace(":", "").toLowerCase();
  const dangerous = [
    "javascript",
    "data",
    "file",
    "vbscript",
    "chrome",
    "chrome-extension",
  ];
  return dangerous.includes(scheme);
}

export function hasSuspiciousPort(url: URL): boolean {
  if (!url.port) return false;
  const port = Number(url.port);
  if (Number.isNaN(port)) return false;
  const common = [80, 443, 8080, 3000, 8000];
  return !common.includes(port);
}

export function hasTrackingParams(url: URL): boolean {
  const trackingKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
    "mc_eid",
  ];
  for (const key of trackingKeys) {
    if (url.searchParams.has(key)) return true;
  }
  return false;
}
