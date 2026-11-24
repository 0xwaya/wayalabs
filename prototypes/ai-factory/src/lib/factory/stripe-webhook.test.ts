import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { mapStripeEvent, verifyStripeWebhook } from "./stripe-webhook";

const secret = "whsec_test_secret";

function sign(body: string, ts = Math.floor(Date.now() / 1000)) {
  const v1 = createHmac("sha256", secret)
    .update(`${ts}.${body}`, "utf8")
    .digest("hex");
  return { header: `t=${ts},v1=${v1}`, ts };
}

describe("verifyStripeWebhook", () => {
  it("accepts a valid signature", () => {
    const body = JSON.stringify({
      id: "evt_1",
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_1", amount_received: 42000, currency: "usd" } },
    });
    const { header } = sign(body);
    const result = verifyStripeWebhook(body, header, secret);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.payload.id).toBe("evt_1");
  });

  it("rejects bad signatures and missing secret", () => {
    const body = "{}";
    expect(verifyStripeWebhook(body, "t=1,v1=nope", secret).ok).toBe(false);
    const missing = verifyStripeWebhook(body, "t=1,v1=nope", undefined);
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.status).toBe(503);
  });
});

describe("mapStripeEvent", () => {
  it("extracts PI, shopify order metadata, and run_id", () => {
    const mapped = mapStripeEvent({
      id: "evt_2",
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_abc",
          amount_received: 51000,
          currency: "USD",
          metadata: { run_id: "run_1", shopify_order_id: "901" },
        },
      },
    });
    expect(mapped?.kind).toBe("payment_captured");
    expect(mapped?.runId).toBe("run_1");
    expect(mapped?.hints.stripePaymentIntentId).toBe("pi_abc");
    expect(mapped?.hints.shopifyOrderId).toBe("901");
    expect(mapped?.amountCents).toBe(51000);
  });

  it("maps refund events", () => {
    const mapped = mapStripeEvent({
      id: "evt_3",
      type: "charge.refunded",
      data: { object: { id: "ch_1", amount: 1000, currency: "usd" } },
    });
    expect(mapped?.kind).toBe("payment_refunded");
  });

  it("ignores unsupported event types", () => {
    expect(
      mapStripeEvent({
        id: "evt_fail",
        type: "payment_intent.payment_failed",
        data: { object: { id: "pi_x" } },
      }),
    ).toBeNull();
  });
});
