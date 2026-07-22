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

  it("publishes all three supplied menu pages and a downloadable PDF", () => {
    const page = read("app/poolside-menu/page.tsx");

    expect(page).toContain("/hotel-photos/poolside-menu/drinks.jpg");
    expect(page).toContain("/hotel-photos/poolside-menu/cocktails.jpg");
    expect(page).toContain("/hotel-photos/poolside-menu/food.jpg");
    expect(page).toContain("/andreas-poolside-menu.pdf");

    for (const asset of [
      "public/hotel-photos/poolside-menu/drinks.jpg",
      "public/hotel-photos/poolside-menu/cocktails.jpg",
      "public/hotel-photos/poolside-menu/food.jpg",
      "public/andreas-poolside-menu.pdf",
    ]) {
      expect(statSync(join(root, asset)).size).toBeGreaterThan(10_000);
    }
  });

  it("links both additions from the primary navigation", () => {
    const nav = read("components/nav.tsx");

    expect(nav).toContain('{ label: "Poolside Menu", href: "/poolside-menu" }');
    expect(nav).toContain('{ label: "Local Guide", href: "/local-guide" }');
  });
});
