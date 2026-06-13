import { NextResponse } from "next/server";

// Room data mirroring the CMS - code to room mapping
const ROOMS: Record<string, {
  code: string;
  name: string;
  slug: string;
  bed: string;
  guests: string;
  sqft: string;
  price: string;
  price_numeric: number;
  description: string;
  amenities: string[];
  badge: string;
  img: string;
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
    description: "Italian furnishings, fireplace, dedicated workspace, refrigerator, microwave, Keurig — ideal for business travelers who expect more.",
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
    description: "Italian furnishings, fireplace, two private bedrooms, cozy living space. Select suites have a balcony facing N. Indian Canyon for prime people-watching.",
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const arrival = searchParams.get("arrival") || "";
  const departure = searchParams.get("departure") || "";
  const adults = parseInt(searchParams.get("adults") || "2", 10);

  if (!arrival || !departure) {
    return NextResponse.json(
      { error: "arrival and departure dates are required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  const nights = Math.max(1, Math.round(
    (new Date(departure).getTime() - new Date(arrival).getTime()) / (1000 * 60 * 60 * 24)
  ));

  const rooms = Object.values(ROOMS)
    .filter((r) => {
      // Filter by guest capacity
      const maxGuests = parseInt(r.guests, 10);
      return adults <= maxGuests;
    })
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
    .sort((a, b) => {
      // Accessible rooms last
      if (a.accessible !== b.accessible) return a.accessible ? 1 : -1;
      return 0;
    });

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
