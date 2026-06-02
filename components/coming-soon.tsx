import Nav from "@/components/nav";
import Footer from "@/components/footer";
import Link from "next/link";

interface ComingSoonProps {
  title: string;
  subtitle: string;
  description?: string;
}

export default function ComingSoon({ title, subtitle, description }: ComingSoonProps) {
  return (
    <main className="min-h-screen bg-[var(--hotel-cream)]">
      <Nav />
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <p className="font-body text-[var(--hotel-terracotta)] text-[10px] tracking-[0.5em] uppercase mb-4">
          {subtitle}
        </p>
        <h1 className="font-display text-[var(--hotel-charcoal)] text-5xl md:text-7xl font-light tracking-wide mb-6">
          {title}
        </h1>
        <p className="font-body text-[var(--hotel-charcoal)]/50 text-base max-w-md leading-relaxed mb-10">
          {description || "This section is currently being redesigned. Please check back soon or contact us for more information."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://us01.iqwebbook.com/AHSCA115/" target="_blank" rel="noopener noreferrer"
            className="bg-[var(--hotel-terracotta)] text-[var(--hotel-cream)] font-body text-xs tracking-[0.3em] uppercase px-8 py-3 hover:bg-[var(--hotel-charcoal)] transition-colors"
          >
            Book a Room
          </a>
          <Link
            href="/"
            className="bg-[var(--hotel-charcoal)] text-[var(--hotel-cream)] font-body text-xs tracking-[0.3em] uppercase px-8 py-3 hover:bg-[var(--hotel-gold)] hover:text-[var(--hotel-charcoal)] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
