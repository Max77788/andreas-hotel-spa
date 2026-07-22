import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

describe("guest guide additions", () => {
  it("publishes the supplied local points of interest", () => {
    const page = read("app/local-guide/page.tsx");

    expect(page).toContain("Palm Springs Art Museum");
    expect(page).toContain("Palm Springs Aerial Tramway");
    expect(page).toContain("Indian Canyons");
    expect(page).toContain("Marriott's Shadow Ridge Golf Club");
    expect(page.match(/distance:/g)).toHaveLength(10);
  });

  it("publishes a readable HTML poolside menu with downloadable PDF", () => {
    const page = read("app/poolside-menu/page.tsx");

    expect(page).toContain("Mixed Drinks");
    expect(page).toContain("Specialty Cocktails");
    expect(page).toContain("Poolside Bites");
    expect(page).toContain("Mai Tai");
    expect(page).toContain("Andreas Signature Martinis");
    expect(page).toContain("Italian Pesto Pinwheel");
    expect(page).toContain("/andreas-poolside-menu.pdf");
    expect(page).toContain("Download Menu PDF");
    // No paper-scan image grid as the primary menu presentation
    expect(page).not.toContain("/hotel-photos/poolside-menu/drinks.jpg");
    expect(page).not.toContain("/hotel-photos/poolside-menu/cocktails.jpg");
    expect(page).not.toContain("/hotel-photos/poolside-menu/food.jpg");

    expect(statSync(join(root, "public/andreas-poolside-menu.pdf")).size).toBeGreaterThan(10_000);
  });

  it("keeps Local Guide in primary nav and routes Poolside Menu through Amenities", () => {
    const nav = read("components/nav.tsx");
    const home = read("app/page.tsx");

    expect(nav).not.toContain('{ label: "Poolside Menu", href: "/poolside-menu" }');
    expect(nav).toContain('{ label: "Local Guide", href: "/local-guide" }');
    expect(nav).toContain('{ label: "Amenities", href: "/#amenities" }');
    expect(home).toContain('title: "Poolside Menu"');
    expect(home).toContain('href: "/poolside-menu"');
  });
});
