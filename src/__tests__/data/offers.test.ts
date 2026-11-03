import { describe, expect, it } from "vitest";
import {
  DISCOVERY_CREDIT_DAYS,
  discoveryCreditSentence,
  discoveryOffer,
  discoveryRules,
} from "@/lib/data/offers";

describe("discovery offer", () => {
  it("is a flat price, not a percentage discount", () => {
    expect(discoveryOffer.priceUsd).toBe(1200);
    expect(discoveryOffer).not.toHaveProperty("listPriceUsd");
    expect(discoveryRules.join(" ")).not.toMatch(/40%/);
    expect(discoveryRules.join(" ")).toMatch(/not a percentage/);
  });

  it("keeps the internal ladder off this module", () => {
    expect(discoveryOffer).not.toHaveProperty("platform");
    expect(discoveryOffer).not.toHaveProperty("retainer");
  });

  it("credits the amount paid within 60 days and does not discount the build", () => {
    expect(DISCOVERY_CREDIT_DAYS).toBe(60);
    expect(discoveryCreditSentence).toBe(
      "Discovery is $1,200. That fee is credited if a build starts within 60 days.",
    );
    expect(discoveryCreditSentence).not.toMatch(/40%/);
    expect(discoveryRules.join(" ")).toMatch(/credited/);
    expect(discoveryRules.join(" ")).toMatch(/not discounted/);
  });
});
