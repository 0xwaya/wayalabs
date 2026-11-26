import { describe, it, expect } from "vitest";
import { isSafeHref, isSafeSitePath } from "@/lib/safe-url";

describe("isSafeSitePath", () => {
  it("accepts a root-relative public path", () => {
    expect(isSafeSitePath("/research/ai-race-nov2026/wayalabs-ai-race-nov2026.pdf")).toBe(true);
  });

  it("rejects protocol-relative and non-path values", () => {
    expect(isSafeSitePath("//evil.example/pdf")).toBe(false);
    expect(isSafeSitePath("https://example.com/a.pdf")).toBe(false);
    expect(isSafeSitePath("javascript:alert(1)")).toBe(false);
    expect(isSafeSitePath("/foo\\bar")).toBe(false);
    expect(isSafeSitePath("/foo\"onclick")).toBe(false);
  });
});

describe("isSafeHref", () => {
  it("accepts http(s), mailto, hash, and site paths", () => {
    expect(isSafeHref("https://www.federalregister.gov/d/1")).toBe(true);
    expect(isSafeHref("http://example.com")).toBe(true);
    expect(isSafeHref("mailto:admin@wayalabs.com")).toBe(true);
    expect(isSafeHref("#sources")).toBe(true);
    expect(isSafeHref("/insights/ai-policies-us-china-2026")).toBe(true);
  });

  it("rejects javascript and other unsafe schemes", () => {
    expect(isSafeHref("javascript:alert(1)")).toBe(false);
    expect(isSafeHref("data:text/html,hi")).toBe(false);
    expect(isSafeHref("//evil.example")).toBe(false);
    expect(isSafeHref("mailto:foo@bar.com?body=javascript:alert(1)")).toBe(false);
  });
});
