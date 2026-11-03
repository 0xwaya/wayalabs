import { NextResponse } from "next/server";
import { deliverInquiry } from "@/lib/contact-delivery";
import {
  getClientIp,
  isRateLimited,
  isContactIntent,
  isValidEmail,
  sanitize,
} from "@/lib/contact-validation";

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  intent?: unknown;
  website?: string;
};

const MAX_BODY_CHARS = 8_000;

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_CHARS) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const body = parsed as Partial<ContactPayload>;

    // Honeypot: bots often fill hidden fields.
    const website = asText(body.website);
    if (website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = sanitize(asText(body.name));
    const email = sanitize(asText(body.email)).toLowerCase();
    const company = sanitize(asText(body.company));
    const message = sanitize(asText(body.message));
    const intent = asText(body.intent) || "unsure";

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
    }

    if (!isValidEmail(email) || email.length > 200) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (company.length > 120) {
      return NextResponse.json({ error: "Company name is too long." }, { status: 400 });
    }

    if (message.length < 10 || message.length > 3000) {
      return NextResponse.json(
        { error: "Please include a short project description (10-3000 chars)." },
        { status: 400 }
      );
    }

    if (!isContactIntent(intent)) {
      return NextResponse.json({ error: "Invalid project intent." }, { status: 400 });
    }

    // Volume only. The message, name, and address go to email, not logs.
    console.info("[contact-inquiry]", {
      receivedAt: new Date().toISOString(),
      nameLength: name.length,
      emailDomain: email.split("@")[1] ?? "unknown",
      hasCompany: company.length > 0,
      intent,
      messageLength: message.length,
    });

    const delivery = await deliverInquiry({ name, email, company, message, intent });
    if (!delivery.ok) {
      return NextResponse.json({ error: delivery.error }, { status: delivery.status });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit right now. Please email admin@wayalabs.com." },
      { status: 500 }
    );
  }
}