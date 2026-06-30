"use client";

import { useSearchParams } from "next/navigation";

interface LogoSwitcherProps {
  variantA: React.ReactNode;
  variantB: React.ReactNode;
  defaultVariant?: "a" | "b";
}

/**
 * Renders either Logo A (A-letter + "ndreas") or Logo B (full cursive wordmark)
 * based on the ?logo=variant_a or ?logo=variant_b URL parameter.
 */
export default function LogoSwitcher({ variantA, variantB, defaultVariant = "b" }: LogoSwitcherProps) {
  const searchParams = useSearchParams();
  const logo = searchParams?.get("logo") || (defaultVariant === "a" ? "variant_a" : "variant_b");

  if (logo === "variant_a") return <>{variantA}</>;
  return <>{variantB}</>;
}
