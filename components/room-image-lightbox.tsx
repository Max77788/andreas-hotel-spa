"use client";

import { useEffect, useRef, useState } from "react";
import { X, ZoomIn } from "lucide-react";

type RoomImageLightboxProps = {
  src: string;
  alt: string;
  triggerClassName: string;
};

/**
 * A clickable room image with a full-screen lightbox. Each instance owns its
 * own open state, so room hero and gallery images can be opened independently.
 */
export default function RoomImageLightbox({
  src,
  alt,
  triggerClassName,
}: RoomImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={`View larger image: ${alt}`}
        className={`${triggerClassName} group cursor-zoom-in`}
        style={{ backgroundImage: `url(${src})` }}
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">View larger image: {alt}</span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity duration-200 group-hover:bg-black/25 group-hover:opacity-100 group-focus-visible:bg-black/25 group-focus-visible:opacity-100"
        >
          <ZoomIn className="h-8 w-8 text-white drop-shadow" />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8"
          role="presentation"
          onMouseDown={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Expanded image: ${alt}`}
            className="relative flex max-h-full max-w-full items-center justify-center"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[calc(100vh-2rem)] max-w-full rounded-sm object-contain shadow-2xl md:max-h-[calc(100vh-4rem)]"
            />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/85 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Close expanded image"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
