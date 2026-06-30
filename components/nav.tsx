"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/rooms" },
  { label: "Spa", href: "/spa" },
  { label: "Offers", href: "/offers" },
  { label: "Amenities", href: "/#amenities" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Groups & Events", href: "/group-booking" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Main nav */}
      <header
        className="fixed left-0 right-0 z-40 bg-black/90 backdrop-blur-sm shadow-sm"
        style={{ top: 0 }}
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/andreas_logo_white.png"
              alt="Andreas Hotel & Spa"
              className="h-14 md:h-20 w-auto block"
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[10px] tracking-[0.25em] uppercase transition-colors duration-200 text-white/80 hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-[10px] tracking-[0.25em] uppercase transition-colors duration-200 text-white/80 hover:text-white"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right: Book Now + theme toggle + mobile hamburger */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/book"
              className="hidden md:inline-block bg-[var(--hotel-gold)] text-black font-body text-[10px] tracking-[0.25em] uppercase px-5 py-2 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
            >
              Book Now
            </Link>
            {/* Mobile hamburger — solid dark button so lines are always visible */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden flex flex-col items-center justify-center w-10 h-10 bg-black/50 rounded-sm gap-[5px] cursor-pointer"
              aria-label="Open menu"
            >
              <span className="block w-5 h-[2px] bg-white transition-colors" />
              <span className="block w-5 h-[2px] bg-white transition-colors" />
              <span className="block w-5 h-[2px] bg-white transition-colors" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-[#0d0d0d] flex flex-col transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white font-body text-xs tracking-[0.3em] uppercase flex items-center gap-2"
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
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="font-display text-white text-4xl font-light tracking-wider hover:text-[var(--hotel-gold)] transition-colors duration-300"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-white text-4xl font-light tracking-wider hover:text-[var(--hotel-gold)] transition-colors duration-300"
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/book"
            className="mt-4 bg-[var(--hotel-gold)] text-black font-body text-sm tracking-[0.3em] uppercase px-8 py-3 hover:bg-[var(--hotel-terracotta)] hover:text-white transition-all duration-300"
          >
            Book a Room
          </Link>
        </nav>

        <div className="pb-10 text-center">
          <p className="font-body text-white/50 text-xs tracking-widest">
            277 N. Indian Canyon Drive, Palm Springs, CA 92262
          </p>
        </div>
      </div>
    </>
  );
}
