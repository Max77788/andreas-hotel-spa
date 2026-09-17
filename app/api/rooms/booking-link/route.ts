import { NextRequest, NextResponse } from "next/server";
import {
  buildBookingEngineUrl,
  fetchBookingSnapshot,
  getBookableRate,
  normalizeBookingAddOns,
  validateGuestDetails,
  type BookingAddOnInput,
  type GuestDetails,
} from "@/lib/booking-engine";

const ROOM_SLUGS: Record<string, string> = {
  DLX: "deluxe-room", EXEC: "executive-room", STE: "1-bedroom-suite",
  "2BED": "2-bed-1-bath-suite", "2B2B": "andreas-villa-suite",
  ADA: "mobility-accessible-deluxe-room", ADA2: "mobility-accessible-suite",
};

type BookingInput = {
  code: string; arrival: string; departure: string; adults: number;
  addOns: BookingAddOnInput[]; guest?: Partial<GuestDetails>;
};

function getParams(req: NextRequest): BookingInput {
  const sp = req.nextUrl.searchParams;
  return {
    code: (sp.get("room") || "").toUpperCase(),
    arrival: sp.get("arrival") || "",
    departure: sp.get("departure") || "",
    adults: Math.max(1, Number.parseInt(sp.get("adults") || "2", 10) || 2),
    addOns: [],
  };
}

export async function GET(req: NextRequest) { return respond(getParams(req)); }

export async function POST(req: NextRequest) {
  const input = getParams(req);
  try {
    const body = await req.json();
    input.code = String(body.room || body.code || input.code).toUpperCase();
    input.arrival = body.arrival || input.arrival;
    input.departure = body.departure || input.departure;
    input.adults = Math.max(1, Number.parseInt(String(body.adults || input.adults), 10) || 2);
    input.addOns = Array.isArray(body.addOns || body.upsells) ? (body.addOns || body.upsells) : [];
    input.guest = body.guest || body.guestDetails || body.purchaser;
  } catch { /* query parameters are handled below */ }
  return respond(input);
}

async function respond({ code, arrival, departure, adults, addOns, guest }: BookingInput) {
  if (!code || !arrival || !departure) {
    return NextResponse.json({ error: "room, arrival, and departure are required" }, { status: 400 });
  }
  if (!ROOM_SLUGS[code]) {
    return NextResponse.json({ error: `Unknown room code: ${code}. Valid: ${Object.keys(ROOM_SLUGS).join(", ")}` }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(arrival) || !/^\d{4}-\d{2}-\d{2}$/.test(departure) || departure <= arrival) {
    return NextResponse.json({ error: "Valid arrival and departure dates required (YYYY-MM-DD), with departure after arrival" }, { status: 400 });
  }

  let normalizedAddOns;
  try { normalizedAddOns = normalizeBookingAddOns(addOns); }
  catch (err) { return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid add-ons" }, { status: 400 }); }
  const guestErrors = guest ? validateGuestDetails(guest) : [];
  if (guestErrors.length) return NextResponse.json({ error: "Invalid guest details", fields: guestErrors }, { status: 400 });

  try {
    const snapshot = await fetchBookingSnapshot({ arrival, departure, adults });
    const room = snapshot.roomOffers.find((offer) => offer.code === code);
    const rate = room ? getBookableRate(room) : null;
    if (!room || !rate) {
      return NextResponse.json({ error: `${code} is not available for ${arrival} to ${departure}` }, { status: 409 });
    }

    const bookingUrl = new URL("https://andreashotel.com/book");
    bookingUrl.searchParams.set("arrival", arrival);
    bookingUrl.searchParams.set("departure", departure);
    bookingUrl.searchParams.set("adults", String(adults));
    bookingUrl.searchParams.set("room", code);
    bookingUrl.searchParams.set("rate", rate.code);
    const serviceCodes = normalizedAddOns.flatMap((addOn) => Array(addOn.quantity).fill(addOn.code));
    if (serviceCodes.length) bookingUrl.searchParams.set("skd-preselected-services", serviceCodes.join(","));

    return NextResponse.json({
      room: room.metadata?.title?.replace(/\s*\([^)]*\)$/, "") || code,
      code, rate_code: rate.code, arrival, departure, adults,
      booking_url: bookingUrl.toString(),
      booking_engine_url: buildBookingEngineUrl({ arrival, departure, adults, room: code, rate: rate.code, addOns: normalizedAddOns }).toString(),
      add_ons: normalizedAddOns,
      guest_details: guest
        ? { accepted: true, fields: Object.keys(guest), provider_prefill: "not_supported_by_booking_engine" }
        : { accepted: false, provider_prefill: "not_requested" },
      room_details_url: `https://andreashotel.com/rooms/${ROOM_SLUGS[code]}`,
      message: `Click the booking link to reserve your ${room.metadata?.title || code} for ${arrival} to ${departure}, ${adults} adult(s). Add-ons are preselected. The booking engine still requires purchaser details to be completed in checkout.`,
    });
  } catch (err) {
    console.error("Booking link creation failed:", err);
    return NextResponse.json({ error: "The booking engine could not be reached. Please try again." }, { status: 502 });
  }
}
