"use client";

import { useState, Suspense, type FormEvent } from "react";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import LogoVariantDisplay from "@/components/logo-variant-display";

// ── Images ────────────────────────────────────────────────────────────────────

const STORY_IMG = "/hotel-photos/courtyard.jpg";
const PHILOSOPHY_IMG = "/hotel-photos/pool-night.jpg";

const OFFERS_BG = "/hotel-photos/pool-night.jpg";
const AMENITIES_POOL = "/hotel-photos/pool-night.jpg";
const AMENITIES_SPA = "/hotel-photos/amenities.jpg";

// ── Fallback Data ─────────────────────────────────────────────────────────────

const fallbackRooms = [
  { badge: "VILLA", name: "Andreas Villa Suite", href: "/rooms/andreas-villa-suite", img: "/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg", description: "Our most prestigious suite featuring Italian Villa design with panoramic desert views and private courtyard.", bed: "King Bed", guests: "4 Guests", sqft: "750 sq ft", price: "$599" },
  { badge: "SUITE", name: "1 Bedroom Suite", href: "/rooms/1-bedroom-suite", img: "/hotel-photos/amenities.jpg", description: "Spacious suite with pillow-topped king bed, separate living area, and luxurious Italian-inspired furnishings.", bed: "King Bed", guests: "2 Guests", sqft: "520 sq ft", price: "$389" },
  { badge: "DELUXE", name: "Deluxe Room", href: "/rooms/deluxe-room", img: "/hotel-photos/room6.jpg", description: "Beautifully appointed with marble bathrooms, luxury linens, and warm desert-inspired décor.", bed: "Queen Bed", guests: "2 Guests", sqft: "340 sq ft", price: "$219" },
];

const fallbackEvents = [
  { tag: "WELLNESS", date: "APR 12, 2026", title: "Desert Sunrise Yoga", description: "Begin your morning with guided yoga on our rooftop terrace as the sun rises over the San Jacinto Mountains.", img: "/hotel-photos/room7.jpg" },
  { tag: "DINING", date: "APR 19, 2026", title: "Poolside Wine Evening", description: "Join our sommelier for an intimate poolside tasting of curated California wines and artisanal small bites.", img: "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg" },
  { tag: "CULTURE", date: "MAY 3, 2026", title: "Architecture Walking Tour", description: "A curated tour of Palm Springs' iconic mid-century modern architecture and vibrant local art galleries.", img: "/hotel-photos/pool-night.jpg" },
  { tag: "SPA", date: "MAY 17, 2026", title: "Signature Spa Day", description: "A full-day spa retreat featuring our Vital-C Facial, Canyon Clay Body Wrap, and poolside relaxation package.", img: "/hotel-photos/room1.jpg" },
];

const fallbackOffers = {
  oneNight: [
    { title: "The Escape", description: "Includes the Andreas signature scrub, 50 min Deep Tissue, 50 minute Aroma Therapy massage, and the Vital C Facial.", note: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Mar 15 - Oct 15.", price: "$630" },
    { title: "The Rejuvenate", description: "Includes a 30 minute Mineral Soak, the Vital C Facial, Gentlemen's Facial and two 50 minute Therapeutic massages.", note: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Mar 15 - Oct 15.", price: "$665" },
  ],
  twoNight: [
    { title: "The Oasis", description: "Includes: The Andreas Signature Scrub, the Canyon Clay Body Mask, a 50 minute Swedish massage, and a 50 Minute Aromatherapy massage.", note: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Mar 15 - Oct 15.", price: "$745" },
    { title: "The Andreas Renewal", description: "Includes: 30 min. Mineral Soak, Ageless Facial, and Rosemary Mint Scrub; 50 min. Deep Tissue & therapeutic massage.", note: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Mar 15 - Oct 15.", price: "$795" },
  ],
};
const stats = [
  { icon: "⊞", value: "25", label: "Guest Rooms" },
  { icon: "◎", value: "1", label: "Full Spa" },
  { icon: "◈", value: "2", label: "Pool & Jacuzzi" },
  { icon: "✦", value: "4.9", label: "Guest Rating" },
  { icon: "⊙", value: "24hr", label: "Front Desk" },
  { icon: "◉", value: "Free", label: "Parking" },
  { icon: "◫", value: "Downtown", label: "Palm Springs" },
  { icon: "△", value: "Est. 1935", label: "Heritage" },
];
const amenities = [
  { icon: "◎", title: "Full-Service Spa", desc: "Indulge in Vital-C Facial, California Orange Blossom Scrub, and Canyon Clay Body Mask treatments by expert therapists." },
  { icon: "◈", title: "Outdoor Pool & Jacuzzi", desc: "Our heated pool and Jacuzzi are surrounded by lush gardens and elegant poolside loungers — open 24 hours daily for our guests." },
  { icon: "♨", title: "Finnish Sauna", desc: "Enjoy our traditional Finnish sauna — available as a dry sauna or a steam sauna for the ultimate relaxation experience." },
  { icon: "◐", title: "Outdoor Fireplaces", desc: "Gather around beautifully designed gas fireplaces set within our manicured courtyard every evening." },
  { icon: "◌", title: "24-Hour Front Desk", desc: "Our attentive concierge team is available around the clock to assist with reservations, dining, and activities." },
  { icon: "⊡", title: "Express Check-In/Out", desc: "Seamless arrivals and departures — because your time in Palm Springs should start and end perfectly." },
];
export default function HomePage() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [contactError, setContactError] = useState("");

  // Use fallback data (CMS data loading via fetch on client is possible but adds complexity; keeping hardcoded fallbacks works identically)
  const rooms = fallbackRooms;
  const events = fallbackEvents;
  const galleryImages = [
    { src: "/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg", alt: "Villa Suite bedroom" },
    { src: "/hotel-photos/courtyard.jpg", alt: "Courtyard garden" },
    { src: "/hotel-photos/room1.jpg", alt: "Deluxe guest room" },
    { src: "/hotel-photos/exterior.jpg", alt: "Hotel exterior" },
    { src: "/hotel-photos/amenities.jpg", alt: "Spa treatment room" },
    { src: "/hotel-photos/room6.jpg", alt: "Suite living area" },
    { src: "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg", alt: "Accessible suite" },
    { src: "/hotel-photos/room7.jpg", alt: "Executive room" },
  ];
  const offers = fallbackOffers;
  // ── Contact form ──
  async function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    setContactStatus("sending");
    setContactError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setContactStatus("sent");
      setContactForm({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setContactStatus("idle"), 5000);
    } catch (err: unknown) {
      setContactStatus("error");
      setContactError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        {/* Video background with poster fallback */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url(/hotel-photos/exterior.jpg)",
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/hotel-photos/exterior.jpg"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100vw",
              height: "56.25vw",
              minHeight: "100vh",
              minWidth: "177.77vh",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ paddingTop: "60px" }}>
          {/* Logo backdrop */}
          <div
            className="flex flex-col items-center px-10 py-10 mb-8"
            style={{
              background: "rgba(0,0,0,0.42)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <Suspense fallback={null}>
              <div className="flex items-center justify-center">
                <img src="/andreas_logo_white.png" alt="Andreas Hotel & Spa" className="w-48 md:w-72 h-auto opacity-90" />
              </div>
            </Suspense>
            <div className="w-10 h-px bg-[var(--hotel-gold)] my-4" />
            <p className="font-body text-white/90 text-xs md:text-sm tracking-[0.4em] uppercase">
              A Sanctuary of Italian-Inspired Elegance
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="#rooms"
              className="bg-black border border-black text-white font-body text-[10px] tracking-[0.3em] uppercase px-7 py-3 hover:bg-white hover:text-[var(--hotel-charcoal)] hover:border-white transition-all duration-300"
            >
              Explore Rooms
            </Link>
            <a
              href="/book"
              rel="noopener noreferrer"
              className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[10px] tracking-[0.3em] uppercase px-7 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
            >
              Book Now
            </a>
          </div>
        </div>

        {/* Scroll hint */}
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
                <span className="font-body text-[var(--hotel-charcoal)]/90 text-[9px] tracking-[0.3em] uppercase">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING BAR ─────────────────────────────────────────────────────── */}
      <section className="bg-[var(--hotel-charcoal)] px-6 md:px-10 py-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block font-body text-[9px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-1">Check In</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 text-white font-body text-sm py-2 focus:outline-none focus:border-[var(--hotel-gold)] transition-colors"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block font-body text-[9px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-1">Check Out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 text-white font-body text-sm py-2 focus:outline-none focus:border-[var(--hotel-gold)] transition-colors"
            />
          </div>
          <a
            href={checkIn && checkOut ? `/book?arrival=${checkIn}&departure=${checkOut}` : "/book"}
            rel="noopener noreferrer"
            className="w-full md:w-auto flex-shrink-0 bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[10px] tracking-[0.3em] uppercase px-8 py-3 text-center hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
          >
            Check Availability
          </a>
        </div>
      </section>

      {/* ── OUR STORY ───────────────────────────────────────────────────────── */}
      <section id="story" className="pt-4 md:pt-10 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-4">
                Our Story
              </p>
              <h2 className="font-display text-[var(--hotel-charcoal)] font-light leading-tight mb-2" style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}>
                Where Italian<br />
                <em className="italic">Villa Elegance</em><br />
                Meets the Desert
              </h2>
              <div className="w-8 h-px bg-[var(--hotel-gold)] my-6" />
              <div className="flex justify-center mb-6">
                {/* Full logo — does NOT switch with URL param */}
                <div className="dark:hidden">
                  <img src="/andreas_logo.png" alt="Andreas Hotel & Spa" className="w-40 md:w-52 h-auto opacity-90" />
                </div>
                <div className="hidden dark:block">
                  <img src="/andreas_logo_white.png" alt="Andreas Hotel & Spa" className="w-40 md:w-52 h-auto opacity-90" />
                </div>
              </div>
              <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed mb-4">
                The <Suspense fallback={<span className="inline-block align-middle" style={{ width: 70, height: 14 }} />}>
                  {/* Light mode — dark logos */}
                  <span className="dark:hidden">
                    <LogoVariantDisplay
                      variantA={<img src="/andreas_logo_a.png" alt="Andreas" className="inline-block align-middle h-[2.25em] w-auto" />}
                      variantB={<img src="/andreas_wordmark.png" alt="Andreas" className="inline-block align-middle h-[2.25em] w-auto opacity-80" />}
                    />
                  </span>
                  {/* Dark mode — white logos */}
                  <span className="hidden dark:inline">
                    <LogoVariantDisplay
                      variantA={<img src="/andreas_logo_a_white.png" alt="Andreas" className="inline-block align-middle h-[2.25em] w-auto" />}
                      variantB={<img src="/andreas_wordmark_white.png" alt="Andreas" className="inline-block align-middle h-[2.25em] w-auto opacity-80" />}
                    />
                  </span>
                </Suspense> Hotel & Spa is located in the heart of historic downtown Palm Springs, a short stroll from the city's shopping, dining, gaming, and nightlife. Established in 1935, the boutique hotel upholds the timeless allure of its heritage while capturing contemporary features following a full renovation and re-opening.
              </p>
              <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed mb-10">
                Interiors include a full-service spa where guests can indulge in sumptuous treatments. Our 25 guest rooms are a reflection of Italian Villas in the hills of Italy. Outdoors, guests enjoy amenities including outdoor gas fireplaces, a swimming pool, and Jacuzzi, surrounded by a lovely manicured courtyard.
              </p>

              {/* Stats row */}
              <div className="flex gap-10 border-t border-[var(--hotel-sand)] pt-8">
                {[
                  { num: "1935", label: "Established" },
                  { num: "25", label: "Guest Rooms" },
                  { num: "5★", label: "Experience" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-3xl text-[var(--hotel-charcoal)] font-light">{s.num}</div>
                    <div className="font-body text-[9px] tracking-[0.35em] uppercase text-[var(--hotel-charcoal)]/90 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div
                className="w-full aspect-[4/5] bg-cover bg-center"
                style={{ backgroundImage: `url(${STORY_IMG})` }}
              />
              {/* Location badge */}
              <div className="absolute bottom-6 left-6 bg-[#1a1a1a]/90 backdrop-blur-sm px-5 py-3">
                <div className="font-display text-[var(--hotel-cream)] text-lg font-light">Palm Springs</div>
                <div className="font-body text-[var(--hotel-gold)] text-[9px] tracking-widest uppercase mt-0.5">277 N. Indian Canyon Drive</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ──────────────────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2">
        {/* Half image */}
        <div
          className="aspect-[4/3] md:aspect-auto md:min-h-[520px] bg-cover bg-center"
          style={{ backgroundImage: `url(${PHILOSOPHY_IMG})` }}
        />
        {/* Content */}
        <div className="bg-[var(--hotel-sand)] flex items-center px-10 md:px-16 py-16 md:py-24">
          <div className="max-w-md">
            <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-4">
              Our Philosophy
            </p>
            <h2 className="font-display text-[var(--hotel-charcoal)] font-light leading-tight mb-2" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Embracing the<br />
              <em className="italic">Art of Living Well</em>
            </h2>
            <div className="w-8 h-px bg-[var(--hotel-gold)] my-5" />
            <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed mb-4">
              At The Andreas, we believe that true luxury is found in the harmony of authentic experiences, thoughtful design, and genuine human connection. Every detail — from our organically sourced linens to our poolside lite menu — reflects our commitment to a life beautifully lived.
            </p>
            <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed mb-10">
              Our Palm Springs sanctuary celebrates the natural world around us — the desert light, the bloom of bougainvillea, the stillness of warm evenings — inviting each guest to slow down, breathe deeply, and arrive fully.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-[var(--hotel-sand)]/60 pt-8">
              {[
                { num: "90+", label: "Years of Hospitality" },
                { num: "100%", label: "Image Spa Products" },
                { num: "5★", label: "Rated Experience" },
              ].map((s) => (
                <div key={s.label} className="border-r border-[var(--hotel-charcoal)]/10 last:border-0 pr-4 last:pr-0">
                  <div className="font-display text-2xl text-[var(--hotel-charcoal)] font-light">{s.num}</div>
                  <div className="font-body text-[8px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/90 mt-1 leading-tight">{s.label}</div>
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
            <h2 className="font-display text-[var(--hotel-charcoal)] font-light" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              Rooms &amp; Suites
            </h2>
            <div className="w-8 h-px bg-[var(--hotel-gold)] mt-4" />
          </div>

          <div className="flex flex-col gap-20 md:gap-28">
            {rooms.map((room, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={room.name} className="group flex flex-col md:flex-row gap-0">
                  {/* Image side */}
                  <div className={`relative w-full md:w-[58%] overflow-hidden ${isEven ? "md:order-1" : "md:order-2"}`}>
                    <Link href={room.href} className="block">
                      <div
                        className="aspect-[4/3] md:aspect-[16/10] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                        style={{ backgroundImage: `url(${room.img})` }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </Link>
                    {/* Badge */}
                    <div className="absolute top-5 left-5">
                      <span className="font-body text-[9px] tracking-[0.35em] uppercase bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-sm text-[var(--hotel-charcoal)] px-4 py-1.5">
                        {room.badge}
                      </span>
                    </div>
                  </div>

                  {/* Text side */}
                  <div className={`w-full md:w-[42%] flex items-center ${isEven ? "md:order-2" : "md:order-1"}`}>
                    <div className={`p-8 md:p-12 lg:p-16 w-full ${isEven ? "" : "md:text-right"}`}>
                      <Link href={room.href}>
                        <h3 className="font-display text-[var(--hotel-charcoal)] font-light mb-3 hover:text-[var(--hotel-terracotta)] transition-colors" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 1.15 }}>
                          {room.name}
                        </h3>
                      </Link>
                      <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed mb-6 max-w-md" style={isEven ? {} : { marginLeft: "auto" }}>
                        {room.description}
                      </p>

                      {/* Meta */}
                      <div className={`flex gap-6 mb-8 ${isEven ? "" : "md:justify-end"}`}>
                        {[room.bed, room.guests, room.sqft].map((meta) => (
                          <span key={meta} className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/90">{meta}</span>
                        ))}
                      </div>

                      {/* Price + CTA */}
                      <div className={`flex items-center gap-6 ${isEven ? "" : "md:flex-row-reverse"}`}>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-3xl text-[var(--hotel-charcoal)] font-light">{room.price}</span>
                          <span className="font-body text-[11px] text-[var(--hotel-charcoal)]/90">/ night</span>
                        </div>
                        <Link
                          href={room.href}
                          className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--hotel-charcoal)]/90 border-b border-[var(--hotel-charcoal)]/30 pb-0.5 hover:text-[var(--hotel-terracotta)] hover:border-[var(--hotel-terracotta)] transition-colors"
                        >
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
            <Link
              href="/rooms"
              className="font-body text-[10px] tracking-[0.35em] uppercase bg-[#1a1a1a] text-white/90 px-8 py-3 hover:bg-[var(--hotel-gold)] hover:text-[var(--hotel-charcoal)] transition-all duration-300"
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-[var(--hotel-sand)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-3">
                At The Andreas
              </p>
              <h2 className="font-display text-[var(--hotel-charcoal)] font-light" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                Upcoming Events
              </h2>
              <div className="w-8 h-px bg-[var(--hotel-gold)] mt-4" />
            </div>
            <Link
              href="/events"
              className="hidden md:inline-block font-body text-[9px] tracking-[0.35em] uppercase text-[var(--hotel-charcoal)]/90 hover:text-[var(--hotel-charcoal)] transition-colors border-b border-[var(--hotel-charcoal)]/30 pb-0.5"
            >
              View All Events →
            </Link>
          </div>

          {/* Horizontal scroll */}
          <div className="scroll-x flex gap-6 pb-4">
            {events.map((ev) => (
              <div key={ev.title} className="flex-shrink-0 w-[260px] bg-white card-lift">
                <div
                  className="h-44 bg-cover bg-center"
                  style={{ backgroundImage: `url(${ev.img})` }}
                />
                <div className="p-5">
                  <div className="mb-3">
                    <span className="font-body text-[7px] tracking-[0.4em] uppercase bg-[var(--hotel-gold)]/20 text-[var(--hotel-terracotta)] px-2 py-0.5">
                      {ev.tag}
                    </span>
                  </div>
                  <p className="font-body text-[var(--hotel-charcoal)]/90 text-[9px] tracking-widest uppercase mb-1">{ev.date}</p>
                  <h3 className="font-display text-[var(--hotel-charcoal)] text-lg font-light mb-2">{ev.title}</h3>
                  <p className="font-body text-[var(--hotel-charcoal)]/90 text-xs leading-relaxed">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFERS ──────────────────────────────────────────────────────────── */}
      <section
        className="relative py-32 md:py-40 overflow-hidden"
        style={{
          backgroundImage: `url(${OFFERS_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-4">
              Offers
            </p>
            <h2 className="font-display text-white font-light leading-tight mb-2" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
              Seasonal Packages
            </h2>
            <div className="flex items-center justify-center mb-4">
              <img src="/andreas_logo_white.png" alt="Andreas Hotel & Spa" className="w-32 md:w-48 h-auto opacity-90" />
            </div>
            <div className="divider-gold" />
          </div>

          {/* 1 Night Stay */}
          <div className="mb-14">
            <h3 className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase text-center mb-8">
              &ldquo;1 Night Stay&rdquo; Packages
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "The Escape",
                  desc: "Includes the Andreas signature scrub, 50 min Deep Tissue, 50 minute Aroma Therapy massage, and the Vital C Facial.",
                  duration: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Mar 15 - Oct 15.",
                  price: "$630",
                },
                {
                  title: "The Rejuvenate",
                  desc: "Includes a 30 minute Mineral Soak, the Vital C Facial, Gentlemen&rsquo;s Facial and two 50 minute Therapeutic massages.",
                  duration: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Mar 15 - Oct 15.",
                  price: "$665",
                },
              ].map((offer) => (
                <div key={offer.title} className="border border-white/20 bg-black/75 px-8 py-8 hover:bg-black/85 hover:border-[var(--hotel-gold)]/40 transition-all duration-300 flex flex-col">
                  <h4 className="font-display text-white text-2xl font-light mb-3">{offer.title}</h4>
                  <p className="font-body text-white/70 text-sm leading-relaxed mb-2">{offer.desc}</p>
                  <p className="font-body text-[var(--hotel-gold)]/80 text-xs italic mb-5">{offer.duration}</p>
                  <div className="mt-auto flex items-end justify-between">
                    <span className="font-display text-white text-3xl font-light">{offer.price}</span>
                    <a
                      href="/#contact"
                      className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[9px] tracking-[0.3em] uppercase px-5 py-2 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2 Night Stay */}
          <div className="mb-12">
            <h3 className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase text-center mb-8">
              &ldquo;2 Night Stay&rdquo; Packages
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "The Oasis",
                  desc: "Includes: The Andreas Signature Scrub, the Canyon Clay Body Mask, a 50 minute Swedish massage, and a 50 Minute Aromatherapy massage.",
                  duration: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Mar 15 - Oct 15.",
                  price: "$745",
                },
                {
                  title: "The Andreas Renewal",
                  desc: "Includes: 30 min. Mineral Soak, Ageless Facial, and Rosemary Mint Scrub; 50 min. Deep Tissue &amp; therapeutic massage.",
                  duration: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Mar 15 - Oct 15.",
                  price: "$795",
                },
              ].map((offer) => (
                <div key={offer.title} className="border border-white/20 bg-black/75 px-8 py-8 hover:bg-black/85 hover:border-[var(--hotel-gold)]/40 transition-all duration-300 flex flex-col">
                  <h4 className="font-display text-white text-2xl font-light mb-3">{offer.title}</h4>
                  <p className="font-body text-white/70 text-sm leading-relaxed mb-2">{offer.desc}</p>
                  <p className="font-body text-[var(--hotel-gold)]/80 text-xs italic mb-5">{offer.duration}</p>
                  <div className="mt-auto flex items-end justify-between">
                    <span className="font-display text-white text-3xl font-light">{offer.price}</span>
                    <a
                      href="/#contact"
                      className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[9px] tracking-[0.3em] uppercase px-5 py-2 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="font-body text-white/50 text-[10px] tracking-widest text-center uppercase mb-8">
            ✦ Call (760) 327-5701 for custom packages ✦
          </p>

          <div className="text-center">
            <Link
              href="/offers"
              className="font-body text-[10px] tracking-[0.35em] uppercase bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] px-8 py-3 hover:bg-white transition-all duration-300"
            >
              View All Packages
            </Link>
          </div>
        </div>
      </section>

      {/* ── AMENITIES ───────────────────────────────────────────────────────── */}
      <section id="amenities" className="py-24 md:py-32 bg-[var(--hotel-forest)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-14">
            <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-3">What We Offer</p>
            <h2 className="font-display text-white/90 font-light" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              Hotel Amenities
            </h2>
            <div className="w-8 h-px bg-[var(--hotel-gold)] mt-4" />
          </div>

          <div className="grid md:grid-cols-[1fr_1fr_380px] gap-8">
            {/* Amenity cards */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {amenities.map((a) => (
                <div key={a.title} className="border border-[var(--hotel-cream)]/10 p-6 hover:border-[var(--hotel-gold)]/40 transition-colors duration-300">
                  <span className="text-[var(--hotel-gold)] text-xl block mb-4">{a.icon}</span>
                  <h3 className="font-display text-white/90 text-lg font-light mb-2">{a.title}</h3>
                  <p className="font-body text-white/80 text-xs leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>

            {/* Right stacked images + CTA */}
            <div className="flex flex-col gap-4">
              <div
                className="flex-1 min-h-[180px] bg-cover bg-center"
                style={{ backgroundImage: `url(${AMENITIES_POOL})` }}
              />
              <div
                className="flex-1 min-h-[180px] bg-cover bg-center"
                style={{ backgroundImage: `url(${AMENITIES_SPA})` }}
              />
              <div className="bg-[var(--hotel-terracotta)] p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-white text-lg font-light leading-tight">Ready to Experience It?</p>
                  <p className="font-body text-white/70 text-[10px] tracking-widest uppercase mt-1">All amenities included</p>
                </div>
                <a
                  href="/book"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 bg-white text-[var(--hotel-charcoal)] font-body text-[9px] tracking-[0.3em] uppercase px-4 py-2 hover:bg-[var(--hotel-cream)] transition-colors duration-300"
                >
                  Reserve Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────────────────────── */}
      <section id="gallery" className="py-24 bg-[var(--hotel-cream)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-3">Visual Journey</p>
            <h2 className="font-display text-[var(--hotel-charcoal)] font-light" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              Our Gallery
            </h2>
            <div className="divider-gold" />
          </div>

          <div className="masonry-grid">
            {galleryImages.map((img, i) => (
              <div
                key={img.src}
                className="overflow-hidden group cursor-pointer"
                style={{ borderRadius: 0 }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── AWARDS & SOCIALS ────────────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] border-t border-[var(--hotel-gold)]/20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Awards */}
            <div className="text-center md:text-left">
              <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-5">
                Our Awards & Recognition
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                <a
                  href="https://www.tripadvisor.com/Hotel_Review-g32847-d529370-Reviews-Andreas_Hotel_Spa-Palm_Springs_Greater_Palm_Springs_California.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:opacity-80 transition-opacity"
                >
                  <img
                    src="/hotel-photos/tripadvisor-award.png"
                    alt="TripAdvisor Award"
                    className="h-16 md:h-20 w-auto"
                  />
                </a>
                <span className="font-body text-white/50 text-[9px] tracking-[0.3em] uppercase">
                  Expedia · Booking.com · Yelp
                </span>
              </div>
            </div>

            {/* Socials */}
            <div className="text-center md:text-right">
              <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-5">
                Follow Us
              </p>
              <div className="flex items-center justify-center md:justify-end gap-5">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/andreashotelandspa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--hotel-gold)] hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/andreashotelandspa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--hotel-gold)] hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>

                {/* TripAdvisor */}
                <a
                  href="https://www.tripadvisor.com/Hotel_Review-g32847-d529370-Reviews-Andreas_Hotel_Spa-Palm_Springs_Greater_Palm_Springs_California.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--hotel-gold)] hover:text-white transition-colors"
                  aria-label="TripAdvisor"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <ellipse cx="12" cy="12" rx="4" ry="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                  </svg>
                </a>

                {/* Yelp */}
                <a
                  href="https://www.yelp.com/biz/andreas-hotel-and-spa-palm-springs-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--hotel-gold)] hover:text-white transition-colors"
                  aria-label="Yelp"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v-2.5c0-.55.45-1 1-1h1.5c4.69 0 8.5-3.81 8.5-8.5S17.69 2 13 2h-1.5z"/>
                    <path d="M7.5 13l1.5-4.5 1.5 4.5"/>
                    <path d="M9.6 11h2.8"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CONTACT US ────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 md:py-32 bg-[var(--hotel-cream)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-block px-8 py-8 mb-8"
              style={{
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.6em] uppercase mb-4">Get in Touch</p>
              <h2 className="font-display text-white font-light mb-4" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                Your Desert Escape Awaits
              </h2>
              <p className="font-body text-white/90 text-sm tracking-widest">
                We'd love to hear from you — our team is ready to help
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-16">
            {/* Form — 3/5 width */}
            <div className="md:col-span-3">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body text-[var(--hotel-charcoal)] text-xs tracking-[0.2em] uppercase mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white dark:bg-[#2a2620] border border-[var(--hotel-sand)] dark:border-[#3a3530] px-4 py-3 font-body text-[var(--hotel-charcoal)] placeholder:text-[var(--hotel-charcoal)]/30 focus:outline-none focus:border-[var(--hotel-gold)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[var(--hotel-charcoal)] text-xs tracking-[0.2em] uppercase mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Your email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white dark:bg-[#2a2620] border border-[var(--hotel-sand)] dark:border-[#3a3530] px-4 py-3 font-body text-[var(--hotel-charcoal)] placeholder:text-[var(--hotel-charcoal)]/30 focus:outline-none focus:border-[var(--hotel-gold)] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-body text-[var(--hotel-charcoal)] text-xs tracking-[0.2em] uppercase mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Your phone number"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-white dark:bg-[#2a2620] border border-[var(--hotel-sand)] dark:border-[#3a3530] px-4 py-3 font-body text-[var(--hotel-charcoal)] placeholder:text-[var(--hotel-charcoal)]/30 focus:outline-none focus:border-[var(--hotel-gold)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body text-[var(--hotel-charcoal)] text-xs tracking-[0.2em] uppercase mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-white dark:bg-[#2a2620] border border-[var(--hotel-sand)] dark:border-[#3a3530] px-4 py-3 font-body text-[var(--hotel-charcoal)] placeholder:text-[var(--hotel-charcoal)]/30 focus:outline-none focus:border-[var(--hotel-gold)] transition-colors resize-none"
                  />
                </div>
                {contactError && (
                  <p className="text-red-600 font-body text-xs">{contactError}</p>
                )}
                <button
                  type="submit"
                  disabled={contactStatus === "sending"}
                  className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[10px] tracking-[0.35em] uppercase px-10 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300 disabled:opacity-50"
                >
                  {contactStatus === "sending" ? "Sending..." : contactStatus === "sent" ? "✓ Message Sent" : "Send Message"}
                </button>
                {contactStatus === "sent" && (
                  <p className="text-green-700 font-body text-xs">Thank you! We'll get back to you shortly.</p>
                )}
              </form>

              {/* Group Events CTA */}
              <div className="mt-12 pt-10 border-t border-[var(--hotel-sand)]">
                <a
                  href="/group-booking"
                  className="block w-full text-center bg-[var(--hotel-terracotta)] text-white font-body text-[11px] tracking-[0.3em] uppercase py-4 px-8 hover:bg-[#1a1a1a] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Plan a Group Event → 
                </a>
                <p className="font-body text-[var(--hotel-charcoal)]/90 text-[11px] mt-3 text-center leading-relaxed">
                  Weddings, corporate retreats, wellness getaways — our team crafts bespoke group experiences at Palm Springs' most intimate boutique hotel.
                </p>
              </div>
            </div>

            {/* Contact Info — 2/5 width */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.3em] uppercase mb-3">
                  Address
                </p>
                <p className="font-body text-[var(--hotel-charcoal)]/90 leading-relaxed">
                  277 N. Indian Canyon Drive<br />
                  Palm Springs, CA 92262
                </p>
              </div>
              <div>
                <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.3em] uppercase mb-3">
                  Phone
                </p>
                <a
                  href="tel:+17603250900"
                  className="font-body text-[var(--hotel-charcoal)]/90 hover:text-[var(--hotel-terracotta)] transition-colors"
                >
                  (760) 325-0900
                </a>
              </div>
              <div>
                <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.3em] uppercase mb-3">
                  Email
                </p>
                <a
                  href="mailto:stay@andreashotel.com"
                  className="font-body text-[var(--hotel-charcoal)]/90 hover:text-[var(--hotel-terracotta)] transition-colors break-all"
                >
                  stay@andreashotel.com
                </a>
              </div>
              <div>
                <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.3em] uppercase mb-3">
                  Front Desk
                </p>
                <p className="font-body text-[var(--hotel-charcoal)]/90">
                  Open 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-16">
            <a
              href="/book"
              rel="noopener noreferrer"
              className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[10px] tracking-[0.35em] uppercase px-10 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
            >
              Book Your Stay
            </a>
            <a
              href="tel:+176****0900"
              className="bg-[#1a1a1a] text-white/90 font-body text-[10px] tracking-[0.35em] uppercase px-10 py-3 hover:bg-black hover:text-white transition-all duration-300"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
