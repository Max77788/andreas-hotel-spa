import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Link from "next/link";

const EVENTS = [
  {
    tag: "SPA",
    date: "May 17, 2026",
    title: "Signature Spa Day",
    description: "A full-day spa retreat featuring our Vital-C Facial, Canyon Clay Body Wrap, and poolside relaxation package.",
    img: "/hotel-photos/room1.jpg",
  },
  {
    tag: "YOGA",
    date: "June 8, 2026",
    title: "Morning Yoga",
    description: "Start your day with a revitalizing yoga session in our serene courtyard, suitable for all levels.",
    img: "/hotel-photos/exterior.jpg",
  },
  {
    tag: "WINE",
    date: "June 22, 2026",
    title: "Wine Evening",
    description: "An evening of fine California wines paired with artisan cheeses in our intimate courtyard setting.",
    img: "/hotel-photos/room1.jpg",
  },
  {
    tag: "TOUR",
    date: "July 6, 2026",
    title: "Architecture Walking Tour",
    description: "A curated tour of Palm Springs' iconic mid-century modern architecture and vibrant local art galleries.",
    img: "/hotel-photos/room1.jpg",
  },
];

export const metadata = {
  title: "Special Events – The Andreas Hotel & Spa",
  description: "Discover upcoming events at The Andreas Hotel & Spa — from wine evenings to architecture tours and spa days in Palm Springs.",
};

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      {/* Hero */}
      <section
        className="relative py-28 md:py-36 overflow-hidden"
        style={{
          backgroundImage: "url(/hotel-photos/pool-night.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 text-center">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-4">
            The Andreas Hotel & Spa
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide">
            Special Events
          </h1>
          <div className="divider-gold mx-auto mt-4" />
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-4 text-center">
            Upcoming
          </p>
          <h2 className="font-display text-[var(--hotel-charcoal)] text-3xl md:text-4xl font-light mb-16 text-center">
            What's On
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            {EVENTS.map((ev) => (
              <div key={ev.title} className="bg-white card-lift dark:bg-[#2a2620] overflow-hidden group">
                <div
                  className="h-56 bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"
                  style={{ backgroundImage: `url(${ev.img})` }}
                />
                <div className="p-6 md:p-8">
                  <div className="mb-3">
                    <span className="font-body text-[7px] tracking-[0.4em] uppercase bg-[var(--hotel-gold)]/20 text-[var(--hotel-terracotta)] px-2 py-0.5">
                      {ev.tag}
                    </span>
                  </div>
                  <p className="font-body text-[var(--hotel-charcoal)]/90 text-[10px] tracking-widest uppercase mb-2">
                    {ev.date}
                  </p>
                  <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl font-light mb-3">
                    {ev.title}
                  </h3>
                  <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed mb-6">
                    {ev.description}
                  </p>
                  <Link
                    href="/book"
                    className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--hotel-terracotta)] border-b border-[var(--hotel-terracotta)]/30 pb-0.5 hover:text-[var(--hotel-charcoal)] hover:border-[var(--hotel-charcoal)] transition-colors"
                  >
                    Book Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Group Events CTA */}
          <div className="mt-20 text-center">
            <div className="inline-block px-10 py-10"
              style={{
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.4em] uppercase mb-4">
                Private Events
              </p>
              <h3 className="font-display text-white text-2xl md:text-3xl font-light mb-4">
                Plan Your Gathering
              </h3>
              <p className="font-body text-white/90 text-sm mb-8 max-w-md leading-relaxed">
                Weddings, corporate retreats, and private celebrations — our team crafts unforgettable experiences in the heart of Palm Springs.
              </p>
              <Link
                href="/group-booking"
                className="inline-block font-body text-[10px] tracking-[0.3em] uppercase bg-[var(--hotel-gold)] text-black px-8 py-3 hover:bg-[var(--hotel-gold)]/80 transition-colors"
              >
                Submit RFP →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
