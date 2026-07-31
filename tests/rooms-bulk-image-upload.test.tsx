/**
 * Behavior-level runtime tests for the Rooms CMS bulk image upload feature.
 *
 * These replace the previous source-string inspection tests with real component
 * rendering via @testing-library/react and mocked fetch, verifying:
 *   1. Gallery input accepts multiple files
 *   2. Ordered batch appends successful URLs and makes exactly one POST
 *      (verified after waiting for autosave debounce window)
 *   3. Partial failure retains successful URLs and reports error
 *   4. Total upload failure keeps original gallery
 *   5. Network throw produces visible error and re-enables controls
 *   6. Main image upload persists immediately
 *      (verified after waiting for autosave debounce window)
 *   7. Slow batch upload (>1s per file) does not trigger mid-upload
 *      autosave POST; exactly one persist POST at end
 */

import { render, screen, waitFor, act } from "@testing-library/react";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RoomsEditor from "@/app/admin/rooms/page";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockFile(name: string, type = "image/png"): File {
  return new File(["mock-file-content"], name, { type });
}

const sampleRoom = {
  id: "room-1",
  slug: "deluxe-king",
  name: "Deluxe King",
  badge: null as string | null,
  short_description: "A lovely room",
  long_description: "A very lovely room",
  bed: "King",
  guests: "2",
  sqft: "400",
  price: "$299",
  amenities: ["WiFi", "TV"] as string[],
  extras: [] as { icon: string; label: string }[],
  image_url: "https://example.com/main.jpg" as string | null,
  gallery_urls: ["https://example.com/g1.jpg", "https://example.com/g2.jpg"] as string[],
  sort_order: 0,
  is_published: true,
};

let mockFetch: ReturnType<typeof vi.fn>;
let uploadCallCount: number;

// Default behaviours that tests can override per-case
let uploadResponses: Array<{ ok: boolean; url?: string; error?: string; throwError?: boolean; delay?: number }>;

beforeEach(() => {
  mockFetch = vi.fn();
  globalThis.fetch = mockFetch as unknown as typeof fetch;
  uploadCallCount = 0;
  uploadResponses = [];

  // Default mock: each call checks the requests and returns appropriate responses
  mockFetch.mockImplementation(async (_url: string, init?: RequestInit) => {
    const url = String(_url);
    const method = (init?.method || "GET").toUpperCase();

    // ----- GET /api/admin/rooms  (initial room list) -----
    if (url === "/api/admin/rooms" && method === "GET") {
      return new Response(JSON.stringify([sampleRoom]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ----- POST /api/admin/upload  (single file upload) -----
    if (url === "/api/admin/upload" && method === "POST") {
      const idx = uploadCallCount++;
      const resp = uploadResponses[idx] ?? {
        ok: true,
        url: `https://example.com/uploaded-${idx}.jpg`,
      };

      // Simulate network latency for slow-upload regression test
      if (resp.delay) {
        await new Promise((r) => setTimeout(r, resp.delay));
      }

      if (resp.throwError) throw new Error("Network failure");
      if (!resp.ok) {
        return new Response(JSON.stringify({ error: resp.error || "Upload failed" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ url: resp.url }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ----- POST /api/admin/rooms  (persist) -----
    if (url === "/api/admin/rooms" && method === "POST") {
      return new Response(null, { status: 204 });
    }

    // ----- DELETE /api/admin/rooms -----
    if (url === "/api/admin/rooms" && method === "DELETE") {
      return new Response(null, { status: 204 });
    }

    // ----- Anything else -----
    return new Response("Not found", { status: 404 });
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Helper: render the editor, wait for load, and click Edit on the first room
// ---------------------------------------------------------------------------
async function openRoomEditor() {
  const user = userEvent.setup();
  render(<RoomsEditor />);

  // Wait for the room list to load (the "Loading..." text disappears)
  await waitFor(() => {
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  // Click the Edit button
  await user.click(screen.getByRole("button", { name: /edit/i }));

  // Wait for the modal to appear (heading contains room name)
  await waitFor(() => {
    expect(screen.getByText(/Edit: Deluxe King/i)).toBeInTheDocument();
  });
}

// ---------------------------------------------------------------------------
// Helper: wait enough real time for the autosave debounce (1000ms) to fire
// ---------------------------------------------------------------------------
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Helper: get all POST calls to /api/admin/rooms (excluding GET/DELETE)
// ---------------------------------------------------------------------------
function persistPostCalls(): Array<{ body: unknown }> {
  return (mockFetch.mock.calls as Array<[string, RequestInit | undefined]>)
    .filter(
      ([url, init]) =>
        String(url) === "/api/admin/rooms" &&
        (init?.method || "GET").toUpperCase() === "POST",
    )
    .map(([_url, init]) => ({
      body: init?.body ? JSON.parse(init.body as string) : null,
    }));
}

// ===========================================================================
// Tests
// ===========================================================================

describe("rooms bulk image upload (runtime behavior)", () => {
  // -----------------------------------------------------------------------
  // 1. Gallery accepts multiple files
  // -----------------------------------------------------------------------
  it("gallery input has multiple attribute so Darwin can select many images", async () => {
    await openRoomEditor();

    const gallerySection = screen.getByText("Gallery Images").closest("div")!;
    const fileInputs = within(gallerySection).getAllByDisplayValue("");
    const galleryInput = fileInputs.find(
      (el) => el.getAttribute("type") === "file",
    ) as HTMLInputElement;

    expect(galleryInput).toBeTruthy();
    expect(galleryInput.multiple).toBe(true);
    expect(galleryInput.accept).toBe("image/*");
  });

  // -----------------------------------------------------------------------
  // 2. Ordered batch appends + exactly ONE POST (wait for autosave window)
  // -----------------------------------------------------------------------
  it("ordered batch appends successful URLs to original gallery and makes exactly one POST (no autosave duplicate)", async () => {
    uploadResponses = [
      { ok: true, url: "https://example.com/new-1.jpg" },
      { ok: true, url: "https://example.com/new-2.jpg" },
      { ok: true, url: "https://example.com/new-3.jpg" },
    ];

    await openRoomEditor();
    const user = userEvent.setup();

    const gallerySection = screen.getByText("Gallery Images").closest("div")!;
    const fileInputs = within(gallerySection).getAllByDisplayValue("");
    const galleryInput = fileInputs.find(
      (el) => el.getAttribute("type") === "file",
    ) as HTMLInputElement;

    const files = [mockFile("a.jpg"), mockFile("b.jpg"), mockFile("c.jpg")];
    await user.upload(galleryInput, files);

    // Wait for upload to complete (progress bar disappears)
    await waitFor(() => {
      expect(screen.queryByText(/Uploading/)).not.toBeInTheDocument();
    });

    // Wait 1200ms for autosave debounce window to close
    // If autosave fires a duplicate POST, it will show up here
    await act(async () => {
      await delay(1200);
    });

    // Assert exactly ONE POST to /api/admin/rooms with the combined URLs
    const posts = persistPostCalls();
    expect(posts).toHaveLength(1);
    expect(posts[0].body).toHaveProperty("gallery_urls");
    expect((posts[0].body as Record<string, unknown>).gallery_urls).toEqual([
      "https://example.com/g1.jpg",
      "https://example.com/g2.jpg",
      "https://example.com/new-1.jpg",
      "https://example.com/new-2.jpg",
      "https://example.com/new-3.jpg",
    ]);
  });

  // -----------------------------------------------------------------------
  // 3. Partial failure — retains successful URLs and reports error
  // -----------------------------------------------------------------------
  it("partial failure retains successful URLs and displays the API error", async () => {
    uploadResponses = [
      { ok: true, url: "https://example.com/ok-1.jpg" },
      { ok: false, error: "Storage request timed out" },
      { ok: true, url: "https://example.com/ok-2.jpg" },
    ];

    await openRoomEditor();
    const user = userEvent.setup();

    const gallerySection = screen.getByText("Gallery Images").closest("div")!;
    const fileInputs = within(gallerySection).getAllByDisplayValue("");
    const galleryInput = fileInputs.find(
      (el) => el.getAttribute("type") === "file",
    ) as HTMLInputElement;

    const files = [mockFile("good1.jpg"), mockFile("bad.jpg"), mockFile("good2.jpg")];
    await user.upload(galleryInput, files);

    await waitFor(() => {
      expect(screen.queryByText(/Uploading/)).not.toBeInTheDocument();
    });

    // Error message should mention the failure
    expect(screen.getByText(/1 file\(s\) failed/)).toBeInTheDocument();
    expect(screen.getByText(/bad\.jpg: Storage request timed out/)).toBeInTheDocument();

    // Successful URLs should be appended
    const posts = persistPostCalls();
    expect(posts).toHaveLength(1);
    const urls = (posts[0].body as Record<string, unknown>).gallery_urls as string[];
    expect(urls).toContain("https://example.com/ok-1.jpg");
    expect(urls).toContain("https://example.com/ok-2.jpg");
    expect(urls).toContain("https://example.com/g1.jpg");
    expect(urls).not.toContain(undefined);
    expect(urls).not.toContain(null);
  });

  // -----------------------------------------------------------------------
  // 4. Total upload failure keeps original gallery and reports per-file errors
  // -----------------------------------------------------------------------
  it("total upload failure shows every filename with the API error message, does not POST, and preserves original gallery", async () => {
    uploadResponses = [
      { ok: false, error: "Storage request timed out" },
      { ok: false, error: "Storage request timed out" },
    ];

    await openRoomEditor();
    const user = userEvent.setup();

    const gallerySection = screen.getByText("Gallery Images").closest("div")!;
    const fileInputs = within(gallerySection).getAllByDisplayValue("");
    const galleryInput = fileInputs.find(
      (el) => el.getAttribute("type") === "file",
    ) as HTMLInputElement;

    const files = [mockFile("fail1.jpg"), mockFile("fail2.jpg")];
    await user.upload(galleryInput, files);

    // Wait for the summary error banner to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to upload all 2 image\(s\)/)).toBeInTheDocument();
    });

    // Error banner must contain each filename and the exact API error message
    const errorBanner = screen.getByText(/Failed to upload all/);
    const errorText = errorBanner.textContent || "";
    expect(errorText).toContain("fail1.jpg");
    expect(errorText).toContain("fail2.jpg");
    expect(errorText).toContain("Storage request timed out");

    // No persist POST should have been made (the component returns early)
    const posts = persistPostCalls();
    expect(posts).toHaveLength(0);

    // Original gallery thumbnails should still be visible
    const imgs = within(gallerySection).queryAllByRole("img");
    const srcs = imgs.map((img) => img.getAttribute("src"));
    expect(srcs).toContain("https://example.com/g1.jpg");
    expect(srcs).toContain("https://example.com/g2.jpg");
  });

  // -----------------------------------------------------------------------
  // 5. Network throw produces visible error and re-enables controls
  // -----------------------------------------------------------------------
  it("network throw during upload produces visible error and re-enables controls", async () => {
    uploadResponses = [
      { ok: false, throwError: true },
    ];

    await openRoomEditor();
    const user = userEvent.setup();

    const gallerySection = screen.getByText("Gallery Images").closest("div")!;
    const fileInputs = within(gallerySection).getAllByDisplayValue("");
    const galleryInput = fileInputs.find(
      (el) => el.getAttribute("type") === "file",
    ) as HTMLInputElement;

    const files = [mockFile("net-fail.jpg")];
    await user.upload(galleryInput, files);

    // Wait for the error message to appear (network throw is caught; shows as upload failure)
    await waitFor(() => {
      expect(screen.getByText(/Failed to upload all/i)).toBeInTheDocument();
    });

    // The gallery input should be re-enabled (not disabled)
    expect(galleryInput).not.toBeDisabled();

    // Uploading state should be cleared — progress bar should not be visible
    expect(screen.queryByText(/Uploading \d of \d/)).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // 6. Main image upload persists immediately (no autosave duplicate)
  // -----------------------------------------------------------------------
  it("main image upload persists immediately with exactly one POST (no autosave duplicate)", async () => {
    uploadResponses = [
      { ok: true, url: "https://example.com/new-main.jpg" },
    ];

    await openRoomEditor();
    const user = userEvent.setup();

    const mainSection = screen.getByText("Main Image").closest("div")!;
    const fileInputs = within(mainSection).getAllByDisplayValue("");
    const mainInput = fileInputs.find(
      (el) => el.getAttribute("type") === "file",
    ) as HTMLInputElement;

    expect(mainInput).toBeTruthy();

    const file = mockFile("new-main.jpg");
    await user.upload(mainInput, [file]);

    // Wait for the upload to complete (Saving… goes away)
    await waitFor(() => {
      expect(screen.queryByText(/Saving…/)).not.toBeInTheDocument();
    });

    // Wait 1200ms for autosave debounce window to close
    await act(async () => {
      await delay(1200);
    });

    // Exactly ONE persist POST should have been made with the new image_url
    const posts = persistPostCalls();
    expect(posts).toHaveLength(1);
    expect((posts[0].body as Record<string, unknown>).image_url).toBe(
      "https://example.com/new-main.jpg",
    );
  });

  // -----------------------------------------------------------------------
  // 7. Slow batch upload: 500ms per-file latency, >2.5s total — autosave
  //    debounce (1s) fires BEFORE upload completes if unprotected.
  //    Regression: must prove ZERO autosave POSTs mid-upload and exactly
  //    ONE persist POST when the batch finishes.
  // -----------------------------------------------------------------------
  it("slow batch upload (500ms per file, 2.5s total) never triggers mid-upload autosave; exactly one persist POST at end", async () => {
    uploadResponses = [
      { ok: true, url: "https://example.com/slow-1.jpg", delay: 500 },
      { ok: true, url: "https://example.com/slow-2.jpg", delay: 500 },
      { ok: true, url: "https://example.com/slow-3.jpg", delay: 500 },
      { ok: true, url: "https://example.com/slow-4.jpg", delay: 500 },
      { ok: true, url: "https://example.com/slow-5.jpg", delay: 500 },
    ];

    await openRoomEditor();
    const user = userEvent.setup();

    const gallerySection = screen.getByText("Gallery Images").closest("div")!;
    const fileInputs = within(gallerySection).getAllByDisplayValue("");
    const galleryInput = fileInputs.find(
      (el) => el.getAttribute("type") === "file",
    ) as HTMLInputElement;

    const files = [
      mockFile("s1.jpg"),
      mockFile("s2.jpg"),
      mockFile("s3.jpg"),
      mockFile("s4.jpg"),
      mockFile("s5.jpg"),
    ];
    await user.upload(galleryInput, files);

    // Wait for upload to complete (total ~2.5s of async delays)
    await waitFor(
      () => {
        expect(screen.queryByText(/Uploading/)).not.toBeInTheDocument();
      },
      { timeout: 8000 },
    );

    // Collect persist POSTs now (before waiting 1200ms more)
    const midUploadPosts = persistPostCalls();

    // Wait another 1200ms to let any post-upload autosave timers fire
    await act(async () => {
      await delay(1200);
    });

    const allPosts = persistPostCalls();

    // If autosave fired mid-upload, we'd see 2 or more POSTs.
    // With the fix (pause + suppressNextAutoSave), we expect exactly 1.
    expect(
      midUploadPosts.length,
      "must have exactly one persist POST (from directPersist), no mid-upload autosave",
    ).toBe(1);

    // No additional POSTs should appear after waiting for debounce window
    expect(allPosts).toHaveLength(1);

    // Verify the body contains the combined URLs (original 2 + 5 new)
    const urls = (allPosts[0].body as Record<string, unknown>).gallery_urls as string[];
    expect(urls).toHaveLength(7);
    expect(urls).toEqual([
      "https://example.com/g1.jpg",
      "https://example.com/g2.jpg",
      "https://example.com/slow-1.jpg",
      "https://example.com/slow-2.jpg",
      "https://example.com/slow-3.jpg",
      "https://example.com/slow-4.jpg",
      "https://example.com/slow-5.jpg",
    ]);
  });
});
