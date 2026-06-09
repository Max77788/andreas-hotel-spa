import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

interface RoomData {
  name: string;
  badge: string;
  img: string;
  description: string;
  bed: string;
  guests: string;
  sqft: string;
  price: string;
  amenities: string[];
  longDescription: string;
  extras: { icon: string; label: string }[];
  gallery: string[];
}

const rooms: Record<string, RoomData> = {
  "andreas-villa-suite": {
    name: "Andreas Villa Suite",
    badge: "VILLA",
    img: "/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg",
    description:
      "Our most prestigious suite featuring Italian Villa design with panoramic desert views, a private courtyard entrance facing the pool, king bedroom, and a separate living area with fireplace.",
    bed: "King Bed",
    guests: "4 Guests",
    sqft: "750 sq ft",
    price: "$599",
    amenities: [
      "Private Courtyard Entrance",
      "Gas Fireplace",
      "Separate Living Room",
      "Marble Bathroom with Soaking Tub",
      "Panoramic Desert Views",
      "Luxury Linens & Robes",
    ],
    longDescription:
      "The Andreas Villa Suite is the crown jewel of our Palm Springs hotel. Inspired by the grand villas of the Italian countryside, this suite offers an unparalleled experience of space, elegance, and privacy. Enter through your own private courtyard to discover a sanctuary of warm terracotta tones, hand-selected furnishings, and a king bed dressed in the finest Italian linens. The separate living area with a gas fireplace invites you to unwind after a day exploring downtown Palm Springs, while the marble bathroom with a deep soaking tub completes the experience of refined relaxation.",
    extras: [
      { icon: "🛏", label: "King Bed" },
      { icon: "🛋", label: "Separate Living Room" },
      { icon: "🔥", label: "Gas Fireplace" },
      { icon: "🛁", label: "Soaking Tub" },
      { icon: "🏡", label: "Private Courtyard" },
      { icon: "📺", label: "55\" Flat Screen TV" },
      { icon: "❄️", label: "Mini Fridge" },
      { icon: "☕", label: "Keurig Coffee Maker" },
    ],
    gallery: [
      "/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg",
      "/hotel-photos/exterior.jpg",
      "/hotel-photos/courtyard.jpg",
    ],
  },
  "mobility-accessible-suite": {
    name: "Mobility Accessible 2 Bed Suite",
    badge: "ACCESSIBLE",
    img: "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg",
    description:
      "A spacious two-bedroom, two-bathroom suite designed for full accessibility with wide doorways, roll-in shower, and comfortable furnishings throughout.",
    bed: "2 Queen Beds",
    guests: "4 Guests",
    sqft: "680 sq ft",
    price: "$449",
    amenities: [
      "Roll-in Shower",
      "Wide Doorways (36\")",
      "Grab Bars Throughout",
      "Ground Floor Access",
      "Two Full Bathrooms",
      "Luxury Linens",
    ],
    longDescription:
      "Designed with accessibility at its heart, this two-bedroom suite ensures every guest experiences the comfort and elegance of the Andreas without compromise. Wide doorways, roll-in showers, and strategically placed grab bars provide ease of movement, while the thoughtful layout offers privacy between the two bedrooms. Each room is furnished with queen beds and premium linens, and the two full bathrooms mean no waiting. Located on the ground floor for effortless access to the courtyard, pool, and spa.",
    extras: [
      { icon: "♿", label: "Full Accessibility" },
      { icon: "🛏", label: "2 Queen Beds" },
      { icon: "🚿", label: "Roll-in Shower" },
      { icon: "🚪", label: "36\" Doorways" },
      { icon: "🏠", label: "Ground Floor" },
      { icon: "📺", label: "Flat Screen TV" },
      { icon: "❄️", label: "Mini Fridge" },
      { icon: "☕", label: "Keurig Coffee Maker" },
    ],
    gallery: [
      "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg",
      "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs-room11.jpg",
      "/hotel-photos/courtyard.jpg",
    ],
  },
  "mobility-accessible-deluxe-room": {
    name: "Mobility Accessible Deluxe Room",
    badge: "ACCESSIBLE",
    img: "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs-room11.jpg",
    description:
      "A thoughtfully designed accessible deluxe room with all the comfort and elegance of our standard deluxe rooms, plus enhanced accessibility features.",
    bed: "Queen Bed",
    guests: "2 Guests",
    sqft: "360 sq ft",
    price: "$219",
    amenities: [
      "Roll-in Shower",
      "Wide Doorways (36\")",
      "Grab Bars",
      "Ground Floor Access",
      "Marble Bathroom",
      "Luxury Linens",
    ],
    longDescription:
      "The Mobility Accessible Deluxe Room brings together accessibility and the classic Andreas aesthetic. A spacious layout with a queen bed, roll-in shower, and wide doorways ensures a comfortable stay without sacrificing style. Marble bathroom finishes and Italian-inspired furnishings create the same inviting atmosphere found in every Andreas room, with the added peace of mind of ground-floor access and barrier-free design throughout.",
    extras: [
      { icon: "♿", label: "Full Accessibility" },
      { icon: "🛏", label: "Queen Bed" },
      { icon: "🚿", label: "Roll-in Shower" },
      { icon: "🚪", label: "36\" Doorways" },
      { icon: "🏠", label: "Ground Floor" },
      { icon: "📺", label: "Flat Screen TV" },
      { icon: "❄️", label: "Mini Fridge" },
      { icon: "☕", label: "Keurig Coffee Maker" },
    ],
    gallery: [
      "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs-room11.jpg",
      "/hotel-photos/room6.jpg",
      "/hotel-photos/courtyard.jpg",
    ],
  },
  "2-bed-1-bath-suite": {
    name: "2 Bed 1 Bath Suite",
    badge: "SUITE",
    img: "/hotel-photos/room7.jpg",
    description:
      "Perfect for families or small groups, this two-bedroom suite offers privacy and comfort with a shared full bath and cozy living space.",
    bed: "2 Queen Beds",
    guests: "4 Guests",
    sqft: "580 sq ft",
    price: "$379",
    amenities: [
      "Two Separate Bedrooms",
      "Shared Full Bath",
      "Cozy Sitting Area",
      "Mini Fridge",
      "Garden View",
      "Luxury Linens",
    ],
    longDescription:
      "Ideal for families or friends traveling together, the 2 Bed 1 Bath Suite balances togetherness with privacy. Two separate bedrooms, each with a queen bed, share a well-appointed full bathroom. A cozy sitting area between the rooms provides a gathering spot for morning coffee or evening conversation. Decorated in warm desert tones with Italian-inspired touches, this suite feels like a home away from home — just steps from the pool, courtyard, and downtown Palm Springs.",
    extras: [
      { icon: "🛏", label: "2 Queen Beds" },
      { icon: "🚪", label: "Two Bedrooms" },
      { icon: "🛋", label: "Sitting Area" },
      { icon: "🌿", label: "Garden View" },
      { icon: "📺", label: "Flat Screen TV" },
      { icon: "❄️", label: "Mini Fridge" },
      { icon: "☕", label: "Keurig Coffee Maker" },
      { icon: "👨‍👩‍👧", label: "Family Friendly" },
    ],
    gallery: [
      "/hotel-photos/room7.jpg",
      "/hotel-photos/room1.jpg",
      "/hotel-photos/courtyard.jpg",
    ],
  },
  "1-bedroom-suite": {
    name: "1 Bedroom Suite",
    badge: "SUITE",
    img: "/hotel-photos/amenities.jpg",
    description:
      "Spacious suite with pillow-topped king bed, separate living area, luxurious Italian-inspired furnishings, and select suites feature a private cabana patio.",
    bed: "King Bed",
    guests: "2 Guests",
    sqft: "520 sq ft",
    price: "$389",
    amenities: [
      "Separate Living Room",
      "King Bed",
      "Courtyard View",
      "Marble Bathroom",
      "Luxury Linens & Robes",
      "Work Desk",
    ],
    longDescription:
      "The 1 Bedroom Suite offers the perfect blend of space and intimacy. A separate living area with a plush sofa and work desk gives you room to spread out, while the bedroom — anchored by a pillow-topped king bed — promises deep, restful sleep. Italian-inspired furnishings, warm terracotta accents, and a marble bathroom make every moment feel elevated. Overlooking our manicured courtyard, this suite is a quiet retreat just minutes from the energy of downtown Palm Springs.",
    extras: [
      { icon: "🛏", label: "King Bed" },
      { icon: "🛋", label: "Separate Living Room" },
      { icon: "🏖", label: "Private Cabana Patio" },
      { icon: "🌿", label: "Courtyard View" },
      { icon: "🖊", label: "Work Desk" },
      { icon: "📺", label: "Flat Screen TV" },
      { icon: "❄️", label: "Mini Fridge" },
      { icon: "☕", label: "Keurig Coffee Maker" },
      { icon: "🛁", label: "Marble Bath" },
    ],
    gallery: [
      "/hotel-photos/amenities.jpg",
      "/hotel-photos/room1.jpg",
      "/hotel-photos/courtyard.jpg",
    ],
  },
  "executive-room": {
    name: "Executive Room",
    badge: "EXECUTIVE",
    img: "/hotel-photos/room1.jpg",
    description:
      "An elevated stay with upgraded furnishings, dedicated workspace, and refined details — ideal for business travelers who expect more.",
    bed: "King Bed",
    guests: "2 Guests",
    sqft: "380 sq ft",
    price: "$289",
    amenities: [
      "Dedicated Work Desk",
      "King Bed",
      "Upgraded Linens",
      "Courtyard View",
      "Marble Bathroom",
      "High-Speed WiFi",
    ],
    longDescription:
      "Designed for the traveler who blends business with pleasure, the Executive Room offers more than just a place to sleep. A dedicated workspace with high-speed WiFi keeps you connected, while the king bed with upgraded linens ensures you recharge in style. Marble bathroom finishes and a courtyard view add a layer of refinement that turns a work trip into a pleasure. After hours, the pool, spa, and downtown Palm Springs are just steps away.",
    extras: [
      { icon: "🛏", label: "King Bed" },
      { icon: "🖊", label: "Work Desk" },
      { icon: "📶", label: "High-Speed WiFi" },
      { icon: "🌿", label: "Courtyard View" },
      { icon: "📺", label: "Flat Screen TV" },
      { icon: "❄️", label: "Mini Fridge" },
      { icon: "☕", label: "Keurig Coffee Maker" },
      { icon: "🛁", label: "Marble Bath" },
    ],
    gallery: [
      "/hotel-photos/room1.jpg",
      "/hotel-photos/room5.jpg",
      "/hotel-photos/courtyard.jpg",
    ],
  },
  "deluxe-room": {
    name: "Deluxe Room",
    badge: "DELUXE",
    img: "/hotel-photos/room6.jpg",
    description:
      "Beautifully appointed with marble bathrooms, luxury linens, and Italian-inspired furnishings. The classic Andreas experience.",
    bed: "Queen Bed",
    guests: "2 Guests",
    sqft: "340 sq ft",
    price: "$219",
    amenities: [
      "Marble Bathroom",
      "Queen Bed",
      "Pool View",
      "Luxury Linens",
      "Italian-Inspired Furnishings",
      "Plush Robes",
    ],
    longDescription:
      "The Deluxe Room is where most guests fall in love with the Andreas. A beautifully appointed queen bed dressed in crisp Italian linens, a marble bathroom with premium amenities, and Italian-inspired furnishings that reflect the timeless elegance of our hotel. Overlooking the pool and courtyard, these rooms capture the essence of relaxed luxury. It's the perfect home base for exploring downtown, hiking the nearby trails, or simply doing nothing at all by the pool.",
    extras: [
      { icon: "🛏", label: "Queen Bed" },
      { icon: "🏊", label: "Pool View" },
      { icon: "🛁", label: "Marble Bath" },
      { icon: "👘", label: "Plush Robes" },
      { icon: "📺", label: "Flat Screen TV" },
      { icon: "❄️", label: "Mini Fridge" },
      { icon: "☕", label: "Keurig Coffee Maker" },
      { icon: "🛋", label: "Italian Furnishings" },
    ],
    gallery: [
      "/hotel-photos/room6.jpg",
      "/hotel-photos/room7.jpg",
      "/hotel-photos/pool-night.jpg",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = rooms[slug];
  if (!room) return { title: "Room Not Found – The Andreas Hotel & Spa" };
  return {
    title: `${room.name} – The Andreas Hotel & Spa`,
    description: room.description,
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = rooms[slug];

  if (!room) notFound();

  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      {/* Hero image */}
      <section className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${room.img})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Badge + back link */}
        <div className="absolute top-24 left-6 md:left-10 z-10 flex items-center gap-4">
          <Link
            href="/rooms"
            className="font-body text-[9px] tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Rooms
          </Link>
          <span className="font-body text-[8px] tracking-[0.35em] uppercase bg-[var(--hotel-charcoal)] text-[var(--hotel-gold)] px-3 py-1">
            {room.badge}
          </span>
        </div>

        {/* Room title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-white text-4xl md:text-6xl font-light mb-3">
              {room.name}
            </h1>
            <div className="flex gap-6">
              {[room.bed, room.guests, room.sqft].map((meta) => (
                <span key={meta} className="font-body text-[10px] tracking-[0.2em] uppercase text-white/70">
                  {meta}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-[var(--hotel-cream)]">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 md:gap-16">
            {/* Main column */}
            <div>
              <p className="font-display text-[var(--hotel-charcoal)] text-xl md:text-2xl font-light leading-relaxed mb-8">
                {room.description}
              </p>
              <p className="font-body text-[var(--hotel-charcoal)]/70 text-sm leading-relaxed mb-10">
                {room.longDescription}
              </p>

              {/* Amenities */}
              <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl font-light mb-5">
                Room Amenities
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-10">
                {room.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 text-[var(--hotel-charcoal)]/80">
                    <span className="w-1 h-1 bg-[var(--hotel-terracotta)] rounded-full flex-shrink-0" />
                    <span className="font-body text-xs">{a}</span>
                  </div>
                ))}
              </div>

              {/* Gallery */}
              <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl font-light mb-5">
                Gallery
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {room.gallery.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] bg-cover bg-center rounded-sm"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Booking card */}
              <div className="card-lift bg-white dark:bg-[#2a2620] p-6 sticky top-28">
                <div className="text-center mb-6">
                  <span className="font-display text-[var(--hotel-charcoal)] text-4xl font-light">
                    {room.price}
                  </span>
                  <span className="font-body text-[10px] text-[var(--hotel-charcoal)]/50 ml-1">
                    / night
                  </span>
                </div>

                <a
                  href="/book"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center font-body text-[10px] tracking-[0.3em] uppercase bg-[var(--hotel-terracotta)] text-white px-6 py-3 hover:bg-[var(--hotel-charcoal)] transition-all duration-300 mb-5"
                >
                  Book This Room
                </a>

                <div className="border-t border-[var(--hotel-sand)] pt-5">
                  <h4 className="font-display text-[var(--hotel-charcoal)] text-base font-light mb-4">
                    Room Features
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {room.extras.map((ex) => (
                      <div key={ex.label} className="flex items-center gap-2 text-xs">
                        <span>{ex.icon}</span>
                        <span className="font-body text-[var(--hotel-charcoal)]/70">
                          {ex.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[var(--hotel-sand)] mt-5 pt-5">
                  <p className="font-body text-[10px] text-[var(--hotel-charcoal)]/50 text-center">
                    Questions? Call{" "}
                    <a href="tel:+17603275701" className="text-[var(--hotel-terracotta)] hover:underline">
                      (760) 327-5701
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-[var(--hotel-charcoal)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-4">
            Explore More
          </p>
          <h2 className="font-display text-[var(--hotel-cream)] text-3xl md:text-4xl font-light mb-8">
            See all our rooms &amp; suites
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rooms"
              className="font-body text-[10px] tracking-[0.35em] uppercase border border-[var(--hotel-gold)] text-[var(--hotel-gold)] px-8 py-3 hover:bg-[var(--hotel-gold)] hover:text-[var(--hotel-charcoal)] transition-all duration-300"
            >
              View All Rooms
            </Link>
            <a
              href="/book"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-[10px] tracking-[0.35em] uppercase bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] px-8 py-3 hover:bg-white transition-all duration-300"
            >
              Book Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
