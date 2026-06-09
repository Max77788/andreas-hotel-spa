import Link from "next/link";

export const metadata = {
  title: "Book a Room – The Andreas Hotel & Spa",
  description:
    "Secure your stay at The Andreas Hotel & Spa. Book directly through our reservation system.",
};

export default function BookPage() {
  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Minimal top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--hotel-charcoal)] shrink-0">
        <Link
          href="/"
          className="text-[var(--hotel-cream)]/80 hover:text-[var(--hotel-gold)] font-body text-xs tracking-wider transition-colors"
        >
          ← Back to Andreas Hotel
        </Link>
        <Link href="/" className="flex items-center gap-1">
          <span className="font-display text-white text-sm tracking-wide">Andreas</span>
          <span className="font-body text-[10px] tracking-[0.2em] text-[var(--hotel-gold)] uppercase">
            Hotel & Spa
          </span>
        </Link>
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
