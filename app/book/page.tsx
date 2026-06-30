import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Book a Room – The Andreas Hotel & Spa",
  description:
    "Secure your stay at The Andreas Hotel & Spa. Book directly through our reservation system.",
};

export default function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <BookPageInner searchParamsPromise={searchParams} />;
}

function BookPageInner({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <Suspense fallback={<BookShell iframeSrc="/api/book-proxy" />}>
      <AsyncBookPage searchParamsPromise={searchParamsPromise} />
    </Suspense>
  );
}

async function AsyncBookPage({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParamsPromise;
  const params = new URLSearchParams();
  if (sp.arrival) params.set("arrival", String(sp.arrival));
  if (sp.departure) params.set("departure", String(sp.departure));
  if (sp.adults) params.set("adults", String(sp.adults));
  if (sp.room) params.set("room", String(sp.room));
  const iframeSrc = `/api/book-proxy${params.toString() ? `?${params.toString()}` : ""}`;
  return <BookShell iframeSrc={iframeSrc} />;
}

function BookShell({ iframeSrc }: { iframeSrc: string }) {
  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Branding header */}
      <div className="bg-[#1a1a1a] shrink-0 relative">
        {/* Back arrow — absolute positioned so logo stays centered */}
        <Link
          href="/"
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-[var(--hotel-cream)]/60 hover:text-[var(--hotel-gold)] transition-colors"
          aria-label="Back to home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Centered logo */}
        <Link href="/" className="flex flex-col items-center py-4 md:py-5">
          <img
            src="/andreas_logo_white.png"
            alt="The Andreas Hotel & Spa"
            className="h-9 md:h-11 w-auto"
          />
          <span className="font-body text-[8px] tracking-[0.4em] text-[var(--hotel-gold)] uppercase mt-1">
            Palm Springs
          </span>
        </Link>

        {/* Gold accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--hotel-gold)] to-transparent" />

        {/* Tagline */}
        <div className="text-center py-2 bg-black/20">
          <p className="font-body text-white/80 text-[10px] tracking-[0.25em] uppercase">
            Book Direct — Best Rates Guaranteed
          </p>
        </div>
      </div>

      {/* Booking iframe fills the rest */}
      <iframe
        src={iframeSrc}
        className="flex-1 w-full border-0"
        title="Book a room at The Andreas Hotel & Spa"
      />
    </div>
  );
}
