import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AndreasInitial from "@/components/andreas-initial";
import { ThemeAwareLogoA } from "@/components/theme-aware-logo-a";

describe("inline logo A spacing", () => {
  it("uses a tight negative right margin before the word suffix", () => {
    render(<AndreasInitial suffix="ndreas" />);
    expect(screen.getByRole("img", { name: "A" })).toHaveClass("-mr-[0.12em]");
  });

  it("uses the same tight spacing for theme-aware A marks", () => {
    render(<ThemeAwareLogoA />);
    expect(screen.getByLabelText("A")).toHaveClass("-mr-[0.12em]");
  });
});
