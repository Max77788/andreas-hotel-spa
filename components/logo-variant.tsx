interface LogoVariantProps {
  variant?: string;
}

/**
 * Logo A — the standalone letter A from the logo + "ndreas" in serif text.
 */
export function LogoAWhite({ className = "h-16 w-auto" }: { className?: string }) {
  return <img src="/andreas_logo_a_white.png" alt="Andreas" className={className} />;
}

export function LogoADark({ className = "h-16 w-auto" }: { className?: string }) {
  return <img src="/andreas_logo_a.png" alt="Andreas" className={className} />;
}

/**
 * Logo B — the full cursive Andreas wordmark.
 */
export function LogoBWhite({ className = "h-12 md:h-16 w-auto" }: { className?: string }) {
  return <img src="/andreas_wordmark_white.png" alt="Andreas" className={`${className} opacity-90`} />;
}

export function LogoBDark({ className = "h-12 md:h-16 w-auto" }: { className?: string }) {
  return <img src="/andreas_wordmark.png" alt="Andreas" className={`${className} opacity-90`} />;
}

/**
 * Picks Logo A or Logo B based on the variant param.
 * variant_a → Logo A, anything else or missing → Logo B
 */
export function LogoVariant({ variant, className }: LogoVariantProps & { className?: string }) {
  if (variant === "variant_a") {
    return <LogoAWhite className={className} />;
  }
  return <LogoBWhite className={className} />;
}
