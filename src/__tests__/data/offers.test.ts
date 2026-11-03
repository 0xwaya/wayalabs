import { describe, expect, it } from "vitest";
import {
  DISCOVERY_CREDIT_DAYS,
  discoveryOffer,
  discoveryOutcomes,
  discoveryRules,
  discoverySummary,
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

  it("describes the sprint as the onboarding product", () => {
    expect(discoverySummary).toMatch(/onboarding product/);
    expect(discoverySummary).toMatch(/go or no-go/);
    expect(discoverySummary).not.toMatch(/40%/);
    expect(discoveryOutcomes).toHaveLength(3);
    const text = discoveryOutcomes.map((item) => `${item.title} ${item.body}`).join(" ");
    expect(text).toMatch(/front door/);
    expect(text).not.toMatch(/40%|deposit|Watch|Echo/);
  });

  it("credits the amount paid within 60 days and does not discount the build", () => {
    expect(DISCOVERY_CREDIT_DAYS).toBe(60);
    expect(discoveryRules.join(" ")).toMatch(/credited/);
    expect(discoveryRules.join(" ")).toMatch(/not discounted/);
  });
});
