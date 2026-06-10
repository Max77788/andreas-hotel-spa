import Nav from "@/components/nav";
import Footer from "@/components/footer";

const policies = [
  {
    label: "Check-in / Check-out",
    detail: "Check-in: 3 PM. Check-out: 11 AM.",
  },
  {
    label: "Hotel Parking",
    detail: "We offer complimentary parking for our guests.",
  },
  {
    label: "Age Requirement",
    detail: "Andreas Hotel & Spa is for adults 21 and over only. However, all ages are allowed on Easter weekend and the first Saturday of December for the annual Palm Springs light parade.",
  },
  {
    label: "Smoking",
    detail: "The Andreas Hotel is a non-smoking establishment. This includes, but is not limited to: cigars, e-cigarettes, vaping, and marijuana. Guests who do not comply will be charged a $300 smoking fee.",
  },
  {
    label: "Pets",
    detail: "Pets are not currently allowed at the Andreas.",
  },
  {
    label: "Resort Fee",
    detail: "A daily resort fee of $34.95 + tax per day will be added after check-in.",
  },
  {
    label: "Extra Guests",
    detail: "From $50/night (after 2 guests).",
  },
  {
    label: "Security Deposit",
    detail: "$100/night.",
  },
  {
    label: "Rollaway Beds",
    detail: "Rollaway beds are $45/room per night. Rollaways are only available for Executive and 2 Bedroom Suites. Maximum 2 rollaways per room.",
  },
  {
    label: "Guarantee Policy",
    detail: "A guaranteed reservation assures you of a room even if you check in very late (after 6:00 PM). All reservations made through this website must be guaranteed to a major credit card.",
  },
];

export const metadata = {
  title: "Hotel Policies – The Andreas Hotel & Spa",
  description:
    "Review our hotel policies including cancellation policy, check-in/check-out times, resort fees, and more for The Andreas Hotel & Spa in Palm Springs.",
};

export default function PoliciesPage() {
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

          {/* Cancellation Policy — highlighted */}
          <div
            className="p-8 md:p-12 border border-[var(--hotel-terracotta)]/30"
            style={{ background: "rgba(201,169,110,0.06)" }}
          >
            <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-[var(--hotel-terracotta)] mb-3">
              Cancellation Policy
            </h2>
            <p className="font-body text-[var(--hotel-charcoal)] leading-relaxed text-lg">
              Cancellations for a hotel room reservation must be received{" "}
              <strong>14 days prior to arrival</strong>, not including the day of check-in.
              If cancellation of a guaranteed reservation is not received by the required date,
              you will be charged for half the stay or one night's accommodation &mdash; whichever is greater.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
