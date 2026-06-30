"use client";

import { useSearchParams } from "next/navigation";

interface Props {
  /** Override the URL param — used by server components that pass it down */
  variantOverride?: string;
  className?: string;
  variantA: React.ReactNode;
  variantB: React.ReactNode;
}

/**
 * Displays either Logo A or Logo B based on ?logo=variant_a / ?logo=variant_b URL param.
 * Falls back to variantB (full wordmark) by default.
 * Server components can pass variantOverride from searchParams.
 */
export default function LogoVariantDisplay({ variantOverride, className, variantA, variantB }: Props) {
  const searchParams = useSearchParams();
  const logo = variantOverride || searchParams?.get("logo") || "variant_b";

  if (logo === "variant_a") {
    return <>{variantA}</>;
  }
  return <>{variantB}</>;
}
