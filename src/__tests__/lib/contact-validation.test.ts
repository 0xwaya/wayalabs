import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  sanitize,
  isRateLimited,
  getClientIp,
  MAX_REQUESTS_PER_WINDOW,
} from "@/lib/contact-validation";

describe("isValidEmail", () => {
  it("accepts a standard email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  it("accepts email with subdomain", () => {
    expect(isValidEmail("user@mail.example.com")).toBe(true);
  });

  it("accepts email with plus tag", () => {
    expect(isValidEmail("user+tag@example.com")).toBe(true);
  });

  it("accepts email with numeric local part", () => {
    expect(isValidEmail("123@example.io")).toBe(true);
  });

  it("rejects email without @", () => {
    expect(isValidEmail("notanemail")).toBe(false);
  });

  it("rejects email without domain extension", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejects email with leading space", () => {
    expect(isValidEmail(" user@example.com")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects double-@ address", () => {
    expect(isValidEmail("a@b@c.com")).toBe(false);
  });
});

describe("sanitize", () => {
  it("trims leading and trailing whitespace", () => {
    expect(sanitize("  hello  ")).toBe("hello");
  });

  it("collapses multiple internal spaces", () => {
    expect(sanitize("hello   world")).toBe("hello world");
  });

  it("normalises tabs and newlines to a single space", () => {
    expect(sanitize("hello\t\nworld")).toBe("hello world");
  });

  it("returns an empty string unchanged", () => {
    expect(sanitize("")).toBe("");
  });

  it("does not alter a clean string", () => {
    expect(sanitize("Clean input")).toBe("Clean input");
  });
});

describe("getClientIp", () => {
  it("returns the first IP from X-Forwarded-For with multiple entries", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("returns the IP when there is only one entry", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.42" },
    });
    expect(getClientIp(req)).toBe("203.0.113.42");
  });

  it("returns 'unknown' when no forwarding header is present", () => {
    const req = new Request("http://localhost");
    expect(getClientIp(req)).toBe("unknown");
  });
});

describe("isRateLimited", () => {
  it("allows requests under the per-IP limit", () => {
    const log = new Map<string, number[]>();
    for (let i = 0; i < MAX_REQUESTS_PER_WINDOW; i++) {
      expect(isRateLimited("192.168.1.1", log)).toBe(false);
    }
  });

  it("blocks the request that exceeds the per-IP limit", () => {
    const log = new Map<string, number[]>();
    for (let i = 0; i < MAX_REQUESTS_PER_WINDOW; i++) {
      isRateLimited("10.0.0.1", log);
    }
    expect(isRateLimited("10.0.0.1", log)).toBe(true);
  });

  it("does not block a different IP that is under the limit", () => {
    const log = new Map<string, number[]>();
    for (let i = 0; i < MAX_REQUESTS_PER_WINDOW; i++) {
      isRateLimited("10.0.0.1", log);
    }
    expect(isRateLimited("10.0.0.2", log)).toBe(false);
  });
});
