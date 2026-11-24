import { createHmac, timingSafeEqual } from "node:crypto";
import type { ProofKind } from "./types-live";
import type { CommerceKeyHints } from "./commerce-key";

export type StripeVerifyResult =
  | { ok: true; payload: StripeEventLike }
  | { ok: false; error: string; status: 400 | 401 | 503 };

export type StripeEventLike = {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
};

/** Verify Stripe-Signature (t=,v1=) and parse JSON body. */
export function verifyStripeWebhook(
  rawBody: string,
  signatureHeader: string | null,
  secret: string | undefined,
  toleranceSec = 300,
): StripeVerifyResult {
  const trimmed = secret?.trim() ?? "";
  if (!trimmed) {
    return {
      ok: false,
      error: "STRIPE_WEBHOOK_SECRET is not configured.",
      status: 503,
    };
  }
  if (!signatureHeader) {
    return { ok: false, error: "Missing Stripe-Signature header.", status: 400 };
  }

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((piece) => {
      const [k, ...rest] = piece.split("=");
      return [k?.trim() ?? "", rest.join("=").trim()];
    }),
  );
  const timestamp = parts.t;
  const v1 = parts.v1;
  if (!timestamp || !v1) {
    return { ok: false, error: "Malformed Stripe-Signature.", status: 400 };
  }

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) {
    return { ok: false, error: "Invalid Stripe timestamp.", status: 400 };
  }
  const age = Math.abs(Math.floor(Date.now() / 1000) - ts);
  if (age > toleranceSec) {
    return { ok: false, error: "Stripe timestamp outside tolerance.", status: 401 };
  }

  const signed = `${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", trimmed).update(signed, "utf8").digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(v1, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, error: "Invalid Stripe signature.", status: 401 };
  }

  let payload: StripeEventLike;
  try {
    payload = JSON.parse(rawBody) as StripeEventLike;
  } catch {
    return { ok: false, error: "Invalid JSON body.", status: 400 };
  }
  if (!payload?.id || !payload?.type) {
    return { ok: false, error: "Stripe event missing id/type.", status: 400 };
  }
  return { ok: true, payload };
}

export function mapStripeEvent(event: StripeEventLike): {
  kind: ProofKind;
  hints: CommerceKeyHints;
  amountCents: number | null;
  currency: string | null;
  runId: string | null;
} {
  const obj = event.data?.object ?? {};
  const meta = (obj.metadata ?? {}) as Record<string, unknown>;
  const runId =
    typeof meta.run_id === "string"
      ? meta.run_id
      : typeof meta.runId === "string"
        ? meta.runId
        : null;

  const shopifyOrderId =
    typeof meta.shopify_order_id === "string"
      ? meta.shopify_order_id
      : typeof meta.shopifyOrderId === "string"
        ? meta.shopifyOrderId
        : null;

  const paymentIntentId =
    typeof obj.id === "string" && obj.id.startsWith("pi_")
      ? obj.id
      : typeof obj.payment_intent === "string"
        ? obj.payment_intent
        : null;

  const chargeId =
    typeof obj.id === "string" && obj.id.startsWith("ch_")
      ? obj.id
      : typeof obj.charge === "string"
        ? obj.charge
        : null;

  const amountCents =
    typeof obj.amount_received === "number"
      ? obj.amount_received
      : typeof obj.amount === "number"
        ? obj.amount
        : null;

  const currency =
    typeof obj.currency === "string" ? obj.currency.toLowerCase() : null;

  const hints: CommerceKeyHints = {
    stripePaymentIntentId: paymentIntentId,
    stripeChargeId: chargeId,
    shopifyOrderId,
    runId,
    externalId: event.id,
  };

  let kind: ProofKind = "payment_captured";
  if (event.type.includes("refund") || event.type === "charge.refunded") {
    kind = "payment_refunded";
  } else if (event.type.includes("dispute")) {
    kind = "dispute_opened";
  } else if (event.type === "payment_intent.succeeded" || event.type === "charge.succeeded") {
    kind = "payment_captured";
  }

  return { kind, hints, amountCents, currency, runId };
}
