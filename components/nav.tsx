"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#story" },
  { label: "Rooms", href: "/rooms" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Phone top bar — hidden for now */}
      {/* <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--hotel-charcoal)] border-b border-[var(--hotel-gold)]/10 px-6 md:px-10 py-[7px] flex items-center justify-center gap-3">
        <a
          href="tel:+17474949881"
          className="font-body text-[var(--hotel-gold)] text-[10px] md:text-[11px] tracking-[0.3em] uppercase hover:text-white transition-colors duration-200"
        >
          +1 (747) 494-9881
        </a>
        <span className="font-body text-[var(--hotel-gold)]/30 text-[9px]">·</span>
        <span className="font-body text-[var(--hotel-gold)]/70 text-[9px] tracking-[0.25em] uppercase">
          Calls Accepted 24/7
        </span>
      </div> */}

      {/* Main nav */}
      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? "bg-[var(--hotel-cream)]/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div>
              <div className={`font-display text-lg font-light tracking-[0.25em] uppercase transition-colors ${scrolled ? "text-[var(--hotel-charcoal)]" : "text-[var(--hotel-cream)]"}`}>
                The Andreas
              </div>
              <div className="font-body text-[var(--hotel-gold)] text-[8px] tracking-[0.45em] uppercase -mt-0.5">
                Hotel & Spa · Palm Springs
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-[10px] tracking-[0.25em] uppercase transition-colors duration-200 ${
                  scrolled
                    ? "text-[var(--hotel-charcoal)]/70 hover:text-[var(--hotel-charcoal)]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Book Now + mobile hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="https://us01.iqwebbook.com/AHSCA115/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-block border border-[var(--hotel-gold)] text-[var(--hotel-gold)] font-body text-[10px] tracking-[0.25em] uppercase px-5 py-2 hover:bg-[var(--hotel-gold)] hover:text-[var(--hotel-charcoal)] transition-all duration-300"
            >
              Book Now
            </a>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden flex flex-col gap-[5px] cursor-pointer"
              aria-label="Open menu"
            >
              <span className={`block w-6 h-[1.5px] transition-colors ${scrolled ? "bg-[var(--hotel-charcoal)]" : "bg-[var(--hotel-cream)]"}`} />
              <span className={`block w-6 h-[1.5px] transition-colors ${scrolled ? "bg-[var(--hotel-charcoal)]" : "bg-[var(--hotel-cream)]"}`} />
              <span className={`block w-6 h-[1.5px] transition-colors ${scrolled ? "bg-[var(--hotel-charcoal)]" : "bg-[var(--hotel-cream)]"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-[var(--hotel-charcoal)] flex flex-col transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-[var(--hotel-cream)] font-body text-xs tracking-[0.3em] uppercase flex items-center gap-2"
            aria-label="Close menu"
          >
            <span className="text-lg leading-none">×</span>
            <span>Close</span>
          </button>
          <div className="font-body text-[var(--hotel-gold)] text-[8px] tracking-[0.4em] uppercase">
            Menu
          </div>
        </div>

        <nav className="flex-1 flex flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-[var(--hotel-cream)] text-4xl font-light tracking-wider hover:text-[var(--hotel-gold)] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://us01.iqwebbook.com/AHSCA115/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 border border-[var(--hotel-gold)] text-[var(--hotel-gold)] font-body text-sm tracking-[0.3em] uppercase px-8 py-3 hover:bg-[var(--hotel-gold)] hover:text-[var(--hotel-charcoal)] transition-all duration-300"
          >
            Book a Room
          </a>
        </nav>

        <div className="pb-10 text-center">
          <p className="font-body text-[var(--hotel-sand)]/60 text-xs tracking-widest">
            277 N. Indian Canyon Drive, Palm Springs, CA 92262
          </p>
          {/* <p className="font-body text-[var(--hotel-gold)] text-xs tracking-widest mt-1">
            +1 (747) 494-9881 · stay@andreashotel.com
          </p> */}
        </div>
      </div>
    </>
  );
}
