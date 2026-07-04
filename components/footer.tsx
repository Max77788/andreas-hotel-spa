import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

const footerLinks = [
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "The Spa", href: "/spa" },
  { label: "Special Events", href: "/events" },
  { label: "Seasonal Offers", href: "/offers" },
];

export default async function Footer() {
  let address = "277 N. Indian Canyon Drive";
  let city = "Palm Springs, CA 92262";
  let phone1 = "888-327-5701";
  let phone2 = "760-527-5701";
  let email = "stay@andreashotel.com";

  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("site_settings").select("*").single();
    if (data) {
      const fullAddr = data.address || "";
      // Parse "277 N. Indian Canyon Drive, Palm Springs, CA" into street + city
      const parts = fullAddr.split(",").map((s: string) => s.trim());
      address = parts[0] || address;
      city = parts.slice(1).join(", ") || city;
      phone1 = data.phone || phone1;
      email = data.email || email;
    }
  } catch (err) {
    console.error("Footer CMS fetch failed:", err);
  }
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
            <div className="font-body text-[var(--hotel-cream)] text-[10px] tracking-[0.5em] uppercase mb-5">
              Hotel & Spa · Palm Springs
            </div>
            <p className="font-body text-sm text-[var(--hotel-cream)]/70 leading-relaxed max-w-xs">
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
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-[var(--hotel-cream)]/80 hover:text-[var(--hotel-gold)] transition-colors tracking-wide"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="font-body text-sm text-[var(--hotel-cream)]/80 hover:text-[var(--hotel-gold)] transition-colors tracking-wide"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-5">
              Contact
            </h4>
            <div className="space-y-3 font-body text-sm text-[var(--hotel-cream)]/80">
              <p>{address}</p>
              <p>{city}</p>
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
          <p className="font-body text-xs text-[var(--hotel-cream)]/50 tracking-widest">
            © {new Date().getFullYear()} The Andreas Hotel & Spa. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/policies" className="font-body text-xs text-[var(--hotel-cream)]/50 hover:text-[var(--hotel-cream)]/80 transition-colors">
              Hotel Policies
            </Link>
            <Link href="/privacy" className="font-body text-xs text-[var(--hotel-cream)]/50 hover:text-[var(--hotel-cream)]/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-body text-xs text-[var(--hotel-cream)]/50 hover:text-[var(--hotel-cream)]/80 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
