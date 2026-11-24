import { describe, expect, it } from "vitest";
import { runLeadSourceJob } from "@/lib/leads/source-job";

describe("runLeadSourceJob", () => {
  it("fails when CRM env is missing instead of reporting success", async () => {
    const result = await runLeadSourceJob(
      {
        LEAD_SOURCE_SBA: "0",
        LEAD_SOURCE_AI_INTENT: "0",
      },
      fetch,
    );
    // Both channels off → nothing to file; ok with zeros.
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.inserted).toBe(0);
    }

    const missingCrm = await runLeadSourceJob(
      {
        LEAD_SOURCE_SBA: "0",
        LEAD_SOURCE_AI_INTENT: "1",
      },
      (async () =>
        new Response(
          `<rss><channel><item><title>Acme deploys AI agents in operations</title><link>https://example.com/x</link></item></channel></rss>`,
          { status: 200 },
        )) as typeof fetch,
    );
    expect(missingCrm.ok).toBe(false);
    if (!missingCrm.ok) {
      expect(missingCrm.status).toBe(503);
      expect(missingCrm.error).toContain("CRM is not configured");
    }
  });
});
