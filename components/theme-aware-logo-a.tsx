"use client";

import { useTheme } from "next-themes";

type ThemeAwareLogoAProps = {
  alt?: string;
  className?: string;
};

/** Renders the standalone Logo A in a color that remains legible in either site theme. */
export function ThemeAwareLogoA({
  alt = "A",
  className = "h-[1em] w-auto",
}: ThemeAwareLogoAProps) {
  const { resolvedTheme } = useTheme();
  const src = resolvedTheme === "dark" ? "/andreas_logo_a_white.png" : "/andreas_logo_a.png";

  return <img src={src} alt={alt} className={className} />;
}
