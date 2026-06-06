import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const allRooms = [
  {
    slug: "andreas-villa-suite",
    name: "Andreas Villa Suite",
    badge: "VILLA",
    img: "/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg",
    description:
      "Our most prestigious suite featuring Italian Villa design with panoramic desert views, private courtyard entrance, king bedroom, and a separate living area with fireplace.",
    bed: "King Bed",
    guests: "4 Guests",
    sqft: "750 sq ft",
    price: "$599",
    amenities: ["Private Courtyard", "Fireplace", "Sitting Area", "Marble Bath"],
  },
  {
    slug: "mobility-accessible-suite",
    name: "Mobility Accessible 2 Bed Suite",
    badge: "ACCESSIBLE",
    img: "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg",
    description:
      "A spacious two-bedroom, two-bathroom suite designed for full accessibility with wide doorways, roll-in shower, and comfortable furnishings throughout.",
    bed: "2 Queen Beds",
    guests: "4 Guests",
    sqft: "680 sq ft",
    price: "$449",
    amenities: ["Roll-in Shower", "Wide Doorways", "Grab Bars", "Ground Floor"],
  },
  {
    slug: "mobility-accessible-deluxe-room",
    name: "Mobility Accessible Deluxe Room",
    badge: "ACCESSIBLE",
    img: "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs-room11.jpg",
    description:
      "A thoughtfully designed accessible deluxe room with all the comfort and elegance of our standard deluxe rooms, plus enhanced accessibility features.",
    bed: "Queen Bed",
    guests: "2 Guests",
    sqft: "360 sq ft",
    price: "$219",
    amenities: ["Roll-in Shower", "Wide Doorways", "Grab Bars", "Ground Floor"],
  },
  {
    slug: "2-bed-1-bath-suite",
    name: "2 Bed 1 Bath Suite",
    badge: "SUITE",
    img: "/hotel-photos/room7.jpg",
    description:
      "Perfect for families or small groups, this two-bedroom suite offers privacy and comfort with a shared full bath and cozy living space.",
    bed: "2 Queen Beds",
    guests: "4 Guests",
    sqft: "580 sq ft",
    price: "$379",
    amenities: ["Two Bedrooms", "Sitting Area", "Mini Fridge", "Garden View"],
  },
  {
    slug: "1-bedroom-suite",
    name: "1 Bedroom Suite",
    badge: "SUITE",
    img: "/hotel-photos/amenities.jpg",
    description:
      "Spacious suite with pillow-topped king bed, separate living area, and luxurious Italian-inspired furnishings throughout.",
    bed: "King Bed",
    guests: "2 Guests",
    sqft: "520 sq ft",
    price: "$389",
    amenities: ["Separate Living Room", "King Bed", "Courtyard View", "Luxury Linens"],
  },
  {
    slug: "executive-room",
    name: "Executive Room",
    badge: "EXECUTIVE",
    img: "/hotel-photos/room1.jpg",
    description:
      "An elevated stay with upgraded furnishings, dedicated workspace, and refined details — ideal for business travelers who expect more.",
    bed: "King Bed",
    guests: "2 Guests",
    sqft: "380 sq ft",
    price: "$289",
    amenities: ["Work Desk", "King Bed", "Upgraded Linens", "Courtyard View"],
  },
  {
    slug: "deluxe-room",
    name: "Deluxe Room",
    badge: "DELUXE",
    img: "/hotel-photos/room6.jpg",
    description:
      "Beautifully appointed with marble bathrooms, luxury linens, and warm desert-inspired décor. The classic Andreas experience.",
    bed: "Queen Bed",
    guests: "2 Guests",
    sqft: "340 sq ft",
    price: "$219",
    amenities: ["Marble Bath", "Queen Bed", "Pool View", "Luxury Linens"],
  },
];

export const metadata = {
  title: "Rooms & Suites – The Andreas Hotel & Spa",
  description:
    "Explore our 25 guest rooms and suites in the heart of Palm Springs. From the Villa Suite to Deluxe Rooms, find your perfect desert retreat.",
};

export default function RoomsPage() {
  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      {/* Hero strip */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          backgroundImage: "url(/hotel-photos/exterior.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 text-center">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-4">
            Accommodations
          </p>
          <h1
            className="font-display text-white font-light leading-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            Rooms &amp; Suites
          </h1>
          <div className="divider-gold mx-auto" />
          <p className="font-body text-white/70 text-sm max-w-xl mx-auto mt-6 leading-relaxed">
            25 guest rooms inspired by Italian Villas — each one a quiet retreat in the
            heart of Palm Springs.
          </p>
        </div>
      </section>

      {/* Room listing */}
      <section className="py-20 md:py-28 bg-[var(--hotel-cream)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allRooms.map((room) => (
              <div key={room.slug} className="card-lift bg-white dark:bg-[#2a2620] group flex flex-col">
                {/* Image */}
                <Link href={`/rooms/${room.slug}`} className="relative overflow-hidden aspect-[4/3] block">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${room.img})` }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="font-body text-[8px] tracking-[0.35em] uppercase bg-[var(--hotel-charcoal)] text-[var(--hotel-gold)] px-3 py-1">
                      {room.badge}
                    </span>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                    <span className="text-white font-body text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/60 px-6 py-2 rounded-sm">
                      View Details
                    </span>
                  </div>
                </Link>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1">
                  <Link href={`/rooms/${room.slug}`}>
                    <h3 className="font-display text-[var(--hotel-charcoal)] text-xl font-light mb-2 hover:text-[var(--hotel-terracotta)] transition-colors">
                      {room.name}
                    </h3>
                  </Link>
                  <p className="font-body text-[var(--hotel-charcoal)]/70 text-xs leading-relaxed mb-4">
                    {room.description}
                  </p>

                  {/* Amenity chips */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {room.amenities.map((a) => (
                      <span
                        key={a}
                        className="font-body text-[8px] tracking-[0.15em] uppercase text-[var(--hotel-charcoal)]/50 border border-[var(--hotel-sand)] px-2 py-1"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  {/* Meta row */}
                  <div className="flex gap-4 border-t border-[var(--hotel-sand)] pt-4 mb-5 mt-auto">
                    {[room.bed, room.guests, room.sqft].map((meta) => (
                      <span
                        key={meta}
                        className="font-body text-[9px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50"
                      >
                        {meta}
                      </span>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display text-2xl text-[var(--hotel-charcoal)] font-light">
                        {room.price}
                      </span>
                      <span className="font-body text-[10px] text-[var(--hotel-charcoal)]/50 ml-1">
                        / night
                      </span>
                    </div>
                    <a
                      href="https://s005948.officialbookings.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-[9px] tracking-[0.3em] uppercase bg-[var(--hotel-terracotta)] text-white px-4 py-2 hover:bg-[var(--hotel-charcoal)] transition-all duration-300"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-[var(--hotel-charcoal)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-4">
            Need Help Choosing?
          </p>
          <h2 className="font-display text-[var(--hotel-cream)] text-3xl md:text-4xl font-light mb-6">
            Let us find the perfect room for your stay
          </h2>
          <p className="font-body text-white/60 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            Call our front desk for personalized recommendations, group bookings, or
            accessibility questions.
          </p>
          <a
            href="tel:+17603275701"
            className="font-body text-[10px] tracking-[0.35em] uppercase border border-[var(--hotel-gold)] text-[var(--hotel-gold)] px-8 py-3 hover:bg-[var(--hotel-gold)] hover:text-[var(--hotel-charcoal)] transition-all duration-300"
          >
            (760) 327-5701
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
