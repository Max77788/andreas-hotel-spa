import { NextRequest, NextResponse } from "next/server";

const ROOMS: Record<string, {
  code: string; name: string; slug: string;
  bed: string; guests: string; sqft: string;
  price: string; price_numeric: number;
  description: string; amenities: string[];
  badge: string; img: string;
}> = {
  DLX: {
    code: "DLX", name: "Deluxe Room", slug: "deluxe-room",
    bed: "Queen Bed", guests: "2 Guests", sqft: "340 sq ft",
    price: "$219", price_numeric: 219,
    description: "Italian furnishings, fireplace, marble bathroom. Refrigerator, microwave, Keurig, sound machine. The classic Andreas experience.",
    amenities: ["Fireplace", "Refrigerator", "Microwave", "Keurig", "Sound Machine", "Marble Bath", "Queen Bed"],
    badge: "DELUXE", img: "/hotel-photos/room6.jpg",
  },
  EXEC: {
    code: "EXEC", name: "Executive Room", slug: "executive-room",
    bed: "King Bed", guests: "2 Guests", sqft: "380 sq ft",
    price: "$289", price_numeric: 289,
    description: "Italian furnishings, fireplace, dedicated workspace, refrigerator, microwave, Keurig — ideal for business travelers.",
    amenities: ["Fireplace", "Refrigerator", "Microwave", "Keurig", "Sound Machine", "Work Desk", "King Bed"],
    badge: "EXECUTIVE", img: "/hotel-photos/room1.jpg",
  },
  STE: {
    code: "STE", name: "1 Bedroom Suite", slug: "1-bedroom-suite",
    bed: "King Bed", guests: "2 Guests", sqft: "520 sq ft",
    price: "$389", price_numeric: 389,
    description: "Spacious suite with pillow-topped king bed, fireplace, separate living area, luxurious Italian furnishings. Select suites feature a private balcony.",
    amenities: ["Fireplace", "Refrigerator", "Microwave", "Keurig", "Sound Machine", "Separate Living Room", "King Bed"],
    badge: "SUITE", img: "/hotel-photos/amenities.jpg",
  },
  "2BED": {
    code: "2BED", name: "2 Bed 1 Bath Suite", slug: "2-bed-1-bath-suite",
    bed: "2 Queen Beds", guests: "4 Guests", sqft: "580 sq ft",
    price: "$379", price_numeric: 379,
    description: "Italian furnishings, fireplace, two private bedrooms, cozy living space. Select suites have a balcony facing N. Indian Canyon.",
    amenities: ["Fireplace", "Refrigerator", "Microwave", "Keurig", "Sound Machine", "Two Bedrooms", "Garden View"],
    badge: "SUITE", img: "/hotel-photos/room7.jpg",
  },
  "2B2B": {
    code: "2B2B", name: "Andreas Villa Suite", slug: "andreas-villa-suite",
    bed: "King Bed", guests: "4 Guests", sqft: "750 sq ft",
    price: "$599", price_numeric: 599,
    description: "Our most prestigious suite: Italian Villa design, fireplace, private courtyard, king bedroom, separate living area, and a private balcony with mountain views.",
    amenities: ["Fireplace", "Refrigerator", "Microwave", "Keurig", "Sound Machine", "Private Courtyard", "Marble Bath"],
    badge: "VILLA", img: "/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg",
  },
  ADA: {
    code: "ADA", name: "Mobility Accessible Deluxe Room", slug: "mobility-accessible-deluxe-room",
    bed: "Queen Bed", guests: "2 Guests", sqft: "360 sq ft",
    price: "$219", price_numeric: 219,
    description: "Italian furnishings, fireplace, full accessibility. All the elegance of our deluxe rooms with enhanced accessibility features throughout.",
    amenities: ["Fireplace", "Refrigerator", "Microwave", "Keurig", "Sound Machine", "Roll-in Shower", "Wide Doorways"],
    badge: "ACCESSIBLE", img: "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs-room11.jpg",
  },
  ADA2: {
    code: "ADA2", name: "Mobility Accessible 2 Bed Suite", slug: "mobility-accessible-suite",
    bed: "2 Queen Beds", guests: "4 Guests", sqft: "680 sq ft",
    price: "$449", price_numeric: 449,
    description: "Italian furnishings, fireplace, two bedrooms, two baths. Full accessibility with wide doorways, roll-in shower, and every comfort.",
    amenities: ["Fireplace", "Refrigerator", "Microwave", "Keurig", "Sound Machine", "Roll-in Shower", "Wide Doorways"],
    badge: "ACCESSIBLE", img: "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg",
  },
};

function parseDate(s: string): Date | null {
  if (!s) return null;
  // Try YYYY-MM-DD
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T12:00:00`);
  // Try other formats
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function getParams(req: NextRequest): Promise<{ arrival: string; departure: string; adults: number } | { error: string; status: number }> {
  let arrival = "";
  let departure = "";
  let adults = 2;

  // Try query params first (GET)
  const sp = req.nextUrl.searchParams;
  arrival = sp.get("arrival") || "";
  departure = sp.get("departure") || "";
  const a = sp.get("adults");
  if (a) adults = parseInt(a, 10) || 2;

  // If no query params, try JSON body (POST)
  if (!arrival && !departure) {
    try {
      const body = await req.json();
      arrival = body.arrival || body.checkin || body.check_in || body.startDate || "";
      departure = body.departure || body.checkout || body.check_out || body.endDate || "";
      if (body.adults) adults = parseInt(String(body.adults), 10) || 2;
    } catch { /* ignore */ }
  }

  const ad = parseDate(arrival);
  const dd = parseDate(departure);
  if (!ad || !dd) {
    return { error: "Valid arrival and departure dates required (YYYY-MM-DD)", status: 400 };
  }
  if (dd <= ad) {
    return { error: "Departure must be after arrival", status: 400 };
  }

  return { arrival: fmt(ad), departure: fmt(dd), adults };
}

export async function GET(req: NextRequest) {
  const params = await getParams(req);
  if ("error" in params) {
    return NextResponse.json({ error: params.error }, { status: params.status });
  }
  return respond(params);
}

export async function POST(req: NextRequest) {
  const params = await getParams(req);
  if ("error" in params) {
    return NextResponse.json({ error: params.error }, { status: params.status });
  }
  return respond(params);
}

function respond({ arrival, departure, adults }: { arrival: string; departure: string; adults: number }) {
  const nights = Math.max(1, Math.round(
    (new Date(departure).getTime() - new Date(arrival).getTime()) / (1000 * 60 * 60 * 24)
  ));

  const rooms = Object.values(ROOMS)
    .filter((r) => adults <= parseInt(r.guests, 10))
    .map((r) => ({
      code: r.code,
      name: r.name,
      badge: r.badge,
      bed: r.bed,
      guests: r.guests,
      sqft: r.sqft,
      price_per_night: r.price,
      total_for_stay: `$${r.price_numeric * nights}`,
      nights,
      description: r.description,
      key_amenities: r.amenities.slice(0, 5),
      accessible: r.code.startsWith("ADA"),
    }))
    .sort((a, b) => (a.accessible === b.accessible ? 0 : a.accessible ? 1 : -1));

  return NextResponse.json({
    hotel: "Andreas Hotel & Spa",
    location: "Palm Springs, California",
    arrival,
    departure,
    nights,
    adults,
    available_rooms: rooms.length,
    rooms,
  });
}
