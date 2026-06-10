import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Link from "next/link";
import { getEvents } from "@/lib/cms/queries";
import type { EventItem } from "@/lib/cms/types";

const fallbackEvents: EventItem[] = [
  { id:"1", tag:"WELLNESS", date_label:"APR 12, 2026", title:"Desert Sunrise Yoga", description:"Begin your morning with guided yoga on our rooftop terrace as the sun rises over the San Jacinto Mountains.", image_url:"/hotel-photos/room7.jpg", sort_order:0, is_published:true },
  { id:"2", tag:"DINING", date_label:"APR 19, 2026", title:"Poolside Wine Evening", description:"Join our sommelier for an intimate poolside tasting of curated California wines and artisanal small bites.", image_url:"/hotel-photos/mobility-accessible-2bed-2bath-suite-andreas-hotel-palm-springs.jpg", sort_order:1, is_published:true },
  { id:"3", tag:"CULTURE", date_label:"MAY 3, 2026", title:"Architecture Walking Tour", description:"A curated tour of Palm Springs' iconic mid-century modern architecture and vibrant local art galleries.", image_url:"/hotel-photos/pool-night.jpg", sort_order:2, is_published:true },
  { id:"4", tag:"SPA", date_label:"MAY 17, 2026", title:"Signature Spa Day", description:"A full-day spa retreat featuring our Vital-C Facial, Canyon Clay Body Wrap, and poolside relaxation package.", image_url:"/hotel-photos/room1.jpg", sort_order:3, is_published:true },
];

export const metadata = {
  title: "Events – The Andreas Hotel & Spa",
  description: "Upcoming events at The Andreas. Desert yoga, poolside wine tastings, architecture tours, and signature spa days in Palm Springs.",
};

export default async function EventsPage() {
  let events = fallbackEvents;
  try { const data = await getEvents(); if (data.length) events = data; } catch {}

  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      <section className="relative py-28 md:py-36 overflow-hidden" style={{ backgroundImage:"url(/hotel-photos/courtyard.jpg)", backgroundSize:"cover", backgroundPosition:"center" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 text-center">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--hotel-gold)] mb-4">At The Andreas</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide">Events & Experiences</h1>
          <div className="divider-gold mx-auto mt-4" />
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-10">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white card-lift flex flex-col md:flex-row overflow-hidden">
                {ev.image_url && (
                  <div className="md:w-2/5 h-48 md:h-auto bg-cover bg-center" style={{ backgroundImage:`url(${ev.image_url})` }} />
                )}
                <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {ev.tag && <span className="font-body text-[7px] tracking-[0.4em] uppercase bg-[var(--hotel-gold)]/20 text-[var(--hotel-terracotta)] px-2 py-0.5">{ev.tag}</span>}
                    <span className="font-body text-[9px] tracking-widest uppercase text-[var(--hotel-charcoal)]/50">{ev.date_label}</span>
                  </div>
                  <h2 className="font-display text-[var(--hotel-charcoal)] text-xl font-light mb-3">{ev.title}</h2>
                  {ev.description && <p className="font-body text-[var(--hotel-charcoal)]/60 text-xs leading-relaxed">{ev.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
