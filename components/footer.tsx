"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const footerLinks = [
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "The Spa", href: "/spa" },
  { label: "Special Events", href: "/events" },
  { label: "Seasonal Offers", href: "/offers" },
];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { db: { schema: "andreas_website" } });
}

export default function Footer() {
  const [fullAddress, setFullAddress] = useState(
    "277 N. Indian Canyon Drive, Palm Springs, CA 92262"
  );
  const [phone1] = useState("888-327-5701");
  const [phone2] = useState("760-527-5701");
  const [email, setEmail] = useState("stay@andreashotel.com");

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    supabase
      .from("site_settings")
      .select("address, phone, email")
      .single()
      .then(({ data }) => {
        if (data) {
          if (data.address) setFullAddress(data.address);
          if (data.email) setEmail(data.email);
        }
      })
      .catch((err) => console.error("Footer CMS fetch failed:", err));
  }, []);

  const addrParts = fullAddress.split(",").map((s: string) => s.trim());
  const address = addrParts[0] || fullAddress;
  const city = addrParts.length > 1 ? addrParts.slice(1).join(", ") : "";

  return (
    <footer className="bg-[#1a1a1a] text-[var(--hotel-cream)] dark:text-[#e8ddd0]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-[var(--hotel-cream)]/10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <img
                src="/andreas_logo_white.png"
                alt="The Andreas Hotel & Spa"
                className="h-9 md:h-10 w-auto block dark:hidden"
              />
              <img
                src="/andreas_logo.png"
                alt="The Andreas Hotel & Spa"
                className="h-9 md:h-10 w-auto hidden dark:block"
              />
            </Link>
            <div className="font-body text-[var(--hotel-cream)] dark:text-[#e8ddd0] text-[10px] tracking-[0.5em] uppercase mb-5">
              Hotel & Spa · Palm Springs
            </div>
            <p className="font-body text-sm text-[var(--hotel-cream)]/70 dark:text-[#e8ddd0]/70 leading-relaxed max-w-xs">
              Originally built in 1935, the Andreas is a landmark hotel in the heart of downtown Palm Springs.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                      href={link.href}
                      className="font-body text-sm text-[var(--hotel-cream)]/80 hover:text-[var(--hotel-gold)] transition-colors tracking-wide"
                    >
                      {link.label}
                    </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-5">
              Contact
            </h4>
            <div className="space-y-3 font-body text-sm text-[var(--hotel-cream)]/80 dark:text-[#e8ddd0]/80">
              <p>{address}</p>
              {city && <p>{city}</p>}
              <a href={`tel:${phone1.replace(/\D/g, "")}`} className="block hover:text-[var(--hotel-gold)] transition-colors">
                {phone1}
              </a>
              <a href={`tel:${phone2.replace(/\D/g, "")}`} className="block hover:text-[var(--hotel-gold)] transition-colors">
                {phone2}
              </a>
              <a
                href={`mailto:${email}`}
                className="block hover:text-[var(--hotel-gold)] transition-colors"
              >
                {email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4">
          <p className="font-body text-xs text-[var(--hotel-cream)]/50 dark:text-[#e8ddd0]/50 tracking-widest">
            &copy; {new Date().getFullYear()} The Andreas Hotel & Spa. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/policies" className="font-body text-xs text-[var(--hotel-cream)]/50 dark:text-[#e8ddd0]/50 hover:text-[var(--hotel-cream)]/80 dark:hover:text-[#e8ddd0]/80 transition-colors">
              Hotel Policies
            </Link>
            <Link href="/privacy" className="font-body text-xs text-[var(--hotel-cream)]/50 dark:text-[#e8ddd0]/50 hover:text-[var(--hotel-cream)]/80 dark:hover:text-[#e8ddd0]/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-body text-xs text-[var(--hotel-cream)]/50 dark:text-[#e8ddd0]/50 hover:text-[var(--hotel-cream)]/80 dark:hover:text-[#e8ddd0]/80 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
