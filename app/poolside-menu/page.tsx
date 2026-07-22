import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata = {
  title: "Poolside Menu - The Andreas Hotel & Spa",
  description:
    "Browse drinks, signature cocktails, and food available poolside at The Andreas Hotel & Spa in Palm Springs.",
};

const menuPages = [
  { src: "/hotel-photos/poolside-menu/drinks.jpg", alt: "The Andreas poolside drinks menu" },
  { src: "/hotel-photos/poolside-menu/cocktails.jpg", alt: "The Andreas poolside specialty cocktails menu" },
  { src: "/hotel-photos/poolside-menu/food.jpg", alt: "The Andreas poolside food menu" },
];

export default function PoolsideMenuPage() {
  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      <section
        className="relative min-h-[520px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hotel-photos/pool-night.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-3xl px-6 pt-24 text-center">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-4">
            Sip · Savor · Unwind
          </p>
          <h1 className="font-display text-white text-5xl md:text-7xl font-light tracking-wide">
            Poolside Menu
          </h1>
          <p className="font-body text-white/80 text-sm md:text-base leading-relaxed max-w-xl mx-auto mt-6">
            Refreshing drinks, specialty cocktails, and light bites served beside our courtyard pool.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-10 px-2">
            <div>
              <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.4em] uppercase mb-2">
                Food & Drinks
              </p>
              <h2 className="font-display text-[var(--hotel-charcoal)] text-3xl md:text-4xl font-light">
                Available Poolside
              </h2>
            </div>
            <a
              href="/andreas-poolside-menu.pdf"
              download
              className="inline-block border border-[var(--hotel-gold)] text-[var(--hotel-charcoal)] font-body text-[10px] tracking-[0.25em] uppercase px-6 py-3 hover:bg-[var(--hotel-gold)] transition-colors whitespace-nowrap"
            >
              Download Menu
            </a>
          </div>

          <div className="grid gap-8">
            {menuPages.map((page) => (
              <div key={page.src} className="bg-white dark:bg-[#2a2620] p-2 md:p-5 shadow-sm border border-[var(--hotel-gold)]/15">
                <img src={page.src} alt={page.alt} className="w-full h-auto" />
              </div>
            ))}
          </div>

          <p className="font-body text-[var(--hotel-charcoal)]/70 text-xs text-center mt-8 leading-relaxed">
            Menu selections and pricing are subject to availability. Please ask our front desk team for current service hours.
          </p>
        </div>
      </section>

      <section className="bg-[var(--hotel-forest)] py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.4em] uppercase mb-4">
            Adults-Only Boutique Retreat
          </p>
          <h2 className="font-display text-white text-3xl md:text-4xl font-light mb-7">
            Your Poolside Escape Awaits
          </h2>
          <Link
            href="/book"
            className="inline-block bg-[var(--hotel-gold)] text-black font-body text-[10px] tracking-[0.3em] uppercase px-9 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-colors"
          >
            Reserve Your Stay
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
