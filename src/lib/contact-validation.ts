export const RATE_LIMIT_WINDOW_MS = 60_000;
export const MAX_REQUESTS_PER_WINDOW = 5;

// Internal request log. Exported with underscore prefix for test-time injection.
export const _requestLog = new Map<string, number[]>();

export type ContactIntent = "chatbot" | "agent" | "integration" | "platform" | "unsure";
export const ALLOWED_INTENTS: ContactIntent[] = [
  "chatbot",
  "agent",
  "integration",
  "platform",
  "unsure",
];

export function isContactIntent(value: string): value is ContactIntent {
  return (ALLOWED_INTENTS as readonly string[]).includes(value);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getClientIp(request: Request): string {
  // Prefer the platform-set address. The left-most X-Forwarded-For value is
  // client-controlled when the request reaches the app directly.
  const realIp = request.headers.get("x-real-ip")?.split(",")[0]?.trim();
  if (realIp) return realIp;

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return "unknown";
}

/**
 * Returns true if the given IP has exceeded the rate limit.
 * The optional `log` parameter allows tests to inject an isolated Map.
 */
export function isRateLimited(
  ip: string,
  log: Map<string, number[]> = _requestLog,
): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (log.size > 512) {
    for (const [key, stamps] of log) {
      const recent = stamps.filter((timestamp) => timestamp >= windowStart);
      if (recent.length === 0) log.delete(key);
      else log.set(key, recent);
    }
  }

  const requests = log.get(ip) ?? [];
  const recentRequests = requests.filter((timestamp) => timestamp >= windowStart);

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    log.set(ip, recentRequests);
    return true;
  }

  recentRequests.push(now);
  log.set(ip, recentRequests);
  return false;
}

export function sanitize(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}
