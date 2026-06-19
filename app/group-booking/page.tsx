"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const packageTypes = [
  { value: "wedding", label: "Wedding Package", desc: "Full hotel buyout or partial booking with courtyard ceremony, spa services, and catering" },
  { value: "corporate", label: "Corporate Retreat", desc: "Team offsites with meeting spaces, poolside breaks, and group spa access" },
  { value: "wellness", label: "Wellness Retreat", desc: "Yoga, spa treatments, healthy catering, and desert tranquility for your group" },
  { value: "private-party", label: "Private Party", desc: "Birthdays, anniversaries, and celebrations with poolside or courtyard setup" },
  { value: "photo-shoot", label: "Photo / Film Shoot", desc: "Iconic mid-century backdrop for editorial, commercial, or film productions" },
  { value: "buyout", label: "Full Hotel Buyout", desc: "Exclusive use of all 25 rooms, spa, pool, and courtyard for your event" },
  { value: "other", label: "Custom Package", desc: "Tell us what you need and we'll craft a bespoke experience" },
];

export default function GroupBookingPage() {
  const [form, setForm] = useState({
    organization: "",
    contactName: "",
    email: "",
    phone: "",
    eventType: "",
    guestCount: "",
    budget: "",
    preferredDates: "",
    requirements: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.contactName || !form.email) {
      setError("Name and email are required.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/rfp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Submission failed");
      setStatus("sent");
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const bg = "bg-[#f5f0e8]";

  return (
    <>
      <Nav />
      <main className={`min-h-screen pt-32 pb-24 ${bg}`}>
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="font-body text-[#b8743d] text-[10px] tracking-[0.5em] uppercase mb-3">
              Groups & Events
            </p>
            <h1 className="font-display text-[#2a2118] font-light" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              Plan Your Event
            </h1>
            <div className="mx-auto mt-4 w-12 h-[1px] bg-[#c9a96e]" />
            <p className="font-body text-[#2a2118]/60 mt-6 max-w-lg mx-auto leading-relaxed text-sm">
              From intimate weddings to corporate retreats, our team crafts bespoke experiences at Palm Springs' most charming boutique hotel. Fill out the form below and we'll respond within 24 hours.
            </p>
          </div>

          {/* Package cards */}
          <div className="grid sm:grid-cols-2 gap-3 mb-14">
            {packageTypes.map((pkg) => (
              <button
                key={pkg.value}
                onClick={() => update("eventType", pkg.value)}
                className={`text-left p-4 border transition-all duration-200 ${
                  form.eventType === pkg.value
                    ? "border-[#b8743d] bg-[#b8743d]/5 shadow-sm"
                    : "border-[#d4c9b5] bg-white hover:border-[#c9a96e]"
                }`}
              >
                <span className="block font-body text-[#2a2118] text-xs tracking-[0.15em] uppercase font-semibold mb-1">
                  {pkg.label}
                </span>
                <span className="block font-body text-[#2a2118]/50 text-[11px] leading-relaxed">
                  {pkg.desc}
                </span>
              </button>
            ))}
          </div>

          {/* RFP Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-12 border border-[#d4c9b5]">
            <h2 className="font-display text-[#2a2118] text-2xl font-light mb-2">
              Request for Proposal
            </h2>
            <p className="font-body text-[#2a2118]/50 text-xs mb-6">
              All fields marked with * are required
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-[#2a2118] text-xs tracking-[0.2em] uppercase mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  placeholder="Company or group name"
                  value={form.organization}
                  onChange={(e) => update("organization", e.target.value)}
                  className="w-full border border-[#d4c9b5] px-4 py-3 font-body text-[#2a2118] placeholder:text-[#2a2118]/30 focus:outline-none focus:border-[#c9a96e] transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-[#2a2118] text-xs tracking-[0.2em] uppercase mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.contactName}
                  onChange={(e) => update("contactName", e.target.value)}
                  className="w-full border border-[#d4c9b5] px-4 py-3 font-body text-[#2a2118] placeholder:text-[#2a2118]/30 focus:outline-none focus:border-[#c9a96e] transition-colors"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-[#2a2118] text-xs tracking-[0.2em] uppercase mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full border border-[#d4c9b5] px-4 py-3 font-body text-[#2a2118] placeholder:text-[#2a2118]/30 focus:outline-none focus:border-[#c9a96e] transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-[#2a2118] text-xs tracking-[0.2em] uppercase mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="Your phone number"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full border border-[#d4c9b5] px-4 py-3 font-body text-[#2a2118] placeholder:text-[#2a2118]/30 focus:outline-none focus:border-[#c9a96e] transition-colors"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <label className="block font-body text-[#2a2118] text-xs tracking-[0.2em] uppercase mb-2">
                  Guest Count
                </label>
                <input
                  type="text"
                  placeholder="e.g. 20-30"
                  value={form.guestCount}
                  onChange={(e) => update("guestCount", e.target.value)}
                  className="w-full border border-[#d4c9b5] px-4 py-3 font-body text-[#2a2118] placeholder:text-[#2a2118]/30 focus:outline-none focus:border-[#c9a96e] transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-[#2a2118] text-xs tracking-[0.2em] uppercase mb-2">
                  Budget Range
                </label>
                <input
                  type="text"
                  placeholder="e.g. $5,000-10,000"
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                  className="w-full border border-[#d4c9b5] px-4 py-3 font-body text-[#2a2118] placeholder:text-[#2a2118]/30 focus:outline-none focus:border-[#c9a96e] transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-[#2a2118] text-xs tracking-[0.2em] uppercase mb-2">
                  Preferred Dates
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oct 15-17, 2026"
                  value={form.preferredDates}
                  onChange={(e) => update("preferredDates", e.target.value)}
                  className="w-full border border-[#d4c9b5] px-4 py-3 font-body text-[#2a2118] placeholder:text-[#2a2118]/30 focus:outline-none focus:border-[#c9a96e] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-[#2a2118] text-xs tracking-[0.2em] uppercase mb-2">
                Special Requirements
              </label>
              <textarea
                rows={5}
                placeholder="Tell us about your event - room blocks, spa services, catering, AV needs..."
                value={form.requirements}
                onChange={(e) => update("requirements", e.target.value)}
                className="w-full border border-[#d4c9b5] px-4 py-3 font-body text-[#2a2118] placeholder:text-[#2a2118]/30 focus:outline-none focus:border-[#c9a96e] transition-colors resize-none"
              />
            </div>

            {error && (
              <p className="text-red-600 font-body text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-[#b8743d] text-white font-body text-[11px] tracking-[0.3em] uppercase py-4 hover:bg-[#2a2118] transition-all duration-300 disabled:opacity-50"
            >
              {status === "sending" ? "Submitting..." : status === "sent" ? "✓ RFP Submitted" : "Submit RFP"}
            </button>

            {status === "sent" && (
              <div className="text-center p-6 bg-green-50 border border-green-200">
                <p className="font-body text-green-800 text-sm">
                  Thank you! Your RFP has been received. Our events team will respond within 24 hours.
                </p>
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
