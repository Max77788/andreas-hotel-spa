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
              <p>277 N. Indian Canyon Drive</p>
              <p>Palm Springs, CA 92262</p>
              <a href="tel:8883275701" className="block hover:text-[var(--hotel-gold)] transition-colors">
                888-327-5701
              </a>
              <a href="tel:7605275701" className="block hover:text-[var(--hotel-gold)] transition-colors">
                760-527-5701
              </a>
              <a
                href="mailto:stay@andreashotel.com"
                className="block hover:text-[var(--hotel-gold)] transition-colors"
              >
                stay@andreashotel.com
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
