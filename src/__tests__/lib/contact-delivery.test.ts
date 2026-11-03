import { describe, expect, it } from "vitest";
import {
  deliverInquiry,
  isFromAddress,
  renderInquiry,
  type Inquiry,
} from "@/lib/contact-delivery";

const inquiry: Inquiry = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  message: "Need a quote form that emails sales.",
  intent: "platform",
};

describe("renderInquiry", () => {
  it("includes the reply path and the message", () => {
    const rendered = renderInquiry(inquiry);
    expect(rendered.subject).toContain("platform");
    expect(rendered.subject).toContain("Ada Lovelace");
    expect(rendered.text).toContain("ada@example.com");
    expect(rendered.text).toContain("Need a quote form that emails sales.");
  });
});

describe("isFromAddress", () => {
  it("accepts a mailbox and a single display-name form", () => {
    expect(isFromAddress("admin@wayalabs.com")).toBe(true);
    expect(isFromAddress("WayaLabs <admin@wayalabs.com>")).toBe(true);
  });

  it("rejects header breaks and extra mailboxes", () => {
    expect(isFromAddress("admin@wayalabs.com\nBcc: evil@example.com")).toBe(false);
    expect(isFromAddress("a@b.com, c@d.com")).toBe(false);
  });
});

describe("deliverInquiry", () => {
  it("refuses to pretend success when Resend is unset", async () => {
    const result = await deliverInquiry(inquiry, {});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(503);
      expect(result.error).toContain("admin@wayalabs.com");
    }
  });

  it("posts the inquiry to Resend when configured", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const fetchImpl = (async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ id: "email_1" }), { status: 200 });
    }) as typeof fetch;

    const result = await deliverInquiry(
      inquiry,
      {
        RESEND_API_KEY: "re_test",
        CONTACT_FROM_EMAIL: "WayaLabs <admin@wayalabs.com>",
        CONTACT_TO_EMAIL: "admin@wayalabs.com",
      },
      fetchImpl,
    );

    expect(result).toEqual({ ok: true });
    expect(calls[0]?.url).toBe("https://api.resend.com/emails");
    const headers = calls[0]?.init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer re_test");
    const body = JSON.parse(String(calls[0]?.init?.body));
    expect(body.from).toBe("WayaLabs <admin@wayalabs.com>");
    expect(body.to).toEqual(["admin@wayalabs.com"]);
    expect(body.reply_to).toBe("ada@example.com");
    expect(body.text).toContain("Analytical Engines");
  });

  it("does not report success when Resend rejects the message", async () => {
    const fetchImpl = (async () => new Response("no", { status: 422 })) as typeof fetch;
    const result = await deliverInquiry(
      inquiry,
      {
        RESEND_API_KEY: "re_test",
        CONTACT_FROM_EMAIL: "WayaLabs <admin@wayalabs.com>",
      },
      fetchImpl,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(502);
  });

  it("returns a delivery failure when the provider call throws", async () => {
    const fetchImpl = (async () => {
      throw new Error("timeout");
    }) as typeof fetch;
    const result = await deliverInquiry(
      inquiry,
      {
        RESEND_API_KEY: "re_test",
        CONTACT_FROM_EMAIL: "WayaLabs <admin@wayalabs.com>",
      },
      fetchImpl,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(502);
  });

  it("does not send when the from address is not a single mailbox", async () => {
    const fetchImpl = (async () => new Response("ok", { status: 200 })) as typeof fetch;
    const result = await deliverInquiry(
      inquiry,
      {
        RESEND_API_KEY: "re_test",
        CONTACT_FROM_EMAIL: "admin@wayalabs.com\nBcc: evil@example.com",
      },
      fetchImpl,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(503);
  });
});
