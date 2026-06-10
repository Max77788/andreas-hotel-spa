"use client";

import { useState } from "react";

const sections = [
  { name: "Rooms", href: "/admin/rooms", desc: "Edit room details, photos, amenities, pricing" },
  { name: "Policies", href: "/admin/policies", desc: "Manage hotel policies and cancellation" },
  { name: "Offers", href: "/admin/offers", desc: "Seasonal packages and inclusions" },
  { name: "Events", href: "/admin/events", desc: "Upcoming events and activities" },
  { name: "Gallery", href: "/admin/gallery", desc: "Upload and organize site photos" },
  { name: "Settings", href: "/admin/settings", desc: "Hotel name, phone, address, logos" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[var(--hotel-cream)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl text-[var(--hotel-charcoal)] font-light">CMS Dashboard</h1>
            <p className="font-body text-sm text-[var(--hotel-charcoal)]/70 mt-1">Andreas Hotel & Spa</p>
          </div>
          <a
            href="/"
            target="_blank"
            className="font-body text-sm text-[var(--hotel-charcoal)]/80 hover:text-[var(--hotel-terracotta)] transition-colors font-semibold"
          >
            View Site →
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {sections.map((s) => (
            <a
              key={s.name}
              href={s.href}
              className="block bg-white p-6 hover:shadow-md transition-shadow border-2 border-gray-200 hover:border-[var(--hotel-gold)]"
            >
              <h2 className="font-display text-xl text-[var(--hotel-charcoal)] font-medium mb-1">
                {s.name}
              </h2>
              <p className="font-body text-sm text-[var(--hotel-charcoal)]/70">{s.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
