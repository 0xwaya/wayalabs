import { NextResponse } from "next/server";
import { createFactorySql } from "@/lib/factory/db";
import { ingestProofEvent } from "@/lib/factory/ingest";
import {
  mapStripeEvent,
  verifyStripeWebhook,
} from "@/lib/factory/stripe-webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const sql = createFactorySql();
  if (!sql) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured." },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const verified = verifyStripeWebhook(
    rawBody,
    request.headers.get("stripe-signature"),
    process.env.STRIPE_WEBHOOK_SECRET,
  );
  if (!verified.ok) {
    return NextResponse.json({ error: verified.error }, { status: verified.status });
  }

  const mapped = mapStripeEvent(verified.payload);
  const result = await ingestProofEvent(sql, {
    provider: "stripe",
    eventId: verified.payload.id,
    kind: mapped.kind,
    hints: mapped.hints,
    amountCents: mapped.amountCents,
    currency: mapped.currency,
    runId: mapped.runId,
    bayId: null,
    raw: verified.payload,
  });

  return NextResponse.json(result);
}
