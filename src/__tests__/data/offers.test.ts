import { describe, expect, it } from "vitest";
import {
  DISCOVERY_CREDIT_DAYS,
  discoveryCreditSentence,
  discoveryOffer,
  leadSystemOffer,
  offerRules,
  offersPageDescription,
  platformOffer,
} from "@/lib/data/offers";

describe("public offers", () => {
  it("prices discovery at $1,200 and describes the week", () => {
    expect(discoveryOffer.priceUsd).toBe(1200);
    expect(discoveryOffer.duration).toBe("One week");
    expect(discoveryOffer.includes.join(" ")).toMatch(/go or no-go/);
    expect(discoveryOffer.includes.join(" ")).toMatch(/data boundary/i);
  });

  it("publishes the live platform and lead-system ranges", () => {
    expect(platformOffer.priceFromUsd).toBe(10_000);
    expect(platformOffer.priceToUsd).toBe(18_000);
    expect(leadSystemOffer.priceFromUsd).toBe(7_000);
    expect(leadSystemOffer.priceToUsd).toBe(14_000);
    expect(platformOffer.summary).toMatch(/still being improved/);
    expect(leadSystemOffer.summary).toMatch(/still being improved/);
    expect(leadSystemOffer.summary).toMatch(/Onyx/);
  });

  it("credits discovery once within 60 days and does not discount", () => {
    expect(DISCOVERY_CREDIT_DAYS).toBe(60);
    expect(offerRules.join(" ")).toMatch(/credited/);
    expect(offerRules.join(" ")).toMatch(/once/);
    expect(discoveryCreditSentence).not.toMatch(/40%/);
    expect(offersPageDescription).not.toMatch(/40%/);
    expect(offersPageDescription).toMatch(/\$1,200/);
    expect(offersPageDescription).toMatch(/\$10,000/);
    expect(offersPageDescription).toMatch(/\$7,000/);
  });

  it("keeps watch, the build block, and agent pilots off this module", () => {
    const blob = JSON.stringify({ discoveryOffer, platformOffer, leadSystemOffer, offerRules });
    expect(blob).not.toMatch(/watch/i);
    expect(blob).not.toMatch(/build block/i);
    expect(blob).not.toMatch(/agent/i);
  });
});
