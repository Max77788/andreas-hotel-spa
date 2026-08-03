"use client";

import { useEffect, useRef, useState } from "react";

export type GalleryImage = { src: string; alt: string };

type GalleryLightboxProps = {
  images: GalleryImage[];
  previewCount?: number;
};

export default function GalleryLightbox({ images, previewCount = 6 }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previewImages = images.slice(0, previewCount);
  const selected = selectedIndex === null ? null : images[selectedIndex];

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") setSelectedIndex((index) => index === null ? null : (index + 1) % images.length);
      if (event.key === "ArrowLeft") setSelectedIndex((index) => index === null ? null : (index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, images.length]);

  if (!images.length) return null;

  return (
    <>
      <div className="masonry-grid">
        {previewImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`Open photo ${index + 1}: ${image.alt}`}
            className={`group relative block w-full overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hotel-terracotta)] focus-visible:ring-offset-4 ${index >= 4 ? "hidden md:block" : ""}`}
          >
            <img src={image.src} alt={image.alt} className="block h-auto w-full transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-black/0 text-xs tracking-[0.28em] text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100 group-focus-visible:bg-black/30 group-focus-visible:opacity-100">VIEW PHOTO</span>
          </button>
        ))}
      </div>

      {images.length > previewCount && (
        <div className="mt-10 text-center">
          <button type="button" onClick={() => setSelectedIndex(0)} className="font-body border border-[var(--hotel-charcoal)] px-7 py-3 text-[10px] uppercase tracking-[0.3em] text-[var(--hotel-charcoal)] transition hover:border-[var(--hotel-terracotta)] hover:text-[var(--hotel-terracotta)]">
            View all {images.length} photos
          </button>
        </div>
      )}

      {selected && selectedIndex !== null && (
        <div role="presentation" onMouseDown={() => setSelectedIndex(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8">
          <div role="dialog" aria-modal="true" aria-label={`Expanded gallery image: ${selected.alt}`} onMouseDown={(event) => event.stopPropagation()} className="relative flex max-h-full max-w-full items-center justify-center">
            <img src={selected.src} alt={selected.alt} className="max-h-[calc(100vh-2rem)] max-w-full object-contain shadow-2xl md:max-h-[calc(100vh-4rem)]" />
            <button ref={closeButtonRef} type="button" onClick={() => setSelectedIndex(null)} aria-label="Close expanded gallery image" className="absolute right-2 top-2 h-11 w-11 bg-black/60 text-2xl text-white transition hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-white">×</button>
            {images.length > 1 && <>
              <button type="button" onClick={() => setSelectedIndex((selectedIndex - 1 + images.length) % images.length)} aria-label="Previous gallery image" className="absolute left-2 top-1/2 h-11 w-11 -translate-y-1/2 bg-black/60 text-2xl text-white transition hover:bg-black/85">‹</button>
              <button type="button" onClick={() => setSelectedIndex((selectedIndex + 1) % images.length)} aria-label="Next gallery image" className="absolute right-2 top-1/2 h-11 w-11 -translate-y-1/2 bg-black/60 text-2xl text-white transition hover:bg-black/85">›</button>
            </>}
          </div>
        </div>
      )}
    </>
  );
}
