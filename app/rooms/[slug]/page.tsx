import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { getRoomBySlug, getRooms } from "@/lib/cms/queries";
import type { Room } from "@/lib/cms/types";

// Fallback data for when Supabase is not yet seeded
const fallbackRooms: Record<string, Room> = {
  "andreas-villa-suite": { id:"1", slug:"andreas-villa-suite", name:"Andreas Villa Suite", badge:"VILLA", image_url:"/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg", short_description:"Our most prestigious suite: Italian Villa design, fireplace, private courtyard, king bedroom, separate living area, and a private balcony with mountain views.", bed:"King Bed", guests:"4 Guests", sqft:"750 sq ft", price:"$599", amenities:["Private Courtyard Entrance","Gas Fireplace","Separate Living Room","Marble Bathroom with Soaking Tub","Panoramic Desert Views","Luxury Linens & Robes","Microwave","Refrigerator","Keurig Coffee Maker","Sound Machine","Double-Paned Windows"], extras:[{icon:"🛏",label:"King Bed"},{icon:"🛋",label:"Separate Living Room"},{icon:"🔥",label:"Gas Fireplace"},{icon:"🛁",label:"Soaking Tub"},{icon:"🏡",label:"Private Courtyard"},{icon:"📺",label:'55" Flat Screen TV'},{icon:"🧊",label:"Refrigerator"},{icon:"☕",label:"Keurig Coffee Maker"},{icon:"🍿",label:"Microwave"},{icon:"🎵",label:"Sound Machine"},{icon:"🪟",label:"Double-Paned Windows"}], gallery_urls:["/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg","/hotel-photos/exterior.jpg","/hotel-photos/courtyard.jpg"], sort_order:0, is_published:true, long_description:"The Andreas Villa Suite is the crown jewel of our Palm Springs hotel. Inspired by the grand villas of the Italian countryside, this suite offers an unparalleled experience of space, elegance, and privacy. Enter through your private courtyard to discover a sanctuary of hand-selected furnishings, and a king bed dressed in the finest Italian linens. The separate living area with a gas fireplace invites you to unwind after a day exploring downtown Palm Springs, while the marble bathroom with a deep soaking tub completes the experience of refined relaxation." },
  "mobility-accessible-suite": { id:"2", slug:"mobility-accessible-suite", name:"Mobility Accessible 2 Bed Suite", badge:"ACCESSIBLE", image_url:"/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg", short_description:"Italian furnishings, fireplace, two bedrooms, two baths. Full accessibility with wide doorways, roll-in shower, and every comfort.", bed:"2 Queen Beds", guests:"4 Guests", sqft:"680 sq ft", price:"$449", amenities:["Roll-in Shower",'Wide Doorways (36")',"Grab Bars Throughout","Ground Floor Access","Two Full Bathrooms","Luxury Linens","Gas Fireplace","Microwave","Refrigerator","Keurig Coffee Maker","Sound Machine","Double-Paned Windows"], extras:[{icon:"♿",label:"Full Accessibility"},{icon:"🛏",label:"2 Queen Beds"},{icon:"🚿",label:"Roll-in Shower"},{icon:"🚪",label:'36" Doorways'},{icon:"🏠",label:"Ground Floor"},{icon:"📺",label:"Flat Screen TV"},{icon:"🧊",label:"Refrigerator"},{icon:"☕",label:"Keurig Coffee Maker"},{icon:"🔥",label:"Gas Fireplace"},{icon:"🍿",label:"Microwave"},{icon:"🎵",label:"Sound Machine"},{icon:"🪟",label:"Double-Paned Windows"}], gallery_urls:["/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg","/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs-room11.jpg","/hotel-photos/courtyard.jpg"], sort_order:1, is_published:true, long_description:"Designed with accessibility at its heart, this two-bedroom suite ensures every guest experiences the comfort and elegance of the Andreas without compromise. Wide doorways, roll-in showers, and strategically placed grab bars provide ease of movement, while the thoughtful layout offers privacy between the two bedrooms. Each room is furnished with queen beds and premium linens, and the two full bathrooms mean no waiting. Located on the ground floor for effortless access to the courtyard, pool, and spa." },
  "mobility-accessible-deluxe-room": { id:"3", slug:"mobility-accessible-deluxe-room", name:"Mobility Accessible Deluxe Room", badge:"ACCESSIBLE", image_url:"/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs-room11.jpg", short_description:"Italian furnishings, fireplace, full accessibility. All the elegance of our deluxe rooms with enhanced accessibility features throughout.", bed:"Queen Bed", guests:"2 Guests", sqft:"360 sq ft", price:"$219", amenities:["Roll-in Shower",'Wide Doorways (36")',"Grab Bars","Ground Floor Access","Marble Bathroom","Luxury Linens","Gas Fireplace","Microwave","Refrigerator","Keurig Coffee Maker","Sound Machine","Double-Paned Windows"], extras:[{icon:"♿",label:"Full Accessibility"},{icon:"🛏",label:"Queen Bed"},{icon:"🚿",label:"Roll-in Shower"},{icon:"🚪",label:'36" Doorways'},{icon:"🏠",label:"Ground Floor"},{icon:"📺",label:"Flat Screen TV"},{icon:"🧊",label:"Refrigerator"},{icon:"☕",label:"Keurig Coffee Maker"},{icon:"🔥",label:"Gas Fireplace"},{icon:"🍿",label:"Microwave"},{icon:"🎵",label:"Sound Machine"},{icon:"🪟",label:"Double-Paned Windows"}], gallery_urls:["/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs-room11.jpg","/hotel-photos/room6.jpg","/hotel-photos/courtyard.jpg"], sort_order:2, is_published:true, long_description:"The Mobility Accessible Deluxe Room brings together accessibility and the classic Andreas aesthetic. A spacious layout with a queen bed, roll-in shower, and wide doorways ensures a comfortable stay without sacrificing style. Marble bathroom finishes and Italian-inspired furnishings create the same inviting atmosphere found in every Andreas room, with the added peace of mind of ground-floor access and barrier-free design throughout." },
  "2-bed-1-bath-suite": { id:"4", slug:"2-bed-1-bath-suite", name:"2 Bed 1 Bath Suite", badge:"SUITE", image_url:"/hotel-photos/room7.jpg", short_description:"Italian furnishings, fireplace, two private bedrooms, cozy living space. Select suites have a balcony facing N. Indian Canyon for prime people-watching.", bed:"2 Queen Beds", guests:"4 Guests", sqft:"580 sq ft", price:"$379", amenities:["Two Separate Bedrooms","Shared Full Bath","Cozy Sitting Area","Refrigerator","Garden View","Luxury Linens","Gas Fireplace","Microwave","Keurig Coffee Maker","Sound Machine","Double-Paned Windows"], extras:[{icon:"🛏",label:"2 Queen Beds"},{icon:"🚪",label:"Two Bedrooms"},{icon:"🛋",label:"Sitting Area"},{icon:"🌿",label:"Garden View"},{icon:"📺",label:"Flat Screen TV"},{icon:"🧊",label:"Refrigerator"},{icon:"☕",label:"Keurig Coffee Maker"},{icon:"👨‍👩‍👧",label:"Family Friendly"},{icon:"🔥",label:"Gas Fireplace"},{icon:"🍿",label:"Microwave"},{icon:"🎵",label:"Sound Machine"},{icon:"🪟",label:"Double-Paned Windows"}], gallery_urls:["/hotel-photos/room7.jpg","/hotel-photos/room1.jpg","/hotel-photos/courtyard.jpg"], sort_order:3, is_published:true, long_description:"Ideal for families or friends traveling together, the 2 Bed 1 Bath Suite balances togetherness with privacy. Select suites offer a balcony facing iconic N. Indian Canyon Drive — perfect for soaking in the Palm Springs energy. Two separate bedrooms, each with a queen bed, share a well-appointed full bathroom. A cozy sitting area between the rooms provides a gathering spot for morning coffee or evening conversation. Decorated in Italian-inspired touches, this suite feels like a home away from home — just steps from the pool, courtyard, and downtown Palm Springs." },
  "1-bedroom-suite": { id:"5", slug:"1-bedroom-suite", name:"1 Bedroom Suite", badge:"SUITE", image_url:"/hotel-photos/amenities.jpg", short_description:"Spacious suite with pillow-topped king bed, fireplace, separate living area, luxurious Italian furnishings. Select suites feature a private balcony.", bed:"King Bed", guests:"2 Guests", sqft:"520 sq ft", price:"$389", amenities:["Separate Living Room","King Bed","Courtyard View","Marble Bathroom","Luxury Linens & Robes","Work Desk","Gas Fireplace","Microwave","Refrigerator","Keurig Coffee Maker","Sound Machine","Double-Paned Windows"], extras:[{icon:"🛏",label:"King Bed"},{icon:"🛋",label:"Separate Living Room"},{icon:"🏖",label:"Private Cabana Patio"},{icon:"🌿",label:"Courtyard View"},{icon:"🖊",label:"Work Desk"},{icon:"📺",label:"Flat Screen TV"},{icon:"🧊",label:"Refrigerator"},{icon:"☕",label:"Keurig Coffee Maker"},{icon:"🛁",label:"Marble Bath"},{icon:"🔥",label:"Gas Fireplace"},{icon:"🍿",label:"Microwave"},{icon:"🎵",label:"Sound Machine"},{icon:"🪟",label:"Double-Paned Windows"}], gallery_urls:["/hotel-photos/amenities.jpg","/hotel-photos/room1.jpg","/hotel-photos/courtyard.jpg"], sort_order:4, is_published:true, long_description:"The 1 Bedroom Suite offers the perfect blend of space and intimacy. Select suites feature a private balcony overlooking N. Indian Canyon Drive — ideal for people-watching over your morning Keurig coffee. A separate living area with a plush sofa and work desk gives you room to spread out, while the bedroom — anchored by a pillow-topped king bed — promises deep, restful sleep. Italian-inspired furnishings, and a marble bathroom make every moment feel elevated. Overlooking our manicured courtyard, this suite is a quiet retreat just minutes from the energy of downtown Palm Springs." },
  "executive-room": { id:"6", slug:"executive-room", name:"Executive Room", badge:"EXECUTIVE", image_url:"/hotel-photos/room1.jpg", short_description:"Italian furnishings, fireplace, dedicated workspace, refrigerator, microwave, Keurig — ideal for business travelers who expect more.", bed:"King Bed", guests:"2 Guests", sqft:"380 sq ft", price:"$289", amenities:["Dedicated Work Desk","King Bed","Upgraded Linens","Courtyard View","Marble Bathroom","High-Speed WiFi","Gas Fireplace","Microwave","Refrigerator","Keurig Coffee Maker","Sound Machine","Double-Paned Windows"], extras:[{icon:"🛏",label:"King Bed"},{icon:"🖊",label:"Work Desk"},{icon:"📶",label:"High-Speed WiFi"},{icon:"🌿",label:"Courtyard View"},{icon:"📺",label:"Flat Screen TV"},{icon:"🧊",label:"Refrigerator"},{icon:"☕",label:"Keurig Coffee Maker"},{icon:"🛁",label:"Marble Bath"},{icon:"🔥",label:"Gas Fireplace"},{icon:"🍿",label:"Microwave"},{icon:"🎵",label:"Sound Machine"},{icon:"🪟",label:"Double-Paned Windows"}], gallery_urls:["/hotel-photos/room1.jpg","/hotel-photos/room5.jpg","/hotel-photos/courtyard.jpg"], sort_order:5, is_published:true, long_description:"Designed for the traveler who blends business with pleasure, the Executive Room offers more than just a place to sleep. A dedicated workspace with high-speed WiFi keeps you connected, while the king bed with upgraded linens ensures you recharge in style. Marble bathroom finishes and a courtyard view add a layer of refinement that turns a work trip into a pleasure. After hours, the pool, spa, and downtown Palm Springs are just steps away." },
  "deluxe-room": { id:"7", slug:"deluxe-room", name:"Deluxe Room", badge:"DELUXE", image_url:"/hotel-photos/room6.jpg", short_description:"Italian furnishings, fireplace, marble bathroom. Refrigerator, microwave, Keurig, sound machine. The classic Andreas experience.", bed:"Queen Bed", guests:"2 Guests", sqft:"340 sq ft", price:"$219", amenities:["Marble Bathroom","Queen Bed","Pool View","Luxury Linens","Italian-Inspired Furnishings","Plush Robes","Gas Fireplace","Microwave","Refrigerator","Keurig Coffee Maker","Sound Machine","Double-Paned Windows"], extras:[{icon:"🛏",label:"Queen Bed"},{icon:"🏊",label:"Pool View"},{icon:"🛁",label:"Marble Bath"},{icon:"👘",label:"Plush Robes"},{icon:"📺",label:"Flat Screen TV"},{icon:"🧊",label:"Refrigerator"},{icon:"☕",label:"Keurig Coffee Maker"},{icon:"🛋",label:"Italian Furnishings"},{icon:"🔥",label:"Gas Fireplace"},{icon:"🍿",label:"Microwave"},{icon:"🎵",label:"Sound Machine"},{icon:"🪟",label:"Double-Paned Windows"}], gallery_urls:["/hotel-photos/room6.jpg","/hotel-photos/room7.jpg","/hotel-photos/pool-night.jpg"], sort_order:6, is_published:true, long_description:"The Deluxe Room is where most guests fall in love with the Andreas. A beautifully appointed queen bed dressed in crisp Italian linens, a marble bathroom with premium amenities, and Italian-inspired furnishings that reflect the timeless elegance of our hotel. Overlooking the pool and courtyard, these rooms capture the essence of relaxed luxury. It's the perfect home base for exploring downtown, hiking the nearby trails, or simply doing nothing at all by the pool." },
};

async function getRoom(slug: string): Promise<Room | null> {
  try {
    return await getRoomBySlug(slug);
  } catch {
    return fallbackRooms[slug] || null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) return { title: "Room Not Found – The Andreas Hotel & Spa" };
  return { title: `${room.name} – The Andreas Hotel & Spa`, description: room.short_description };
}

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) notFound();

  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      <section className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${room.image_url})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute top-24 left-6 md:left-10 z-10 flex items-center gap-4">
          <Link href="/rooms" className="font-body text-[9px] tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors flex items-center gap-2">← Back to Rooms</Link>
          {room.badge && <span className="font-body text-[8px] tracking-[0.35em] uppercase bg-[var(--hotel-charcoal)] text-[var(--hotel-gold)] px-3 py-1">{room.badge}</span>}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-white text-4xl md:text-6xl font-light mb-3">{room.name}</h1>
            <div className="flex gap-6">
              {[room.bed, room.guests, room.sqft].filter(Boolean).map((meta) => (
                <span key={meta} className="font-body text-[10px] tracking-[0.2em] uppercase text-white/70">{meta}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[var(--hotel-cream)]">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 md:gap-16">
            <div>
              <p className="font-display text-[var(--hotel-charcoal)] text-xl md:text-2xl font-light leading-relaxed mb-8">{room.short_description}</p>
              {room.long_description && <p className="font-body text-[var(--hotel-charcoal)]/70 text-sm leading-relaxed mb-10">{room.long_description}</p>}

              <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl font-light mb-5">Room Amenities</h3>
              <div className="grid grid-cols-2 gap-3 mb-10">
                {(room.amenities || []).map((a) => (
                  <div key={a} className="flex items-center gap-3 text-[var(--hotel-charcoal)]/80">
                    <span className="w-1 h-1 bg-[var(--hotel-terracotta)] rounded-full flex-shrink-0" />
                    <span className="font-body text-xs">{a}</span>
                  </div>
                ))}
              </div>

              {(room.gallery_urls || []).length > 0 && (
                <>
                  <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl font-light mb-5">Gallery</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(room.gallery_urls || []).map((img, i) => (
                      <div key={i} className="aspect-[4/3] bg-cover bg-center rounded-sm" style={{ backgroundImage: `url(${img})` }} />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div>
              <div className="card-lift bg-white dark:bg-[#2a2620] p-6 sticky top-28">
                <div className="text-center mb-6">
                  <span className="font-display text-[var(--hotel-charcoal)] text-4xl font-light">{room.price}</span>
                  <span className="font-body text-[10px] text-[var(--hotel-charcoal)]/50 ml-1">/ night</span>
                </div>
                <a href="/book" target="_blank" rel="noopener noreferrer" className="block text-center font-body text-[10px] tracking-[0.3em] uppercase bg-[var(--hotel-terracotta)] text-white px-6 py-3 hover:bg-[var(--hotel-charcoal)] transition-all duration-300 mb-5">Book This Room</a>

                {(room.extras || []).length > 0 && (
                  <div className="border-t border-[var(--hotel-sand)] pt-5">
                    <h4 className="font-display text-[var(--hotel-charcoal)] text-base font-light mb-4">Room Features</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {(room.extras || []).map((ex) => (
                        <div key={ex.label} className="flex items-center gap-2 text-xs">
                          <span>{ex.icon}</span>
                          <span className="font-body text-[var(--hotel-charcoal)]/70">{ex.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-[var(--hotel-sand)] mt-5 pt-5">
                  <p className="font-body text-[10px] text-[var(--hotel-charcoal)]/50 text-center">
                    Questions? Call{" "}
                    <a href="tel:+176****5701" className="text-[var(--hotel-terracotta)] hover:underline">(760) 327-5701</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
