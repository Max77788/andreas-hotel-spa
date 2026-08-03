import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import GalleryLightbox from "@/components/gallery-lightbox";

const images = [
  { src: "/one.jpg", alt: "One" },
  { src: "/two.jpg", alt: "Two" },
];

describe("GalleryLightbox", () => {
  it("opens the selected gallery image via a real button", async () => {
    const user = userEvent.setup();
    render(<GalleryLightbox images={images} />);

    await user.click(screen.getByRole("button", { name: "Open photo 2: Two" }));

    const dialog = screen.getByRole("dialog", { name: "Expanded gallery image: Two" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("img", { name: "Two" })).toHaveAttribute("src", "/two.jpg");
  });

  it("closes the selected image with Escape", async () => {
    const user = userEvent.setup();
    render(<GalleryLightbox images={images} />);

    await user.click(screen.getByRole("button", { name: "Open photo 1: One" }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
