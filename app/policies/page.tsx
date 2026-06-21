import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { getPolicies } from "@/lib/cms/queries";
import type { Policy } from "@/lib/cms/types";

const fallbackPolicies: Policy[] = [
  { id:"1", label:"Check-in / Check-out", detail:"Check-in: 3 PM. Check-out: 11 AM.", sort_order:0, is_highlighted:false },
  { id:"2", label:"Hotel Parking", detail:"We offer complimentary parking for our guests.", sort_order:1, is_highlighted:false },
  { id:"3", label:"Age Requirement", detail:"Andreas Hotel & Spa is for adults 21 and over only. However, all ages are allowed on Easter weekend and the first Saturday of December for the annual Palm Springs light parade.", sort_order:2, is_highlighted:false },
  { id:"4", label:"Smoking", detail:"The Andreas Hotel is a non-smoking establishment. This includes, but is not limited to: cigars, e-cigarettes, vaping, and marijuana. Guests who do not comply will be charged a $300 smoking fee.", sort_order:3, is_highlighted:false },
  { id:"5", label:"Pets", detail:"Pets are not currently allowed at the Andreas.", sort_order:4, is_highlighted:false },
  { id:"6", label:"Resort Fee", detail:"A daily resort fee of $34.95 + tax per day will be added after check-in.", sort_order:5, is_highlighted:false },
  { id:"7", label:"Extra Guests", detail:"From $50/night (after 2 guests).", sort_order:6, is_highlighted:false },
  { id:"8", label:"Security Deposit", detail:"$100/night.", sort_order:7, is_highlighted:false },
  { id:"9", label:"Rollaway Beds", detail:"Rollaway beds are $45/room per night. Rollaways are only available for Executive and 2 Bedroom Suites. Maximum 2 rollaways per room.", sort_order:8, is_highlighted:false },
  { id:"10", label:"Guarantee Policy", detail:"A guaranteed reservation assures you of a room even if you check in very late (after 6:00 PM). All reservations made through this website must be guaranteed to a major credit card.", sort_order:9, is_highlighted:false },
];

const fallbackCancellation: Policy = {
  id:"11", label:"Cancellation Policy", detail:"Cancellations for a hotel room reservation must be received 14 days prior to arrival, not including the day of check-in. If cancellation of a guaranteed reservation is not received by the required date, you will be charged for half the stay or one night's accommodation — whichever is greater.", sort_order:10, is_highlighted:true,
};

export const metadata = {
  title: "Hotel Policies – The Andreas Hotel & Spa",
  description:
    "Review our hotel policies including cancellation policy, check-in/check-out times, resort fees, and more for The Andreas Hotel & Spa in Palm Springs.",
};

export default async function PoliciesPage() {
  let policies: Policy[] = fallbackPolicies;
  let cancellationPolicy: Policy = fallbackCancellation;
  try {
    const data = await getPolicies();
    if (data?.length) {
      policies = data.filter((p) => !p.is_highlighted);
      const cp = data.find((p) => p.is_highlighted);
      if (cp) cancellationPolicy = cp;
    }
  } catch {}

  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />

      {/* Hero */}
      <section
        className="relative py-28 md:py-36 overflow-hidden"
        style={{
          backgroundImage: "url(/hotel-photos/exterior.jpg)",
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
            Hotel Policies
          </h1>
        </div>
      </section>

      {/* Policies Content */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <p className="font-body text-[var(--hotel-charcoal)] leading-relaxed mb-16">
            Please review the following policies before your stay. If you have any questions, contact us at{" "}
            <a href="tel:8883275701" className="text-[var(--hotel-terracotta)] hover:underline">888-327-5701</a>{" "}
            or{" "}
            <a href="mailto:stay@andreashotel.com" className="text-[var(--hotel-terracotta)] hover:underline">
              stay@andreashotel.com
            </a>.
          </p>

          {/* General Policies */}
          <div className="space-y-10 mb-20">
            {policies.map((policy) => (
              <div key={policy.label}>
                <h3 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-2">
                  {policy.label}
                </h3>
                <p className="font-body text-[var(--hotel-charcoal)]/90 leading-relaxed">
                  {policy.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Cancellation Policy - highlighted */}
          <div className="p-8 md:p-12 border border-[var(--hotel-terracotta)]/30" style={{ background: "rgba(201,169,110,0.06)" }}>
            <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-3">
              {cancellationPolicy.label}
            </h2>
            <p className="font-body text-[var(--hotel-charcoal)] leading-relaxed text-lg">
              {cancellationPolicy.detail}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
