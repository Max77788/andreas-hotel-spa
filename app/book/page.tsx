import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata = {
  title: "Book a Room – The Andreas Hotel & Spa",
  description:
    "Secure your stay at The Andreas Hotel & Spa. Book directly through our reservation system for the best rates in Palm Springs.",
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[var(--hotel-cream)] flex flex-col">
      <Nav />

      {/* Hero strip */}
      <section
        className="relative py-16 md:py-20 overflow-hidden"
        style={{
          backgroundImage: "url(/hotel-photos/exterior.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 text-center">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-3">
            The Andreas Hotel & Spa
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-white tracking-wide">
            Book Your Stay
          </h1>
        </div>
      </section>

      {/* Booking iframe */}
      <section className="flex-1 flex flex-col">
        <div className="flex-1 relative min-h-[800px]">
          <iframe
            src="/api/book-proxy"
            className="absolute inset-0 w-full h-full border-0"
            title="Book a room at The Andreas Hotel & Spa"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
