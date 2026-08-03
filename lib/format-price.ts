export function formatNightlyPrice(price: string | null | undefined): string {
  const value = price?.trim().replace(/^\$+/, "") ?? "";
  return value ? `$${value}` : "";
}
