import Link from "next/link";

const footerLinks = [
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "The Spa", href: "/spa" },
  { label: "Special Events", href: "/events" },
  { label: "Seasonal Offers", href: "/offers" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--hotel-charcoal)] text-[var(--hotel-cream)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="font-display text-3xl font-light tracking-[0.2em] uppercase mb-1">
              Andreas
            </div>
            <div className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-5">
              Hotel & Spa · Palm Springs
            </div>
            <p className="font-body text-sm text-white/50 leading-relaxed max-w-xs">
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
                    className="font-body text-sm text-white/60 hover:text-[var(--hotel-cream)] transition-colors tracking-wide"
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
            <div className="space-y-3 font-body text-sm text-white/60">
              <p>277 N. Indian Canyon Drive</p>
              <p>Palm Springs, CA 92262</p>
              <a href="tel:8883275701" className="block hover:text-[var(--hotel-cream)] transition-colors">
                888-327-5701
              </a>
              <a href="tel:7605275701" className="block hover:text-[var(--hotel-cream)] transition-colors">
                760-527-5701
              </a>
              <a
                href="mailto:stay@andreashotel.com"
                className="block hover:text-[var(--hotel-cream)] transition-colors"
              >
                stay@andreashotel.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4">
          <p className="font-body text-xs text-white/30 tracking-widest">
            © {new Date().getFullYear()} The Andreas Hotel & Spa. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="font-body text-xs text-white/30 hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-body text-xs text-white/30 hover:text-white/60 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
