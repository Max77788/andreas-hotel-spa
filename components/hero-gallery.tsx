"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";

export interface HeroImage {
  src: string;
  alt: string;
}

const IMAGE_DURATION = 6000; // ms per image
const CROSSFADE_DURATION = 2000; // ms transition

interface HeroGalleryProps {
  images: HeroImage[];
  children: ReactNode;
  videoUrl?: string;
}

export default function HeroGallery({ images, children, videoUrl }: HeroGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetInterval = useCallback(
    (fromIndex: number) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (images.length <= 1) return;
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }, IMAGE_DURATION);
    },
    [images.length],
  );

  // Bootstrap interval + cleanup
  useEffect(() => {
    resetInterval(0);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetInterval]);

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setActiveIndex(index);
      resetInterval(index);
    },
    [activeIndex, resetInterval],
  );

  if (!images.length) {
    return (
      <section className="relative h-screen overflow-hidden bg-[var(--hotel-charcoal)]">
        <div className="absolute inset-0 z-30">{children}</div>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden bg-[var(--hotel-charcoal)]">
      {/* ── Hero video (if configured) ─────────────────────────────────── */}
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[5]"
          src={videoUrl}
        />
      )}
      {/* ── Image stack ─────────────────────────────────────────────────── */}
      {images.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{
            opacity: i === activeIndex ? 1 : 0,
            zIndex: i === activeIndex ? 2 : 0,
            transitionDuration: `${CROSSFADE_DURATION}ms`,
          }}
        >
          {/* Static base image (always renders, prevents flash) */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${img.src})` }}
          />
          {/* Ken Burns animated layer — remounts on index change via key */}
          {i === activeIndex && (
            <div
              key={`kb-${activeIndex}`}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${img.src})`,
                animation: `heroKenBurns ${IMAGE_DURATION}ms ease-in-out forwards`,
              }}
            />
          )}
        </div>
      ))}

      {/* ── Gradient overlay ────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* ── Film grain ──────────────────────────────────────────────────── */}
      <div className="film-grain absolute inset-0 z-20" />

      {/* ── Hero content (logo, tagline, CTAs, scroll hint) ─────────────── */}
      <div className="relative z-30">{children}</div>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-30">
        <div
          key={`progress-${activeIndex}`}
          className="h-full bg-[var(--hotel-gold)]"
          style={{ animation: `heroProgress ${IMAGE_DURATION}ms linear` }}
        />
      </div>

      {/* ── Dot indicators ──────────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`View slide ${i + 1}`}
              className="rounded-full transition-all duration-500 focus:outline-none"
              style={{
                width: i === activeIndex ? "28px" : "8px",
                height: "8px",
                backgroundColor:
                  i === activeIndex
                    ? "var(--hotel-gold)"
                    : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
