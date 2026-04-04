import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("returns an empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("merges class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", undefined, null as never, false as never, "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const active = true;
    const disabled = false;
    expect(cn("base", active && "active", disabled && "disabled")).toBe("base active");
  });

  it("resolves tailwind conflicts — last value wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("handles object syntax", () => {
    expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe("text-red-500");
  });

  it("merges conflicting padding utilities correctly", () => {
    expect(cn("p-4", "px-6")).toBe("p-4 px-6");
  });
});
