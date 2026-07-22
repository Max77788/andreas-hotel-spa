import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata = {
  title: "Palm Springs Local Guide - The Andreas Hotel & Spa",
  description:
    "Explore Palm Springs attractions near The Andreas Hotel & Spa, from downtown museums and casinos to Indian Canyons and the aerial tramway.",
};

const attractions = [
  { name: "Agua Caliente Casino Palm Springs", distance: "0.3 miles" },
  { name: "Palm Springs Art Museum", distance: "0.5 miles" },
  { name: "Palm Springs Convention Center", distance: "0.8 miles" },
  { name: "Palm Springs Air Museum", distance: "4.5 miles" },
  { name: "Mount San Jacinto State Park", distance: "6 miles" },
  { name: "Palm Springs Aerial Tramway", distance: "5.9 miles" },
  { name: "Indian Canyons", distance: "6.4 miles" },
  { name: "Palm Canyon", distance: "7.4 miles" },
  { name: "Agua Caliente Casino Rancho Mirage", distance: "8.8 miles" },
  { name: "Marriott's Shadow Ridge Golf Club", distance: "13.4 miles" },
];

export default function LocalGuidePage() {
  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      <section
        className="relative min-h-[520px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hotel-photos/exterior.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-3xl px-6 pt-24 text-center">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-4">
            In the Heart of Downtown
          </p>
          <h1 className="font-display text-white text-5xl md:text-7xl font-light tracking-wide">
            Explore Palm Springs
          </h1>
          <p className="font-body text-white/80 text-sm md:text-base leading-relaxed max-w-xl mx-auto mt-6">
            Art, architecture, desert landscapes, dining, and nightlife are all within easy reach of The Andreas.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-3">
              Points of Interest
            </p>
            <h2 className="font-display text-[var(--hotel-charcoal)] text-4xl md:text-5xl font-light">
              Near The Andreas
            </h2>
            <div className="divider-gold mt-5" />
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--hotel-gold)]/20 border border-[var(--hotel-gold)]/20">
            {attractions.map((attraction) => (
              <a
                key={attraction.name}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${attraction.name}, Palm Springs, CA`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-5 bg-[var(--hotel-cream)] px-6 py-6 hover:bg-[var(--hotel-sand)] transition-colors"
              >
                <span className="font-display text-[var(--hotel-charcoal)] text-xl font-light group-hover:text-[var(--hotel-terracotta)] transition-colors">
                  {attraction.name}
                </span>
                <span className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.2em] uppercase whitespace-nowrap">
                  {attraction.distance}
                </span>
              </a>
            ))}
          </div>

          <p className="font-body text-[var(--hotel-charcoal)]/70 text-xs text-center mt-6">
            Distances are approximate from The Andreas Hotel & Spa.
          </p>
        </div>
      </section>

      <section className="bg-[var(--hotel-forest)] py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.4em] uppercase mb-4">
            Your Desert Escape
          </p>
          <h2 className="font-display text-white text-3xl md:text-4xl font-light mb-7">
            Stay in the Center of It All
          </h2>
          <Link
            href="/book"
            className="inline-block bg-[var(--hotel-gold)] text-black font-body text-[10px] tracking-[0.3em] uppercase px-9 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors"
          >
            Book Your Stay
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
