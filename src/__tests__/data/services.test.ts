import { describe, it, expect } from "vitest";
import { services } from "@/lib/data/services";

const REQUIRED_FIELDS = ["id", "title", "slug", "tagline", "description", "icon"] as const;

describe("services data — smoke tests", () => {
  it("exports exactly 3 services", () => {
    expect(services.length).toBe(3);
  });

  it("has unique ids", () => {
    const ids = services.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique slugs", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  services.forEach((service) => {
    describe(service.title, () => {
      REQUIRED_FIELDS.forEach((field) => {
        it(`has a non-empty ${field}`, () => {
          expect((service as Record<string, unknown>)[field]).toBeTruthy();
        });
      });

      it("has at least one capability", () => {
        expect(service.capabilities.length).toBeGreaterThanOrEqual(1);
      });

      it("has at least one outcome with metric and label", () => {
        expect(service.outcomes.length).toBeGreaterThanOrEqual(1);
        service.outcomes.forEach((o) => {
          expect(o.metric).toBeTruthy();
          expect(o.label).toBeTruthy();
        });
      });
    });
  });
});
