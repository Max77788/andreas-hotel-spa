type ThemeAwareLogoAProps = {
  alt?: string;
  className?: string;
};

/** Renders the standalone Logo A in a color that remains legible in either site theme. */
export function ThemeAwareLogoA({
  alt = "A",
  className = "h-[1em] w-auto",
}: ThemeAwareLogoAProps) {
  return (
    <span className="theme-aware-logo-a inline-flex -mr-[0.12em]" aria-label={alt}>
      <img
        src="/andreas_logo_a.png"
        alt=""
        aria-hidden="true"
        className={`theme-aware-logo-a-light ${className}`}
      />
      <img
        src="/andreas_logo_a_white.png"
        alt=""
        aria-hidden="true"
        className={`theme-aware-logo-a-dark ${className}`}
      />
    </span>
  );
}
