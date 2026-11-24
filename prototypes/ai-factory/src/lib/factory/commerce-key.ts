/**
 * Canonical commerce identity for cross-provider ledger dedupe.
 * See docs/internal/ai-factory-production.md — Webhook ingress.
 *
 * Stripe `pi_…` and Shopify `order:…` for the same checkout are different
 * native keys. Call `linkCommerceAliases` when either webhook carries the
 * other provider's id (or when an operator attaches them), then resolve
 * through `canonicalizeCommerceKey` before `shouldBookCredit`.
 */

export type CommerceKeyHints = {
  stripePaymentIntentId?: string | null;
  stripeChargeId?: string | null;
  shopifyOrderId?: string | null;
  shopifyCheckoutToken?: string | null;
  runId?: string | null;
  externalId?: string | null;
};

/** In-memory / DB-backed alias graph: alias → canonical commerce_key. */
export type CommerceAliasLookup = {
  /** Return the canonical key for an alias, or null if unknown. */
  findCanonical(alias: string): string | null | Promise<string | null>;
};

export type CommerceAliasWriter = {
  /** Persist that each alias maps to `canonical`. Idempotent. */
  link(canonical: string, aliases: readonly string[]): void | Promise<void>;
};

/** Resolve the strongest native key from provider hints (no alias graph). */
export function resolveCommerceKey(hints: CommerceKeyHints): string | null {
  const candidates = collectNativeKeys(hints);
  return candidates[0] ?? null;
}

/**
 * Collect all native keys present on a webhook (strongest first).
 * Used both for primary key selection and for alias linking.
 */
export function collectNativeKeys(hints: CommerceKeyHints): string[] {
  const keys: string[] = [];
  const push = (key: string | null) => {
    if (key && !keys.includes(key)) keys.push(key);
  };

  const pi = normalizeId(hints.stripePaymentIntentId);
  push(pi ? `stripe:pi:${pi}` : null);

  const ch = normalizeId(hints.stripeChargeId);
  push(ch ? `stripe:ch:${ch}` : null);

  const order = normalizeId(hints.shopifyOrderId);
  push(order ? `shopify:order:${order}` : null);

  const checkout = normalizeId(hints.shopifyCheckoutToken);
  push(checkout ? `shopify:checkout:${checkout}` : null);

  const runId = normalizeId(hints.runId);
  const external = normalizeId(hints.externalId);
  push(runId && external ? `run:${runId}:${external}` : null);

  return keys;
}

/**
 * Prefer Stripe PI → Charge → Shopify order → checkout → run fallback.
 * When the alias graph already maps any of these, return that canonical.
 */
export async function resolveAndCanonicalizeCommerceKey(
  hints: CommerceKeyHints,
  lookup?: CommerceAliasLookup | null,
): Promise<string | null> {
  const natives = collectNativeKeys(hints);
  if (natives.length === 0) return null;

  if (lookup) {
    for (const key of natives) {
      const canonical = await lookup.findCanonical(key);
      if (canonical) return canonical;
    }
  }

  return natives[0] ?? null;
}

/**
 * Link every native id on this event to one canonical key (the strongest
 * native, or an existing canonical if any alias already maps).
 * Call after ingesting a webhook that may carry cross-provider references.
 */
export async function linkCommerceAliases(
  hints: CommerceKeyHints,
  lookup: CommerceAliasLookup,
  writer: CommerceAliasWriter,
): Promise<string | null> {
  const natives = collectNativeKeys(hints);
  if (natives.length === 0) return null;

  let canonical: string | null = null;
  for (const key of natives) {
    const existing = await lookup.findCanonical(key);
    if (existing) {
      canonical = existing;
      break;
    }
  }
  if (!canonical) canonical = natives[0]!;

  const aliases = natives.filter((k) => k !== canonical);
  // Always register the canonical as an alias of itself for lookup hits.
  await writer.link(canonical, [canonical, ...aliases]);
  return canonical;
}

/**
 * Map a resolved key through the alias graph. No-op when lookup misses.
 */
export async function canonicalizeCommerceKey(
  key: string | null,
  lookup?: CommerceAliasLookup | null,
): Promise<string | null> {
  if (!key) return null;
  if (!lookup) return key;
  const canonical = await lookup.findCanonical(key);
  return canonical ?? key;
}

/**
 * Whether a second proof should book a new credit or attach as evidence only.
 * Compare against *canonical* keys only (after alias resolution).
 */
export function shouldBookCredit(opts: {
  commerceKey: string | null;
  existingCreditKeys: ReadonlySet<string>;
}): boolean {
  if (!opts.commerceKey) return false;
  return !opts.existingCreditKeys.has(opts.commerceKey);
}

/** Simple Map-backed alias store for tests and Phase 0 contract demos. */
export function createMemoryAliasStore(): CommerceAliasLookup &
  CommerceAliasWriter & { entries: Map<string, string> } {
  const entries = new Map<string, string>();
  return {
    entries,
    findCanonical(alias: string) {
      return entries.get(alias) ?? null;
    },
    link(canonical: string, aliases: readonly string[]) {
      for (const alias of aliases) {
        entries.set(alias, canonical);
      }
      entries.set(canonical, canonical);
    },
  };
}

function normalizeId(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
