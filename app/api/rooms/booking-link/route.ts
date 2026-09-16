import { NextRequest, NextResponse } from "next/server";
import { buildBookingEngineUrl, fetchBookingSnapshot, getBookableRate } from "@/lib/booking-engine";

const ROOM_SLUGS: Record<string, string> = {
  DLX: "deluxe-room", EXEC: "executive-room", STE: "1-bedroom-suite",
  "2BED": "2-bed-1-bath-suite", "2B2B": "andreas-villa-suite",
  ADA: "mobility-accessible-deluxe-room", ADA2: "mobility-accessible-suite",
};

function getParams(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  return {
    code: (sp.get("room") || "").toUpperCase(),
    arrival: sp.get("arrival") || "",
    departure: sp.get("departure") || "",
    adults: Math.max(1, Number.parseInt(sp.get("adults") || "2", 10) || 2),
  };
}

export async function GET(req: NextRequest) { return respond(getParams(req)); }
export async function POST(req: NextRequest) {
  const input = getParams(req);
  if (!input.code || !input.arrival || !input.departure) {
    try {
      const body = await req.json();
      input.code = String(body.room || body.code || input.code).toUpperCase();
      input.arrival = body.arrival || input.arrival;
      input.departure = body.departure || input.departure;
      input.adults = Math.max(1, Number.parseInt(String(body.adults || input.adults), 10) || 2);
    } catch { /* query parameters are handled below */ }
  }
  return respond(input);
}

async function respond({ code, arrival, departure, adults }: ReturnType<typeof getParams>) {
  if (!code || !arrival || !departure) {
    return NextResponse.json({ error: "room, arrival, and departure are required" }, { status: 400 });
  }
  if (!ROOM_SLUGS[code]) {
    return NextResponse.json({ error: `Unknown room code: ${code}. Valid: ${Object.keys(ROOM_SLUGS).join(", ")}` }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(arrival) || !/^\d{4}-\d{2}-\d{2}$/.test(departure) || departure <= arrival) {
    return NextResponse.json({ error: "Valid arrival and departure dates required (YYYY-MM-DD), with departure after arrival" }, { status: 400 });
  }

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

    return NextResponse.json({
      room: room.metadata?.title?.replace(/\s*\([^)]*\)$/, "") || code,
      code,
      rate_code: rate.code,
      arrival,
      departure,
      adults,
      booking_url: bookingUrl.toString(),
      booking_engine_url: buildBookingEngineUrl({ arrival, departure, adults, room: code, rate: rate.code }).toString(),
      room_details_url: `https://andreashotel.com/rooms/${ROOM_SLUGS[code]}`,
      message: `Click the booking link to reserve your ${room.metadata?.title || code} for ${arrival} to ${departure}, ${adults} adult(s).`,
    });
  } catch (err) {
    console.error("Booking link creation failed:", err);
    return NextResponse.json({ error: "The booking engine could not be reached. Please try again." }, { status: 502 });
  }
}
