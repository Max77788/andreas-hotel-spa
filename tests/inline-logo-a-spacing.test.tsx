import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import AndreasInitial from "@/components/andreas-initial";
import { ThemeAwareLogoA } from "@/components/theme-aware-logo-a";

describe("inline logo A spacing", () => {
  it("crops transparent export padding and keeps the mark joined to its suffix", () => {
    render(<AndreasInitial suffix="ndreas" />);
    expect(screen.getByLabelText("Andreas")).toHaveClass("whitespace-nowrap");
    expect(document.querySelector(".andreas-initial-mark")).toBeTruthy();
    expect(document.querySelector("img[alt='A']")).toHaveClass("andreas-initial-art");
  });

  it("uses the same cropped mark for theme-aware A treatments", () => {
    render(<ThemeAwareLogoA />);
    expect(screen.getByLabelText("A")).toHaveClass("andreas-initial-mark");
  });

  it("overlaps every shared logo A treatment enough for its dash to meet the suffix", () => {
    const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");

    expect(css).toMatch(/\.andreas-initial-mark\s*\{[\s\S]*?margin-right:\s*-0\.10em;/);
    expect(css).toMatch(/\.andreas-initial-art\s*\{[\s\S]*?transform:\s*translate\(-0\.13em,\s*0\.05em\);/);
  });
});
