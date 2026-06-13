import { NextRequest, NextResponse } from "next/server";

const ROOM_NAMES: Record<string, string> = {
  DLX: "Deluxe Room", EXEC: "Executive Room", STE: "1 Bedroom Suite",
  "2BED": "2 Bed 1 Bath Suite", "2B2B": "Andreas Villa Suite",
  ADA: "Mobility Accessible Deluxe Room", ADA2: "Mobility Accessible 2 Bed Suite",
};

const ROOM_SLUGS: Record<string, string> = {
  DLX: "deluxe-room", EXEC: "executive-room", STE: "1-bedroom-suite",
  "2BED": "2-bed-1-bath-suite", "2B2B": "andreas-villa-suite",
  ADA: "mobility-accessible-deluxe-room", ADA2: "mobility-accessible-suite",
};

async function getParams(req: NextRequest) {
  let code = "";
  let arrival = "";
  let departure = "";
  let adults = "2";

  const sp = req.nextUrl.searchParams;
  code = sp.get("room") || "";
  arrival = sp.get("arrival") || "";
  departure = sp.get("departure") || "";
  if (sp.get("adults")) adults = sp.get("adults")!;

  if (!code) {
    try {
      const body = await req.json();
      code = body.room || body.code || "";
      arrival = body.arrival || arrival;
      departure = body.departure || departure;
      if (body.adults) adults = String(body.adults);
    } catch { /* ignore */ }
  }

  return { code: code.toUpperCase(), arrival, departure, adults };
}

export async function GET(req: NextRequest) {
  const { code, arrival, departure, adults } = await getParams(req);
  return respond(code, arrival, departure, adults);
}

export async function POST(req: NextRequest) {
  const { code, arrival, departure, adults } = await getParams(req);
  return respond(code, arrival, departure, adults);
}

function respond(code: string, arrival: string, departure: string, adults: string) {
  if (!code || !arrival || !departure) {
    return NextResponse.json(
      { error: "room, arrival, and departure are required" },
      { status: 400 }
    );
  }

  const roomName = ROOM_NAMES[code];
  if (!roomName) {
    return NextResponse.json(
      { error: `Unknown room code: ${code}. Valid: ${Object.keys(ROOM_NAMES).join(", ")}` },
      { status: 400 }
    );
  }

  const kubeUrl = new URL("https://s005948.officialbookings.com/");
  kubeUrl.searchParams.set("channelId", "ibe");
  kubeUrl.searchParams.set("checkin", arrival);
  kubeUrl.searchParams.set("checkout", departure);
  kubeUrl.searchParams.set("totalRooms", "1");
  kubeUrl.searchParams.set("language", "en");
  kubeUrl.searchParams.set("currencyCode", "USD");
  kubeUrl.searchParams.set("propertyCode", "S005948");
  kubeUrl.searchParams.set("widgetId", "BOOKINGWIDGET");
  kubeUrl.searchParams.set("widgetSection", "searchbar");
  kubeUrl.searchParams.set("activeBookingEngine", "KBE");
  kubeUrl.searchParams.set("adult_room1", adults);
  kubeUrl.searchParams.set("priceType", "withInformativeTaxesAndFees");
  kubeUrl.searchParams.set("priceTimeBase", "stay");
  kubeUrl.searchParams.set("coupon", "");

  const bookingUrl = kubeUrl.toString();
  const roomPageUrl = `https://andreas-hotel-spa.vercel.app/rooms/${ROOM_SLUGS[code]}`;

  return NextResponse.json({
    room: roomName, code, arrival, departure, adults,
    booking_url: bookingUrl,
    room_details_url: roomPageUrl,
    message: `Click the booking link to reserve your ${roomName} for ${arrival} to ${departure}, ${adults} adult(s).`,
  });
}
