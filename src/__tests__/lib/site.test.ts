import { describe, it, expect } from "vitest";
import { showOffersInNavigation } from "@/lib/site";

describe("showOffersInNavigation", () => {
  it("lists Offers in navigation (one commercial ladder)", () => {
    expect(showOffersInNavigation).toBe(true);
  });
});
