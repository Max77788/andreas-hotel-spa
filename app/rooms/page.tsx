import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata = {
  title: "Rooms & Suites – The Andreas Hotel & Spa",
};

export default function RoomsPage() {
  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-4">
          Coming Soon
        </p>
        <h1 className="font-display text-[var(--hotel-charcoal)] text-5xl md:text-7xl font-light tracking-wide mb-6">
          Rooms & Suites
        </h1>
        <p className="font-body text-[var(--hotel-charcoal)]/50 text-base max-w-md leading-relaxed mb-10">
          This page is currently being redesigned. To browse our rooms or make a reservation, please contact us directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://us01.iqwebbook.com/AHSCA115/" target="_blank" rel="noopener noreferrer"
            className="bg-[var(--hotel-terracotta)] text-[var(--hotel-cream)] font-body text-xs tracking-[0.3em] uppercase px-8 py-3 hover:bg-[var(--hotel-charcoal)] transition-colors"
          >
            Book Online
          </a>
          <a
            href="/"
            className="bg-[var(--hotel-charcoal)] text-[var(--hotel-cream)] font-body text-xs tracking-[0.3em] uppercase px-8 py-3 hover:bg-[var(--hotel-gold)] hover:text-[var(--hotel-charcoal)] transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
