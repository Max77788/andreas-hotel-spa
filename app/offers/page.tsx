import Nav from "@/components/nav";
import Footer from "@/components/footer";

const oneNight = [
  {
    title: "The Escape",
    desc: "Includes the Andreas signature scrub, 50 min Deep Tissue, 50 minute Aroma Therapy massage, and the Vital C Facial.",
    duration: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid March 15 - October 15.",
    price: "$630",
  },
  {
    title: "The Rejuvenate",
    desc: "Includes a 30 minute Mineral Soak, the Vital C Facial, Gentlemen's Facial and two 50 minute Therapeutic massages.",
    duration: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid March 15 - October 15.",
    price: "$665",
  },
];

const twoNight = [
  {
    title: "The Oasis",
    desc: "Includes: The Andreas Signature Scrub, the Canyon Clay Body Mask, a 50 minute Swedish massage, and a 50 Minute Aromatherapy massage.",
    duration: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid March 15 - October 15.",
    price: "$745",
  },
  {
    title: "The Andreas Renewal",
    desc: "Includes: 30 min. Mineral Soak, Ageless Facial, and Rosemary Mint Scrub; 50 min. Deep Tissue & therapeutic massage.",
    duration: "Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid March 15 - October 15.",
    price: "$795",
  },
];

const inclusions = [
  { icon: "🛏", label: "Luxury Accommodations", detail: "Your choice of room or suite in our Italian Villa-inspired hotel." },
  { icon: "💆", label: "Spa Treatments", detail: "Massages, facials, body wraps, and scrubs by licensed therapists." },
  { icon: "🏊", label: "Pool & Jacuzzi", detail: "Heated outdoor pool and Jacuzzi surrounded by manicured courtyard." },
  { icon: "🔥", label: "Outdoor Fireplaces", detail: "Cozy gas fireplaces throughout the courtyard for evening relaxation." },
  { icon: "🍷", label: "Welcome Amenity", detail: "A complimentary welcome drink or bottle of wine on arrival." },
  { icon: "🅿", label: "Free Parking", detail: "Complimentary on-site parking for the duration of your stay." },
];

export const metadata = {
  title: "Seasonal Offers & Packages – The Andreas Hotel & Spa",
  description:
    "Indulge in our curated spa and stay packages. From one-night escapes to two-night renewals, find your perfect Palm Springs retreat.",
};

export default function OffersPage() {
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
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 text-center">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-4">
            Packages &amp; Deals
          </p>
          <h1
            className="font-display text-white font-light leading-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            Seasonal Offers
          </h1>
          <div className="divider-gold mx-auto" />
          <p className="font-body text-white/70 text-sm max-w-xl mx-auto mt-6 leading-relaxed">
            Great deals on spa treatments and hotel room packages — the perfect Palm
            Springs getaway awaits.
          </p>
        </div>
      </section>

      {/* 1 Night Packages */}
      <section className="py-20 md:py-24 bg-[var(--hotel-cream)]">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <span className="font-body text-[8px] tracking-[0.35em] uppercase bg-[var(--hotel-terracotta)] text-white px-4 py-1.5 mb-5 inline-block">
              1 Night
            </span>
            <h2 className="font-display text-[var(--hotel-charcoal)] text-3xl md:text-5xl font-light mb-4">
              One Night Stay Packages
            </h2>
            <p className="font-body text-[var(--hotel-charcoal)]/60 text-xs max-w-md mx-auto">
              A single evening of indulgence — spa treatments paired with a restful
              night in our Italian Villa-inspired accommodations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {oneNight.map((offer) => (
              <div
                key={offer.title}
                className="card-lift bg-white dark:bg-[#2a2620] p-8 md:p-10 flex flex-col group"
              >
                <div className="flex-1">
                  <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl md:text-3xl font-light mb-3">
                    {offer.title}
                  </h3>
                  <p className="font-body text-[var(--hotel-charcoal)]/70 text-sm leading-relaxed mb-4">
                    {offer.desc}
                  </p>
                  <p className="font-body text-[var(--hotel-terracotta)] text-xs italic mb-8">
                    {offer.duration}
                  </p>
                </div>

                <div className="flex items-end justify-between border-t border-[var(--hotel-sand)] pt-6">
                  <div>
                    <span className="font-display text-[var(--hotel-charcoal)] text-3xl font-light">
                      {offer.price}
                    </span>
                    <span className="font-body text-[10px] text-[var(--hotel-charcoal)]/50 ml-1">
                      / package
                    </span>
                  </div>
                  <a
                    href="https://spaatandreas.com/booking/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-[9px] tracking-[0.3em] uppercase bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] px-5 py-2 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2 Night Packages */}
      <section className="py-20 md:py-24 bg-[var(--hotel-sand)] dark:bg-[#1a1a1a]">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <span className="font-body text-[8px] tracking-[0.35em] uppercase bg-[var(--hotel-charcoal)] text-[var(--hotel-gold)] px-4 py-1.5 mb-5 inline-block">
              2 Nights
            </span>
            <h2 className="font-display text-[var(--hotel-charcoal)] text-3xl md:text-5xl font-light mb-4">
              Two Night Stay Packages
            </h2>
            <p className="font-body text-[var(--hotel-charcoal)]/60 text-xs max-w-md mx-auto">
              Immerse yourself fully. Two nights give you time to unwind, explore,
              and truly disconnect.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {twoNight.map((offer) => (
              <div
                key={offer.title}
                className="card-lift bg-[var(--hotel-cream)] dark:bg-[#2a2620] p-8 md:p-10 flex flex-col group border border-[var(--hotel-sand)]"
              >
                <div className="flex-1">
                  <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl md:text-3xl font-light mb-3">
                    {offer.title}
                  </h3>
                  <p className="font-body text-[var(--hotel-charcoal)]/70 text-sm leading-relaxed mb-4">
                    {offer.desc}
                  </p>
                  <p className="font-body text-[var(--hotel-terracotta)] text-xs italic mb-8">
                    {offer.duration}
                  </p>
                </div>

                <div className="flex items-end justify-between border-t border-[var(--hotel-sand)] pt-6">
                  <div>
                    <span className="font-display text-[var(--hotel-charcoal)] text-3xl font-light">
                      {offer.price}
                    </span>
                    <span className="font-body text-[10px] text-[var(--hotel-charcoal)]/50 ml-1">
                      / package
                    </span>
                  </div>
                  <a
                    href="https://spaatandreas.com/booking/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-[9px] tracking-[0.3em] uppercase bg-[var(--hotel-gold)] text-[var(--hotel-charcoal)] px-5 py-2 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 md:py-24 bg-[var(--hotel-cream)]">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-3">
              Every package includes
            </p>
            <h2 className="font-display text-[var(--hotel-charcoal)] text-3xl md:text-5xl font-light">
              What You&rsquo;ll Enjoy
            </h2>
            <div className="divider-gold mx-auto mt-6" />
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {inclusions.map((item) => (
              <div
                key={item.label}
                className="card-lift bg-white dark:bg-[#2a2620] p-6 text-center"
              >
                <span className="text-2xl block mb-3">{item.icon}</span>
                <h3 className="font-display text-[var(--hotel-charcoal)] text-base font-light mb-2">
                  {item.label}
                </h3>
                <p className="font-body text-[var(--hotel-charcoal)]/60 text-xs leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-[var(--hotel-charcoal)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.5em] uppercase mb-4">
            Custom Packages
          </p>
          <h2 className="font-display text-[var(--hotel-cream)] text-3xl md:text-4xl font-light mb-6">
            Don&rsquo;t see what you&rsquo;re looking for?
          </h2>
          <p className="font-body text-white/60 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            We create custom packages for special occasions — anniversaries, proposals,
            birthdays, or just because. Call us and we&rsquo;ll design something
            unforgettable.
          </p>
          <a
            href="tel:+17603275701"
            className="font-body text-[10px] tracking-[0.35em] uppercase border border-[var(--hotel-gold)] text-[var(--hotel-gold)] px-8 py-3 hover:bg-[var(--hotel-gold)] hover:text-[var(--hotel-charcoal)] transition-all duration-300"
          >
            (760) 327-5701
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
