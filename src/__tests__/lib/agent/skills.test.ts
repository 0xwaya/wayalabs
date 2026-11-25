import { describe, expect, it, vi } from "vitest";
import { createRegistry } from "@/lib/agent/registry";
import { createDefaultRegistry } from "@/lib/agent/skills";
import { crmSnapshotSkill } from "@/lib/agent/skills/crm-snapshot";
import { opsAlertSkill } from "@/lib/agent/skills/ops-alert";
import { siteHealthSkill } from "@/lib/agent/skills/site-health";

const now = () => new Date("2026-11-25T12:00:00Z");

describe("registry", () => {
  it("exposes the default skills with risk labels", () => {
    const skills = createDefaultRegistry().list();
    expect(skills.map((s) => s.name)).toEqual([
      "crm.snapshot",
      "site.health",
      "lead.source",
      "lead.digest",
      "ops.alert",
    ]);
    expect(skills.find((s) => s.name === "crm.snapshot")?.risk).toBe("read");
    expect(skills.find((s) => s.name === "lead.digest")?.risk).toBe("write");
  });

  it("rejects duplicate names", () => {
    const s = createDefaultRegistry().list()[0];
    expect(() => createRegistry([s, s])).toThrow(/Duplicate/);
  });
});

describe("crm.snapshot", () => {
  it("fails without a database", async () => {
    const result = await crmSnapshotSkill.run({ env: {}, fetchImpl: fetch, now });
    expect(result).toMatchObject({ ok: false });
  });
});

describe("site.health", () => {
  it("reports healthy when every page returns 200", async () => {
    const fetchImpl = vi.fn<(url: string) => Promise<Response>>(async () => new Response("ok", { status: 200 }));
    const result = await siteHealthSkill.run({
      env: { SITE_URL: "https://example.test/" },
      fetchImpl: fetchImpl as unknown as typeof fetch,
      now,
    });
    expect(result).toMatchObject({ ok: true, data: { failing: [] } });
    expect(fetchImpl.mock.calls[0][0]).toBe("https://example.test/");
  });

  it("lists failing and unreachable pages", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.endsWith("/contact")) return new Response("", { status: 500 });
      if (url.endsWith("/offers")) throw new Error("down");
      return new Response("ok", { status: 200 });
    });
    const result = await siteHealthSkill.run({
      env: { SITE_URL: "https://example.test" },
      fetchImpl: fetchImpl as unknown as typeof fetch,
      now,
    });
    expect(result).toMatchObject({
      ok: true,
      data: {
        failing: [
          { path: "/contact", status: 500 },
          { path: "/offers", status: "error" },
        ],
      },
    });
  });
});

describe("ops.alert", () => {
  it("fails when mail is not configured", async () => {
    const result = await opsAlertSkill.run({ env: {}, fetchImpl: fetch, now });
    expect(result).toMatchObject({ ok: false, retryable: false });
  });

  it("emails only the configured operator mailbox", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));
    const result = await opsAlertSkill.run({
      env: {
        RESEND_API_KEY: "key",
        CONTACT_FROM_EMAIL: "Wayalabs <noreply@wayalabs.com>",
        CONTACT_TO_EMAIL: "admin@wayalabs.com",
      },
      fetchImpl: fetchImpl as unknown as typeof fetch,
      now,
    });
    expect(result).toMatchObject({ ok: true });
    const body = JSON.parse(
      (fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body as string,
    );
    expect(body.to).toEqual(["admin@wayalabs.com"]);
  });
});
