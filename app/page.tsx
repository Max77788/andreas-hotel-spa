import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import BookingBar from "@/components/booking-bar";
import { getRooms, getEvents, getGallery } from "@/lib/cms/queries";
import type { Room, EventItem, GalleryImage } from "@/lib/cms/types";

// ── Fallback data (used when Supabase is not yet seeded) ──────────────────────
const fallbackRooms: Room[] = [
  { id:"1", slug:"andreas-villa-suite", name:"Andreas Villa Suite", badge:"VILLA", image_url:"/hotel-photos/exterior.jpg", short_description:"Our most prestigious suite featuring Italian Villa design with panoramic desert views and private courtyard.", bed:"King Bed", guests:"4 Guests", sqft:"750 sq ft", price:"$599", amenities:[], extras:[], gallery_urls:[], sort_order:0, is_published:true, long_description:null },
  { id:"2", slug:"1-bedroom-suite", name:"1 Bedroom Suite", badge:"SUITE", image_url:"/hotel-photos/amenities.jpg", short_description:"Spacious suite with pillow-topped king bed, separate living area, and luxurious Italian-inspired furnishings.", bed:"King Bed", guests:"2 Guests", sqft:"520 sq ft", price:"$389", amenities:[], extras:[], gallery_urls:[], sort_order:1, is_published:true, long_description:null },
  { id:"3", slug:"deluxe-room", name:"Deluxe Room", badge:"DELUXE", image_url:"/hotel-photos/room6.jpg", short_description:"Beautifully appointed with marble bathrooms, luxury linens, and warm desert-inspired décor.", bed:"Queen Bed", guests:"2 Guests", sqft:"340 sq ft", price:"$219", amenities:[], extras:[], gallery_urls:[], sort_order:2, is_published:true, long_description:null },
];

const fallbackEvents: EventItem[] = [
  { id:"1", tag:"WELLNESS", date_label:"APR 12, 2026", title:"Desert Sunrise Yoga", description:"Begin your morning with guided yoga on our rooftop terrace as the sun rises over the San Jacinto Mountains.", image_url:"/hotel-photos/room7.jpg", sort_order:0, is_published:true },
  { id:"2", tag:"DINING", date_label:"APR 19, 2026", title:"Poolside Wine Evening", description:"Join our sommelier for an intimate poolside tasting of curated California wines and artisanal small bites.", image_url:"/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg", sort_order:1, is_published:true },
  { id:"3", tag:"CULTURE", date_label:"MAY 3, 2026", title:"Architecture Walking Tour", description:"A curated tour of Palm Springs' iconic mid-century modern architecture and vibrant local art galleries.", image_url:"/hotel-photos/pool-night.jpg", sort_order:2, is_published:true },
  { id:"4", tag:"SPA", date_label:"MAY 17, 2026", title:"Signature Spa Day", description:"A full-day spa retreat featuring our Vital-C Facial, Canyon Clay Body Wrap, and poolside relaxation package.", image_url:"/hotel-photos/room1.jpg", sort_order:3, is_published:true },
];

const fallbackGallery: GalleryImage[] = [
  { id:"1", image_url:"/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg", alt:"Villa Suite", category:"general", sort_order:0 },
  { id:"2", image_url:"/hotel-photos/pool-night.jpg", alt:"Sunset pool", category:"general", sort_order:1 },
  { id:"3", image_url:"/hotel-photos/room1.jpg", alt:"Guest room", category:"general", sort_order:2 },
  { id:"4", image_url:"/hotel-photos/amenities.jpg", alt:"Spa treatment", category:"general", sort_order:3 },
  { id:"5", image_url:"/hotel-photos/room6.jpg", alt:"Living area", category:"general", sort_order:4 },
  { id:"6", image_url:"/hotel-photos/room7.jpg", alt:"Desert palms", category:"general", sort_order:5 },
];

const stats = [
  { icon:"⊞", value:"25", label:"Guest Rooms" },
  { icon:"◎", value:"1", label:"Full Spa" },
  { icon:"◈", value:"2", label:"Pool & Jacuzzi" },
  { icon:"✦", value:"4.9", label:"Guest Rating" },
  { icon:"⊙", value:"24hr", label:"Front Desk" },
  { icon:"◉", value:"Free", label:"Parking" },
  { icon:"◫", value:"Downtown", label:"Palm Springs" },
  { icon:"△", value:"Est. 1935", label:"Heritage" },
];

const amenities = [
  { icon:"◎", title:"Full-Service Spa", desc:"Indulge in Vital-C Facial, California Orange Blossom Scrub, and Canyon Clay Body Mask treatments by expert therapists." },
  { icon:"◈", title:"Outdoor Pool & Jacuzzi", desc:"Our heated pool and Jacuzzi are surrounded by lush gardens and elegant poolside loungers — open daily." },
  { icon:"◐", title:"Outdoor Fireplaces", desc:"Gather around beautifully designed gas fireplaces set within our manicured courtyard every evening." },
  { icon:"◌", title:"24-Hour Front Desk", desc:"Our attentive concierge team is available around the clock to assist with reservations, dining, and activities." },
  { icon:"⊡", title:"Express Check-In/Out", desc:"Seamless arrivals and departures — because your time in Palm Springs should start and end perfectly." },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default async function HomePage() {
  let rooms = fallbackRooms;
  let events = fallbackEvents;
  let galleryImages = fallbackGallery;

  try {
    const [dbRooms, dbEvents, dbGallery] = await Promise.all([
      getRooms().catch(() => []),
      getEvents().catch(() => []),
      getGallery().catch(() => []),
    ]);
    if (dbRooms.length) rooms = dbRooms;
    if (dbEvents.length) events = dbEvents;
    if (dbGallery.length) galleryImages = dbGallery;
  } catch {}

  const displayRooms = rooms.slice(0, 3);

  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage:"url(/hotel-photos/exterior.jpg)" }}>
          <video autoPlay muted loop playsInline poster="/hotel-photos/exterior.jpg" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"100vw", height:"56.25vw", minHeight:"100vh", minWidth:"177.77vh", objectFit:"cover", pointerEvents:"none" }}>
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.6) 100%)" }} />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ paddingTop:"60px" }}>
          <div className="flex flex-col items-center px-10 py-10 mb-8" style={{ background:"rgba(0,0,0,0.42)", backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)" }}>
            <img src="/andreas_logo_white.png" alt="The Andreas Hotel & Spa" className="w-64 md:w-96 h-auto" />
            <div className="w-10 h-px bg-[var(--hotel-gold)] my-4" />
            <p className="font-body text-white/90 text-xs md:text-sm tracking-[0.4em] uppercase">A Sanctuary of Italian-Inspired Elegance</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="#rooms" className="bg-black border border-black text-white font-body text-[10px] tracking-[0.3em] uppercase px-7 py-3 hover:bg-white hover:text-[var(--hotel-charcoal)] hover:border-white transition-all duration-300">Explore Rooms</Link>
            <a href="/book" target="_blank" rel="noopener noreferrer" className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[10px] tracking-[0.3em] uppercase px-7 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300">Book Now</a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="font-body text-[8px] tracking-[0.5em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/20 animate-pulse" />
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────────── */}
      <section className="bg-[var(--hotel-cream)] border-b border-[var(--hotel-sand)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center text-center gap-1">
                <span className="text-[var(--hotel-gold)] text-lg mb-1">{s.icon}</span>
                <span className="font-display text-[var(--hotel-charcoal)] text-xl font-light">{s.value}</span>
                <span className="font-body text-[var(--hotel-charcoal)]/50 text-[9px] tracking-[0.3em] uppercase">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING BAR ─────────────────────────────────────────────────────── */}
      <BookingBar />

      {/* ── OUR STORY ───────────────────────────────────────────────────────── */}
      <section id="story" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-4">Our Story</p>
              <h2 className="font-display text-[var(--hotel-charcoal)] font-light leading-tight mb-2" style={{ fontSize:"clamp(2.2rem, 5vw, 3.8rem)" }}>
                Where Italian<br /><em className="italic">Villa Elegance</em><br />Meets the Desert
              </h2>
              <div className="w-8 h-px bg-[var(--hotel-gold)] my-6" />
              <p className="font-body text-[var(--hotel-charcoal)]/65 text-sm leading-relaxed mb-4">
                The Andreas Hotel & Spa is located in the heart of historic downtown Palm Springs, a short stroll from the city's shopping, dining, gaming, and nightlife. Established in 1935, the boutique hotel upholds the timeless allure of its heritage while capturing contemporary features following a full renovation and re-opening.
              </p>
              <p className="font-body text-[var(--hotel-charcoal)]/65 text-sm leading-relaxed mb-10">
                Interiors include a full-service spa where guests can indulge in sumptuous treatments. Our 25 guest rooms are a reflection of Italian Villas in the hills of Italy. Outdoors, guests enjoy amenities including outdoor gas fireplaces, a swimming pool, and Jacuzzi, surrounded by a lovely manicured courtyard.
              </p>
              <div className="flex gap-10 border-t border-[var(--hotel-sand)] pt-8">
                {[{ num:"1935", label:"Established" },{ num:"25", label:"Guest Rooms" },{ num:"5★", label:"Experience" }].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-3xl text-[var(--hotel-charcoal)] font-light">{s.num}</div>
                    <div className="font-body text-[9px] tracking-[0.35em] uppercase text-[var(--hotel-charcoal)]/50 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full aspect-[4/5] bg-cover bg-center" style={{ backgroundImage:"url(/hotel-photos/courtyard.jpg)" }} />
              <div className="absolute bottom-6 left-6 bg-[var(--hotel-charcoal)]/90 backdrop-blur-sm px-5 py-3">
                <div className="font-display text-[var(--hotel-cream)] text-lg font-light">Palm Springs</div>
                <div className="font-body text-[var(--hotel-gold)] text-[9px] tracking-widest uppercase mt-0.5">277 N. Indian Canyon Drive</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ──────────────────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2">
        <div className="aspect-[4/3] md:aspect-auto md:min-h-[520px] bg-cover bg-center" style={{ backgroundImage:"url(/hotel-photos/pool-night.jpg)" }} />
        <div className="bg-[var(--hotel-sand)] flex items-center px-10 md:px-16 py-16 md:py-24">
          <div className="max-w-md">
            <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-4">Our Philosophy</p>
            <h2 className="font-display text-[var(--hotel-charcoal)] font-light leading-tight mb-2" style={{ fontSize:"clamp(2rem, 4vw, 3rem)" }}>
              Embracing the<br /><em className="italic">Art of Living Well</em>
            </h2>
            <div className="w-8 h-px bg-[var(--hotel-gold)] my-5" />
            <p className="font-body text-[var(--hotel-charcoal)]/65 text-sm leading-relaxed mb-4">
              At The Andreas, we believe that true luxury is found in the harmony of authentic experiences, thoughtful design, and genuine human connection. Every detail — from our organically sourced linens to our poolside lite menu — reflects our commitment to a life beautifully lived.
            </p>
            <p className="font-body text-[var(--hotel-charcoal)]/65 text-sm leading-relaxed mb-10">
              Our Palm Springs sanctuary celebrates the natural world around us — the desert light, the bloom of bougainvillea, the stillness of warm evenings — inviting each guest to slow down, breathe deeply, and arrive fully.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-[var(--hotel-sand)]/60 pt-8">
              {[{ num:"90+", label:"Years of Hospitality" },{ num:"100%", label:"Image Spa Products" },{ num:"5★", label:"Rated Experience" }].map((s) => (
                <div key={s.label} className="border-r border-[var(--hotel-charcoal)]/10 last:border-0 pr-4 last:pr-0">
                  <div className="font-display text-2xl text-[var(--hotel-charcoal)] font-light">{s.num}</div>
                  <div className="font-body text-[8px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50 mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROOMS & SUITES ──────────────────────────────────────────────────── */}
      <section id="rooms" className="py-24 md:py-32 bg-[var(--hotel-sand)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-16">
            <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-3">Accommodations</p>
            <h2 className="font-display text-[var(--hotel-charcoal)] font-light" style={{ fontSize:"clamp(2.5rem, 5vw, 4rem)" }}>Rooms &amp; Suites</h2>
            <div className="w-8 h-px bg-[var(--hotel-gold)] mt-4" />
          </div>

          <div className="flex flex-col gap-20 md:gap-28">
            {displayRooms.map((room, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={room.slug} className="group flex flex-col md:flex-row gap-0">
                  <div className={`relative w-full md:w-[58%] overflow-hidden ${isEven ? "md:order-1" : "md:order-2"}`}>
                    <Link href={`/rooms/${room.slug}`} className="block">
                      <div className="aspect-[4/3] md:aspect-[16/10] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage:`url(${room.image_url})` }} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </Link>
                    {room.badge && (
                      <div className="absolute top-5 left-5">
                        <span className="font-body text-[9px] tracking-[0.35em] uppercase bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-sm text-[var(--hotel-charcoal)] px-4 py-1.5">{room.badge}</span>
                      </div>
                    )}
                  </div>
                  <div className={`w-full md:w-[42%] flex items-center ${isEven ? "md:order-2" : "md:order-1"}`}>
                    <div className={`p-8 md:p-12 lg:p-16 w-full ${isEven ? "" : "md:text-right"}`}>
                      <Link href={`/rooms/${room.slug}`}>
                        <h3 className="font-display text-[var(--hotel-charcoal)] font-light mb-3 hover:text-[var(--hotel-terracotta)] transition-colors" style={{ fontSize:"clamp(1.6rem, 3vw, 2.2rem)", lineHeight:1.15 }}>{room.name}</h3>
                      </Link>
                      <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed mb-6 max-w-md" style={isEven ? {} : { marginLeft:"auto" }}>{room.short_description}</p>
                      <div className={`flex gap-6 mb-8 ${isEven ? "" : "md:justify-end"}`}>
                        {[room.bed, room.guests, room.sqft].filter(Boolean).map((meta) => (
                          <span key={meta} className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/90">{meta}</span>
                        ))}
                      </div>
                      <div className={`flex items-center gap-6 ${isEven ? "" : "md:flex-row-reverse"}`}>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-3xl text-[var(--hotel-charcoal)] font-light">{room.price}</span>
                          <span className="font-body text-[11px] text-[var(--hotel-charcoal)]/90">/ night</span>
                        </div>
                        <Link href={`/rooms/${room.slug}`} className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--hotel-charcoal)]/90 border-b border-[var(--hotel-charcoal)]/30 pb-0.5 hover:text-[var(--hotel-terracotta)] hover:border-[var(--hotel-terracotta)] transition-colors">
                          View Room →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Link href="/rooms" className="font-body text-[10px] tracking-[0.35em] uppercase bg-[var(--hotel-charcoal)] text-[var(--hotel-cream)] px-8 py-3 hover:bg-[var(--hotel-gold)] hover:text-[var(--hotel-charcoal)] transition-all duration-300">View All Rooms</Link>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-[var(--hotel-sand)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-3">At The Andreas</p>
              <h2 className="font-display text-[var(--hotel-charcoal)] font-light" style={{ fontSize:"clamp(2rem, 4vw, 3.2rem)" }}>Upcoming Events</h2>
              <div className="w-8 h-px bg-[var(--hotel-gold)] mt-4" />
            </div>
            <Link href="/events" className="hidden md:inline-block font-body text-[9px] tracking-[0.35em] uppercase text-[var(--hotel-charcoal)]/60 hover:text-[var(--hotel-charcoal)] transition-colors border-b border-[var(--hotel-charcoal)]/30 pb-0.5">View All Events →</Link>
          </div>

          <div className="scroll-x flex gap-6 pb-4">
            {events.map((ev) => (
              <div key={ev.id} className="flex-shrink-0 w-[260px] bg-white card-lift">
                <div className="h-44 bg-cover bg-center" style={{ backgroundImage:`url(${ev.image_url})` }} />
                <div className="p-5">
                  <div className="mb-3">{ev.tag && <span className="font-body text-[7px] tracking-[0.4em] uppercase bg-[var(--hotel-gold)]/20 text-[var(--hotel-terracotta)] px-2 py-0.5">{ev.tag}</span>}</div>
                  <p className="font-body text-[var(--hotel-charcoal)]/50 text-[9px] tracking-widest uppercase mb-1">{ev.date_label}</p>
                  <h3 className="font-display text-[var(--hotel-charcoal)] text-lg font-light mb-2">{ev.title}</h3>
                  {ev.description && <p className="font-body text-[var(--hotel-charcoal)]/60 text-xs leading-relaxed">{ev.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFERS ──────────────────────────────────────────────────────────── */}
      <section className="relative py-32 md:py-40 overflow-hidden" style={{ backgroundImage:"url(/hotel-photos/pool-night.jpg)", backgroundSize:"cover", backgroundPosition:"center", backgroundAttachment:"fixed" }}>
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-4">Offers</p>
            <h2 className="font-display text-[var(--hotel-cream)] font-light leading-tight mb-2" style={{ fontSize:"clamp(2.5rem, 5vw, 4rem)", textShadow:"0 2px 12px rgba(0,0,0,0.5)" }}>Seasonal Packages</h2>
            <div className="flex justify-center mb-4">
              <img src="/andreas_logo_white.png" alt="The Andreas Hotel & Spa" className="h-12 md:h-16 w-auto opacity-90" />
            </div>
          </div>
          <div className="text-center">
            <Link href="/offers" className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[10px] tracking-[0.35em] uppercase px-8 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300">View All Offers</Link>
          </div>
        </div>
      </section>

      {/* ── AMENITIES ──────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[var(--hotel-cream)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-16">
            <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-3">Amenities</p>
            <h2 className="font-display text-[var(--hotel-charcoal)] font-light" style={{ fontSize:"clamp(2.5rem, 5vw, 4rem)" }}>The Andreas Experience</h2>
            <div className="w-8 h-px bg-[var(--hotel-gold)] mt-4" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {amenities.map((a) => (
              <div key={a.title} className="text-center group">
                <span className="text-[var(--hotel-gold)] text-3xl mb-4 block">{a.icon}</span>
                <h3 className="font-display text-[var(--hotel-charcoal)] text-lg font-light mb-3">{a.title}</h3>
                <p className="font-body text-[var(--hotel-charcoal)]/60 text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--hotel-sand)] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-16">
            <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-3">Gallery</p>
            <h2 className="font-display text-[var(--hotel-charcoal)] font-light" style={{ fontSize:"clamp(2.5rem, 5vw, 4rem)" }}>A Glimpse Inside</h2>
            <div className="w-8 h-px bg-[var(--hotel-gold)] mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {galleryImages.slice(0, 8).map((img) => (
              <div key={img.id} className="aspect-[4/3] bg-cover bg-center transition-transform duration-700 hover:scale-[1.03]" style={{ backgroundImage:`url(${img.image_url})` }} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
