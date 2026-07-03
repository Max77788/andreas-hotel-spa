import Nav from "@/components/nav";
import Footer from "@/components/footer";
import LogoVariantDisplay from "@/components/logo-variant-display";
import { Suspense } from "react";

export const metadata = {
  title: "Spa & Wellness – The Andreas Hotel & Spa",
  description: "The Spa at Andreas offers skin care, massages, body treatments, and foot treatments. Deluxe couple's suites with Jacuzzi tubs and fireplaces in Palm Springs.",
};

const SPA_PACKAGES = [
  {
    name: "Couples Getaway",
    price: "$535",
    duration: null,
    desc: "Two 60-minute therapeutic massages, side by side, in our couples suite with a fireplace, a glass of champagne, and a 30-minute mineral soak in our whirlpool tub.",
  },
  {
    name: "Me Time",
    price: "$99",
    duration: null,
    desc: "A 55-minute aromatherapy massage and a glass of champagne. The perfect solo escape.",
  },
  {
    name: "Summer Delight",
    price: "$205",
    duration: null,
    desc: "A 55-minute Swedish massage, a 55-minute Vital-C facial, and a glass of champagne.",
  },
];

const PREMIUM_PACKAGES = [
  {
    name: "Paradise for Two",
    price: "$375",
    duration: "1.5 hrs",
    desc: "Relax with that special someone bathing in warm mineral-rich water. Enjoy champagne and fresh fruit before a luxurious 50-minute therapeutic massage. Price for two.",
  },
  {
    name: "The Every Inch",
    price: "$375",
    duration: "2 hrs",
    desc: "Begin with a peaceful Canyon Clay Wrap to detoxify and purify, followed by a mind-calming therapeutic massage, then complete the experience with an exhilarating Vital-C facial for a perfect glow — plus scalp, neck, and foot massage.",
  },
  {
    name: "Romance Andreas Style",
    price: "$395",
    duration: "2 hrs",
    desc: "A mineral soak relaxes your muscles as you spend quality time together before experiencing our Canyon Clay Body Masque and a half-hour therapeutic massage. Price for two.",
  },
];

const MASSAGES = [
  { name: "Swedish Massage", desc: "The classic oiled massage using long strokes, kneading and friction techniques. Relaxes, improves circulation and mobility.", price50: "$115", price80: "$160" },
  { name: "Aromatherapy Massage", desc: "A light rhythmic massage utilizing the power of essential oils to enhance and calm. Pure healing heaven.", price50: "$120", price80: "$165" },
  { name: "Pre-natal Massage", desc: "Massage for pregnant women that reduces stress on weight-bearing joints, encourages blood and lymph circulation, and relaxes nervous tension.", price50: "$130", price80: null },
  { name: "Therapeutic Massage", desc: "A combination of Swedish and Deep Tissue work, with other modalities tailored to your individual needs.", price50: "$125", price80: "$175" },
  { name: "Deep Tissue", desc: "A slow and firm technique designed to work out tighter spots in the body.", price50: "$135", price80: "$195" },
  { name: "Warm Stone Massage", desc: "Warm smooth river rocks are placed along the spine and used to dissolve knots and release tension.", price50: "$135", price80: null },
  { name: "Head to Toe", desc: "A 25-minute pressure point reflexology session for hands and feet, followed by a 25-minute jojoba eucalyptus scalp massage.", price50: "$130", price80: null },
  { name: "Lymphatic Massage", desc: "A very light touch massage designed to activate the lymphatic system to remove toxins from the body.", price50: "$130", price80: null },
];

const FACIALS = [
  { name: "Vital-C", desc: "The ultimate hydration facial — an antioxidant-rich vitamin C emollient that gently renews and nourishes skin for a healthy, youthful glow.", price: "$115" },
  { name: "Andreas Signature Ageless Facial", desc: "A results-driven treatment using plant stem cell technology with retinol and polypeptides to resurface, rejuvenate, and repair aging skin.", price: "$125" },
  { name: "Gent's Facial", desc: "Especially for men — a deep pore cleanse with enzyme exfoliation and hydration to reduce signs of aging and increase cell turnover.", price: "$115" },
  { name: "Oxygen Facial", desc: "An invigorating treatment that infuses oxygen, plant-derived stem cells, peptides, and enzymatic botanicals — leaving skin luminous and rejuvenated.", price: "$120" },
  { name: "Clear Cell", desc: "An active clinical facial designed to treat all forms of acne by eliminating excess oil and adding essential antioxidants. Salicylic acid, enzymes, and retinol work synergistically.", price: "$120" },
  { name: "Age Later Face Lift", desc: "A revolutionary peel in four layers — vitamin C, glycolic acid, enzymes, and a lightening treatment — to renew your complexion, leaving it silky smooth with a healthy glow.", price: "$130" },
];

const BODY_TREATMENTS = [
  { name: "Canyon Clay Wrap", desc: "A detoxifying wrap that purifies the body's outer surface while drawing out impurities. Leaves skin smooth and renewed.", price: "$120" },
  { name: "Salt Scrub", desc: "An invigorating full-body exfoliation that removes dead skin cells and stimulates circulation for soft, glowing skin.", price: "$115" },
];

const ADDONS = [
  "Moisturizing Hand Treatment — $45",
  "Scalp Massage Add-On — $30",
  "Foot Scrub Add-On — $35",
  "Eye Treatment Add-On — $25",
];

export default function SpaPage() {
  return (
    <main>
      <Nav />
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hotel-photos/amenities.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.4em] uppercase mb-4">
            Relax · Renew · Rejuvenate
          </p>
          <h1 className="font-display text-white text-5xl md:text-7xl font-light tracking-wide mb-6 flex items-baseline justify-center gap-0">
            Spa at The <img src="/andreas_logo_a_white.png" alt="A" className="inline-block h-[1.2em] w-auto align-text-bottom" />ndreas
          </h1>
          <div className="flex justify-center mb-6">
            <Suspense fallback={null}>
              <LogoVariantDisplay
                variantA={<><img src="/andreas_logo_a_white.png" alt="A" className="inline-block h-14 md:h-20 w-auto align-middle" /><span className="font-body text-white inline-block mt-5 md:mt-7 text-3xl md:text-4xl">ndreas</span></>}
                variantB={<img src="/andreas_wordmark_white.png" alt="Andreas" className="h-10 md:h-14 w-auto opacity-90" />}
              />
            </Suspense>
          </div>
          <p className="font-body text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Deluxe couple&apos;s treatment suites with oversized Jacuzzi tubs and fireplaces — a romantic escape in the heart of Palm Springs.
          </p>
          <div className="mt-8">
            <a
              href="https://spaatandreas.com/booking/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[var(--hotel-gold)] text-black font-body text-xs tracking-[0.3em] uppercase px-10 py-4 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
            >
              Book Spa Services
            </a>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 md:py-32 bg-[var(--hotel-cream)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.4em] uppercase mb-3">Spa Packages</p>
            <h2 className="font-display text-[var(--hotel-charcoal)] text-4xl md:text-5xl font-light tracking-wide">Starting at $160</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {SPA_PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className="card-lift dark:bg-[#2a2620] p-8 text-center group"
              >
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--hotel-terracotta)] mb-3">
                  Package
                </p>
                <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl font-light mb-2">
                  {pkg.name}
                </h3>
                <p className="font-display text-[var(--hotel-gold)] text-3xl font-light mb-4">
                  {pkg.price}
                </p>
                <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed">
                  {pkg.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Premium packages */}
          <div className="grid md:grid-cols-3 gap-8">
            {PREMIUM_PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className="card-lift dark:bg-[#2a2620] p-8 text-center group"
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--hotel-terracotta)]">
                    Premium
                  </p>
                  {pkg.duration && (
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--hotel-charcoal)]/90">
                      · {pkg.duration}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl font-light mb-2">
                  {pkg.name}
                </h3>
                <p className="font-display text-[var(--hotel-gold)] text-3xl font-light mb-4">
                  {pkg.price}
                </p>
                <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed">
                  {pkg.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Packages */}
      <section className="py-20 md:py-28 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.4em] uppercase mb-4">Group Events</p>
          <h2 className="font-display text-white/90 text-3xl md:text-4xl font-light tracking-wide mb-6">
            Corporate · Bridal · Birthdays · Celebrations
          </h2>
          <p className="font-body text-white/80 text-base leading-relaxed max-w-2xl mx-auto mb-2">
            Groups of 6 or more receive a <span className="text-[var(--hotel-gold)]">15% discount</span> off each 50-minute treatment.
          </p>
          <p className="font-body text-white/60 text-sm mb-8">
            Includes a glass of champagne on arrival and a complimentary fruit and cheese platter.
          </p>
          <a
            href="tel:+17603250900"
            className="inline-block bg-[var(--hotel-gold)] text-black font-body text-xs tracking-[0.3em] uppercase px-10 py-4 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
          >
            Call to Book Your Event
          </a>
        </div>
      </section>

      {/* Spa Services Menu */}
      <section className="py-24 md:py-32 bg-[var(--hotel-sand)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.4em] uppercase mb-3">Our Services</p>
            <h2 className="font-display text-[var(--hotel-charcoal)] text-4xl md:text-5xl font-light tracking-wide">Spa Menu</h2>
          </div>

          {/* Massages */}
          <div className="mb-16">
            <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-terracotta)] mb-8 text-center">
              Massages
            </h3>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {MASSAGES.map((m) => (
                <div key={m.name} className="border-b border-[var(--hotel-sand)] pb-4">
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h4 className="font-display text-[var(--hotel-charcoal)] text-lg font-light">{m.name}</h4>
                    <div className="flex gap-3 font-body text-[var(--hotel-gold)] text-sm whitespace-nowrap">
                      <span>50 min — {m.price50}</span>
                      {m.price80 && <span className="text-[var(--hotel-charcoal)]/90">| 80 min — {m.price80}</span>}
                    </div>
                  </div>
                  <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed">{m.desc}</p>
                </div>
              ))}
              <div className="border-b border-[var(--hotel-sand)] pb-4">
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <h4 className="font-display text-[var(--hotel-charcoal)] text-lg font-light">Moisturizing Hand Treatment</h4>
                  <span className="font-body text-[var(--hotel-gold)] text-sm whitespace-nowrap">$45</span>
                </div>
                <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed">Can be added to any massage above.</p>
              </div>
            </div>
          </div>

          {/* Facials */}
          <div className="mb-16">
            <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-terracotta)] mb-8 text-center">
              Facials
            </h3>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {FACIALS.map((f) => (
                <div key={f.name} className="border-b border-[var(--hotel-sand)] pb-4">
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h4 className="font-display text-[var(--hotel-charcoal)] text-lg font-light">{f.name}</h4>
                    <span className="font-body text-[var(--hotel-gold)] text-sm whitespace-nowrap">50 min — {f.price}</span>
                  </div>
                  <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Body Treatments */}
          <div>
            <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-terracotta)] mb-8 text-center">
              Body Treatments
            </h3>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-2xl mx-auto">
              {BODY_TREATMENTS.map((b) => (
                <div key={b.name} className="border-b border-[var(--hotel-sand)] pb-4">
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h4 className="font-display text-[var(--hotel-charcoal)] text-lg font-light">{b.name}</h4>
                    <span className="font-body text-[var(--hotel-gold)] text-sm whitespace-nowrap">50 min — {b.price}</span>
                  </div>
                  <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="mt-16 text-center">
            <h3 className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-terracotta)] mb-6">
              Add-Ons & Treats
            </h3>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {ADDONS.map((a) => (
                <span key={a} className="font-body text-[var(--hotel-charcoal)]/90 text-sm">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Contact */}
      <section className="py-20 md:py-28 bg-[var(--hotel-cream)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-[var(--hotel-gold)] text-[10px] tracking-[0.4em] uppercase mb-4">Visit Us</p>
          <h2 className="font-display text-[var(--hotel-charcoal)] text-3xl md:text-4xl font-light tracking-wide mb-10">
            Hours & Contact
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--hotel-terracotta)] mb-2">Hours</p>
              <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed">
                Monday – Sunday<br />
                9 a.m. – 7 p.m.<br />
                <span className="text-[var(--hotel-charcoal)]/90 text-xs">By appointment only</span>
              </p>
            </div>
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--hotel-terracotta)] mb-2">Contact</p>
              <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed">
                Tel:{" "}
                <a href="tel:+17603250900" className="hover:text-[var(--hotel-terracotta)] transition-colors">
                  (760) 325-0900
                </a>
                <br />
                <span className="text-[var(--hotel-charcoal)]/90 text-xs">Dial 314 from your hotel room</span>
                <br />
                <a href="mailto:stay@andreashotel.com" className="hover:text-[var(--hotel-terracotta)] transition-colors">
                  stay@andreashotel.com
                </a>
              </p>
            </div>
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--hotel-terracotta)] mb-2">Book Online</p>
              <a
                href="https://spaatandreas.com/booking/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[var(--hotel-gold)] text-black font-body text-xs tracking-[0.3em] uppercase px-8 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
              >
                Make an Appointment
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
