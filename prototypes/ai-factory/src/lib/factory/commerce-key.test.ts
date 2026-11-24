import { describe, expect, it } from "vitest";
import { resolveCommerceKey, shouldBookCredit } from "./commerce-key";

describe("resolveCommerceKey", () => {
  it("prefers Stripe PaymentIntent over Charge and Shopify", () => {
    expect(
      resolveCommerceKey({
        stripePaymentIntentId: "pi_abc",
        stripeChargeId: "ch_xyz",
        shopifyOrderId: "5678",
      }),
    ).toBe("stripe:pi:pi_abc");
  });

  it("falls back to Stripe Charge then Shopify order", () => {
    expect(resolveCommerceKey({ stripeChargeId: "ch_1" })).toBe("stripe:ch:ch_1");
    expect(resolveCommerceKey({ shopifyOrderId: "901" })).toBe("shopify:order:901");
    expect(resolveCommerceKey({ shopifyCheckoutToken: "tok" })).toBe(
      "shopify:checkout:tok",
    );
  });

  it("uses runId+externalId as last resort", () => {
    expect(
      resolveCommerceKey({ runId: "run_1", externalId: "evt_9" }),
    ).toBe("run:run_1:evt_9");
  });

  it("returns null when hints are empty or blank", () => {
    expect(resolveCommerceKey({})).toBeNull();
    expect(resolveCommerceKey({ stripePaymentIntentId: "  " })).toBeNull();
  });
});

describe("shouldBookCredit", () => {
  it("books once per commerce_key across providers", () => {
    const key = "stripe:pi:pi_abc";
    const existing = new Set<string>();
    expect(shouldBookCredit({ commerceKey: key, existingCreditKeys: existing })).toBe(
      true,
    );
    existing.add(key);
    expect(shouldBookCredit({ commerceKey: key, existingCreditKeys: existing })).toBe(
      false,
    );
  });

  it("refuses to book without a commerce_key", () => {
    expect(
      shouldBookCredit({ commerceKey: null, existingCreditKeys: new Set() }),
    ).toBe(false);
  });
});
