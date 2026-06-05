"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import VapiChatSection from "@/components/vapi-chat-section";

// ── Images ────────────────────────────────────────────────────────────────────

const STORY_IMG = "/hotel-photos/courtyard.jpg";
const PHILOSOPHY_IMG = "/hotel-photos/courtyard.jpg";

const OFFERS_BG = "/hotel-photos/pool-night.jpg";
const AMENITIES_POOL = "/hotel-photos/pool-night.jpg";
const AMENITIES_SPA = "/hotel-photos/amenities.jpg";

// ── Data ──────────────────────────────────────────────────────────────────────
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

const rooms = [
  {
    badge: "VILLA",
    name: "Andreas Villa Suite",
    href: "/rooms/andreas-villa-suite",
    img: "/hotel-photos/exterior.jpg",
    description: "Our most prestigious suite featuring Italian Villa design with panoramic desert views and private courtyard.",
    bed: "King Bed",
    guests: "4 Guests",
    sqft: "750 sq ft",
    price: "$599",
  },
  {
    badge: "SUITE",
    name: "1 Bedroom Suite",
    href: "/rooms/1-bedroom-suite",
    img: "/hotel-photos/amenities.jpg",
    description: "Spacious suite with pillow-topped king bed, separate living area, and luxurious Italian-inspired furnishings.",
    bed: "King Bed",
    guests: "2 Guests",
    sqft: "520 sq ft",
    price: "$389",
  },
  {
    badge: "DELUXE",
    name: "Deluxe Room",
    href: "/rooms/deluxe-room",
    img: "/hotel-photos/room6.jpg",
    description: "Beautifully appointed with marble bathrooms, luxury linens, and warm desert-inspired décor.",
    bed: "Queen Bed",
    guests: "2 Guests",
    sqft: "340 sq ft",
    price: "$219",
  },
];

const events = [
  {
    tag: "WELLNESS",
    date: "APR 12, 2026",
    title: "Desert Sunrise Yoga",
    description: "Begin your morning with guided yoga on our rooftop terrace as the sun rises over the San Jacinto Mountains.",
    img: "/hotel-photos/room7.jpg",
  },
  {
    tag: "DINING",
    date: "APR 19, 2026",
    title: "Poolside Wine Evening",
    description: "Join our sommelier for an intimate poolside tasting of curated California wines and artisanal small bites.",
    img: "/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg",
  },
  {
    tag: "CULTURE",
    date: "MAY 3, 2026",
    title: "Architecture Walking Tour",
    description: "A curated tour of Palm Springs' iconic mid-century modern architecture and vibrant local art galleries.",
    img: "/hotel-photos/pool-night.jpg",
  },
  {
    tag: "SPA",
    date: "MAY 17, 2026",
    title: "Signature Spa Day",
    description: "A full-day spa retreat featuring our Vital-C Facial, Canyon Clay Body Wrap, and poolside relaxation package.",
    img: "/hotel-photos/room1.jpg",
  },
];

const amenities = [
  { icon: "◎", title: "Full-Service Spa", desc: "Indulge in Vital-C Facial, California Orange Blossom Scrub, and Canyon Clay Body Mask treatments by expert therapists." },
  { icon: "◈", title: "Outdoor Pool & Jacuzzi", desc: "Our heated pool and Jacuzzi are surrounded by lush gardens and elegant poolside loungers — open daily." },
  { icon: "⊟", title: "Poolside Bar & Dining", desc: "Enjoy happy hour daily 4–6 PM with handcrafted cocktails, seasonal bites, and poolside service." },
  { icon: "◐", title: "Outdoor Fireplaces", desc: "Gather around beautifully designed gas fireplaces set within our manicured courtyard every evening." },
  { icon: "◌", title: "24-Hour Front Desk", desc: "Our attentive concierge team is available around the clock to assist with reservations, dining, and activities." },
  { icon: "⊡", title: "Express Check-In/Out", desc: "Seamless arrivals and departures — because your time in Palm Springs should start and end perfectly." },
];

const galleryImages = [
  { src: "/hotel-photos/andreas-villa-suite-andreas-hotel-palm-springs-bedroom1-1.jpg", alt: "Villa Suite" },
  { src: "/hotel-photos/pool-night.jpg", alt: "Sunset pool" },
  { src: "/hotel-photos/room1.jpg", alt: "Guest room" },
  { src: "/hotel-photos/pool-night.jpg", alt: "Pool area" },
  { src: "/hotel-photos/amenities.jpg", alt: "Spa treatment" },
  { src: "/hotel-photos/room6.jpg", alt: "Living area" },
  { src: "/hotel-photos/room7.jpg", alt: "Desert palms" },
  { src: "/hotel-photos/room7.jpg", alt: "Executive room" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        {/* Hotel exterior background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url(/hotel-photos/exterior.jpg)",
          }}
        />

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
            {/* White logo (visible on dark backgrounds / dark mode) */}
            <img
              src="/andreas_logo_white.png"
              alt="The Andreas Hotel & Spa"
              className="w-64 md:w-96 h-auto"
            />
            <div className="w-10 h-px bg-[var(--hotel-gold)] my-4" />
            <p className="font-body text-white/90 text-xs md:text-sm tracking-[0.4em] uppercase">
              A Sanctuary of Italian-Inspired Elegance
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://s005948.officialbookings.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black border border-black text-white font-body text-[10px] tracking-[0.3em] uppercase px-7 py-3 hover:bg-white hover:text-[var(--hotel-charcoal)] hover:border-white transition-all duration-300"
            >
              Explore Rooms
            </a>
            <a
              href="https://s005948.officialbookings.com/"
              target="_blank"
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
                <span className="font-body text-[var(--hotel-charcoal)]/50 text-[9px] tracking-[0.3em] uppercase">{s.label}</span>
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
            href="https://s005948.officialbookings.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto flex-shrink-0 bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[10px] tracking-[0.3em] uppercase px-8 py-3 text-center hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
          >
            Check Availability
          </a>
        </div>
      </section>

      {/* ── OUR STORY ───────────────────────────────────────────────────────── */}
      <section id="story" className="py-24 md:py-32">
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
              <p className="font-body text-[var(--hotel-charcoal)]/65 text-sm leading-relaxed mb-4">
                The Andreas Hotel & Spa is located in the heart of historic downtown Palm Springs, a short stroll from the city's shopping, dining, gaming, and nightlife. Established in 1935, the boutique hotel upholds the timeless allure of its heritage while capturing contemporary features following a full renovation and re-opening.
              </p>
              <p className="font-body text-[var(--hotel-charcoal)]/65 text-sm leading-relaxed mb-10">
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
                    <div className="font-body text-[9px] tracking-[0.35em] uppercase text-[var(--hotel-charcoal)]/50 mt-1">{s.label}</div>
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
            <p className="font-body text-[var(--hotel-charcoal)]/65 text-sm leading-relaxed mb-4">
              At The Andreas, we believe that true luxury is found in the harmony of authentic experiences, thoughtful design, and genuine human connection. Every detail — from our organically sourced linens to our garden-fresh menus — reflects our commitment to a life beautifully lived.
            </p>
            <p className="font-body text-[var(--hotel-charcoal)]/65 text-sm leading-relaxed mb-10">
              Our Palm Springs sanctuary celebrates the natural world around us — the desert light, the bloom of bougainvillea, the stillness of warm evenings — inviting each guest to slow down, breathe deeply, and arrive fully.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-[var(--hotel-sand)]/60 pt-8">
              {[
                { num: "90+", label: "Years of Hospitality" },
                { num: "100%", label: "Organic Spa Products" },
                { num: "5★", label: "Rated Experience" },
              ].map((s) => (
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
      <section className="py-24 md:py-32 bg-[var(--hotel-cream)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-3">Accommodations</p>
            <h2 className="font-display text-[var(--hotel-charcoal)] font-light" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
              Rooms &amp; Suites
            </h2>
            <div className="divider-gold" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.name} className="card-lift bg-white group">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${room.img})` }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="font-body text-[8px] tracking-[0.35em] uppercase bg-[var(--hotel-charcoal)] text-[var(--hotel-gold)] px-3 py-1">
                      {room.badge}
                    </span>
                  </div>
                </div>
                {/* Card body */}
                <div className="p-6">
                  <h3 className="font-display text-[var(--hotel-charcoal)] text-xl font-light mb-2">{room.name}</h3>
                  <p className="font-body text-[var(--hotel-charcoal)]/60 text-xs leading-relaxed mb-4">{room.description}</p>
                  {/* Meta row */}
                  <div className="flex gap-4 border-t border-[var(--hotel-sand)] pt-4 mb-5">
                    {[room.bed, room.guests, room.sqft].map((meta) => (
                      <span key={meta} className="font-body text-[9px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/50">{meta}</span>
                    ))}
                  </div>
                  {/* Price + CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display text-2xl text-[var(--hotel-charcoal)] font-light">{room.price}</span>
                      <span className="font-body text-[10px] text-[var(--hotel-charcoal)]/50 ml-1">/ night</span>
                    </div>
                    <a
                      href="https://s005948.officialbookings.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-[9px] tracking-[0.3em] uppercase bg-[var(--hotel-terracotta)] text-white px-4 py-2 hover:bg-[var(--hotel-charcoal)] transition-all duration-300"
                    >
                      Book Now →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/rooms"
              className="font-body text-[10px] tracking-[0.35em] uppercase bg-[var(--hotel-charcoal)] text-[var(--hotel-cream)] px-8 py-3 hover:bg-[var(--hotel-gold)] hover:text-[var(--hotel-charcoal)] transition-all duration-300"
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
              className="hidden md:inline-block font-body text-[9px] tracking-[0.35em] uppercase text-[var(--hotel-charcoal)]/60 hover:text-[var(--hotel-charcoal)] transition-colors border-b border-[var(--hotel-charcoal)]/30 pb-0.5"
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
                  <p className="font-body text-[var(--hotel-charcoal)]/50 text-[9px] tracking-widest uppercase mb-1">{ev.date}</p>
                  <h3 className="font-display text-[var(--hotel-charcoal)] text-lg font-light mb-2">{ev.title}</h3>
                  <p className="font-body text-[var(--hotel-charcoal)]/60 text-xs leading-relaxed">{ev.description}</p>
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
            <h2 className="font-display text-[var(--hotel-cream)] font-light leading-tight" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
              Andreas Hotel &amp; Spa
            </h2>
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
                  desc: "Includes the Andreas signature scrub, 60 min Deep Tissue, 60 minute Aroma Therapy massage, and the Vital C Facial.",
                  duration: "4 hours of pure Heaven!",
                  price: "$525",
                },
                {
                  title: "The Rejuvenate",
                  desc: "Includes a 30 minute Mineral Soak, the Vital C Facial, Gentlemen&rsquo;s Facial and two 60 minute Therapeutic massages.",
                  duration: "4.5 hours of restful bliss!",
                  price: "$550",
                },
              ].map((offer) => (
                <div key={offer.title} className="border border-white/20 bg-black/75 px-8 py-8 hover:bg-black/85 hover:border-[var(--hotel-gold)]/40 transition-all duration-300 flex flex-col">
                  <h4 className="font-display text-[var(--hotel-cream)] text-2xl font-light mb-3">{offer.title}</h4>
                  <p className="font-body text-white/70 text-sm leading-relaxed mb-2">{offer.desc}</p>
                  <p className="font-body text-[var(--hotel-gold)]/80 text-xs italic mb-5">{offer.duration}</p>
                  <div className="mt-auto flex items-end justify-between">
                    <span className="font-display text-[var(--hotel-cream)] text-3xl font-light">{offer.price}</span>
                    <a
                      href="tel:+17603275701"
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
                  desc: "Includes: The Andreas Signature Scrub, the Canyon Clay Body Mask, a 60 minute Swedish massage, and a 60 Minute Aromatherapy massage.",
                  duration: "4 hours of pampering treatments!",
                  price: "$599",
                },
                {
                  title: "The Andreas Renewal",
                  desc: "Includes: 30 min. Mineral Soak, Enzyme Facial, and Botanical Body Wrap; 60 min. Deep Tissue &amp; therapeutic massage.",
                  duration: "4.5 hours of complete renewal!",
                  price: "$650",
                },
              ].map((offer) => (
                <div key={offer.title} className="border border-white/20 bg-black/75 px-8 py-8 hover:bg-black/85 hover:border-[var(--hotel-gold)]/40 transition-all duration-300 flex flex-col">
                  <h4 className="font-display text-[var(--hotel-cream)] text-2xl font-light mb-3">{offer.title}</h4>
                  <p className="font-body text-white/70 text-sm leading-relaxed mb-2">{offer.desc}</p>
                  <p className="font-body text-[var(--hotel-gold)]/80 text-xs italic mb-5">{offer.duration}</p>
                  <div className="mt-auto flex items-end justify-between">
                    <span className="font-display text-[var(--hotel-cream)] text-3xl font-light">{offer.price}</span>
                    <a
                      href="tel:+17603275701"
                      className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[9px] tracking-[0.3em] uppercase px-5 py-2 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="font-body text-white/20 text-[10px] tracking-widest text-center uppercase">
            ✦ Call (760) 327-5701 for custom packages ✦
          </p>
        </div>
      </section>

      {/* ── AMENITIES ───────────────────────────────────────────────────────── */}
      <section id="amenities" className="py-24 md:py-32 bg-[var(--hotel-forest)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-14">
            <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-3">What We Offer</p>
            <h2 className="font-display text-[var(--hotel-cream)] font-light" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
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
                  <h3 className="font-display text-[var(--hotel-cream)] text-lg font-light mb-2">{a.title}</h3>
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
                  href="https://s005948.officialbookings.com/"
                  target="_blank"
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

      {/* ── CTA BANNER ──────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="relative py-28 md:py-36 overflow-hidden"
        style={{
          backgroundImage: `url(/hotel-photos/pool-night.jpg
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[var(--hotel-cream)]/85" />
        <div className="relative text-center px-6">
          <p className="font-body text-[var(--hotel-charcoal)] text-[10px] tracking-[0.6em] uppercase mb-4">Now</p>
          <h2 className="font-display text-[var(--hotel-charcoal)] font-light mb-4" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            Your Desert Escape Awaits
          </h2>
          <p className="font-body text-[var(--hotel-charcoal)]/70 text-sm tracking-widest mb-2">
            {/* Contact us at +1 (747) 494-9881 ·  */}stay@andreashotel.com
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <a
              href="https://s005948.officialbookings.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[10px] tracking-[0.35em] uppercase px-10 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
            >
              Book Your Stay
            </a>
            <a
              href="tel:+17474949881"
              className="bg-[var(--hotel-charcoal)] text-[var(--hotel-cream)] font-body text-[10px] tracking-[0.35em] uppercase px-10 py-3 hover:bg-black hover:text-white transition-all duration-300"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* ── AI CONCIERGE ─────────────────────────────────────────────────── */}
      {/* <VapiChatSection /> */}

      <Footer />
    </main>
  );
}
