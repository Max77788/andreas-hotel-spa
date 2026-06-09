import Link from "next/link";

export const metadata = {
  title: "Book a Room – The Andreas Hotel & Spa",
  description:
    "Secure your stay at The Andreas Hotel & Spa. Book directly through our reservation system.",
};

export default function BookPage() {
  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Branding bar */}
      <div className="bg-[var(--hotel-charcoal)] shrink-0">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <Link
            href="/"
            className="font-body text-[var(--hotel-cream)]/70 hover:text-[var(--hotel-gold)] text-[10px] tracking-[0.25em] uppercase transition-colors"
          >
            ← Back to Site
          </Link>
          <Link href="/" className="flex flex-col items-end">
            <img
              src="/andreas_logo_white.png"
              alt="The Andreas Hotel & Spa"
              className="h-8 md:h-10 w-auto"
            />
            <span className="font-body text-[8px] tracking-[0.35em] text-[var(--hotel-gold)] uppercase -mt-1">
              Palm Springs
            </span>
          </Link>
        </div>
        {/* Gold accent line */}
        <div className="h-[2px] bg-gradient-to-r from-[var(--hotel-gold)] via-[var(--hotel-terracotta)] to-[var(--hotel-gold)]" />
        {/* Tagline */}
        <div className="text-center py-2 bg-black/30">
          <p className="font-body text-white/90 text-[11px] tracking-[0.2em] uppercase">
            Book Direct — Best Rates Guaranteed
          </p>
        </div>
      </div>
      {/* Booking iframe fills the rest */}
      <iframe
        src="/api/book-proxy"
        className="flex-1 w-full border-0"
        title="Book a room at The Andreas Hotel & Spa"
      />
    </div>
  );
}
