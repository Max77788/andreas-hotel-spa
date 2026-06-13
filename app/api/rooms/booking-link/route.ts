import { NextResponse } from "next/server";

const ROOM_NAMES: Record<string, string> = {
  DLX: "Deluxe Room",
  EXEC: "Executive Room",
  STE: "1 Bedroom Suite",
  "2BED": "2 Bed 1 Bath Suite",
  "2B2B": "Andreas Villa Suite",
  ADA: "Mobility Accessible Deluxe Room",
  ADA2: "Mobility Accessible 2 Bed Suite",
};

const ROOM_SLUGS: Record<string, string> = {
  DLX: "deluxe-room",
  EXEC: "executive-room",
  STE: "1-bedroom-suite",
  "2BED": "2-bed-1-bath-suite",
  "2B2B": "andreas-villa-suite",
  ADA: "mobility-accessible-deluxe-room",
  ADA2: "mobility-accessible-suite",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("room") || "";
  const arrival = searchParams.get("arrival") || "";
  const departure = searchParams.get("departure") || "";
  const adults = searchParams.get("adults") || "2";

  if (!code || !arrival || !departure) {
    return NextResponse.json(
      { error: "room, arrival, and departure are required" },
      { status: 400 }
    );
  }

  const roomName = ROOM_NAMES[code];
  if (!roomName) {
    return NextResponse.json(
      { error: `Unknown room code: ${code}. Valid codes: ${Object.keys(ROOM_NAMES).join(", ")}` },
      { status: 400 }
    );
  }

  const siteUrl = "https://andreas-hotel-spa.vercel.app";

  const bookingUrl = `${siteUrl}/book?room=${code}&arrival=${arrival}&departure=${departure}&adults=${adults}`;

  const roomSlug = ROOM_SLUGS[code];
  const roomPageUrl = `${siteUrl}/rooms/${roomSlug}`;

  return NextResponse.json({
    room: roomName,
    code,
    arrival,
    departure,
    adults,
    booking_url: bookingUrl,
    room_details_url: roomPageUrl,
    message: `Click the booking link to reserve your ${roomName} for ${arrival} to ${departure}, ${adults} adult(s).`,
  });
}
