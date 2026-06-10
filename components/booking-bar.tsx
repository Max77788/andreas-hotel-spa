"use client";

import { useState } from "react";

export default function BookingBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  return (
    <section className="bg-[var(--hotel-charcoal)] px-6 md:px-10 py-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="block font-body text-[9px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-1">Check In</label>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white font-body text-sm py-2 focus:outline-none focus:border-[var(--hotel-gold)] transition-colors" />
        </div>
        <div className="flex-1 w-full">
          <label className="block font-body text-[9px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-1">Check Out</label>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent border-b border-white/20 text-white font-body text-sm py-2 focus:outline-none focus:border-[var(--hotel-gold)] transition-colors" />
        </div>
        <a href="/book" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto flex-shrink-0 bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[10px] tracking-[0.3em] uppercase px-8 py-3 text-center hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300">
          Check Availability
        </a>
      </div>
    </section>
  );
}
