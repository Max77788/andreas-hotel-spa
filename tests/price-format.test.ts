import { describe, expect, it } from "vitest";
import { formatNightlyPrice } from "@/lib/format-price";

describe("formatNightlyPrice", () => {
  it.each([
    ["599", "$599"],
    ["$599", "$599"],
    ["  $599 ", "$599"],
  ])("renders %s with exactly one currency symbol", (price, expected) => {
    expect(formatNightlyPrice(price)).toBe(expected);
  });

  it("does not invent a price for an empty value", () => {
    expect(formatNightlyPrice("")).toBe("");
  });
});
