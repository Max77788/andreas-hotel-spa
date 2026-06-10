import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { getRooms } from "@/lib/cms/queries";
import type { Room } from "@/lib/cms/types";

export const metadata = {
  title: "Rooms & Suites – The Andreas Hotel & Spa",
  description:
    "Explore our 25 guest rooms and suites in the heart of Palm Springs. Italian furnishings, fireplaces, and every modern comfort — find your perfect retreat.",
};

// Fallback data in case Supabase is not yet seeded
const fallbackRooms: Room[] = [
  { id:"1", slug:"andreas-villa-suite", name:"Andreas Villa Suite", badge:"VILLA", image_url:"/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg", short_description:"Our most prestigious suite: Italian Villa design, fireplace, private courtyard, king bedroom, separate living area, and a private balcony with mountain views.", bed:"King Bed", guests:"4 Guests", sqft:"750 sq ft", price:"$599", amenities:["Fireplace","Refrigerator","Microwave","Keurig","Sound Machine","Private Courtyard","Marble Bath"], extras:[], gallery_urls:[], sort_order:0, is_published:true, long_description:null },
  { id:"2", slug:"mobility-accessible-suite", name:"Mobility Accessible 2 Bed Suite", badge:"ACCESSIBLE", image_url:"/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg", short_description:"Italian furnishings, fireplace, two bedrooms, two baths. Full accessibility with wide doorways, roll-in shower, and every comfort.", bed:"2 Queen Beds", guests:"4 Guests", sqft:"680 sq ft", price:"$449", amenities:["Fireplace","Refrigerator","Microwave","Keurig","Sound Machine","Roll-in Shower","Wide Doorways"], extras:[], gallery_urls:[], sort_order:1, is_published:true, long_description:null },
  { id:"3", slug:"mobility-accessible-deluxe-room", name:"Mobility Accessible Deluxe Room", badge:"ACCESSIBLE", image_url:"/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs-room11.jpg", short_description:"Italian furnishings, fireplace, full accessibility. All the elegance of our deluxe rooms with enhanced accessibility features throughout.", bed:"Queen Bed", guests:"2 Guests", sqft:"360 sq ft", price:"$219", amenities:["Fireplace","Refrigerator","Microwave","Keurig","Sound Machine","Roll-in Shower","Wide Doorways"], extras:[], gallery_urls:[], sort_order:2, is_published:true, long_description:null },
  { id:"4", slug:"2-bed-1-bath-suite", name:"2 Bed 1 Bath Suite", badge:"SUITE", image_url:"/hotel-photos/room7.jpg", short_description:"Italian furnishings, fireplace, two private bedrooms, cozy living space. Select suites have a balcony facing N. Indian Canyon for prime people-watching.", bed:"2 Queen Beds", guests:"4 Guests", sqft:"580 sq ft", price:"$379", amenities:["Fireplace","Refrigerator","Microwave","Keurig","Sound Machine","Two Bedrooms","Garden View"], extras:[], gallery_urls:[], sort_order:3, is_published:true, long_description:null },
  { id:"5", slug:"1-bedroom-suite", name:"1 Bedroom Suite", badge:"SUITE", image_url:"/hotel-photos/amenities.jpg", short_description:"Spacious suite with pillow-topped king bed, fireplace, separate living area, luxurious Italian furnishings. Select suites feature a private balcony.", bed:"King Bed", guests:"2 Guests", sqft:"520 sq ft", price:"$389", amenities:["Fireplace","Refrigerator","Microwave","Keurig","Sound Machine","Separate Living Room","King Bed"], extras:[], gallery_urls:[], sort_order:4, is_published:true, long_description:null },
  { id:"6", slug:"executive-room", name:"Executive Room", badge:"EXECUTIVE", image_url:"/hotel-photos/room1.jpg", short_description:"Italian furnishings, fireplace, dedicated workspace, refrigerator, microwave, Keurig — ideal for business travelers who expect more.", bed:"King Bed", guests:"2 Guests", sqft:"380 sq ft", price:"$289", amenities:["Fireplace","Refrigerator","Microwave","Keurig","Sound Machine","Work Desk","King Bed"], extras:[], gallery_urls:[], sort_order:5, is_published:true, long_description:null },
  { id:"7", slug:"deluxe-room", name:"Deluxe Room", badge:"DELUXE", image_url:"/hotel-photos/room6.jpg", short_description:"Italian furnishings, fireplace, marble bathroom. Refrigerator, microwave, Keurig, sound machine. The classic Andreas experience.", bed:"Queen Bed", guests:"2 Guests", sqft:"340 sq ft", price:"$219", amenities:["Fireplace","Refrigerator","Microwave","Keurig","Sound Machine","Marble Bath","Queen Bed"], extras:[], gallery_urls:[], sort_order:6, is_published:true, long_description:null },
];

export default async function RoomsPage() {
  const rooms = await getRooms().catch(() => fallbackRooms);
  const allRooms = rooms.length ? rooms : fallbackRooms;

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {allRooms.map((room) => (
              <div key={room.slug} className="group flex flex-col">
                {/* Image */}
                <Link href={`/rooms/${room.slug}`} className="relative overflow-hidden block">
                  <div
                    className="aspect-[4/3] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                    style={{ backgroundImage: `url(${room.image_url})` }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  {room.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="font-body text-[9px] tracking-[0.35em] uppercase bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-sm text-[var(--hotel-charcoal)] px-4 py-1.5">
                        {room.badge}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="pt-6 flex flex-col flex-1">
                  <Link href={`/rooms/${room.slug}`}>
                    <h3 className="font-display text-[var(--hotel-charcoal)] text-xl font-light mb-2 hover:text-[var(--hotel-terracotta)] transition-colors">
                      {room.name}
                    </h3>
                  </Link>
                  <p className="font-body text-[var(--hotel-charcoal)]/90 text-xs leading-relaxed mb-4">
                    {room.short_description}
                  </p>

                  {/* Amenity chips */}
                  <div className="flex flex-wrap gap-x-1 gap-y-1 mb-5">
                    {(room.amenities || []).map((a, idx) => (
                      <span key={a} className="inline-flex items-center">
                        <span className="font-body text-[8px] tracking-[0.15em] uppercase text-[var(--hotel-charcoal)]/90">{a}</span>
                        {idx < (room.amenities || []).length - 1 && <span className="text-[var(--hotel-sand)] mx-1.5">·</span>}
                      </span>
                    ))}
                  </div>

                  {/* Meta row */}
                  <div className="flex gap-5 pt-4 mb-5 mt-auto border-t border-[var(--hotel-sand)]">
                    {[room.bed, room.guests, room.sqft].filter(Boolean).map((meta) => (
                      <span key={meta} className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/90">{meta}</span>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display text-2xl text-[var(--hotel-charcoal)] font-light">{room.price}</span>
                      <span className="font-body text-[11px] text-[var(--hotel-charcoal)]/90 ml-1">/ night</span>
                    </div>
                    <Link href={`/rooms/${room.slug}`} className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--hotel-charcoal)]/90 border-b border-[var(--hotel-charcoal)]/30 pb-0.5 hover:text-[var(--hotel-terracotta)] hover:border-[var(--hotel-terracotta)] transition-colors">
                      Details →
                    </Link>
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
            href="tel:+176****5701"
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
