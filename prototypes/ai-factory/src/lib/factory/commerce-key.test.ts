import { describe, expect, it } from "vitest";
import {
  collectNativeKeys,
  createMemoryAliasStore,
  linkCommerceAliases,
  resolveAndCanonicalizeCommerceKey,
  resolveCommerceKey,
  shouldBookCredit,
} from "./commerce-key";

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

describe("cross-provider alias correlation", () => {
  it("collects every native key present on a checkout", () => {
    expect(
      collectNativeKeys({
        stripePaymentIntentId: "pi_abc",
        shopifyOrderId: "901",
      }),
    ).toEqual(["stripe:pi:pi_abc", "shopify:order:901"]);
  });

  it("links Stripe PI and Shopify order to one shared canonical key", async () => {
    const store = createMemoryAliasStore();

    // Stripe webhook also carries the Shopify order id in metadata.
    const canonical = await linkCommerceAliases(
      {
        stripePaymentIntentId: "pi_abc",
        shopifyOrderId: "901",
      },
      store,
      store,
    );
    expect(canonical).toBe("stripe:pi:pi_abc");
    expect(store.findCanonical("shopify:order:901")).toBe("stripe:pi:pi_abc");

    // Later Shopify-only orders/paid event still resolves to the Stripe key.
    const shopifyOnly = await resolveAndCanonicalizeCommerceKey(
      { shopifyOrderId: "901" },
      store,
    );
    expect(shopifyOnly).toBe("stripe:pi:pi_abc");

    const existing = new Set<string>(["stripe:pi:pi_abc"]);
    expect(
      shouldBookCredit({ commerceKey: shopifyOnly, existingCreditKeys: existing }),
    ).toBe(false);
  });

  it("adopts an existing canonical when Shopify arrives first then Stripe links", async () => {
    const store = createMemoryAliasStore();

    await linkCommerceAliases({ shopifyOrderId: "901" }, store, store);
    const afterStripe = await linkCommerceAliases(
      {
        stripePaymentIntentId: "pi_abc",
        shopifyOrderId: "901",
      },
      store,
      store,
    );
    // Existing Shopify canonical wins once the graph already has it.
    expect(afterStripe).toBe("shopify:order:901");
    expect(store.findCanonical("stripe:pi:pi_abc")).toBe("shopify:order:901");
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
