import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("homepage typography scope", () => {
  it("applies the requested body face to the philosophy headline only", () => {
    const homepage = readFileSync(resolve(process.cwd(), "app/page.tsx"), "utf8");

    expect(homepage).toContain('className="font-body text-[var(--hotel-charcoal)] font-light leading-tight mb-2"');
    expect(homepage).toContain("Embracing the<br />");
  });

  it("keeps the desktop navigation on its original body face", () => {
    const nav = readFileSync(resolve(process.cwd(), "components/nav.tsx"), "utf8");

    expect(nav).toContain('className="font-body text-[10px] tracking-[0.25em] uppercase transition-colors duration-200 text-white/80 hover:text-white"');
    expect(nav).toContain('className="hidden xl:inline-block bg-[var(--hotel-gold)] text-black font-body text-[10px] tracking-[0.25em] uppercase');
  });
});