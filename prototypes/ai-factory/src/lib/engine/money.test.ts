import { describe, expect, it } from "vitest";
import { formatMoneyCents, formatUsd, nextIncomeGoal } from "./money";

describe("formatUsd", () => {
  it("formats positive and negative amounts", () => {
    expect(formatUsd(1450)).toBe("$1,450");
    expect(formatUsd(-40)).toBe("-$40");
  });
});

describe("formatMoneyCents", () => {
  it("preserves cents and currency", () => {
    expect(formatMoneyCents(1999, "usd")).toBe("$19.99");
    expect(formatMoneyCents(1050, "eur")).toMatch(/10[.,]50/);
  });
});

describe("nextIncomeGoal", () => {
  it("returns the next milestone above lifetime revenue", () => {
    expect(nextIncomeGoal(0)).toBe(1000);
    expect(nextIncomeGoal(1000)).toBe(2500);
    expect(nextIncomeGoal(2499)).toBe(2500);
  });
});
