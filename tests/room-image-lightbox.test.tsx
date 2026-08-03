import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RoomImageLightbox from "@/components/room-image-lightbox";

describe("RoomImageLightbox", () => {
  const props = {
    src: "/hotel-photos/room1.jpg",
    alt: "Executive Room main image",
    triggerClassName: "relative h-48 w-full bg-cover",
  };

  it("opens the larger image from the room image trigger", async () => {
    const user = userEvent.setup();
    render(<RoomImageLightbox {...props} />);

    await user.click(screen.getByRole("button", { name: /view larger image/i }));

    expect(screen.getByRole("dialog", { name: /expanded image/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: props.alt })).toHaveAttribute("src", props.src);
  });

  it("closes on Escape and restores the page view", async () => {
    const user = userEvent.setup();
    render(<RoomImageLightbox {...props} />);

    await user.click(screen.getByRole("button", { name: /view larger image/i }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when the backdrop outside the image is clicked", async () => {
    const user = userEvent.setup();
    render(<RoomImageLightbox {...props} />);

    await user.click(screen.getByRole("button", { name: /view larger image/i }));
    await user.click(screen.getByRole("presentation"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
