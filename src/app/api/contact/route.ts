import { NextResponse } from "next/server";
import {
  getClientIp,
  isRateLimited,
  isValidEmail,
  sanitize,
  ALLOWED_INTENTS,
} from "@/lib/contact-validation";
import type { ContactIntent } from "@/lib/contact-validation";

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
  intent?: ContactIntent;
  website?: string;
};

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as Partial<ContactPayload>;

    // Honeypot: bots often fill hidden fields.
    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = sanitize(body.name ?? "");
    const email = sanitize(body.email ?? "").toLowerCase();
    const company = sanitize(body.company ?? "");
    const message = sanitize(body.message ?? "");
    const intent = body.intent ?? "unsure";

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

    if (!ALLOWED_INTENTS.includes(intent)) {
      return NextResponse.json({ error: "Invalid project intent." }, { status: 400 });
    }

    // Log anonymised inquiry for volume tracking — no PII stored in logs.
    // Swap this for email/webhook/CRM integration when infra is ready.
    console.info("[contact-inquiry]", {
      receivedAt: new Date().toISOString(),
      ip,
      nameLength: name.length,
      emailDomain: email.split("@")[1] ?? "unknown",
      hasCompany: company.length > 0,
      intent,
      messageLength: message.length,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit right now. Please email admin@wayalabs.com." },
      { status: 500 }
    );
  }
}