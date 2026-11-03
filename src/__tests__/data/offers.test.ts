import { describe, expect, it } from "vitest";
import {
  NEW_CUSTOMER_DISCOUNT_PERCENT,
  discoveryOffer,
  discountedUsd,
  newCustomerDiscoveryUsd,
  newCustomerRules,
} from "@/lib/data/offers";

describe("new customer offer", () => {
  it("is a 40% discount on the discovery list price", () => {
    expect(NEW_CUSTOMER_DISCOUNT_PERCENT).toBe(40);
    expect(discoveryOffer.listPriceUsd).toBe(3500);
    expect(newCustomerDiscoveryUsd).toBe(2100);
    expect(discountedUsd(3500)).toBe(2100);
  });

  it("rounds half-up to the nearest dollar", () => {
    expect(discountedUsd(100)).toBe(60);
  });

  it("keeps the internal ladder off this module", () => {
    expect(discoveryOffer).not.toHaveProperty("platform");
    expect(discoveryOffer).not.toHaveProperty("retainer");
  });

  it("states that the discount is once, on the first invoice", () => {
    expect(newCustomerRules.join(" ")).toMatch(/first invoice only/);
    expect(newCustomerRules.join(" ")).toMatch(/not discounted/);
  });
});
