import { describe, expect, it } from "vitest";
import {
  isBuyerIntentHeadline,
  newsItemsToCandidates,
  parseRssItems,
} from "@/lib/leads/sourcers/ai-intent";

describe("isBuyerIntentHeadline", () => {
  it("accepts adoption / investment signals", () => {
    expect(
      isBuyerIntentHeadline(
        "Acme Logistics deploys AI agents across customer service operations",
      ),
    ).toBe(true);
    expect(
      isBuyerIntentHeadline(
        "Regional hospital invests in workflow automation with AI",
      ),
    ).toBe(true);
  });

  it("rejects vendor fundraising noise", () => {
    expect(
      isBuyerIntentHeadline("AgentCo raises $40M Series B for AI agents"),
    ).toBe(false);
  });
});

describe("parseRssItems + newsItemsToCandidates", () => {
  it("parses RSS and filters to buyer intent", () => {
    const xml = `<?xml version="1.0"?>
      <rss><channel>
        <item>
          <title>Northwind Retail implements AI automation in back office</title>
          <link>https://example.com/a</link>
          <pubDate>Mon, 24 Nov 2026 12:00:00 GMT</pubDate>
        </item>
        <item>
          <title>BotStartup raises $12M seed round for agentic platform</title>
          <link>https://example.com/b</link>
        </item>
      </channel></rss>`;
    const items = parseRssItems(xml);
    expect(items).toHaveLength(2);
    const candidates = newsItemsToCandidates(items);
    expect(candidates).toHaveLength(1);
    expect(candidates[0]?.source).toBe("ai_intent_news");
    expect(candidates[0]?.signalSummary).toContain("Northwind");
  });
});
