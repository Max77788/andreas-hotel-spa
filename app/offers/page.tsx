import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { getOffers, getOfferInclusions } from "@/lib/cms/queries";
import type { Offer, OfferInclusion } from "@/lib/cms/types";

const fallbackOffers: { oneNight: Offer[], twoNight: Offer[] } = {
  oneNight: [
    { id:"1", title:"The Escape", description:"Includes the Andreas signature scrub, 50 min Deep Tissue, 50 minute Aroma Therapy massage, and the Vital C Facial.", duration:"Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid May 15 - October 15.", price:"$630", category:"one_night", sort_order:0, is_published:true },
    { id:"2", title:"The Rejuvenate", description:"Includes a 30 minute Mineral Soak, the Vital C Facial, Gentlemen's Facial and two 50 minute Therapeutic massages.", duration:"Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid May 15 - October 15.", price:"$665", category:"one_night", sort_order:1, is_published:true },
  ],
  twoNight: [
    { id:"3", title:"The Oasis", description:"Includes: The Andreas Signature Scrub, the Canyon Clay Body Mask, a 50 minute Swedish massage, and a 50 Minute Aromatherapy massage.", duration:"Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid May 15 - October 15.", price:"$745", category:"two_night", sort_order:0, is_published:true },
    { id:"4", title:"The Andreas Renewal", description:"Includes: 30 min. Mineral Soak, Ageless Facial, and Rosemary Mint Scrub; 50 min. Deep Tissue & therapeutic massage.", duration:"Includes a Deluxe Room Sunday-Thursday. Call for weekend rates. Valid May 15 - October 15.", price:"$795", category:"two_night", sort_order:1, is_published:true },
  ],
};

const fallbackInclusions: OfferInclusion[] = [
  { id:"1", icon:"🛏", label:"Luxury Accommodations", detail:"Your choice of room or suite in our Italian Villa-inspired hotel.", sort_order:0 },
  { id:"2", icon:"💆", label:"Spa Treatments", detail:"Massages, facials, body wraps, and scrubs by licensed therapists.", sort_order:1 },
  { id:"3", icon:"🏊", label:"Pool & Jacuzzi", detail:"Heated outdoor pool and Jacuzzi surrounded by manicured courtyard.", sort_order:2 },
  { id:"4", icon:"🔥", label:"Outdoor Fireplaces", detail:"Cozy gas fireplaces throughout the courtyard for evening relaxation.", sort_order:3 },
  { id:"5", icon:"🍷", label:"Welcome Amenity", detail:"A complimentary glass of champagne or sparkling apple cider on arrival.", sort_order:4 },
  { id:"6", icon:"🅿", label:"Free Parking", detail:"Complimentary on-site parking for the duration of your stay.", sort_order:5 },
];

export const metadata = {
  title: "Seasonal Offers & Packages – The Andreas Hotel & Spa",
  description: "Indulge in our curated spa and stay packages. From one-night escapes to two-night renewals, find your perfect Palm Springs retreat.",
};

export default async function OffersPage() {
  let allOffers = fallbackOffers;
  let inclusions = fallbackInclusions;
  try {
    const [offers, incs] = await Promise.all([getOffers(), getOfferInclusions()]);
    if (offers.length) {
      allOffers = {
        oneNight: offers.filter(o => o.category === "one_night"),
        twoNight: offers.filter(o => o.category === "two_night"),
      };
    }
    if (incs.length) inclusions = incs;
  } catch {}

  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      <section className="relative py-28 md:py-36 overflow-hidden" style={{ backgroundImage:"url(/hotel-photos/pool-night.jpg)", backgroundSize:"cover", backgroundPosition:"center" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 text-center">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-4">The Andreas Hotel & Spa</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide">Seasonal Offers</h1>
          <div className="divider-gold mx-auto mt-4" />
        </div>
      </section>

      {/* 1-Night Packages */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-4 text-center">One Night Packages</p>
          <h2 className="font-display text-[var(--hotel-charcoal)] text-3xl md:text-4xl font-light mb-16 text-center">Quick Getaways</h2>

          <div className="grid md:grid-cols-2 gap-10">
            {allOffers.oneNight.map((offer) => (
              <div key={offer.id} className="bg-white dark:bg-[#2a2620] p-8 md:p-10 card-lift flex flex-col">
                <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl font-light mb-4">{offer.title}</h3>
                <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed mb-6 flex-1">{offer.description}</p>
                {offer.duration && <p className="font-body text-[11px] text-[var(--hotel-charcoal)]/90 mb-6">{offer.duration}</p>}
                <div className="flex items-center justify-between pt-6 border-t border-[var(--hotel-sand)]">
                  <div>{offer.price && <><span className="font-display text-3xl text-[var(--hotel-charcoal)] font-light">{offer.price}</span><span className="font-body text-xs text-[var(--hotel-charcoal)]/90 ml-1">total</span></>}</div>
                  <a href="/book" className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--hotel-terracotta)] border-b border-[var(--hotel-terracotta)]/30 pb-0.5 hover:text-[var(--hotel-charcoal)] hover:border-[var(--hotel-charcoal)] transition-colors">Book Now →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2-Night Packages */}
      <section className="py-20 md:py-28 bg-[var(--hotel-sand)]">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-4 text-center">Two Night Packages</p>
          <h2 className="font-display text-[var(--hotel-charcoal)] text-3xl md:text-4xl font-light mb-16 text-center">Extended Retreats</h2>

          <div className="grid md:grid-cols-2 gap-10">
            {allOffers.twoNight.map((offer) => (
              <div key={offer.id} className="bg-white dark:bg-[#2a2620] p-8 md:p-10 card-lift flex flex-col">
                <h3 className="font-display text-[var(--hotel-charcoal)] text-2xl font-light mb-4">{offer.title}</h3>
                <p className="font-body text-[var(--hotel-charcoal)]/90 text-sm leading-relaxed mb-6 flex-1">{offer.description}</p>
                {offer.duration && <p className="font-body text-[11px] text-[var(--hotel-charcoal)]/90 mb-6">{offer.duration}</p>}
                <div className="flex items-center justify-between pt-6 border-t border-[var(--hotel-sand)]">
                  <div>{offer.price && <><span className="font-display text-3xl text-[var(--hotel-charcoal)] font-light">{offer.price}</span><span className="font-body text-xs text-[var(--hotel-charcoal)]/90 ml-1">total</span></>}</div>
                  <a href="/book" className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--hotel-terracotta)] border-b border-[var(--hotel-terracotta)]/30 pb-0.5 hover:text-[var(--hotel-charcoal)] hover:border-[var(--hotel-charcoal)] transition-colors">Book Now →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-4 text-center">What's Included</p>
          <h2 className="font-display text-[var(--hotel-charcoal)] text-3xl md:text-4xl font-light mb-16 text-center">Every Package Includes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inclusions.map((inc) => (
              <div key={inc.id} className="bg-white dark:bg-[#2a2620] p-6 text-center">
                <span className="text-3xl mb-3 block">{inc.icon}</span>
                <h4 className="font-display text-[var(--hotel-charcoal)] text-lg font-light mb-2">{inc.label}</h4>
                {inc.detail && <p className="font-body text-xs text-[var(--hotel-charcoal)]/90 leading-relaxed">{inc.detail}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
