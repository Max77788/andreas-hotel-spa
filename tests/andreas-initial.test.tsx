import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AndreasInitial from "@/components/andreas-initial";

describe("AndreasInitial", () => {
  it("keeps the stylized initial and its word ending together", () => {
    render(<AndreasInitial suffix="menities" />);

    expect(screen.getByLabelText("Amenities")).toHaveClass("whitespace-nowrap");
    expect(screen.getByRole("img", { name: "A" })).toHaveAttribute(
      "src",
      "/andreas_logo_a_white.png",
    );
  });
});
