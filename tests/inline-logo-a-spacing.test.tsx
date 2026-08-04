import { render, screen } from "@testing-library/react";
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
});
