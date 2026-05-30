import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata = {
  title: "Book a Room – The Andreas Hotel & Spa",
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[var(--hotel-cream)] flex flex-col">
      <Nav />
      <div className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
          <div className="text-center mb-8">
            <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-3">
              Reservations
            </p>
            <h1 className="font-display text-[var(--hotel-charcoal)] text-4xl md:text-5xl font-light">
              Book Your Stay
            </h1>
            <div className="divider-gold" />
          </div>
        </div>
        <iframe
          src="/api/book-proxy/"
          title="Book a Room at The Andreas Hotel & Spa"
          className="w-full border-0"
          style={{ height: "calc(100vh - 200px)", minHeight: "800px" }}
          allow="payment"
        />
      </div>
      <Footer />
    </main>
  );
}
