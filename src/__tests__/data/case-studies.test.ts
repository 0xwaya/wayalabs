import { describe, it, expect } from "vitest";
import { caseStudies } from "@/lib/data/case-studies";

const REQUIRED_FIELDS = ["id", "title", "client", "category", "summary"] as const;

describe("caseStudies data — smoke tests", () => {
  it("exports at least one case study", () => {
    expect(caseStudies.length).toBeGreaterThanOrEqual(1);
  });

  it("has unique ids", () => {
    const ids = caseStudies.map((cs) => cs.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  caseStudies.forEach((study) => {
    describe(study.title, () => {
      REQUIRED_FIELDS.forEach((field) => {
        it(`has a non-empty ${field}`, () => {
          expect((study as Record<string, unknown>)[field]).toBeTruthy();
        });
      });

      it("has at least one tag", () => {
        expect(study.tags.length).toBeGreaterThanOrEqual(1);
      });

      it("has at least one impact item", () => {
        expect(study.impact.length).toBeGreaterThanOrEqual(1);
        study.impact.forEach((item) => {
          expect(typeof item).toBe("string");
          expect(item.length).toBeGreaterThan(0);
        });
      });

      it("has a non-empty problem description", () => {
        expect(study.problem.length).toBeGreaterThan(10);
      });

      it("has a non-empty approach description", () => {
        expect(study.approach.length).toBeGreaterThan(10);
      });
    });
  });
});
