import { describe, expect, it } from "vitest";
import { renderDigest, runLeadDigest } from "@/lib/leads/digest";
import type { LeadRecord } from "@/lib/leads/types";

const leads: LeadRecord[] = [
  {
    id: "lead_1",
    intent: "discovery",
    status: "new",
    created_at: "2026-11-24T12:00:00.000Z",
    contact: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "Analytical Engines",
    },
  },
];

describe("renderDigest", () => {
  it("is addressed to the operator and lists leads", () => {
    const rendered = renderDigest(leads, []);
    expect(rendered.subject).toContain("1 open");
    expect(rendered.text).toContain("does not email leads or candidates");
    expect(rendered.text).toContain("ada@example.com");
  });
});

describe("runLeadDigest", () => {
  it("refuses when CRM is unset", async () => {
    const result = await runLeadDigest({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(503);
    }
  });
});
