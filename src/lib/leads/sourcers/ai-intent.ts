import type { SourcedCandidateIntake } from "@/lib/leads/types";
import { createHash } from "node:crypto";

/**
 * Buyer-intent headlines (companies adopting / investing in automation).
 * Excludes typical AI-vendor fundraising noise.
 */
const BUYER_INTENT =
  /\b(invest(?:s|ing|ment)?|deploy(?:s|ing)?|implement(?:s|ing)?|adopt(?:s|ing)?|rolls?\s+out|automate(?:s|ing)?|moderniz(?:e|es|ing)|digital\s+transformation)\b.*\b(ai|artificial\s+intelligence|automation|agentic|ai\s+agents?|workflow\s+automation)\b|\b(ai|automation|agentic|ai\s+agents?)\b.*\b(invest(?:s|ing|ment)?|deploy(?:s|ing)?|implement(?:s|ing)?|adopt(?:s|ing)?|operations|workforce|customer\s+service|sales|back\s+office)\b/i;

const VENDOR_FUNDRAISE =
  /\b(raises?|raised|series\s+[a-z]|seed\s+round|funding\s+round|closes?\s+\$|valuation|venture\s+round|backed\s+by)\b/i;

/** Google News RSS queries aimed at buyer intent nationwide. */
export const AI_INTENT_QUERIES = [
  'company investing in AI automation',
  'business deploys AI agents',
  'enterprise adopts agentic AI',
  'company implements workflow automation AI',
] as const;

export type NewsItem = {
  title: string;
  link: string;
  pubDate?: string;
};

export function isBuyerIntentHeadline(title: string): boolean {
  const t = title.trim();
  if (t.length < 12) return false;
  if (VENDOR_FUNDRAISE.test(t)) return false;
  return BUYER_INTENT.test(t);
}

export function parseRssItems(xml: string): NewsItem[] {
  const items: NewsItem[] = [];
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  for (const block of blocks) {
    const title = decodeXml(
      (block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) ??
        block.match(/<title>([\s\S]*?)<\/title>/i))?.[1] ?? "",
    ).trim();
    const link = decodeXml(
      (block.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i) ??
        block.match(/<link>([\s\S]*?)<\/link>/i))?.[1] ?? "",
    ).trim();
    const pubDate = decodeXml(
      (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] ?? "").trim(),
    );
    if (title && link) {
      items.push({ title, link, pubDate: pubDate || undefined });
    }
  }
  return items;
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function externalIdFor(link: string, title: string): string {
  return createHash("sha256").update(`${link}|${title}`).digest("hex").slice(0, 24);
}

/** Best-effort company label from a headline (operator still reviews). */
export function guessCompanyName(title: string): string {
  const cleaned = title.replace(/\s+-\s+.*$/, "").trim();
  const match = cleaned.match(
    /^([A-Z][\w&.]*(?:\s+[A-Z][\w&.]*){0,5})\b/,
  );
  if (match?.[1] && match[1].length >= 2) return match[1];
  return cleaned.slice(0, 80);
}

export function newsItemsToCandidates(items: NewsItem[]): SourcedCandidateIntake[] {
  const seen = new Set<string>();
  const out: SourcedCandidateIntake[] = [];
  for (const item of items) {
    if (!isBuyerIntentHeadline(item.title)) continue;
    const id = externalIdFor(item.link, item.title);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({
      source: "ai_intent_news",
      externalId: id,
      companyName: guessCompanyName(item.title),
      signalSummary: item.title,
      sourceUrl: item.link,
      approvedAt: item.pubDate
        ? new Date(item.pubDate).toISOString().slice(0, 10)
        : null,
    });
  }
  return out;
}

function googleNewsRssUrl(query: string): string {
  const q = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
}

/**
 * Pull nationwide AI/automation buyer-intent headlines.
 * Does not contact companies.
 */
export async function fetchAiIntentCandidates(options?: {
  queries?: readonly string[];
  limit?: number;
  fetchImpl?: typeof fetch;
  /** Per-request timeout; kept short so parallel RSS fits the source route budget. */
  timeoutMs?: number;
}): Promise<SourcedCandidateIntake[]> {
  const queries = options?.queries ?? AI_INTENT_QUERIES;
  const fetchImpl = options?.fetchImpl ?? fetch;
  const limit = options?.limit ?? 40;
  const timeoutMs = options?.timeoutMs ?? 8_000;

  const results = await Promise.allSettled(
    queries.map(async (query) => {
      const response = await fetchImpl(googleNewsRssUrl(query), {
        headers: {
          "User-Agent": "WayalabsLeadEngine/1.0 (+https://wayalabs.com)",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) return [] as NewsItem[];
      const xml = await response.text();
      return parseRssItems(xml);
    }),
  );

  const collected: NewsItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") collected.push(...result.value);
  }

  return newsItemsToCandidates(collected).slice(0, limit);
}
