import { describe, expect, it } from "vitest";
import {
  ADD_ONS,
  buildBookingEngineUrl,
  normalizeBookingAddOns,
  validateGuestDetails,
} from "@/lib/booking-engine";

describe("booking engine checkout inputs", () => {
  it("adds repeated provider service-code parameters without putting guest PII in the URL", () => {
    const url = buildBookingEngineUrl({
      arrival: "2027-01-15",
      departure: "2027-01-17",
      adults: 2,
      room: "2BED",
      rate: "2BED____BAR",
      addOns: [{ code: "BOTTLE_OF1", quantity: 1 }],
    });

    expect(url.searchParams.get("skd-preselected-services")).toBe("BOTTLE_OF1");
    expect(url.toString()).not.toContain("firstName");
    expect(url.toString()).not.toContain("lastName");
  });

  it("normalizes only known add-ons and rejects unknown codes", () => {
    expect(normalizeBookingAddOns([{ code: "bottle_of1", quantity: 2 }])).toEqual([
      { code: "BOTTLE_OF1", quantity: 2, title: ADD_ONS.BOTTLE_OF1.title, price: 39 },
    ]);
    expect(() => normalizeBookingAddOns([{ code: "champagne", quantity: 1 }])).toThrow(
      /Unknown add-on code/,
    );
  });

  it("requires the checkout identity fields that the provider form collects", () => {
    expect(validateGuestDetails({ firstName: "Ada", lastName: "Lovelace", email: "ada@example.com" })).toEqual([]);
    expect(validateGuestDetails({ firstName: "", lastName: "Lovelace", email: "bad" })).toEqual([
      "firstName is required",
      "email must be valid",
    ]);
  });
});
