import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { getRoomBySlug } from "@/lib/cms/queries";
import type { Room } from "@/lib/cms/types";

const fallbackRooms: Record<string, Room> = {
  "andreas-villa-suite": {
    id: "1", slug: "andreas-villa-suite", name: "Andreas Villa Suite", badge: "VILLA",
    image_url: "/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg",
    short_description: "Our most prestigious suite: Italian Villa design, fireplace, private courtyard, king bedroom, separate living area, and a private balcony with mountain views.",
    bed: "King Bed", guests: "4 Guests", sqft: "750 sq ft", price: "$599",
    amenities: ["Private Courtyard Entrance","Gas Fireplace","Separate Living Room","Marble Bathroom with Soaking Tub","Panoramic Desert Views","Luxury Linens & Robes","Microwave","Refrigerator","Keurig Coffee Maker","Sound Machine","Double-Paned Windows"],
    long_description: "The Andreas Villa Suite is the crown jewel of our Palm Springs hotel. Inspired by the grand villas of the Italian countryside, this suite offers an unparalleled experience of space, elegance, and privacy. Enter through your private courtyard to discover a sanctuary of hand-selected furnishings, and a king bed dressed in the finest Italian linens. The separate living area with a gas fireplace invites you to unwind after a day exploring downtown Palm Springs, while the marble bathroom with a deep soaking tub completes the experience of refined relaxation.",
    extras: [{ icon: "🛏", label: "King Bed" },{ icon: "🛋", label: "Separate Living Room" },{ icon: "🔥", label: "Gas Fireplace" },{ icon: "🛁", label: "Soaking Tub" },{ icon: "🏡", label: "Private Courtyard" },{ icon: "📺", label: "55\" Flat Screen TV" },{ icon: "🧊", label: "Refrigerator" },{ icon: "☕", label: "Keurig Coffee Maker" },{ icon: "🍿", label: "Microwave" },{ icon: "🎵", label: "Sound Machine" },{ icon: "🪟", label: "Double-Paned Windows" }],
    gallery_urls: ["/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg","/hotel-photos/exterior.jpg","/hotel-photos/courtyard.jpg"],
    sort_order: 0, is_published: true,
  },
  "executive-room": {
    id: "6", slug: "executive-room", name: "Executive Room", badge: "EXECUTIVE",
    image_url: "/hotel-photos/room1.jpg",
    short_description: "Italian furnishings, fireplace, dedicated workspace, refrigerator, microwave, Keurig — ideal for business travelers who expect more.",
    bed: "King Bed", guests: "2 Guests", sqft: "380 sq ft", price: "$289",
    amenities: ["Dedicated Work Desk","King Bed","Upgraded Linens","Courtyard View","Marble Bathroom","High-Speed WiFi","Gas Fireplace","Microwave","Refrigerator","Keurig Coffee Maker","Sound Machine","Double-Paned Windows"],
    long_description: "Designed for the traveler who blends business with pleasure, the Executive Room offers more than just a place to sleep. A dedicated workspace with high-speed WiFi keeps you connected, while the king bed with upgraded linens ensures you recharge in style.",
    extras: [{ icon: "🛏", label: "King Bed" },{ icon: "🖊", label: "Work Desk" },{ icon: "📶", label: "High-Speed WiFi" },{ icon: "🌿", label: "Courtyard View" },{ icon: "📺", label: "Flat Screen TV" },{ icon: "🧊", label: "Refrigerator" },{ icon: "☕", label: "Keurig Coffee Maker" },{ icon: "🛁", label: "Marble Bath" },{ icon: "🔥", label: "Gas Fireplace" },{ icon: "🍿", label: "Microwave" },{ icon: "🎵", label: "Sound Machine" },{ icon: "🪟", label: "Double-Paned Windows" }],
    gallery_urls: ["/hotel-photos/room1.jpg","/hotel-photos/room5.jpg","/hotel-photos/courtyard.jpg"],
    sort_order: 5, is_published: true,
  },
  "deluxe-room": {
    id: "7", slug: "deluxe-room", name: "Deluxe Room", badge: "DELUXE",
    image_url: "/hotel-photos/room6.jpg",
    short_description: "Italian furnishings, fireplace, marble bathroom. Refrigerator, microwave, Keurig, sound machine. The classic Andreas experience.",
    bed: "Queen Bed", guests: "2 Guests", sqft: "340 sq ft", price: "$219",
    amenities: ["Marble Bathroom","Queen Bed","Pool View","Luxury Linens","Italian-Inspired Furnishings","Plush Robes","Gas Fireplace","Microwave","Refrigerator","Keurig Coffee Maker","Sound Machine","Double-Paned Windows"],
    long_description: "The Deluxe Room is where most guests fall in love with the Andreas. A beautifully appointed queen bed dressed in crisp Italian linens, a marble bathroom with premium amenities, and Italian-inspired furnishings that reflect the timeless elegance of our hotel.",
    extras: [{ icon: "🛏", label: "Queen Bed" },{ icon: "🏊", label: "Pool View" },{ icon: "🛁", label: "Marble Bath" },{ icon: "👘", label: "Plush Robes" },{ icon: "📺", label: "Flat Screen TV" },{ icon: "🧊", label: "Refrigerator" },{ icon: "☕", label: "Keurig Coffee Maker" },{ icon: "🛋", label: "Italian Furnishings" },{ icon: "🔥", label: "Gas Fireplace" },{ icon: "🍿", label: "Microwave" },{ icon: "🎵", label: "Sound Machine" },{ icon: "🪟", label: "Double-Paned Windows" }],
    gallery_urls: ["/hotel-photos/room6.jpg","/hotel-photos/room7.jpg","/hotel-photos/pool-night.jpg"],
    sort_order: 6, is_published: true,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let room: Room | null = null;
  try { room = await getRoomBySlug(slug); } catch {}
  if (!room) room = fallbackRooms[slug] ?? null;
  return {
    title: room ? `${room.name} – The Andreas Hotel & Spa` : "Room Not Found – The Andreas Hotel & Spa",
    description: room?.short_description ?? "",
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let room: Room | null = null;
  try { room = await getRoomBySlug(slug); } catch {}
  if (!room) room = fallbackRooms[slug] ?? null;
  if (!room) notFound();

  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      {/* Hero image */}
      <section className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${room.image_url})` }}
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
                {room.short_description}
              </p>
              <p className="font-body text-[var(--hotel-charcoal)]/70 text-sm leading-relaxed mb-10">
                {room.long_description}
              </p>

              {/* Amenities */}
              {room.amenities?.length > 0 && (
                <>
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
                </>
              )}

              {/* Gallery */}
              {room.gallery_urls?.length > 0 && (
                <>
                  <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl font-light mb-5">
                    Gallery
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {room.gallery_urls.map((img, i) => (
                      <div
                        key={i}
                        className="aspect-[4/3] bg-cover bg-center rounded-sm"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ))}
                  </div>
                </>
              )}
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

                {room.extras?.length > 0 && (
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
                )}

                <div className="border-t border-[var(--hotel-sand)] mt-5 pt-5">
                  <p className="font-body text-[10px] text-[var(--hotel-charcoal)]/50 text-center">
                    Questions? Call{" "}
                    <a href="tel:+176****5701" className="text-[var(--hotel-terracotta)] hover:underline">
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
